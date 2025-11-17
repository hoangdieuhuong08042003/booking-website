"use server";

import { prisma } from "@/lib/prisma";

/**
 * Tạo amenity mới
 */
async function createAmenity(data: { name: string }) {
	return await prisma.amenity.create({ data, select: { id: true, name: true } });
}

/**
 * Lấy tất cả amenity
 */
async function listAmenities() {
	return await prisma.amenity.findMany({ select: { id: true, name: true } });
}

/**
 * Cập nhật amenity
 */
async function updateAmenity(id: string, data: { name?: string }) {
	return await prisma.amenity.update({ where: { id }, data, select: { id: true, name: true } });
}

/**
 * Xóa amenity: xóa các liên kết ListingAmenity trước
 */
async function removeAmenity(id: string) {
	return await prisma.$transaction(async (tx) => {
		await tx.listingAmenity.deleteMany({ where: { amenityId: id } });
		return await tx.amenity.delete({ where: { id }, select: { id: true } });
	});
}

export {
	createAmenity,
	listAmenities,
	updateAmenity,
	removeAmenity,
};
