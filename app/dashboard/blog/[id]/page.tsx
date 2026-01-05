import { getBlogById } from "@/app/_actions/blog/blog-actions";
import { notFound } from "next/navigation";
import { DashboardHeader } from "@/app/_components/dashboard-header";
import Image from "next/image";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) return notFound();

  const formattedDate = new Date(blog.publishedAt).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-accent/30">
      <DashboardHeader />

      <main className="relative pt-16 pb-24">
        {/* Navigation & Actions */}
        <div className="container max-w-5xl mx-auto px-6 mb-12 flex justify-between items-center">
          <Link
            href="/dashboard/blog"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Quay lại danh sách
          </Link>
        </div>

        {/* Hero Section */}
        <div className="container max-w-4xl mx-auto px-6 mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold tracking-wider uppercase mb-8">
            Chia sẻ
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight text-foreground leading-[1.1] mb-8 text-balance">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground border-y border-border py-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/5">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-foreground">
                {blog.author || "Ẩn danh"}
              </span>
            </div>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {blog.imageUrl && (
          <div className="container max-w-6xl mx-auto px-4 mb-20">
            <div className="relative aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/5">
              <Image
                src={blog.imageUrl || "/placeholder.svg"}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-700"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        )}

        {/* Content Layout */}
        <div className="container max-w-3xl mx-auto px-6">
          {blog.excerpt && (
            <p className="text-xl md:text-2xl text-muted-foreground font-serif italic leading-relaxed mb-12 border-l-4 border-accent pl-8 py-2">
              {blog.excerpt}
            </p>
          )}

          <article className="prose prose-lg md:prose-xl prose-primary dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-light prose-p:leading-relaxed prose-p:text-foreground/80">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </article>

          {/* Footer Tags/Actions */}
          <div className="mt-20 pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-2">
              {/* Optional: Add tags here if available in your schema */}
              <span className="px-4 py-1.5 rounded-full border border-border text-xs font-medium  ">
                #Du lịch
              </span>
              <span className="px-4 py-1.5 rounded-full border border-border text-xs font-medium  ">
                #Tip
              </span>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground italic">
                Cảm ơn bạn đã dành thời gian đọc bài viết này.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
