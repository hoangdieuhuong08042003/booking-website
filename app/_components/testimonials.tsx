import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    role: "Du khách",
    image: "/stylized-user-avatar.png",
    text: "Dịch vụ của TravelHub thật tuyệt vời! Toàn bộ chuyến đi của tôi được sắp xếp hoàn hảo từ đầu đến cuối. Tôi sẽ chắc chắn sử dụng lại dịch vụ của các bạn.",
    rating: 5,
  },
  {
    id: 2,
    name: "Trần Thị B",
    role: "Du khách",
    image: "/avatar-female-user.jpg",
    text: "Giá cả rất hợp lý và chất lượng dịch vụ rất cao. Đội hỗ trợ khách hàng rất thân thiện và lúc nào cũng sẵn lòng giúp đỡ.",
    rating: 5,
  },
  {
    id: 3,
    name: "Phạm Minh C",
    role: "Du khách",
    image: "/avatar-male-user.jpg",
    text: "Tôi đã sử dụng TravelHub cho nhiều chuyến đi khác nhau và luôn cảm thấy hài lòng. Cảm ơn đội ngũ của các bạn vì những trải nghiệm tuyệt vời!",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Tin Tưởng Từ Hàng Triệu Khách Hàng
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Đọc những câu chuyện từ những du khách đã trải nghiệm những chuyến
            du lịch tuyệt vời cùng TravelHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={18} className="fill-accent text-accent" />
                ))}
              </div>

              <p className="text-foreground/80 mb-6 leading-relaxed">
                {testimonial.text}
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-foreground/60">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
