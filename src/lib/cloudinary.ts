import { v2 as cloudinary } from "cloudinary";

// Validate Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn(
    "⚠️ Cloudinary configuration is missing. Image uploads will fail. " +
      "Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables.",
  );
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME || "",
  api_key: CLOUDINARY_API_KEY || "",
  api_secret: CLOUDINARY_API_SECRET || "",
  secure: true,
});

/**
 * Upload a file to Cloudinary
 * @param file - The file buffer to upload
 * @param folderName - The folder to upload to (e.g., 'profile-pictures', 'email-images')
 * @returns The Cloudinary response with image URL details
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folderName = "uploads",
) {
  const base64 = `data:image/jpeg;base64,${buffer.toString("base64")}`;

  return await cloudinary.uploader.upload(base64, {
    folder: folderName,
    resource_type: "image",
  });
}

/**
 * Upload an image from a URL to Cloudinary
 * @param imageUrl - The URL of the image to upload
 * @param folderName - The folder to upload to
 */
export async function uploadImageFromUrl(
  imageUrl: string,
  folderName: string = "uploads",
) {
  try {
    return await cloudinary.uploader.upload(imageUrl, {
      folder: folderName,
    });
  } catch (error) {
    console.error("Error uploading image from URL:", error);
    throw error;
  }
}

export default cloudinary;
