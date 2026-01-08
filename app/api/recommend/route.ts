import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

const FLASK_API = "https://booking-website-suggest.onrender.com/recommend_w2v";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.province || !body.keywords?.length) {
      return NextResponse.json(
        { error: "Missing province / keywords" },
        { status: 400 }
      );
    }

    // Đảm bảo days là mảng chuỗi ngày nếu có
    if (body.days && !Array.isArray(body.days)) {
      body.days = [body.days];
    }

    const res = await fetch(FLASK_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Flask API error", detail: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Proxy error", message: (err instanceof Error ? err.message : "Unknown error") },
      { status: 500 }
    );
  }
}
