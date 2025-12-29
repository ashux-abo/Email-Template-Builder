export type BlockType =
  | "header"
  | "text"
  | "image"
  | "button"
  | "spacer"
  | "divider"
  | "grid-1-column"
  | "grid-2-column"
  | "grid-3-column"
  | "quote"
  | "list"
  | "social"
  | "video"
  | "card"
  | "section";

// Flexible type for block content
export interface BlockContent {
  [key: string]: any;
  text?: string;
  url?: string;
  src?: string;
  alt?: string;
  height?: string;
  columns?: TemplateBlock[][]; // For grid layouts, array of columns where each column is an array of blocks
  items?: string[]; // For list items
  socialLinks?: { platform: string; url: string; icon: string }[]; // For social media links
  videoUrl?: string; // For video embed
  quoteAuthor?: string; // For quote attribution
  title?: string; // For card and section titles
  description?: string; // For card descriptions
  backgroundColor?: string; // For card and section background color
  borderColor?: string; // For card border color
  padding?: string; // For card and section padding
}

// Interface for a template block
export interface TemplateBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  styles: Record<string, string>;
}

// Interface for the complete template
export interface VisualTemplate {
  name: string;
  description: string;
  subject: string;
  blocks: TemplateBlock[];
  variables: string[];
  isPublic: boolean;
  html?: string;
}

export interface VisualTemplateBuilderProps {
  templateId?: string;
  onSave?: (template: any) => void;
}
