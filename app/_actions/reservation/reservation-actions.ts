"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/app/_actions/user/get-user";
import { Reservation, ReservationStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";

async function updateExpiredReservations(): Promise<void> {
  // mark ACTIVE reservations with endDate < today as COMPLETED and free rooms atomically
  const today = new Date();
  const toComplete = await prisma.reservation.findMany({
    where: { endDate: { lt: today }, status: ReservationStatus.ACTIVE },
    select: { id: true, listingId: true },
  });
  if (toComplete.length === 0) return;

  const byListing: Record<string, number> = {};
  toComplete.forEach((r) => (byListing[r.listingId] = (byListing[r.listingId] ?? 0) + 1));
  await prisma.$transaction(async (tx) => {
    // update reservation statuses
    await tx.reservation.updateMany({
      where: { id: { in: toComplete.map((r) => r.id) } },
      data: { status: ReservationStatus.COMPLETED },
    });
    // increment roomsAvailable for each affected listing
    for (const listingId of Object.keys(byListing)) {
      const count = byListing[listingId];
      await tx.listing.update({
        where: { id: listingId },
        data: { roomsAvailable: { increment: count } },
      });
    }
  });
}

// New: accept a DTO rather than a Prisma Reservation
export type CreateReservationInput = {
  listingId: string;
  userId?: string | null; // optional, server will prefer authenticated user
  startDate: Date;
  endDate: Date;
  chargeId: string;
  daysDifference: number;
  reservedDates: number[];
  phone: string;
  totalPrice: number;
  specialRequests?: string | null;
};

async function createReservation(data: CreateReservationInput): Promise<Reservation> {
  const {
    listingId,
    startDate,
    endDate,
    chargeId,
    daysDifference,
    reservedDates,
    phone,
    totalPrice,
    specialRequests,
    userId: inputUserId, // get userId from input
  } = data;

  // ensure expired reservations are finalized before attempting to book
  await updateExpiredReservations();

  // Prefer userId from Stripe metadata, fallback to authenticated user
  let userId = inputUserId;
  if (!userId) {
    userId = await getUserId();
  }
  if (!userId) {
    throw new Error("認証が必要です。ログインしてください。");
  }

  const result = await prisma.$transaction(async (tx) => {
    // decrement roomsAvailable atomically
    const dec = await tx.listing.updateMany({
      where: { id: listingId, roomsAvailable: { gt: 0 } },
      data: { roomsAvailable: { decrement: 1 } },
    });
    if (dec.count === 0) throw new Error("No rooms available");

    // ensure user exists in DB
    const existingUser = await tx.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      throw new Error("Authenticated user record not found");
    }

    // create ACTIVE reservation
    const reservation = await tx.reservation.create({
      data: {
        listingId,
        userId,
        startDate,
        endDate,
        chargeId,
        daysDifference,
        reservedDates,
        phone,
        totalPrice,
        specialRequests: specialRequests ?? null,
        status: ReservationStatus.ACTIVE, // Ensure status is set correctly
      },
    });

    return reservation;
  });

  return result;
}

async function cancelReservation(reservationId: string): Promise<Reservation> {
  await updateExpiredReservations();

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.reservation.findUnique({ where: { id: reservationId } });
    if (!existing) throw new Error("Reservation not found");

    const now = new Date();
    const bookingDate = new Date(existing.startDate); // Assuming startDate is when the booking was made
    const timeDiff = now.getTime() - bookingDate.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff > 24) {
      throw new Error("Cannot cancel reservation after 24 hours.");
    }

    if (existing.status === ReservationStatus.CANCELLED || existing.status === ReservationStatus.COMPLETED) {
      return existing; // Return the current reservation as-is
    }

    await tx.reservation.update({
      where: { id: reservationId },
      data: { status: ReservationStatus.CANCELLED },
    });

    // Free the room if it was ACTIVE or BLOCKED
    if (existing.status === ReservationStatus.ACTIVE || existing.status === ReservationStatus.BLOCKED) {
      await tx.listing.update({
        where: { id: existing.listingId },
        data: { roomsAvailable: { increment: 1 } },
      });
    }

    const updated = await tx.reservation.findUnique({ where: { id: reservationId } });
    if (!updated) throw new Error("Failed to fetch updated reservation");
    return updated;
  });

  return result;
}

async function adminCreateBlockReservation(data: {
  listingId: string;
  adminUserId?: string | null;
  startDate: Date;
  endDate: Date;
  daysDifference: number;
  reservedDates: number[];
  phone?: string;
  totalPrice?: number;
  reason?: string | null;
}): Promise<Reservation> {
  const { listingId, adminUserId, startDate, endDate, daysDifference, reservedDates, phone, totalPrice, reason } = data;

  await updateExpiredReservations();

  const result = await prisma.$transaction(async (tx) => {
    // decrement roomsAvailable atomically
    const dec = await tx.listing.updateMany({
      where: { id: listingId, roomsAvailable: { gt: 0 } },
      data: { roomsAvailable: { decrement: 1 } },
    });
    if (dec.count === 0) throw new Error("No rooms available to block");

    // ensure admin user exists (optional)
    let userToUseId = adminUserId ?? null;
    if (userToUseId) {
      const u = await tx.user.findUnique({ where: { id: userToUseId } });
      if (!u) userToUseId = null;
    }
    if (!userToUseId) {
      const guest = await tx.user.create({
        data: {
          email: `block_${Date.now()}_${Math.random().toString(36).slice(2,8)}@local.dev`,
          name: "BlockedByAdmin",
        },
      });
      userToUseId = guest.id;
    }

    const reservation = await tx.reservation.create({
      data: {
        listingId,
        userId: userToUseId,
        startDate,
        endDate,
        chargeId: `BLOCK_${Date.now()}`,
        daysDifference,
        reservedDates,
        phone: phone ?? "N/A",
        totalPrice: totalPrice ?? 0,
        specialRequests: reason ?? "Admin block",
        status: ReservationStatus.BLOCKED,
      },
    });

    return reservation;
  });

  return result;
}

async function adminUnblockReservation(reservationId: string): Promise<Reservation> {
  await updateExpiredReservations();

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.reservation.findUnique({ where: { id: reservationId } });
    if (!existing) throw new Error("Reservation not found");
    if (existing.status !== ReservationStatus.BLOCKED) {
      // return as-is (fresh from DB)
      return existing;
    }

    // determine new status: COMPLETED if already past endDate, otherwise CANCELLED
    const now = new Date();
    const newStatus = existing.endDate < now ? ReservationStatus.COMPLETED : ReservationStatus.CANCELLED;

    await tx.reservation.update({
      where: { id: reservationId },
      data: { status: newStatus },
    });

    // freeing the room since BLOCKED no longer occupies
    await tx.listing.update({
      where: { id: existing.listingId },
      data: { roomsAvailable: { increment: 1 } },
    });

    const updated = await tx.reservation.findUnique({ where: { id: reservationId } });
    if (!updated) throw new Error("Failed to fetch updated reservation");
    return updated;
  });

  return result;
}

/**
 * Fetch bookings for a given userId.
 * Ensures expired reservations are processed first.
 * Returns Reservation[] with a populated minimal listing object.
 */
async function getBookingsByUser(userId: string): Promise<(Reservation & { listing?: { name?: string | null } | null })[]> {
  if (!userId) return [];

  await updateExpiredReservations();

  const rows = await prisma.reservation.findMany({
    where: { userId },
    include: {
      listing: {
        select: { name: true }, // only 'name' exists on Listing in schema
      },
    },
    orderBy: { createdAt: "desc" }, // Sắp xếp mới nhất lên đầu
  });

  // narrow the type explicitly instead of using `any`
  return rows as (Reservation & { listing?: { name?: string | null } | null })[];
}

/**
 * Fetch a single booking by ID with full listing details.
 * Returns null if not found or user doesn't have access.
 */
type BookingWithListingAndUser = Prisma.ReservationGetPayload<{
  include: {
    listing: {
      include: {
        roomType: { select: { name: true } };
        province: { select: { name: true } };
        ward: { select: { name: true } };
      };
    };
    user: { select: { name: true; email: true } };
  };
}>;

async function getBookingById(reservationId: string): Promise<BookingWithListingAndUser | null> {
  await updateExpiredReservations();

  const userId = await getUserId();
  if (!userId) return null;

  const booking = await prisma.reservation.findFirst({
    where: {
      id: reservationId,
      userId,
    },
    include: {
      listing: {
        include: {
          roomType: {
            select: { name: true },
          },
          province: {
            select: { name: true },
          },
          ward: {
            select: { name: true },
          },
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return booking;
}

/**
 * ADMIN: Lấy danh sách reservation (có phân trang, lọc, tìm kiếm)
 */
async function adminListReservations({
  pageIndex = 0,
  pageSize = 20,
  search = "",
  status,
  listingId,
  userId,
}: {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  status?: ReservationStatus;
  listingId?: string;
  userId?: string;
}) {
  const where: Prisma.ReservationWhereInput = {
    ...(status ? { status } : {}),
    ...(listingId ? { listingId } : {}),
    ...(userId ? { userId } : {}),
    ...(search
      ? {
          OR: [
            { phone: { contains: search, mode: "insensitive" } },
            { user: { name: { contains: search, mode: "insensitive" } } },
            { listing: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const total = await prisma.reservation.count({ where });

  const reservations = await prisma.reservation.findMany({
    where,
    orderBy: { createdAt: "desc" }, // Sắp xếp mới nhất lên đầu
    skip: pageIndex * pageSize,
    take: pageSize,
    include: {
      user: { select: { id: true, name: true, email: true } },
      listing: { select: { id: true, name: true } },
    },
  });

  return { reservations, total };
}

/**
 * ADMIN: Lấy chi tiết reservation theo ID
 */
async function adminGetReservationById(reservationId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      listing: {
        select: {
          id: true,
          name: true,
          roomType: { select: { name: true } },
          province: { select: { name: true } },
          ward: { select: { name: true } },
        },
      },
    },
  });
  return reservation;
}

/**
 * ADMIN: Cập nhật reservation (chỉ cho phép cập nhật status, specialRequests, phone)
 */
async function adminUpdateReservation(
  reservationId: string,
  data: {
    status?: ReservationStatus;
    specialRequests?: string | null;
    phone?: string;
  }
) {
  const updated = await prisma.reservation.update({
    where: { id: reservationId },
    data: {
      ...(data.status ? { status: data.status } : {}),
      ...(data.specialRequests !== undefined ? { specialRequests: data.specialRequests } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      listing: { select: { id: true, name: true } },
    },
  });
  return updated;
}

/**
 * ADMIN: Xoá reservation
 */
async function adminDeleteReservation(reservationId: string) {
  const deleted = await prisma.reservation.delete({
    where: { id: reservationId },
    select: { id: true },
  });
  return deleted;
}

/**
 * Thống kê số lượng đặt phòng theo từng tháng trong năm hiện tại
 */
async function getReservationCountByMonth(year?: number) {
  const now = new Date();
  const targetYear = year ?? now.getFullYear();

  // Đếm tất cả reservation trong năm, không lọc trạng thái
  const reservations = await prisma.reservation.findMany({
    where: {
      createdAt: {
        gte: new Date(targetYear, 0, 1),
        lt: new Date(targetYear + 1, 0, 1),
      },
    },
    select: { createdAt: true },
  });

  const counts = Array(12).fill(0);
  reservations.forEach((r) => {
    const month = r.createdAt.getMonth();
    counts[month]++;
  });

  return counts.map((count, idx) => ({
    month: idx + 1,
    count,
  }));
}

export {
  createReservation,
  cancelReservation,
  adminCreateBlockReservation,
  adminUnblockReservation,
  updateExpiredReservations,
  getBookingsByUser,
  getBookingById,
  adminListReservations,
  adminGetReservationById,
  adminUpdateReservation,
  adminDeleteReservation,
  getReservationCountByMonth,
};
