export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "画像は JPEG、PNG、WebP、または GIF 形式である必要があります。";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "画像サイズは 10MB 以下である必要があります。";
  }
  return null;
}
