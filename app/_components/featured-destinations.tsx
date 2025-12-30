import { Blog } from "@prisma/client";
import { getBlogs } from "../_actions/blog/blog-actions"; // import the action
import { Calendar } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function FeaturedDestinations() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getBlogs();
        setBlogs(data.slice(0, 6));
      } catch (err: unknown) {
        let message = "Lỗi không xác định";
        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section id="blog" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Blog Du Lịch
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Cập nhật kinh nghiệm, chia sẻ hành trình và khám phá những điểm đến
            hấp dẫn tại Việt Nam.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-foreground/70">
            Đang tải blog...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                <Image
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={post.title}
                  width={600}
                  height={300}
                  className="w-full h-56 object-cover"
                  style={{ objectFit: "cover" }}
                  priority={post.id === "1"}
                />
                <div className="flex-1 flex flex-col px-5 py-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-foreground/70 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-end text-xs text-foreground/60 mt-auto gap-4">
                    <span className="flex items-end ">
                      <Calendar className="w-4 h-4 mr-1" />
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("vi-VN")
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
