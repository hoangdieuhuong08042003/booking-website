import Image from "next/image";
import { getProxiedUrl } from "@/lib/utils";
import { Calendar } from "lucide-react";


const blogPosts = [
  {
    id: 1,
    title: "Khám phá Vịnh Hạ Long: Kinh nghiệm du thuyền và tham quan đảo",
    image: "/halong-bay-blog.jpg",
    excerpt:
      "Tìm hiểu cách lên lịch trình, lựa chọn du thuyền và những điểm không thể bỏ lỡ khi đến Vịnh Hạ Long.",
    author: "Nguyễn Văn A",
    date: "2024-06-01",
  },
  {
    id: 2,
    title: "Ẩm thực Hội An: Những món ăn nhất định phải thử",
    image: "/hoi-an-food-blog.jpg",
    excerpt:
      "Hội An không chỉ nổi tiếng với phố cổ mà còn hấp dẫn bởi nền ẩm thực phong phú, đa dạng.",
    author: "Trần Thị B",
    date: "2024-05-20",
  },
  {
    id: 3,
    title: "Chinh phục Fansipan: Hành trình trên nóc nhà Đông Dương",
    image: "/fansipan-blog.jpg",
    excerpt:
      "Kinh nghiệm leo núi Fansipan, chuẩn bị hành trang và những điều cần lưu ý cho chuyến đi an toàn.",
    author: "Lê Văn C",
    date: "2024-05-10",
  },
  {
    id: 4,
    title: "Check-in Đà Nẵng: Những điểm sống ảo không thể bỏ qua",
    image: "/da-nang-checkin-blog.jpg",
    excerpt:
      "Tổng hợp các địa điểm check-in nổi bật tại Đà Nẵng dành cho tín đồ du lịch và nhiếp ảnh.",
    author: "Phạm Thị D",
    date: "2024-04-28",
  },
  {
    id: 5,
    title: "Ninh Bình: Hành trình khám phá Tràng An và Tam Cốc",
    image: "/ninh-binh-blog.jpg",
    excerpt:
      "Gợi ý lịch trình, phương tiện di chuyển và trải nghiệm thú vị tại Ninh Bình.",
    author: "Vũ Minh E",
    date: "2024-04-15",
  },
  {
    id: 6,
    title: "Phú Quốc: Kinh nghiệm du lịch tự túc từ A đến Z",
    image: "/phu-quoc-blog.jpg",
    excerpt:
      "Tất tần tật kinh nghiệm về di chuyển, lưu trú, ăn uống và vui chơi tại đảo ngọc Phú Quốc.",
    author: "Ngô Thị F",
    date: "2024-03-30",
  },
];

export function FeaturedDestinations() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              <Image
                src={getProxiedUrl(post.image) || "/placeholder.svg"}
                alt={post.title}
                width={600}
                height={300}
                className="w-full h-56 object-cover"
                style={{ objectFit: "cover" }}
                priority={post.id === 1}
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
                    {new Date(post.date).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

