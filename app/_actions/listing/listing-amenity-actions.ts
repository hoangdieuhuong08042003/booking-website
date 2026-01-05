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
	return await prisma.amenity.findMany({
		select: { id: true, name: true },
		// Ưu tiên createdAt nếu có, nếu không thì id
		orderBy: { id: "desc" },
	});
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

/**
 * Lấy tất cả loại phòng (tĩnh)
 */
async function getRoomTypes() {
	return await prisma.roomType.findMany({ select: { id: true, name: true } });
}

// Lấy tất cả tiện nghi
async function getAmenity() {
	return await prisma.amenity.findMany({
		select: { id: true, name: true },
		orderBy: { id: "desc" },
	});
}

export {
	createAmenity,
	listAmenities,
	updateAmenity,
	removeAmenity,
	getRoomTypes,
	getAmenity,
};

/**
 * Tạo RoomType mới
 */
async function createRoomType(data: { name: string; desc?: string }) {
	return await prisma.roomType.create({ data, select: { id: true, name: true, desc: true } });
}

/**
 * Lấy tất cả RoomType
 */
async function listRoomTypes() {
	return await prisma.roomType.findMany({
		select: { id: true, name: true, desc: true },
		orderBy: { id: "desc" },
	});
}

/**
 * Cập nhật RoomType
 */
async function updateRoomType(id: string, data: { name?: string; desc?: string }) {
	return await prisma.roomType.update({ where: { id }, data, select: { id: true, name: true, desc: true } });
}

/**
 * Xóa RoomType
 */
async function removeRoomType(id: string) {
	return await prisma.roomType.delete({ where: { id }, select: { id: true } });
}

export {
	createRoomType,
	listRoomTypes,
	updateRoomType,
	removeRoomType,
};
