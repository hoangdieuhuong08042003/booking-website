import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProxiedUrl(url: string | null | undefined) {
  if (!url) return "";
  if (url.startsWith("http")) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
}
