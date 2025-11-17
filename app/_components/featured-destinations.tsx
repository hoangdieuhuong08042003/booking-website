import { MapPin, Star } from "lucide-react";

const featuredHotels = [
  {
    id: 1,
    name: "Hà Nội Luxury Palace",
    location: "Hà Nội, Việt Nam",
    image: "/luxury-hotel-hanoi-palace-elegant.jpg",
    rooms: 120,
    rating: 4.9,
    price: "2,500,000₫",
    pricePerNight: "1,200,000₫",
  },
  {
    id: 2,
    name: "Hội An Ancient Riverside",
    location: "Hội An, Việt Nam",
    image: "/luxury-hotel-hoi-an-riverside-traditional.jpg",
    rooms: 85,
    rating: 4.8,
    price: "1,800,000₫",
    pricePerNight: "900,000₫",
  },
  {
    id: 3,
    name: "Phú Quốc Beach Resort",
    location: "Phú Quốc, Việt Nam",
    image: "/luxury-resort-phu-quoc-beach-tropical.jpg",
    rooms: 200,
    rating: 4.7,
    price: "3,500,000₫",
    pricePerNight: "1,800,000₫",
  },
  {
    id: 4,
    name: "Bangkok Grand Hotel",
    location: "Bangkok, Thái Lan",
    image: "/luxury-hotel-bangkok-modern-city.jpg",
    rooms: 180,
    rating: 4.8,
    price: "2,200,000₫",
    pricePerNight: "1,100,000₫",
  },
  {
    id: 5,
    name: "Kyoto Traditional Ryokan",
    location: "Kyoto, Nhật Bản",
    image: "/luxury-ryokan-kyoto-traditional-japan.jpg",
    rooms: 50,
    rating: 4.9,
    price: "3,800,000₫",
    pricePerNight: "1,900,000₫",
  },
  {
    id: 6,
    name: "Bali Paradise Villa",
    location: "Bali, Indonesia",
    image: "/luxury-villa-bali-paradise-tropical.jpg",
    rooms: 95,
    rating: 4.8,
    price: "2,800,000₫",
    pricePerNight: "1,400,000₫",
  },
];

export function FeaturedDestinations() {
  return (
    <section id="destinations" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Khách Sạn Nổi Bật
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Khám phá những khách sạn hàng đầu được đánh giá cao nhất từ hơn 2
            triệu du khách trên toàn thế giới
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-border hover:border-primary"
            >
              <div className="relative overflow-hidden h-64 bg-muted">
                <img
                  src={hotel.image || "/placeholder.svg"}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                  <Star size={16} className="fill-accent text-accent" />
                  <span className="text-sm font-semibold text-foreground">
                    {hotel.rating}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {hotel.name}
                    </h3>
                    <p className="text-sm text-foreground/60 flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      {hotel.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-border">
                  <span className="text-sm text-foreground/70">
                    {hotel.rooms} phòng
                  </span>
                  <button className="text-primary hover:text-primary/80 font-semibold transition">
                    Xem Chi Tiết →
                  </button>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-foreground/60 mb-2">
                    Giá mỗi đêm từ
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {hotel.pricePerNight}
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
