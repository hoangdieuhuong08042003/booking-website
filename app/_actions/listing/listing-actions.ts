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
  thumbnail: string;
  provinceId?: string | null;   // <--- FIX
  wardId?: string | null;       // <--- FIX
  amenityIds?: string[];
  roomsAvailable?: number;
}) {
  const { amenityIds, thumbnail, roomsAvailable, provinceId, wardId, ...rest } = data;

  const created = await prisma.listing.create({
    data: {
      ...rest,
      imageUrls: rest.imageUrls ?? [],
      thumbnail,
      roomsAvailable: roomsAvailable ?? 0,

      // 🔥 FIX LONG-TERM — correct Prisma relation creation
      province: provinceId ? { connect: { id: provinceId } } : undefined,
      ward: wardId ? { connect: { id: wardId } } : undefined,

      amenities:
        amenityIds?.length
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
      provinceId: true,
      wardId: true,
      avgRating: true,
      roomsAvailable: true,
      amenities: {
        select: {
          amenity: { select: { id: true, name: true } },
        },
      },
      province: { select: { id: true, name: true } },
      ward: { select: { id: true, name: true } },
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
      provinceId: true,
      wardId: true,
      roomTypeId: true,
      avgRating: true,
      roomsAvailable: true,
      province: { select: { id: true, name: true } },
      ward: { select: { id: true, name: true } },
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
  wardId,
  startDate,
  endDate,
  numGuests,
  minPrice,
  maxPrice,
  type,
  selectedAmenities = [],
}: {
  provinceId?: string;
  wardId?: string;
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
      provinceId,
      wardId,
      beds: minBeds ? { gte: minBeds } : undefined,
      type,
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
      ward: true,
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
      ward: true,
      amenities: { include: { amenity: true } },
    },
  });
  return listing;
}

/**
 * Lọc listings theo nhiều trường filter (tương tự getPlansByFilter)
 */
async function getListingByFilter({
  title,
  type,
  provinceId,
  wardId,
  priceRange,
  selectedAmenities,
  guests,
  pageIndex = 0,
  pageSize = 20,
  roomTypeId,
}: {
  title?: string;
  type?: string;
  provinceId?: string;
  wardId?: string;
  priceRange?: [number, number];
  selectedAmenities?: string[];
  guests?: number;
  pageIndex?: number;
  pageSize?: number;
  roomTypeId?: string;
}) {
  let minBeds: number | undefined;
  if (guests) {
    minBeds = Math.ceil(guests / 2);
  }

  const where: Prisma.ListingWhereInput = {
    ...(title
      ? { name: { contains: title, mode: "insensitive" } }
      : {}),
    ...(type ? { type } : {}),
    ...(roomTypeId ? { roomTypeId } : {}),
    ...(provinceId ? { provinceId } : {}),
    ...(wardId ? { wardId } : {}),
  
    ...(minBeds ? { beds: { gte: minBeds } } : {}),
    ...(priceRange
      ? { pricePerNight: { gte: priceRange[0], lte: priceRange[1] } }
      : {}),
    ...(selectedAmenities && selectedAmenities.length
      ? {
          amenities: {
            some: {
              amenity: { name: { in: selectedAmenities } },
            },
          },
        }
      : {}),
  };

  const listings = await prisma.listing.findMany({
    where,
    orderBy: { avgRating: "desc" },
    skip: pageIndex * pageSize,
    take: pageSize,
    select: {
      id: true,
      name: true,
      type: true,
      desc: true,
      pricePerNight: true,
      beds: true,
      imageUrls: true,
      thumbnail: true,
      provinceId: true,
      wardId: true,
      roomTypeId: true, // <-- add this line
      avgRating: true,
      roomsAvailable: true,
      province: { select: { id: true, name: true } },
      ward: { select: { id: true, name: true } },
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

/**
 * Lấy min/max price của tất cả listings
 */
async function getListingPriceRange() {
  const [minResult, maxResult] = await Promise.all([
    prisma.listing.aggregate({ _min: { pricePerNight: true } }),
    prisma.listing.aggregate({ _max: { pricePerNight: true } }),
  ]);
  return {
    min: minResult._min.pricePerNight ?? 0,
    max: maxResult._max.pricePerNight ?? 10000000,
  };
}

// (REMOVE) createReservation implementation moved to reservation-actions.ts

export {
  createListing,
  getNewestListings,
  searchListings,
  getListingById,
  getListingByFilter, // <-- export mới
  getListingPriceRange, // <-- export mới
  // createReservation removed from here
};
