import { BlockContent, BlockType, TemplateBlock } from "./types";

// Default blocks for new templates
export const defaultBlocks: TemplateBlock[] = [
  {
    id: "header-1",
    type: "header",
    content: {
      text: "Hello, {{name}}!",
    } as BlockContent,
    styles: {
      backgroundColor: "#4a6cf7",
      color: "white",
      padding: "20px",
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "bold",
    },
  },
  {
    id: "text-1",
    type: "text",
    content: {
      text: "This is a sample email template. You can edit it to suit your needs.\n\nFeel free to add your content here.",
    } as BlockContent,
    styles: {
      padding: "20px",
      color: "#333333",
      fontSize: "16px",
      lineHeight: "1.5",
    },
  },
  {
    id: "button-1",
    type: "button",
    content: {
      text: "Click Here",
      url: "{{actionLink}}",
    } as BlockContent,
    styles: {
      backgroundColor: "#4a6cf7",
      color: "white",
      padding: "10px 20px",
      textDecoration: "none",
      borderRadius: "4px",
      display: "inline-block",
      margin: "20px 0",
      fontSize: "16px",
      textAlign: "center",
    },
  },
  {
    id: "text-2",
    type: "text",
    content: {
      text: "Best regards,\n{{senderName}}",
    } as BlockContent,
    styles: {
      padding: "20px",
      borderTop: "1px solid #eeeeee",
      marginTop: "20px",
      color: "#333333",
      fontSize: "16px",
      lineHeight: "1.5",
    },
  },
];

// Helper to convert style objects to inline CSS string
const styleObjectToString = (styles: Record<string, string>): string => {
  return Object.entries(styles)
    .map(
      ([key, value]) =>
        `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}`,
    )
    .join("; ");
};

// Get default content based on block type
export const getDefaultContentForType = (type: BlockType): BlockContent => {
  switch (type) {
    case "header":
      return { text: "New Header" };
    case "text":
      return { text: "New text block" };
    case "button":
      return { text: "Button", url: "#" };
    case "image":
      return { src: "https://via.placeholder.com/600x200", alt: "Image" };
    case "spacer":
      return { height: "20px" };
    case "divider":
      return {};
    case "grid-1-column":
      return { columns: [[]] }; // Single column
    case "grid-2-column":
      return { columns: [[], []] }; // Two columns
    case "grid-3-column":
      return { columns: [[], [], []] }; // Three columns
    case "quote":
      return { text: "This is a quote", quoteAuthor: "Author Name" };
    case "list":
      return { items: ["Item 1", "Item 2", "Item 3"] };
    case "social":
      return {
        socialLinks: [
          {
            platform: "facebook",
            url: "https://facebook.com",
            icon: "facebook",
          },
          { platform: "twitter", url: "https://twitter.com", icon: "twitter" },
          {
            platform: "instagram",
            url: "https://instagram.com",
            icon: "instagram",
          },
        ],
      };
    case "video":
      return { videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" };
    case "card":
      return {
        title: "Card Title",
        description: "Card description goes here",
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        padding: "16px",
      };
    case "section":
      return {
        title: "Section Title",
        backgroundColor: "#f9fafb",
        padding: "24px",
      };
    default:
      return { text: "" };
  }
};

// Get default styles based on block type
export const getDefaultStylesForType = (
  type: BlockType,
): Record<string, string> => {
  switch (type) {
    case "header":
      return {
        backgroundColor: "#4a6cf7",
        color: "white",
        padding: "20px",
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
      };
    case "text":
      return {
        padding: "20px",
        color: "#333333",
        fontSize: "16px",
        lineHeight: "1.5",
        fontFamily: "Arial, sans-serif",
      };
    case "button":
      return {
        backgroundColor: "#4a6cf7",
        color: "white",
        padding: "10px 20px",
        textDecoration: "none",
        borderRadius: "4px",
        display: "inline-block",
        fontSize: "16px",
        margin: "20px 0",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        fontWeight: "bold",
      };
    case "image":
      return {
        maxWidth: "100%",
        height: "auto",
      };
    case "grid-1-column":
    case "grid-2-column":
    case "grid-3-column":
      return {
        width: "100%",
        borderCollapse: "collapse",
        margin: "0 auto",
      };
    case "quote":
      return {
        padding: "20px",
        margin: "20px 0",
        borderLeft: "4px solid #4a6cf7",
        fontStyle: "italic",
        color: "#555555",
        fontFamily: "Georgia, serif",
        fontSize: "18px",
      };
    case "list":
      return {
        padding: "10px 20px",
        margin: "10px 0",
        color: "#333333",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        lineHeight: "1.6",
      };
    case "social":
      return {
        padding: "20px",
        textAlign: "center",
        margin: "20px 0",
      };
    case "video":
      return {
        width: "100%",
        maxWidth: "600px",
        height: "338px", // 16:9 ratio
        margin: "20px auto",
        border: "none",
      };
    case "card":
      return {
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        lineHeight: "1.5",
        color: "#374151",
        maxWidth: "100%",
        display: "block",
      };
    case "section":
      return {
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        lineHeight: "1.5",
        color: "#374151",
        textAlign: "center",
        maxWidth: "100%",
        display: "block",
      };
    default:
      return {};
  }
};

// Extract variables from template blocks
export const extractVariables = (blocks: TemplateBlock[]): string[] => {
  const variables = new Set<string>();

  // Always include senderName
  variables.add("senderName");

  const variableRegex = /{{([^}]+)}}/g;

  blocks.forEach((block) => {
    // Ensure block.content is converted to a string safely
    const blockContent = JSON.stringify(block.content || {});
    const matches = blockContent.match(variableRegex) || [];

    matches.forEach((match) => {
      const variable = match.replace(/{{|}}/g, "");
      if (variable) {
        variables.add(variable);
      }
    });
  });

  return Array.from(variables);
};

// Generate HTML for template
export const generateHtml = (blocks: TemplateBlock[]): string => {
  // Start HTML template
  let html = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Template</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; color: #333333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">`;

  // Process each block
  blocks.forEach((block) => {
    switch (block.type) {
      case "header":
        html += `<div style="${styleObjectToString(block.styles)}">
          <h1>${block.content.text || ""}</h1>
        </div>`;
        break;

      case "text":
        html += `<div style="${styleObjectToString(block.styles)}">
          ${(block.content.text || "").replace(/\n/g, "<br>")}
        </div>`;
        break;

      case "button":
        html += `<div style="text-align: center; padding: 10px;">
          <a href="${block.content.url || "#"}" style="${styleObjectToString(block.styles)}">
            ${block.content.text || ""}
          </a>
        </div>`;
        break;

      case "image":
        html += `<div style="text-align: center; padding: 10px;">
          <img src="${block.content.src || ""}" alt="${block.content.alt || ""}" style="${styleObjectToString(block.styles)}" />
        </div>`;
        break;

      case "spacer":
        html += `<div style="height: ${block.content.height || "20px"};"></div>`;
        break;

      case "divider":
        html += `<div style="padding: 10px 0;">
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 0;" />
        </div>`;
        break;

      case "grid-1-column":
      case "grid-2-column":
      case "grid-3-column":
        const columnCount =
          block.type === "grid-1-column"
            ? 1
            : block.type === "grid-2-column"
              ? 2
              : 3;
        const columns = block.content.columns || Array(columnCount).fill([]);

        html += `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="${styleObjectToString(block.styles)}">
          <tbody>
            <tr>`;

        for (let i = 0; i < columnCount; i++) {
          const width = 100 / columnCount;

          html += `<td width="${width}%" style="padding: 10px; vertical-align: top;">`;

          if (columns[i] && columns[i].length > 0) {
            // Render blocks in this column
            columns[i].forEach((colBlock: TemplateBlock) => {
              switch (colBlock.type) {
                case "header":
                  html += `<div style="${styleObjectToString(colBlock.styles)}">
                    <h3>${colBlock.content.text || ""}</h3>
                  </div>`;
                  break;

                case "text":
                  html += `<div style="${styleObjectToString(colBlock.styles)}">
                    ${(colBlock.content.text || "").replace(/\n/g, "<br>")}
                  </div>`;
                  break;

                case "button":
                  html += `<div style="text-align: center; padding: 5px;">
                    <a href="${colBlock.content.url || "#"}" style="${styleObjectToString(colBlock.styles)}">
                      ${colBlock.content.text || "Button"}
                    </a>
                  </div>`;
                  break;

                case "image":
                  html += `<div style="text-align: center; padding: 5px;">
                    <img src="${colBlock.content.src || "https://via.placeholder.com/300x150"}"
                      alt="${colBlock.content.alt || ""}"
                      style="max-width: 100%; ${styleObjectToString(colBlock.styles)}" />
                  </div>`;
                  break;

                case "spacer":
                  html += `<div style="height: ${colBlock.content.height || "20px"};"></div>`;
                  break;

                case "divider":
                  html += `<div style="padding: 10px 0;">
                    <hr style="border: none; border-top: 1px solid ${colBlock.content.color || "#e0e0e0"}; margin: 0;" />
                  </div>`;
                  break;

                case "card":
                  html += `<div style="
                    padding: ${colBlock.content.padding || "16px"};
                    background-color: ${colBlock.content.backgroundColor || "#ffffff"};
                    border: 1px solid ${colBlock.content.borderColor || "#e5e7eb"};
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    margin: 10px 0;
                    width: 100%;
                    box-sizing: border-box;
                    display: block;
                    ${styleObjectToString(colBlock.styles)}
                  ">
                    ${colBlock.content.title ? `<h3 style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">${colBlock.content.title}</h3>` : ""}
                    ${colBlock.content.description ? `<p style="color: #4b5563; margin-top: 0;">${colBlock.content.description}</p>` : ""}
                  </div>`;
                  break;

                default:
                  html += `<div style="padding: 5px;">[Unsupported block type: ${colBlock.type}]</div>`;
              }
            });
          } else {
            html += `<div style="text-align: center; padding: 10px; color: #ccc;">Empty Column</div>`;
          }

          html += `</td>`;
        }

        html += `</tr></tbody></table>`;
        break;

      case "quote":
        html += `<blockquote style="${styleObjectToString(block.styles)}">
          ${(block.content.text || "").replace(/\n/g, "<br>")}
          ${block.content.quoteAuthor ? `<footer style="margin-top: 10px; font-style: normal; font-weight: bold;">— ${block.content.quoteAuthor}</footer>` : ""}
        </blockquote>`;
        break;

      case "list":
        const items = block.content.items || [];
        html += `<ul style="${styleObjectToString(block.styles)}">`;
        items.forEach((item) => {
          html += `<li>${item}</li>`;
        });
        html += `</ul>`;
        break;

      case "social":
        const socialLinks = block.content.socialLinks || [];

        // Add FontAwesome stylesheet if not already added
        if (!html.includes("fontawesome")) {
          html = html.replace(
            "</head>",
            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />\n</head>',
          );
        }

        html += `<div style="${styleObjectToString(block.styles)}">`;
        socialLinks.forEach((link) => {
          // Map platform to Font Awesome icon class
          const getIconClass = (platform: string): string => {
            switch (platform) {
              case "facebook":
                return "fab fa-facebook";
              case "twitter":
                return "fab fa-twitter";
              case "instagram":
                return "fab fa-instagram";
              case "linkedin":
                return "fab fa-linkedin";
              case "youtube":
                return "fab fa-youtube";
              case "pinterest":
                return "fab fa-pinterest";
              case "tiktok":
                return "fab fa-tiktok";
              case "snapchat":
                return "fab fa-snapchat";
              case "github":
                return "fab fa-github";
              case "discord":
                return "fab fa-discord";
              case "reddit":
                return "fab fa-reddit";
              case "twitch":
                return "fab fa-twitch";
              case "whatsapp":
                return "fab fa-whatsapp";
              case "telegram":
                return "fab fa-telegram";
              default:
                return "fas fa-globe";
            }
          };

          // Map platform to color
          const getIconColor = (platform: string): string => {
            switch (platform) {
              case "facebook":
                return "#1877F2";
              case "twitter":
                return "#1DA1F2";
              case "instagram":
                return "#E1306C";
              case "linkedin":
                return "#0077B5";
              case "youtube":
                return "#FF0000";
              case "pinterest":
                return "#BD081C";
              case "tiktok":
                return "#000000";
              case "snapchat":
                return "#FFFC00";
              case "github":
                return "#333333";
              case "discord":
                return "#5865F2";
              case "reddit":
                return "#FF4500";
              case "twitch":
                return "#9146FF";
              case "whatsapp":
                return "#25D366";
              case "telegram":
                return "#0088CC";
              default:
                return "#4285F4";
            }
          };

          html += `<a href="${link.url}" style="display: inline-block; margin: 0 10px; text-decoration: none; text-align: center;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin: 0 auto;">
              <i class="${getIconClass(link.platform)}" style="font-size: 24px; color: ${getIconColor(link.platform)};"></i>
            </div>
            <div style="font-size: 12px; margin-top: 5px; color: #666;">${link.platform}</div>
          </a>`;
        });
        html += `</div>`;
        break;

      case "video":
        html += `<div style="text-align: center; padding: 10px;">
          <iframe
            src="${block.content.videoUrl || ""}"
            style="${styleObjectToString(block.styles)}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>`;
        break;

      case "card":
        html += `<div style="
          padding: ${block.content.padding || "16px"};
          background-color: ${block.content.backgroundColor || "#ffffff"};
          border: 1px solid ${block.content.borderColor || "#e5e7eb"};
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin: 10px 0;
          width: 100%;
          box-sizing: border-box;
          display: block;
          ${styleObjectToString(block.styles)}
        ">
          ${block.content.title ? `<h3 style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">${block.content.title}</h3>` : ""}
          ${block.content.description ? `<p style="color: #4b5563; margin-top: 0;">${block.content.description}</p>` : ""}
        </div>`;
        break;

      case "section":
        html += `<div style="
          padding: ${block.content.padding || "24px"};
          background-color: ${block.content.backgroundColor || "#f9fafb"};
          margin: 10px 0;
          width: 100%;
          box-sizing: border-box;
          display: block;
          ${styleObjectToString(block.styles)}
        ">
          ${block.content.title ? `<h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; text-align: center;">${block.content.title}</h2>` : ""}
          <div style="min-height: 50px;"></div>
        </div>`;
        break;

      default:
        html += `<div>Unsupported block type: ${block.type}</div>`;
    }
  });

  // Close HTML
  html += `
      </div>
    </body>
    </html>`;

  return html;
};
