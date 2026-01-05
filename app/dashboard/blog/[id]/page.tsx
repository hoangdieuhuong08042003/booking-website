import { getBlogById } from "@/app/_actions/blog/blog-actions";
import { notFound } from "next/navigation";
import { DashboardHeader } from "@/app/_components/dashboard-header";
import Image from "next/image";

type Props = {
  params: { id: string };
};

export default async function BlogDetailPage({ params }: Props) {
  const blog = await getBlogById(params.id);

  if (!blog) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-50 to-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Ảnh đại diện lớn */}
        {blog.imageUrl && (
          <div className="w-full h-72 md:h-96 rounded-3xl overflow-hidden mb-10 shadow-2xl relative border-2 border-primary/10 transition-transform duration-300 hover:scale-[1.02]">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              className="object-cover object-center transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 66vw"
              priority={true}
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar thông tin phụ */}
          <aside className="md:w-1/4 flex-shrink-0 mb-6 md:mb-0">
            <div className="bg-card/80 border border-border rounded-2xl p-6 shadow-lg text-center md:sticky md:top-28 transition-all duration-200 hover:shadow-xl">
              <div className="mb-4">
                <span className="block text-xs text-muted-foreground uppercase tracking-widest">
                  Tác giả
                </span>
                <span className="font-semibold text-lg text-primary">
                  {blog.author || "Ẩn danh"}
                </span>
              </div>
              <div className="mb-4">
                <span className="block text-xs text-muted-foreground uppercase tracking-widest">
                  Ngày đăng
                </span>
                <span className="font-medium text-base">
                  {new Date(blog.publishedAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              {blog.excerpt && (
                <div className="mt-4 px-2">
                  <p className="italic text-muted-foreground text-sm">
                    {blog.excerpt}
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* Nội dung chính */}
          <article className="md:w-3/4 bg-white/90 rounded-2xl shadow-xl border border-border px-8 py-10 transition-all duration-200 hover:shadow-2xl">
            <h1 className="text-4xl font-extrabold mb-6 text-primary leading-tight border-b-2 border-primary/20 pb-3">
              {blog.title}
            </h1>
            <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground md:hidden">
              {blog.author && <span>Tác giả: {blog.author}</span>}
              <span>
                {new Date(blog.publishedAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
            <div
              className="prose prose-lg max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>
        </div>
      </div>
    </div>
  );
}
