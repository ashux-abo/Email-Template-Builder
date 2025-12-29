"use client";

import React from "react";
import { BlockContent, TemplateBlock } from "../types";
import { Button } from "../../../../components/ui/button";
import { Plus, Trash } from "lucide-react";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPinterest,
  FaTiktok,
  FaSnapchat,
  FaGithub,
  FaGlobe,
  FaDiscord,
  FaReddit,
  FaTwitch,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface SocialContentEditorProps {
  block: TemplateBlock;
  onUpdateContent: (id: string, content: Partial<BlockContent>) => void;
}

export function SocialContentEditor({
  block,
  onUpdateContent,
}: SocialContentEditorProps) {
  const socialLinks: SocialLink[] = block.content.socialLinks || [];

  // Define platform options with labels and icons
  const platformOptions = [
    {
      value: "facebook",
      label: "Facebook",
      icon: <FaFacebook className="h-5 w-5 text-[#1877F2]" />,
    },
    {
      value: "twitter",
      label: "Twitter",
      icon: <FaTwitter className="h-5 w-5 text-[#1DA1F2]" />,
    },
    {
      value: "instagram",
      label: "Instagram",
      icon: <FaInstagram className="h-5 w-5 text-[#E1306C]" />,
    },
    {
      value: "linkedin",
      label: "LinkedIn",
      icon: <FaLinkedin className="h-5 w-5 text-[#0077B5]" />,
    },
    {
      value: "youtube",
      label: "YouTube",
      icon: <FaYoutube className="h-5 w-5 text-[#FF0000]" />,
    },
    {
      value: "pinterest",
      label: "Pinterest",
      icon: <FaPinterest className="h-5 w-5 text-[#BD081C]" />,
    },
    {
      value: "tiktok",
      label: "TikTok",
      icon: <FaTiktok className="h-5 w-5 text-black" />,
    },
    {
      value: "snapchat",
      label: "Snapchat",
      icon: <FaSnapchat className="h-5 w-5 text-[#FFFC00]" />,
    },
    {
      value: "github",
      label: "GitHub",
      icon: <FaGithub className="h-5 w-5 text-[#333333]" />,
    },
    {
      value: "discord",
      label: "Discord",
      icon: <FaDiscord className="h-5 w-5 text-[#5865F2]" />,
    },
    {
      value: "reddit",
      label: "Reddit",
      icon: <FaReddit className="h-5 w-5 text-[#FF4500]" />,
    },
    {
      value: "twitch",
      label: "Twitch",
      icon: <FaTwitch className="h-5 w-5 text-[#9146FF]" />,
    },
    {
      value: "whatsapp",
      label: "WhatsApp",
      icon: <FaWhatsapp className="h-5 w-5 text-[#25D366]" />,
    },
    {
      value: "telegram",
      label: "Telegram",
      icon: <FaTelegram className="h-5 w-5 text-[#0088CC]" />,
    },
    {
      value: "website",
      label: "Website",
      icon: <FaGlobe className="h-5 w-5 text-[#4285F4]" />,
    },
  ];

  // Map platform names to icon names for HTML generation
  const getPlatformIcon = (platform: string): string => {
    return platform || "globe";
  };

  const handleAddLink = () => {
    const newLinks = [
      ...socialLinks,
      { platform: "website", url: "", icon: "globe" },
    ];
    onUpdateContent(block.id, { socialLinks: newLinks });
  };

  const handleUpdateLink = (index: number, field: string, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = {
      ...newLinks[index],
      [field]: value,
      // Update icon when platform changes
      ...(field === "platform" ? { icon: getPlatformIcon(value) } : {}),
    };
    onUpdateContent(block.id, { socialLinks: newLinks });
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = socialLinks.filter((_: any, i: number) => i !== index);
    onUpdateContent(block.id, { socialLinks: newLinks });
  };

  // Get icon component for preview
  const getPlatformIconComponent = (platform: string) => {
    const option = platformOptions.find((opt) => opt.value === platform);
    return option ? (
      option.icon
    ) : (
      <FaGlobe className="h-5 w-5 text-[#4285F4]" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Social Links</Label>

        {/* Preview how the icons will look */}
        <div className="bg-gray-50 rounded-md p-3 flex flex-wrap gap-3 justify-center border border-gray-200 mb-4">
          {socialLinks.length === 0 ? (
            <p className="text-sm text-gray-500">
              Add social links to see a preview
            </p>
          ) : (
            socialLinks.map((link, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  {getPlatformIconComponent(link.platform)}
                </div>
                <span className="text-xs mt-1">{link.platform}</span>
              </div>
            ))
          )}
        </div>

        {socialLinks.map((link: SocialLink, index: number) => (
          <div
            key={index}
            className="grid grid-cols-[auto_1fr_2fr_auto] gap-2 items-center mt-2 bg-white p-2 rounded-md border border-gray-100"
          >
            <div className="flex-shrink-0">
              {getPlatformIconComponent(link.platform)}
            </div>

            <select
              value={link.platform}
              onChange={(e) =>
                handleUpdateLink(index, "platform", e.target.value)
              }
              className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {platformOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <Input
              value={link.url}
              onChange={(e) => handleUpdateLink(index, "url", e.target.value)}
              placeholder="https://example.com"
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveLink(index)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={handleAddLink}
          className="mt-4 flex items-center gap-1 w-full justify-center"
        >
          <Plus className="h-4 w-4" /> Add Social Link
        </Button>
      </div>
    </div>
  );
}
