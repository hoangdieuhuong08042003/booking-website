"use client";

import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@prisma/client";

type ListingWithRelations = Listing & {
  province?: { id: number; name: string } | null;
  district?: { id: number; name: string } | null;
  thumbnail?: string | null;
  amenities?: { amenity: { id: string; name: string } }[];
};

interface ListingCardProps {
  listing: ListingWithRelations;
}

export function HotelCard({ listing }: ListingCardProps) {
  const imageSrc =
    listing.thumbnail ?? listing.imageUrls?.[0] ?? "/placeholder.svg";
  const location =
    listing.province?.name ?? listing.district?.name ?? listing.type ?? "";

  return (
    <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card">
      <div className="relative h-48 w-full bg-muted">
        <Image
          src={imageSrc}
          alt={listing.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h4 className="text-lg font-semibold text-foreground mb-2">
          {listing.name}
        </h4>

        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 text-accent" />
          {location}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-semibold text-foreground">
              {(listing.avgRating ?? 0).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {listing.amenities && listing.amenities.length > 0 ? (
            <>
              {listing.amenities.slice(0, 2).map((la) => (
                <span
                  key={la.amenity.id}
                  className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                >
                  {la.amenity.name}
                </span>
              ))}
              {listing.amenities.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{listing.amenities.length - 2} tiện nghi khác
                </span>
              )}
            </>
          ) : (
            <>
              {typeof listing.beds === "number" && (
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                  {listing.beds} giường
                </span>
              )}
              {listing.hasFreeWifi && (
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                  Wifi miễn phí
                </span>
              )}
            </>
          )}
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Giá / đêm</p>
            <p className="text-xl font-bold text-accent">
              {listing.pricePerNight.toLocaleString("vi-VN")} ₫
            </p>
          </div>
          <Link href={`/dashboard/listing/${listing.id}`}>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Chi tiết
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
