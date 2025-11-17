"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/app/_actions/user/get-user";
import { Reservation, ReservationStatus } from "@prisma/client";

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
    specialRequests,
  } = data;

  // ensure expired reservations are finalized before attempting to book
  await updateExpiredReservations();

  // get authenticated user (server truth)
  const userId = await getUserId();
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
        specialRequests: specialRequests ?? null,
        status: ReservationStatus.ACTIVE,
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

    if (existing.status === ReservationStatus.CANCELLED || existing.status === ReservationStatus.COMPLETED) {
      // return the current reservation as-is (fresh from DB to ensure full typing)
      return existing;
    }

    // update reservation status to CANCELLED
    await tx.reservation.update({
      where: { id: reservationId },
      data: { status: ReservationStatus.CANCELLED },
    });

    // if it was ACTIVE or BLOCKED, free the room
    if (existing.status === ReservationStatus.ACTIVE || existing.status === ReservationStatus.BLOCKED) {
      await tx.listing.update({
        where: { id: existing.listingId },
        data: { roomsAvailable: { increment: 1 } },
      });
    }

    // fetch updated reservation and return it to satisfy full Reservation type
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
  reason?: string | null;
}): Promise<Reservation> {
  const { listingId, adminUserId, startDate, endDate, daysDifference, reservedDates, reason } = data;

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
    orderBy: { startDate: "desc" },
  });

  // narrow the type explicitly instead of using `any`
  return rows as (Reservation & { listing?: { name?: string | null } | null })[];
}

export {
  createReservation,
  cancelReservation,
  adminCreateBlockReservation,
  adminUnblockReservation,
  updateExpiredReservations,
  getBookingsByUser,
};
