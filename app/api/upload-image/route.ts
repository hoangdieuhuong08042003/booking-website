import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/image-upload-handler";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  try {
    const url = await uploadImageToCloudinary(file);
    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
