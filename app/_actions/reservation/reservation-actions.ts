"use server";

import { prisma } from "@/lib/prisma";

async function updateExpiredReservations() {
  // mark ACTIVE reservations with endDate < today as COMPLETED and free rooms atomically
  const today = new Date();
  const toComplete = await prisma.reservation.findMany({
    where: { endDate: { lt: today }, status: "ACTIVE" },
    select: { id: true, listingId: true },
  });
  if (toComplete.length === 0) return;

  const byListing: Record<string, number> = {};
  toComplete.forEach((r) => (byListing[r.listingId] = (byListing[r.listingId] ?? 0) + 1));
  await prisma.$transaction(async (tx) => {
    // update reservation statuses
    await tx.reservation.updateMany({
      where: { id: { in: toComplete.map((r) => r.id) } },
      data: { status: "COMPLETED" },
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

async function createReservation(data: {
  listingId: string;
  userId?: string | null;
  startDate: Date;
  endDate: Date;
  chargeId: string;
  daysDifference: number;
  reservedDates: number[]; // corresponds to Reservation.reservedDates (Int[])
  specialRequests?: string | null;
}) {
  const {
    listingId,
    userId,
    startDate,
    endDate,
    chargeId,
    daysDifference,
    reservedDates,
    specialRequests,
  } = data;

  // ensure expired reservations are finalized before attempting to book
  await updateExpiredReservations();

  const result = await prisma.$transaction(async (tx) => {
    // Atomically decrement roomsAvailable only if > 0 to avoid race/overbooking
    const dec = await tx.listing.updateMany({
      where: { id: listingId, roomsAvailable: { gt: 0 } },
      data: { roomsAvailable: { decrement: 1 } },
    });
    if (dec.count === 0) throw new Error("No rooms available");

    // ensure user exists; create guest if not found
    let userToUseId = userId ?? null;
    const existingUser = userToUseId ? await tx.user.findUnique({ where: { id: userToUseId } }) : null;
    if (!existingUser) {
      const guest = await tx.user.create({
        data: {
          email: `guest_${Date.now()}_${Math.random().toString(36).slice(2,8)}@local.dev`,
          name: "Guest",
        },
      });
      userToUseId = guest.id;
    }

    // create ACTIVE reservation
    const reservation = await tx.reservation.create({
      data: {
        listingId,
        userId: userToUseId!,
        startDate,
        endDate,
        chargeId,
        daysDifference,
        reservedDates,
        specialRequests,
        status: "ACTIVE",
      },
    });

    return reservation;
  });

  return result;
}

async function cancelReservation(reservationId: string) {
  await updateExpiredReservations();

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.reservation.findUnique({ where: { id: reservationId } });
    if (!existing) throw new Error("Reservation not found");

    if (existing.status === "CANCELLED" || existing.status === "COMPLETED") {
      return existing;
    }

    // update reservation status to CANCELLED
    await tx.reservation.update({
      where: { id: reservationId },
      data: { status: "CANCELLED" },
    });

    // if it was ACTIVE or BLOCKED, free the room
    if (existing.status === "ACTIVE" || existing.status === "BLOCKED") {
      await tx.listing.update({
        where: { id: existing.listingId },
        data: { roomsAvailable: { increment: 1 } },
      });
    }

    return { ...existing, status: "CANCELLED" };
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
}) {
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
        status: "BLOCKED",
      },
    });

    return reservation;
  });

  return result;
}

async function adminUnblockReservation(reservationId: string) {
  await updateExpiredReservations();

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.reservation.findUnique({ where: { id: reservationId } });
    if (!existing) throw new Error("Reservation not found");
    if (existing.status !== "BLOCKED") return existing;

    // determine new status: COMPLETED if already past endDate, otherwise CANCELLED
    const now = new Date();
    const newStatus = existing.endDate < now ? "COMPLETED" : "CANCELLED";

    await tx.reservation.update({
      where: { id: reservationId },
      data: { status: newStatus },
    });

    // freeing the room since BLOCKED no longer occupies
    await tx.listing.update({
      where: { id: existing.listingId },
      data: { roomsAvailable: { increment: 1 } },
    });

    return { ...existing, status: newStatus };
  });

  return result;
}

export {
  createReservation,
  cancelReservation,
  adminCreateBlockReservation,
  adminUnblockReservation,
  updateExpiredReservations,
};
