import { NextRequest, NextResponse } from "next/server";

const FLASK_API = "https://booking-website-suggest.onrender.com/itinerary_w2v";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Kiểm tra days là mảng chuỗi ngày
  if (!body.province || !body.days || !Array.isArray(body.days) || !body.keywords?.length) {
    return NextResponse.json(
      { error: "Missing province / days / keywords" },
      { status: 400 }
    );
  }

  const res = await fetch(FLASK_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data);
}
