import React from "react";
import { DashboardHeader } from "@/app/_components/dashboard-header";
import ImageGallery from "@/app/_components/image-gallery";
import { Star, MapPin, BedDouble, DoorOpen, Tag } from "lucide-react";
import { getListingById } from "@/app/_actions/listing/listing-actions";
import Link from "next/link";
import ListingReviews from "@/app/(site)/listings/[listingId]/_components/listing-reviews";
import { Button } from "@/components/ui/button";

export default async function HotelDetailPage({
  params,
}: {
  // params may be a direct object or a Promise that resolves to the object
  params: { id: string } | Promise<{ id: string }>;
}) {
  // unwrap params safely in async server component (await works for both Promise and plain object)
  const resolvedParams = (await params) as { id: string };
  const listing = await getListingById(resolvedParams.id);

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
    listing.province?.name && listing.ward?.name
      ? `${listing.ward.name}, ${listing.province.name}`
      : listing.province?.name ?? listing.ward?.name ?? listing.type ?? "";
  const rating = listing.avgRating ?? 0;
  const amenities = listing.amenities?.map((a) => a.amenity.name) ?? [];

  // Thêm hàm tạo màu pastel ngẫu nhiên
  function getRandomPastelColor(seed: string) {
    // Simple hash from string
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Generate pastel HSL
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 88%)`;
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="px-2 py-8 bg-gradient-to-b from-gray-50 to-background min-h-screen">
        <div className="listing-wrapper max-w-[1200px] mx-auto w-full flex flex-col gap-10">
          {/* Main gallery */}
          <div className="w-full flex justify-center rounded-2xl overflow-hidden shadow-lg bg-white">
            <ImageGallery
              thumbnail={imageSrc}
              images={listing.imageUrls ?? []}
              alt={listing.name}
            />
          </div>

          {/* Info block */}
          <div className="w-full flex flex-col lg:flex-row gap-8">
            {/* Left: Title, rating, desc, amenities, other info */}
            <div className="flex-1 flex flex-col gap-8">
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h1 className="text-4xl lg:text-5xl leading-tight font-bold text-foreground mb-4">
                  {listing.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-red-500 text-red-500" />
                    <span className="text-lg font-semibold">
                      {rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-base">
                    ({listing.avgRating ?? 0} đánh giá)
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">{location}</span>
                  </div>
                </div>
                <div
                  className="text-base text-muted-foreground mb-6"
                  dangerouslySetInnerHTML={{
                    __html: listing.desc || "",
                  }}
                />
                <div>
                  <h2 className="text-xl font-bold mb-3">Tiện nghi</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {amenities.length ? (
                      amenities.map((amenity, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-3 rounded-lg text-gray-700 text-sm font-semibold shadow-sm"
                          style={{ background: getRandomPastelColor(amenity) }}
                        >
                          <span className="text-xs">{amenity}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        Không có thông tin tiện nghi
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin khác */}
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-xl font-bold mb-4">Thông tin khác</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                    <DoorOpen className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-muted-foreground">
                      Số phòng còn trống:
                    </span>
                    <span className="font-semibold text-base text-foreground">
                      {listing.roomsAvailable ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                    <BedDouble className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      Giường:
                    </span>
                    <span className="font-semibold text-base text-foreground">
                      {typeof listing.beds === "number" ? listing.beds : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                    <Tag className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-muted-foreground">Loại:</span>
                    <span className="font-semibold text-base text-foreground">
                      {listing.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: booking card */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-white border border-border rounded-2xl shadow-lg p-8 sticky top-24">
                <h3 className="text-lg font-bold mb-4">Chi tiết đặt phòng</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Giá mỗi đêm
                    </p>
                    <p className="text-3xl font-extrabold text-red-600">
                      {listing.pricePerNight.toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Số giường
                    </p>
                    <p className="font-semibold">{listing.beds ?? "—"}</p>
                  </div>
                </div>
                <Link
                  href={`/dashboard/booking/${
                    listing.id
                  }?price=${encodeURIComponent(
                    String(listing.pricePerNight)
                  )}&name=${encodeURIComponent(String(listing.name))}`}
                >
                  <Button className="w-full py-3 lg:py-4 text-base lg:text-lg">
                    Tiếp tục đặt phòng
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto w-full bg-white rounded-2xl shadow-md px-4 py-6 mt-8">
          <ListingReviews listingId={listing.id} />
        </div>
      </div>
    </main>
  );
}
