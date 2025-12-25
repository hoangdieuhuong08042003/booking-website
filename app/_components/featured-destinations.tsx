import Image from "next/image";
import { getProxiedUrl } from "@/lib/utils";

const featuredHotels = [
  {
    id: 1,
    name: "Hà Nội Luxury Palace",
    location: "Hà Nội, Việt Nam",
    image: "/luxury-hotel-hanoi-palace-elegant.jpg",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Hội An Ancient Riverside",
    location: "Hội An, Việt Nam",
    image: "/luxury-hotel-hoi-an-riverside-traditional.jpg",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Phú Quốc Beach Resort",
    location: "Phú Quốc, Việt Nam",
    image: "/luxury-resort-phu-quoc-beach-tropical.jpg",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Bangkok Grand Hotel",
    location: "Bangkok, Thái Lan",
    image: "/luxury-hotel-bangkok-modern-city.jpg",
    rating: 4.8,
  },
  {
    id: 5,
    name: "Kyoto Traditional Ryokan",
    location: "Kyoto, Nhật Bản",
    image: "/luxury-ryokan-kyoto-traditional-japan.jpg",
    rating: 4.9,
  },
  {
    id: 6,
    name: "Bali Paradise Villa",
    location: "Bali, Indonesia",
    image: "/luxury-villa-bali-paradise-tropical.jpg",
    rating: 4.8,
  },
];

export function FeaturedDestinations() {
  return (
    <section id="destinations" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Thư Viện Ảnh
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Khám phá bộ những khách sạn hàng đầu từ khắp nơi trên thế giới
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHotels.map((hotel) => (
            <div key={hotel.id} className="relative w-full h-80 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
              <Image
                src={getProxiedUrl(hotel.image) || "/placeholder.svg"}
                alt={hotel.name}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

