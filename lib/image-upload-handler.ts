"use server";

import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Chấp nhận tất cả các file là ảnh
const allowedFileTypes = /^image\//;

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


async function uploadFileToCloudinary(file: File): Promise<SignedURLResponse> {

  // Kiểm tra định dạng file: chấp nhận mọi file có type bắt đầu bằng 'image/'
  if (!allowedFileTypes.test(file.type)) {
    return { failure: "Định dạng file không được hỗ trợ" };
  }

  // Giới hạn 10MB
  if (file.size > 1048576 * 10) {
    return { failure: "Kích thước file quá lớn (tối đa 10MB)" };
  }

  const publicId = generateImageFileName(file.name);

  // Chuyển file sang base64 data URI
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
    // Trả về secure_url đầy đủ
    return { url: result.secure_url };
  } catch (err: unknown) {
    const getErrorMessage = (e: unknown) =>
      e instanceof Error ? e.message : String(e ?? "Tải lên thất bại");
    return { failure: getErrorMessage(err) };
  }
}

async function deleteFileFromCloudinary(fileUrl: string): Promise<boolean> {
  // Lấy public_id từ URL Cloudinary
  const extractPublicIdFromUrl = (url: string) => {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    let rest = parts[1];
    // Xóa tiền tố version v12345/ nếu có
    rest = rest.replace(/^v\d+\//, "");
    // Xóa extension
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

// Hàm tiện ích cho frontend
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const fileUrl = await uploadFileToCloudinary(file);
  if (fileUrl.failure || !fileUrl.url) {
    throw new Error(fileUrl.failure);
  }
  return fileUrl.url;
}

export async function deleteImageFromCloudinary(imageUrl: string): Promise<void> {
  const success = await deleteFileFromCloudinary(imageUrl);
  if (!success) {
    throw new Error("Xóa ảnh thất bại");
  }
}

