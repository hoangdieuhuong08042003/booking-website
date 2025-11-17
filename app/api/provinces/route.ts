import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Lấy từ DB via Prisma
    const rows = await prisma.province.findMany({
      select: { id: true, name: true },
    });

    // map về shape mà client đang mong đợi
    const provinces = rows.map((r) => ({
      province_id: r.id,
      province_name: r.name,
    }));

    return NextResponse.json({ provinces });
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return NextResponse.json({ provinces: [] }, { status: 500 });
  }
}
