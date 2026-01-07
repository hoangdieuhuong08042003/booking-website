import { NextResponse } from "next/server";
import { getBlogs } from "@/app/_actions/blog/blog-actions";

export async function GET() {
  try {
    const blogs = await getBlogs();
    return NextResponse.json(blogs);
  } catch {
    return NextResponse.json(
      { error: "Không thể tải blog" },
      { status: 500 }
    );
  }
}
