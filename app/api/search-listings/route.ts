import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchListings } from "@/app/_actions/listing/listing-actions";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    location,
    checkIn,
    checkOut,
    guests,
    minPrice,
    maxPrice,
    type,
    selectedAmenities,
  } = body;

  // try to resolve a province by id first (if location is numeric), otherwise by name
  let provinceId: number | undefined;
  if (location !== undefined && location !== null) {
    // if location is already a number or a numeric string, use it directly
    if (
      typeof location === "number" ||
      (/^\d+$/.test(String(location).trim()))
    ) {
      provinceId = Number(location);
    } else if (typeof location === "string" && location.trim().length > 0) {
      const province = await prisma.province.findFirst({
        where: { name: { contains: location.trim(), mode: "insensitive" } },
        select: { id: true },
      });
      provinceId = province?.id;
    }
  }

  const startDate = checkIn ? new Date(checkIn) : undefined;
  const endDate = checkOut ? new Date(checkOut) : undefined;

  const results = await searchListings({
    provinceId,
    districtId: undefined,
    startDate,
    endDate,
    numGuests: guests,
    minPrice,
    maxPrice,
    type,
    selectedAmenities: Array.isArray(selectedAmenities)
      ? selectedAmenities
      : [],
  });

  return NextResponse.json(results);
}
