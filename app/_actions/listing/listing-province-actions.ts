"use server";

import { prisma } from "@/lib/prisma";

/**
 * Lấy tất cả tỉnh/thành phố
 */
export async function getProvinces() {
  return await prisma.province.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

/**
 * Lấy tất cả quận/huyện theo tỉnh
 */
export async function getDistricts(provinceId: number) {
  return await prisma.district.findMany({
    where: { provinceId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

