"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Loader2, ImageIcon, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";

interface EmailImageUploaderProps {
  onImageSelected: (imageUrl: string) => void;
  initialImage?: string;
  folder?: string;
  className?: string;
}

const EmailImageUploader: React.FC<EmailImageUploaderProps> = ({
  onImageSelected,
  initialImage = "",
  folder = "email-images",
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update image URL when initialImage prop changes
  useEffect(() => {
    setImageUrl(initialImage);
  }, [initialImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Only JPEG, PNG, GIF and WebP images are allowed");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Failed to upload image";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Unable to parse error message, use default
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.imageUrl) {
        throw new Error("No image URL returned from server");
      }

      setImageUrl(data.imageUrl);
      onImageSelected(data.imageUrl);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setError(error.message || "Error uploading image");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearImage = async () => {
    try {
      // Only attempt to delete if we have an image URL and it's from our own API
      if (imageUrl && imageUrl.startsWith("/api/images/")) {
        // Extract the image ID from the URL
        const imageId = imageUrl.split("/").pop();

        if (imageId) {
          // Send DELETE request to remove the image from the database
          const response = await fetch(`/api/images/${imageId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            console.error(
              "Failed to delete image from database:",
              await response.text(),
            );
          }
        }
      }

      // Clear the image URL locally regardless of server response
      setImageUrl("");
      onImageSelected("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error removing image:", error);
      // Still clear the image locally even if deletion fails
      setImageUrl("");
      onImageSelected("");
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {imageUrl ? (
        <div className="relative">
          <div className="relative rounded-md overflow-hidden border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Uploaded image"
              className="w-full h-auto max-h-[300px] object-contain"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white rounded-full text-gray-700 hover:text-red-500 transition-colors"
              title="Remove image"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Display image URL but remove the placeholder URL if present */}
          {!imageUrl.includes("placeholder.com") && (
            <p className="text-xs text-gray-500 mt-1 break-all">{imageUrl}</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={triggerFileUpload}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center justify-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-1">
                Drag and drop an image, or click to select
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG, GIF, WebP up to 5MB
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="w-full flex items-center justify-center"
            onClick={triggerFileUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Select Image
              </>
            )}
          </Button>
        </div>
      )}

      {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default EmailImageUploader;
