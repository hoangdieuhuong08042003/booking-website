"use server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    // Support both conventional and legacy env var names
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_ACCESS_SECRET || "",
  },
});

type SignedURLResponse = Promise<
  | { failure?: undefined; url: string; key: string }
  | { failure: string; url?: undefined; key?: undefined }
>;

const generateFileName = (fileName: string) => {
  const now = new Date();
  const timestamp = now.getTime();

  // Get the actual file extension from the original filename
  const fileExtension = fileName.split(".").pop()?.toLowerCase();

  return `${uuidv4()}_${timestamp}.${fileExtension}`;
};

const computeSHA256Base64 = async (file: File) => {
  const fileBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
  const hashBytes = new Uint8Array(hashBuffer);
  // Convert to base64 for S3 ChecksumSHA256 field
  let binary = "";
  for (let i = 0; i < hashBytes.byteLength; i++)
    binary += String.fromCharCode(hashBytes[i]);
  return Buffer.from(binary, "binary").toString("base64");
};

async function uploadFileToS3(
  file: File,
  folder?: string
): Promise<SignedURLResponse> {
  try {
    const bucket = process.env.AWS_BUCKET!;
    const region = process.env.AWS_REGION!;
    if (!bucket || !region) {
      return { failure: "Missing AWS_BUCKET or AWS_REGION" } as const;
    }

    const fileName = generateFileName(file.name);
    const key = folder ? `${folder}/${fileName}` : fileName;

    const bodyBuffer = Buffer.from(await file.arrayBuffer());
    const checksumBase64 = await computeSHA256Base64(file);

    const put = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: bodyBuffer,
      ContentType: file.type,
      ContentLength: file.size,
      ChecksumSHA256: checksumBase64,
    });

    const result = await s3Client.send(put);
    const ok = (result.$metadata.httpStatusCode || 0) < 300;
    if (!ok) {
      return {
        failure: `S3 upload failed: ${result.$metadata.httpStatusCode}`,
      } as const;
    }

    // Generate a signed GET URL (bucket likely blocks ACLs/public access)
    const get = new GetObjectCommand({ Bucket: bucket, Key: key });
    const signedGetUrl = await getSignedUrl(s3Client, get, { expiresIn: 600 });
    return { url: signedGetUrl, key } as const;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown S3 error";
    console.error("S3 upload error:", error);
    return { failure: message } as const;
  }
}

async function deleteFileFromS3(fileName: string): Promise<boolean> {
  // Use proper URL parsing instead of string replacement to prevent exploitation
  let s3Key: string;

  try {
    if (fileName.startsWith("https://")) {
      const url = new URL(fileName);
      // Extract the pathname and remove the leading slash
      s3Key = url.pathname.substring(1);

      // Validate that this is actually an S3 URL from our bucket
      const expectedHostname = `${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`;
      if (url.hostname !== expectedHostname) {
        console.error(
          `Invalid S3 hostname: ${url.hostname}, expected: ${expectedHostname}`
        );
        return false;
      }
    } else return false;
  } catch (error) {
    console.error(`Failed to parse S3 URL: ${fileName}`, error);
    return false;
  }

  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: s3Key,
  });

  const result = await s3Client.send(command);
  return result.$metadata.httpStatusCode === 204;
}

async function deleteFilesFromS3(fileNames: string[]): Promise<boolean[]> {
  const results = await Promise.all(
    fileNames.map((fileName) => deleteFileFromS3(fileName))
  );
  return results;
}

/**
 * Extract S3 key from a signed URL or S3 URL
 * Returns the key if it's a valid S3 URL, otherwise returns null
 */
function extractS3KeyFromUrl(url: string): string | null {
  try {
    if (!url.startsWith("https://")) {
      return null;
    }
    const urlObj = new URL(url);
    const expectedHostname = `${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`;

    // Check if it's from our S3 bucket
    if (urlObj.hostname !== expectedHostname) {
      return null;
    }

    // Extract key from pathname (remove leading slash)
    const key = urlObj.pathname.substring(1);
    return key || null;
  } catch {
    return null;
  }
}

/**
 * Generate a new signed URL from S3 key
 * This is useful when the stored signed URL has expired
 */
async function getSignedUrlFromS3Key(
  key: string,
  expiresIn: number = 3600
): Promise<string | null> {
  try {
    const bucket = process.env.AWS_BUCKET!;
    if (!bucket) {
      return null;
    }

    const get = new GetObjectCommand({ Bucket: bucket, Key: key });
    const signedUrl = await getSignedUrl(s3Client, get, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL from key:", error);
    return null;
  }
}

/**
 * Get a valid signed URL from either a stored signed URL or S3 key
 * If the input is already a signed URL, it will be returned as-is
 * If the input is an S3 key or expired signed URL, a new signed URL will be generated
 */
async function getValidSignedUrl(
  urlOrKey: string,
  expiresIn: number = 3600
): Promise<string | null> {
  // If it's already a valid signed URL (has query params), return as-is
  // But we'll still regenerate to ensure it's fresh
  const key = extractS3KeyFromUrl(urlOrKey);
  if (key) {
    return await getSignedUrlFromS3Key(key, expiresIn);
  }

  // If it doesn't look like a URL, treat it as a key
  if (!urlOrKey.startsWith("http")) {
    return await getSignedUrlFromS3Key(urlOrKey, expiresIn);
  }

  // If we can't extract a key, return the original (might be a blob URL or other)
  return urlOrKey;
}

export {
  uploadFileToS3,
  deleteFileFromS3,
  deleteFilesFromS3,
  extractS3KeyFromUrl,
  getSignedUrlFromS3Key,
  getValidSignedUrl,
};
