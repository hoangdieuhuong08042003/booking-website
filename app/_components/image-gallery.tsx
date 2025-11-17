"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  thumbnail?: string | null;
  images?: string[] | null;
  alt?: string;
}

export default function ImageGallery({
  thumbnail,
  images,
  alt,
}: ImageGalleryProps) {
  // imagesFromList = images array without the thumbnail (deduped)
  const imagesFromList = useMemo(() => {
    const arr = (images ?? []).filter(Boolean);
    if (thumbnail) {
      return arr.filter((u) => u !== thumbnail);
    }
    // dedupe
    return Array.from(new Set(arr));
  }, [thumbnail, images]);

  // mainImage: start with thumbnail if present, otherwise first image from images, otherwise placeholder
  const initialMain = thumbnail ?? imagesFromList[0] ?? "/placeholder.svg";
  const [mainImage, setMainImage] = useState(initialMain);

  // If thumbnail changes while mounted, ensure mainImage follows (keeps user-selected if they clicked)
  // optional: sync when thumbnail changes and mainImage was previously the old thumbnail
  // (kept simple here)

  return (
    <div className="max-w-[95vw] mx-auto">
      {/* Main image (thumbnail by default) */}
      <div
        className="relative w-full rounded-xl overflow-hidden mb-4 shadow-lg"
        // taller main image for fullscreen-like appearance
        style={{ paddingBottom: "50%" }}
      >
        <Image
          src={mainImage}
          alt={alt ?? "image"}
          fill
          className="object-cover"
        />
      </div>

      {/* Grid of imageUrls (exclude thumbnail) */}
      <div className="grid grid-cols-3 gap-4">
        {imagesFromList.length === 0 ? (
          // show thumbnail as single small preview if no other images
          thumbnail ? (
            <button
              onClick={() => setMainImage(thumbnail)}
              aria-label="Thumbnail"
              className={`relative w-full rounded-lg overflow-hidden transition-all ring-1 ring-border`}
              style={{ aspectRatio: "1 / 1" }}
            >
              <Image
                src={thumbnail}
                alt={alt ?? "thumb"}
                fill
                className="object-cover"
              />
            </button>
          ) : (
            <div className="col-span-3 text-center text-sm text-muted-foreground">
              Không có ảnh
            </div>
          )
        ) : (
          imagesFromList.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setMainImage(src)}
              aria-label={`Hiển thị ảnh ${i + 1}`}
              className={`relative w-full rounded-lg overflow-hidden transition-all focus:outline-none ${
                mainImage === src
                  ? "ring-2 ring-primary"
                  : "ring-1 ring-transparent hover:ring-border"
              }`}
              style={{ aspectRatio: "1 / 1" }}
            >
              <Image
                src={src}
                alt={`${alt ?? "img"} ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
