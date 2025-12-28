import { NextRequest, NextResponse } from "next/server";

const FLASK_API = "http://127.0.0.1:5000/recommend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.province || !body.keywords?.length) {
      return NextResponse.json(
        { error: "Missing province / keywords" },
        { status: 400 }
      );
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
