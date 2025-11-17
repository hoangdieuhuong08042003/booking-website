"use server";

import { prisma } from "@/lib/prisma";
import { Prisma, ReservationStatus } from "@prisma/client";
import { updateExpiredReservations } from "@/app/_actions/reservation/reservation-actions";

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
  roomsAvailable?: number; // <-- new optional input
}) {
  const { amenityIds, thumbnail, roomsAvailable, ...rest } = data;
  // thumbnail is required by input/schema — use it directly
  const computedThumbnail = thumbnail;

  const created = await prisma.listing.create({
    data: {
      ...rest,
      imageUrls: rest.imageUrls ?? [],
      thumbnail: computedThumbnail,
      roomsAvailable: roomsAvailable ?? 0, // persist roomsAvailable
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
      roomsAvailable: true, // include new field in response
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
      roomsAvailable: true,
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

async function searchListings({
  provinceId,
  districtId,
  startDate,
  endDate,
  numGuests,
  minPrice,
  maxPrice,
  type,
  selectedAmenities = [],
}: {
  provinceId?: number;
  districtId?: number;
  startDate?: Date;
  endDate?: Date;
  numGuests?: number;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  selectedAmenities?: string[];
}) {
  // ensure expired reservations are finalized before computing availability
  await updateExpiredReservations();

  // Tính số giường tối thiểu dựa trên numGuests (1 bed = 2 người)
  let minBeds: number | undefined;
  if (numGuests) {
    minBeds = Math.ceil(numGuests / 2);
  }

  // build reservation overlap filter:
  const reservationDateWhere: Prisma.ReservationWhereInput = startDate && endDate
    ? {
        AND: [
          { startDate: { lte: endDate } },
          { endDate: { gte: startDate } },
        ],
      }
    : { endDate: { gte: new Date() } };
const blockingStatus: ReservationStatus[] = [ReservationStatus.ACTIVE, ReservationStatus.BLOCKED];


  // Fetch listings with reservations matching the above filter so we can compute availability
  const listings = await prisma.listing.findMany({
    where: {
      provinceId: provinceId ?? undefined,
      districtId: districtId ?? undefined,
      beds: minBeds ? { gte: minBeds } : undefined,
      type: type ?? undefined,
      pricePerNight:
        minPrice !== undefined || maxPrice !== undefined
          ? { gte: minPrice ?? 0, lte: maxPrice ?? 999999999 }
          : undefined,
      amenities: selectedAmenities.length
        ? { every: { amenity: { name: { in: selectedAmenities } } } }
        : undefined,
    },
    include: {
      province: true,
      district: true,
      amenities: { include: { amenity: true } },
      // include only overlapping (or future) reservations that actually block rooms
      reservations: { where: { AND: [reservationDateWhere, { status: { in: blockingStatus } }] }, select: { id: true } },
    },
    orderBy: { avgRating: "desc" },
    take: 20,
  });

  // compute availableRooms = roomsAvailable - number of overlapping blocking reservations
  const results = listings
    .map((l) => {
      const overlappingCount = Array.isArray(l.reservations) ? l.reservations.length : 0;
      const availableRooms = (l.roomsAvailable ?? 0) - overlappingCount;
      return {
        ...l,
        reservations: undefined,
        availableRooms,
      };
    })
    .filter((l) => (l.availableRooms ?? 0) > 0);

  return results;
}

async function getListingById(listingId: string) {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      province: true,
      district: true,
      amenities: { include: { amenity: true } },
    },
  });
  return listing;
}

// (REMOVE) createReservation implementation moved to reservation-actions.ts

export {
  createListing,
  getNewestListings,
  searchListings,
  getListingById,
  // createReservation removed from here
};
