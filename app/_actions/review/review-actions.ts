"use server";

import { prisma } from "@/lib/prisma";

export async function getListingReviews(listingId: string) {
	// ...input validation if needed...
	return prisma.review.findMany({
		where: { listingId },
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			text: true,
			stars: true,
			createdAt: true,
			user: { select: { id: true, name: true, image: true } },
		},
	});
}
