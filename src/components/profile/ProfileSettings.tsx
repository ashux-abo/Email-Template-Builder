"use client";

import React, { useState, useEffect, useRef } from "react";
import { UserCircle, Mail, Upload, Loader2, X } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";

interface UserProfile {
  name: string;
  email: string;
  jobTitle: string;
  company: string;
  location: string;
  phone: string;
  bio: string;
  profilePicture: string;
}

interface ProfilePictureUploaderProps {
  onImageSelected: (imageUrl: string) => void;
  initialImage?: string;
}

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  onImageSelected,
  initialImage = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [error, setError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update image URL when initialImage prop changes
  useEffect(() => {
    setImageUrl(initialImage);
    if (initialImage) {
      setIsImageLoading(true);
    }
  }, [initialImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
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
      formData.append("profilePicture", file);

      const response = await fetch("/api/user/profile-picture", {
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

      if (!data.profilePicture) {
        throw new Error("No image URL returned from server");
      }

      setIsImageLoading(true);
      setImageUrl(data.profilePicture);
      onImageSelected(data.profilePicture);
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
      setIsUploading(true);
      setError(null);

      // Delete the image from the database
      const response = await fetch("/api/user/profile-picture", {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = "Failed to remove image";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Unable to parse error message, use default
        }
        throw new Error(errorMessage);
      }

      // Clear the image URL locally
      setImageUrl("");
      onImageSelected("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Error removing image:", error);
      setError(error.message || "Error removing image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
      />

      <div className="flex flex-col items-center space-y-4">
        {imageUrl && (
          <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto border-2 border-primary mb-2">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setIsImageLoading(false);
                setError("Failed to load image");
              }}
            />
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={triggerFileUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Photo
            </>
          )}
        </Button>

        {imageUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={clearImage}
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
          <div className="flex">
            <X className="h-4 w-4 mr-2 mt-0.5" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileSettings: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    jobTitle: "",
    company: "",
    location: "",
    phone: "",
    bio: "",
    profilePicture: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/profile");

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: error.message || "Error loading profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const data = await response.json();

      // Update local state with the returned data
      if (data.profile) {
        setProfile(data.profile);
      }

      toast({
        title: "Success",
        description: "Profile saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: error.message || "Error saving profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Only JPEG, PNG, GIF and WebP images are allowed",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await fetch("/api/user/profile-picture", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload profile picture");
      }

      const data = await response.json();

      setProfile((prev) => ({
        ...prev,
        profilePicture: data.profilePicture,
      }));

      toast({
        title: "Success",
        description: "Profile picture uploaded successfully",
      });
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      toast({
        title: "Error",
        description: error.message || "Error uploading profile picture",
        variant: "destructive",
      });
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

  if (isLoading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-opacity-50 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary/10 shadow-md mb-4">
                {profile.profilePicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profilePicture}
                    alt={profile.name || "Profile Picture"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-full h-full text-gray-300" />
                )}
              </div>
              <h3 className="text-xl font-semibold">
                {profile.name || "Your Name"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {profile.jobTitle || "Your Title"}
              </p>
              <p className="text-muted-foreground text-sm">{profile.email}</p>
            </div>

            <div className="w-full md:w-2/3 flex flex-col justify-center">
              <div className="flex flex-col space-y-1 mb-4">
                <h3 className="text-lg font-medium">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a new profile picture
                </p>
              </div>

              <ProfilePictureUploader
                onImageSelected={(imageUrl) => {
                  setProfile((prev) => ({
                    ...prev,
                    profilePicture: imageUrl,
                  }));

                  toast({
                    title: "Success",
                    description: "Profile picture updated successfully",
                  });

                  setTimeout(() => {
                    fetchUserProfile();

                    fetch("/api/auth/me", {
                      headers: {
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                      },
                    }).then(() => {
                      const updateEvent = new CustomEvent(
                        "user-profile-updated",
                        {
                          detail: { profilePicture: imageUrl },
                        },
                      );
                      window.dispatchEvent(updateEvent);
                    });
                  }, 500);
                }}
                initialImage={profile.profilePicture || ""}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-medium mb-2">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                placeholder="Your email address"
                required
                readOnly
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Contact admin to change your email address
              </p>
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={profile.jobTitle}
                onChange={handleInputChange}
                placeholder="Your job title"
              />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={profile.company}
                onChange={handleInputChange}
                placeholder="Your company name"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                placeholder="Your location"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                placeholder="Your phone number"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
              placeholder="Tell us a little about yourself"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="flex items-center"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <></>}
          Save Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
