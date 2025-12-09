"use server";

import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@prisma/client";

export async function getListingReviews(listingId: string) {
	const reviews = await prisma.review.findMany({
		where: { listingId },
		select: {
			id: true,
			text: true,
			stars: true,
			createdAt: true,
			user: {
				select: {
					id: true,
					name: true,
					image: true,
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});

	return reviews;
}

export async function createReviewFromReservation({
	reservationId,
	text,
	stars,
}: {
	reservationId: string;
	text: string;
	stars: number;
}) {
	const body = (text ?? "").trim();
	if (!reservationId || !body) throw new Error("Thiếu thông tin đánh giá");

	const rating = Math.min(5, Math.max(1, Math.round(stars)));
	const reservation = await prisma.reservation.findUnique({
		where: { id: reservationId },
		select: { status: true, listingId: true, userId: true },
	});
	if (!reservation || reservation.status !== ReservationStatus.COMPLETED) {
		throw new Error("Chỉ đánh giá được khi đặt phòng đã hoàn thành");
	}

	const review = await prisma.$transaction(async (tx) => {
		const existing = await tx.review.findFirst({
			where: { listingId: reservation.listingId, userId: reservation.userId },
		});

		const saved = existing
			? await tx.review.update({
					where: { id: existing.id },
					data: { text: body, stars: rating },
			  })
			: await tx.review.create({
					data: {
						text: body,
						stars: rating,
						listingId: reservation.listingId,
						userId: reservation.userId,
					},
			  });

		const avg = await tx.review.aggregate({
			where: { listingId: reservation.listingId },
			_avg: { stars: true },
		});
		await tx.listing.update({
			where: { id: reservation.listingId },
			data: { avgRating: avg._avg.stars ?? 0 },
		});

		return saved;
	});

	return review;
}
