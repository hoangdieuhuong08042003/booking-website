import { DashboardHeader } from "@/app/_components/dashboard-header";
import ImageGallery from "@/app/_components/image-gallery";
import { Star, MapPin, Wifi, Utensils, Dumbbell } from "lucide-react";
import { getListingById } from "@/app/_actions/listing/listing-actions";
import Link from "next/link";

export default async function HotelDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const listing = await getListingById(params.id);

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Listing không tìm thấy</h1>
        </div>
      </div>
    );
  }

  const imageSrc =
    listing.thumbnail ?? listing.imageUrls?.[0] ?? "/placeholder.svg";
  const location =
    listing.province?.name ?? listing.district?.name ?? listing.type ?? "";
  const rating = listing.avgRating ?? 0;
  const amenities = listing.amenities?.map((a) => a.amenity.name) ?? [];

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      {/* remove container limit so page can use near-full width */}
      <div className="px-4 py-8">
        {/* WRAPPER: nearly full viewport width */}
        <div className="listing-wrapper max-w-[95vw] mx-auto w-full flex flex-col gap-10 bg-white rounded-lg shadow p-8 lg:p-12">
          {/* Main gallery (full width) */}
          <div className="w-full">
            <ImageGallery
              thumbnail={imageSrc}
              images={listing.imageUrls ?? []}
              alt={listing.name}
            />
          </div>

          {/* Info block: trên mobile xếp dọc, trên lg xếp ngang (thông tin bên trái, booking bên phải) */}
          <div className="w-full">
            <div className="mb-4" />

            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Left: chính chứa title, rating, desc, amenities, other info */}
              <div className="flex-1">
                <h1 className="text-6xl leading-tight font-bold text-foreground mb-6">
                  {listing.name}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="text-xl font-semibold">
                      {rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    ({listing.avgRating ?? 0} đánh giá)
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {location}
                  </div>
                </div>

                <p className="text-lg text-muted-foreground mb-8">
                  {listing.desc}
                </p>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Tiện nghi</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {amenities.length ? (
                      amenities.map((amenity, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-3 bg-secondary rounded"
                        >
                          {amenity.includes("WiFi") && (
                            <Wifi className="w-4 h-4" />
                          )}
                          {(amenity.toLowerCase().includes("nhà hàng") ||
                            amenity.toLowerCase().includes("nhahang")) && (
                            <Utensils className="w-4 h-4" />
                          )}
                          {amenity.toLowerCase().includes("gym") && (
                            <Dumbbell className="w-4 h-4" />
                          )}
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Không có thông tin tiện nghi
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Thông tin khác</h2>
                  <div className="space-y-2 text-muted-foreground">
                    <div>
                      Giường:{" "}
                      {typeof listing.beds === "number" ? listing.beds : "—"}
                    </div>
                    <div>Loại: {listing.type}</div>
                  </div>
                </div>
              </div>

              {/* Right: booking card (bên cạnh thông tin trên lg, dưới trên mobile) */}
              <div className="w-full lg:w-96 flex-shrink-0">
                <div className="bg-card border border-border rounded-lg p-8 lg:sticky lg:top-24">
                  <h3 className="text-xl font-bold mb-4">Chi tiết đặt phòng</h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Giá mỗi đêm
                      </p>
                      <p className="text-4xl font-extrabold text-accent">
                        {listing.pricePerNight.toLocaleString("vi-VN")} ₫
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Số giường
                      </p>
                      <p className="font-semibold">{listing.beds ?? "—"}</p>
                    </div>
                  </div>

                  <Link href={`/dashboard/booking/${listing.id}`}>
                    <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 lg:py-6 text-lg lg:text-xl rounded">
                      Tiếp tục đặt phòng
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
