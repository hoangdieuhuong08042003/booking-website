declare module "cloudinary" {
  interface UploadResult extends Record<string, unknown> {
    secure_url: string;
  }

  interface DestroyResult extends Record<string, unknown> {
    result: string;
  }

  interface Uploader {
    upload(file: string, options?: Record<string, unknown>): Promise<UploadResult>;
    destroy(publicId: string, options?: Record<string, unknown>): Promise<DestroyResult>;
    // other uploader methods can be added as needed
  }

  interface CloudinaryV2 {
    uploader: Uploader;
    config(options?: { cloud_name?: string; api_key?: string; api_secret?: string }): void;
    // other cloudinary v2 members can be added as needed
  }

  export const v2: CloudinaryV2;
  export default v2;
}
