"use server";

import { prisma } from "@/lib/prisma";

/**
 * Tạo listing — trả về các trường cơ bản
 */
async function createListing(data: {
  name: string;
  type: string;
  desc: string;
  pricePerNight: number;
  beds: number;
  imageUrls?: string[];
  thumbnail: string; // <-- made required
  hasFreeWifi?: boolean;
  provinceId?: number | null;
  districtId?: number | null;
  amenityIds?: string[]; // <-- để tạo quan hệ tiện nghi
}) {
  const { amenityIds, thumbnail, ...rest } = data;
  // thumbnail is required by input/schema — use it directly
  const computedThumbnail = thumbnail;

  const created = await prisma.listing.create({
    data: {
      ...rest,
      imageUrls: rest.imageUrls ?? [],
      thumbnail: computedThumbnail,
      amenities:
        amenityIds && amenityIds.length > 0
          ? {
              create: amenityIds.map((amenityId) => ({
                amenity: { connect: { id: amenityId } },
              })),
            }
          : undefined,
    },
    select: {
      id: true,
      name: true,
      type: true,
      desc: true,
      pricePerNight: true,
      beds: true,
      imageUrls: true,
      thumbnail: true,
      hasFreeWifi: true,
      provinceId: true,
      districtId: true,
      avgRating: true,
      // trả về danh sách tiện nghi (id + name)
      amenities: {
        select: {
          amenity: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      // trả về thông tin tỉnh/quận (nếu cần)
      province: { select: { id: true, name: true } },
      district: { select: { id: true, name: true } },
    },
  });
  return created;
}

// Thêm: lấy tất cả listings (không giới hạn số lượng)
async function getNewestListings() {
  const listings = await prisma.listing.findMany({
    orderBy: { avgRating: "desc" },
    select: {
      id: true,
      name: true,
      type: true,
      desc: true,
      pricePerNight: true,
      beds: true,
      imageUrls: true,
      thumbnail: true,
      hasFreeWifi: true,
      provinceId: true,
      districtId: true,
      avgRating: true,
      province: { select: { id: true, name: true } },
      district: { select: { id: true, name: true } },
      amenities: {
        select: {
          amenity: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return listings;
}

export {
  createListing,
  getNewestListings,
};
