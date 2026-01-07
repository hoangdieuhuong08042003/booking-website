import { NextRequest, NextResponse } from "next/server";
import { deleteImageFromCloudinary } from "@/lib/image-upload-handler";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) {
    return NextResponse.json({ error: "No image url provided" }, { status: 400 });
  }
  try {
    await deleteImageFromCloudinary(url);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    let message = "Delete failed";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
