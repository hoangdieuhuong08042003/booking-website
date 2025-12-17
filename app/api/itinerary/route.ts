import { NextRequest, NextResponse } from "next/server";

const FLASK_API = "http://127.0.0.1:5000/itinerary";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.province || !body.days || !body.keywords?.length) {
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
