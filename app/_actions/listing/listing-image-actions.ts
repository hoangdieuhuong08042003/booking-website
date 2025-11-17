"use server";

import { prisma } from "@/lib/prisma";

/**
 * Thêm 1 ảnh vào listing.imageUrls (đẩy vào cuối)
 */
async function addImageToListing(
  listingId: string,
  imageUrl: string
): Promise<string[]> {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { imageUrls: true },
  });
  const current = listing?.imageUrls ?? [];
  const next = [...current, imageUrl];
  await prisma.listing.update({
    where: { id: listingId },
    data: { imageUrls: { set: next } },
  });
  return next;
}

/**
 * Lấy tất cả ảnh của 1 listing (mảng string)
 */
async function getImages(listingId: string): Promise<string[]> {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { imageUrls: true },
  });
  return listing?.imageUrls ?? [];
}

/**
 * Lấy 1 ảnh theo index (nếu cần)
 */
async function getImageAtIndex(
  listingId: string,
  index: number
): Promise<string | null> {
  const imgs = await getImages(listingId);
  return imgs[index] ?? null;
}

/**
 * Xóa 1 ảnh (theo url). Trả về mảng ảnh mới
 */
async function removeImageFromListing(
  listingId: string,
  imageUrl: string
): Promise<string[]> {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { imageUrls: true },
  });
  const current = listing?.imageUrls ?? [];
  const next = current.filter((u) => u !== imageUrl);
  await prisma.listing.update({
    where: { id: listingId },
    data: { imageUrls: { set: next } },
  });
  return next;
}

/**
 * Xóa tất cả ảnh của listing (set về [])
 */
async function clearListingImages(listingId: string): Promise<void> {
  await prisma.listing.update({
    where: { id: listingId },
    data: { imageUrls: { set: [] } },
  });
}

/**
 * Sắp xếp / cập nhật thứ tự ảnh bằng cách set mảng mới (phải cung cấp toàn bộ mảng mới)
 */
async function setListingImages(
  listingId: string,
  imageUrls: string[]
): Promise<string[]> {
  await prisma.listing.update({
    where: { id: listingId },
    data: { imageUrls: { set: imageUrls ?? [] } },
  });
  return imageUrls ?? [];
}

export {
  addImageToListing,
  getImages,
  getImageAtIndex,
  removeImageFromListing,
  clearListingImages,
  setListingImages,
};