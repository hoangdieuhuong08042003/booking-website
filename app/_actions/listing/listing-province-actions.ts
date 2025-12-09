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
export async function getWards(provinceId: string) {
  return await prisma.ward.findMany({
    where: { provinceId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

