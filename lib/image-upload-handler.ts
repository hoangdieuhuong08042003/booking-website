"use server";

import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedFileTypes = ["image/jpg", "image/jpeg", "image/png"];

type SignedURLResponse = Promise<
  { failure?: undefined; url: string } | { failure: string; url?: undefined }
>;

const generateImageFileName = (
  fileName: string) => {
  const now = new Date();
  const timestamp = now.getTime();

  // public_id cho Cloudinary (không cần extension)
  return `${fileName.split(".")[0]}_${timestamp}`;
};


async function uploadFileToS3(file: File): Promise<SignedURLResponse> {
  // Validate
  if (!allowedFileTypes.includes(file.type)) {
    return { failure: "ファイルタイプは許可されていません" };
  }

  // 10MB
  if (file.size > 1048576 * 10) {
    return { failure: "ファイルサイズが大きすぎます" };
  }

  const publicId = generateImageFileName(file.name);

  // chuyển file sang base64 data URI
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      public_id: publicId,
      resource_type: "image",
      overwrite: true,
    });
    // trả về secure_url đầy đủ
    return { url: result.secure_url };
  } catch (err: unknown) {
    const getErrorMessage = (e: unknown) =>
      e instanceof Error ? e.message : String(e ?? "Upload failed");
    return { failure: getErrorMessage(err) };
  }
}

async function deleteFileFromS3(fileUrl: string): Promise<boolean> {
  // Extract public_id from Cloudinary URL
  const extractPublicIdFromUrl = (url: string) => {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    let rest = parts[1];
    // remove version prefix v12345/ nếu có
    rest = rest.replace(/^v\d+\//, "");
    // remove extension
    const lastDot = rest.lastIndexOf(".");
    if (lastDot !== -1) rest = rest.substring(0, lastDot);
    return rest;
  };

  const publicId = extractPublicIdFromUrl(fileUrl);
  if (!publicId) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    // result.result === "ok" khi xóa thành công
    return result.result === "ok";
  } catch {
    return false;
  }
}

// Frontend utility functions
export async function uploadImageToAWS(file: File): Promise<string> {
  // Tên hàm giữ nguyên cho tương thích, nhưng thực hiện upload lên Cloudinary
  const fileUrl = await uploadFileToS3(file);
  if (fileUrl.failure || !fileUrl.url) {
    throw new Error(fileUrl.failure);
  }
  return fileUrl.url;
}

export async function deleteImageFromAWS(imageUrl: string): Promise<void> {
  const success = await deleteFileFromS3(imageUrl);
  if (!success) {
    throw new Error("Failed to delete image");
  }
}

export { uploadFileToS3, deleteFileFromS3 };
