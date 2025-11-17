import { Star, MapPin, CreditCard, HeadsetIcon, Lock, Zap } from "lucide-react";

const services = [
  {
    id: 1,
    icon: Star,
    title: "Khách Sạn Chất Lượng",
    description:
      "Chọn từ hơn 500,000 khách sạn và resort được xác minh chất lượng cao",
  },
  {
    id: 2,
    icon: MapPin,
    title: "Địa Điểm Tuyệt Vời",
    description:
      "Khách sạn ở những vị trí đắc địa, gần các điểm tham quan nổi tiếng",
  },
  {
    id: 3,
    icon: Lock,
    title: "Giá Tốt Nhất Được Đảm Bảo",
    description: "Tìm thấy giá rẻ hơn? Chúng tôi sẽ hoàn tiền chênh lệch",
  },
  {
    id: 4,
    icon: CreditCard,
    title: "Thanh Toán Linh Hoạt",
    description: "Nhiều hình thức thanh toán, trả góp 0% lãi suất",
  },
  {
    id: 5,
    icon: Zap,
    title: "Hủy Miễn Phí",
    description: "Hủy phòng miễn phí cho hầu hết các đặt phòng của bạn",
  },
  {
    id: 6,
    icon: HeadsetIcon,
    title: "Hỗ Trợ 24/7",
    description: "Đội hỗ trợ khách hàng sẵn sàng giúp bạn bất cứ lúc nào",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Dịch Vụ Toàn Diện
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Mọi thứ bạn cần để đặt phòng hoàn hảo, từ tìm kiếm đến hỗ trợ sau
            booking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl p-8 border border-border hover:border-primary hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <IconComponent size={24} className="text-white" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>

                <p className="text-foreground/70">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
