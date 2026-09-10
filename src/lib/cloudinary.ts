import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/** Uploads a base64 data URI (or remote URL) to Cloudinary and returns the secure URL. */
export async function uploadImage(dataUriOrUrl: string, folder = "olive-essence/products") {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }
  const result = await cloudinary.uploader.upload(dataUriOrUrl, {
    folder,
    resource_type: "image",
    // Automatic format/quality keeps images optimized for web delivery.
    fetch_format: "auto",
    quality: "auto",
  });
  return result.secure_url;
}

export { cloudinary };
