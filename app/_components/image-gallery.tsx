"use client";


import { useMemo, useState } from "react";
import Image from "next/image";
import { getProxiedUrl } from "@/lib/utils";

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
    // dedupe
    return Array.from(new Set(arr));
  }, [images]);

  // mainImage: always the first image in imagesFromList, otherwise placeholder
  const initialMain = imagesFromList[0] ?? "/placeholder.svg";
  const [mainImage, setMainImage] = useState(initialMain);

  return (
    // Main container: flex on md+, stack on mobile
    <div className="max-w-[98vw] mx-auto flex flex-col md:flex-row gap-4">
      {/* Main image (first image in images) */}
      <div
        className="relative w-full md:w-[700px] lg:w-[900px] rounded-xl overflow-hidden mb-2 md:mb-0 shadow-lg"
        style={{ aspectRatio: "4 / 3" }}
      >
        <Image
          src={getProxiedUrl(mainImage)}
          alt={alt ?? "image"}
          fill
          className="object-cover"
        />
      </div>

      {/* Thumbnails: vertical column on desktop, grid on mobile */}
      <div className="flex md:flex-col gap-4 md:gap-7 w-full md:w-[220px]">
        {imagesFromList.length === 0 ? (
          thumbnail ? (
            <button
              onClick={() => setMainImage(thumbnail)}
              aria-label="Thumbnail"
              className={`relative w-[140px] h-[140px] md:w-full md:h-[170px] rounded-lg overflow-hidden transition-all ring-1 ring-border`}
              style={{ aspectRatio: "1 / 1" }}
            >
              <Image
                src={getProxiedUrl(thumbnail)}
                alt={alt ?? "thumb"}
                fill
                className="object-cover"
              />
            </button>
          ) : (
            <div className="text-center text-sm text-muted-foreground w-full">
              Không có ảnh
            </div>
          )
        ) : (
          imagesFromList.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setMainImage(src)}
              aria-label={`Hiển thị ảnh ${i + 1}`}
              className={`relative w-[120px] h-[120px] md:w-full md:h-[170px] rounded-lg overflow-hidden transition-all focus:outline-none ${
                mainImage === src
                  ? "ring-2 ring-primary"
                  : "ring-1 ring-transparent hover:ring-border"
              }`}
              style={{ aspectRatio: "1 / 1" }}
            >
              <Image
                src={getProxiedUrl(src)}
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
