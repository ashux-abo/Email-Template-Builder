import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
});

/**
 * Upload a file to Cloudinary
 * @param file - The file buffer to upload
 * @param folderName - The folder to upload to (e.g., 'profile-pictures', 'email-images')
 * @returns The Cloudinary response with image URL details
 */
export async function uploadToCloudinary(
  file: Buffer,
  folderName: string = "uploads",
) {
  try {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: folderName,
        resource_type: "auto" as "auto",
      };

      // Upload stream to Cloudinary
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Failed to upload to Cloudinary"));
          }
          resolve(result);
        })
        .end(file);
    });
  } catch (error) {
    console.error("Error in cloudinary upload:", error);
    throw error;
  }
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
