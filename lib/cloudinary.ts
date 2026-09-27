import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs/promises";
import path from "path";

// Initialize Cloudinary
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

/**
 * Uploads an image Buffer (from Cloudflare AI) to Cloudinary
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  folder: string = "interior-ai/generated"
): Promise<CloudinaryUploadResult> {
  // If CLOUDINARY_URL or cloud name is available, perform live upload
  if (process.env.CLOUDINARY_URL) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          format: "png",
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            console.error("[Cloudinary Error]", error);
            return reject(error || new Error("Cloudinary upload failed"));
          }
          resolve({
            url: result.secure_url || result.url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Fallback for local development if CLOUDINARY_URL is omitted:
  // Write to public/uploads directory so images are served directly by Next.js!
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "generated");
  await fs.mkdir(uploadsDir, { recursive: true });
  const filename = `gen-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.png`;
  const filePath = path.join(uploadsDir, filename);
  await fs.writeFile(filePath, buffer);

  return {
    url: `/uploads/generated/${filename}`,
    publicId: `local_${filename}`,
  };
}

/**
 * Uploads a raw file (SketchUp .skp or AutoCAD .dwg / pdf / etc.) to Cloudinary
 */
export async function uploadRawFile(
  buffer: Buffer,
  originalFilename: string,
  folder: string = "interior-ai/layouts"
): Promise<CloudinaryUploadResult> {
  const sanitizedName = originalFilename.replace(/[^a-zA-Z0-9.-]/g, "_");

  if (process.env.CLOUDINARY_URL) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "raw",
          public_id: `${Date.now()}-${sanitizedName}`,
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            console.error("[Cloudinary Raw Upload Error]", error);
            return reject(error || new Error("Cloudinary raw upload failed"));
          }
          resolve({
            url: result.secure_url || result.url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Local fallback storage for layout files
  const layoutsDir = path.join(process.cwd(), "public", "uploads", "layouts");
  await fs.mkdir(layoutsDir, { recursive: true });
  const filename = `${Date.now()}_${sanitizedName}`;
  const filePath = path.join(layoutsDir, filename);
  await fs.writeFile(filePath, buffer);

  return {
    url: `/uploads/layouts/${filename}`,
    publicId: `local_${filename}`,
  };
}

export default cloudinary;
