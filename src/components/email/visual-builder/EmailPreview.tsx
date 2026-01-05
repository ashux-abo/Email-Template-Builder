"use client";

import React from "react";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { TemplateBlock } from "./types";
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

interface EmailPreviewProps {
  blocks: TemplateBlock[];
  activeBlock: string | null;
  onSelectBlock: (id: string) => void;
  onMoveBlock: (id: string, direction: "up" | "down") => void;
  onRemoveBlock: (id: string) => void;
}

export function EmailPreview({
  blocks,
  activeBlock,
  onSelectBlock,
  onMoveBlock,
  onRemoveBlock,
}: EmailPreviewProps) {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <FaFacebook size={24} color="#1877F2" />;
      case "twitter":
        return <FaTwitter size={24} color="#1DA1F2" />;
      case "instagram":
        return <FaInstagram size={24} color="#E1306C" />;
      case "linkedin":
        return <FaLinkedin size={24} color="#0077B5" />;
      case "youtube":
        return <FaYoutube size={24} color="#FF0000" />;
      case "pinterest":
        return <FaPinterest size={24} color="#BD081C" />;
      case "tiktok":
        return <FaTiktok size={24} color="#000000" />;
      case "snapchat":
        return <FaSnapchat size={24} color="#FFFC00" />;
      case "github":
        return <FaGithub size={24} color="#333333" />;
      case "discord":
        return <FaDiscord size={24} color="#5865F2" />;
      case "reddit":
        return <FaReddit size={24} color="#FF4500" />;
      case "twitch":
        return <FaTwitch size={24} color="#9146FF" />;
      case "whatsapp":
        return <FaWhatsapp size={24} color="#25D366" />;
      case "telegram":
        return <FaTelegram size={24} color="#0088CC" />;
      case "website":
      default:
        return <FaGlobe size={24} color="#4285F4" />;
    }
  };

  return (
    <div className="rounded-xl bg-gray-50 p-6">
      <div className="mx-auto max-w-[600px] overflow-auto rounded-lg border-2 border-gray-200 bg-white shadow-lg">
        <div className="grid min-h-[400px] grid-cols-1">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              className={`group relative p-3 cursor-pointer transition-all ${
                activeBlock === block.id
                  ? "ring-4 ring-primary/30 bg-blue-50/50"
                  : "hover:bg-gray-50/50"
              }`}
              onClick={() => onSelectBlock(block.id)}
            >
              {/* Block controls */}
              <div className="absolute right-2 top-2 flex gap-1 rounded-lg bg-white shadow-md border border-gray-200 p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="p-1.5 text-gray-600 hover:text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveBlock(block.id, "up");
                  }}
                  disabled={index === 0}
                  title="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 text-gray-600 hover:text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveBlock(block.id, "down");
                  }}
                  disabled={index === blocks.length - 1}
                  title="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <div className="w-px bg-gray-200 mx-0.5"></div>
                <button
                  type="button"
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveBlock(block.id);
                  }}
                  title="Delete block"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Active indicator */}
              {activeBlock === block.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"></div>
              )}

              {/* Block content */}
              <div>
                {block.type === "header" && (
                  <div style={block.styles as React.CSSProperties}>
                    <h1>{block.content.text || ""}</h1>
                  </div>
                )}

                {block.type === "text" && (
                  <div style={block.styles as React.CSSProperties}>
                    {(block.content.text || "")
                      .split("\n")
                      .map((line: string, i: number) => (
                        <p key={i}>{line}</p>
                      ))}
                  </div>
                )}

                {block.type === "button" && (
                  <div style={{ textAlign: "center", padding: "10px" }}>
                    <a
                      href="#"
                      style={block.styles as React.CSSProperties}
                      onClick={(e) => e.preventDefault()}
                    >
                      {block.content.text || ""}
                    </a>
                  </div>
                )}

                {block.type === "image" && (
                  <div style={{ textAlign: "center", padding: "10px" }}>
                    {block.content.src ? (
                      <img
                        src={block.content.src}
                        alt={block.content.alt || ""}
                        style={block.styles as React.CSSProperties}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "150px",
                          backgroundColor: "#f9fafb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "8px",
                          color: "#9ca3af",
                          border: "2px dashed #e5e7eb",
                        }}
                      >
                        Image placeholder
                      </div>
                    )}
                  </div>
                )}

                {block.type === "spacer" && (
                  <div style={{ height: block.content.height || "20px" }}></div>
                )}

                {block.type === "divider" && (
                  <div style={{ padding: "10px" }}>
                    <hr
                      style={{
                        border: "none",
                        height: "2px",
                        backgroundColor: "#e5e7eb",
                        borderRadius: "1px",
                      }}
                    />
                  </div>
                )}

                {block.type === "quote" && (
                  <blockquote style={block.styles as React.CSSProperties}>
                    {block.content.text || ""}
                    {block.content.quoteAuthor && (
                      <footer
                        style={{
                          marginTop: "10px",
                          fontStyle: "normal",
                          fontWeight: "bold",
                        }}
                      >
                        — {block.content.quoteAuthor}
                      </footer>
                    )}
                  </blockquote>
                )}

                {block.type === "list" && (
                  <ul style={block.styles as React.CSSProperties}>
                    {(block.content.items || []).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}

                {block.type === "social" && (
                  <div style={{ textAlign: "center", padding: "10px" }}>
                    {(block.content.socialLinks || []).map((link, i) => (
                      <span
                        key={i}
                        style={{
                          margin: "0 10px",
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: "#f8f9fa",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      >
                        {getSocialIcon(link.platform)}
                      </span>
                    ))}
                  </div>
                )}

                {block.type === "video" && (
                  <div style={{ textAlign: "center", padding: "10px" }}>
                    <div
                      style={{
                        backgroundColor: "#f9fafb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "200px",
                        border: "2px dashed #e5e7eb",
                        borderRadius: "8px",
                        color: "#9ca3af",
                      }}
                    >
                      <span>Video: {block.content.videoUrl || "No URL"}</span>
                    </div>
                  </div>
                )}

                {block.type === "card" && (
                  <div
                    style={{
                      padding: block.content.padding || "16px",
                      backgroundColor:
                        block.content.backgroundColor || "#ffffff",
                      border: `1px solid ${block.content.borderColor || "#e5e7eb"}`,
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      margin: "10px 0",
                      width: "100%",
                      boxSizing: "border-box",
                      display: "block",
                      ...(block.styles as React.CSSProperties),
                    }}
                  >
                    {block.content.title && (
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          marginBottom: "8px",
                        }}
                      >
                        {block.content.title}
                      </h3>
                    )}
                    {block.content.description && (
                      <p style={{ color: "#4b5563" }}>
                        {block.content.description}
                      </p>
                    )}
                  </div>
                )}

                {block.type === "section" && (
                  <div
                    style={{
                      padding: block.content.padding || "24px",
                      backgroundColor:
                        block.content.backgroundColor || "#f9fafb",
                      margin: "10px 0",
                      width: "100%",
                      boxSizing: "border-box",
                      display: "block",
                      ...(block.styles as React.CSSProperties),
                    }}
                  >
                    {block.content.title && (
                      <h2
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          marginBottom: "16px",
                          textAlign: "center",
                        }}
                      >
                        {block.content.title}
                      </h2>
                    )}
                    <div
                      style={{
                        minHeight: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px dashed #e5e7eb",
                        borderRadius: "8px",
                        padding: "16px",
                      }}
                    >
                      <span style={{ color: "#9ca3af" }}>Section Content</span>
                    </div>
                  </div>
                )}

                {block.type.startsWith("grid-") && (
                  <div>
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      border={0}
                      style={block.styles as React.CSSProperties}
                    >
                      <tbody>
                        <tr>
                          {Array(
                            block.type === "grid-1-column"
                              ? 1
                              : block.type === "grid-2-column"
                                ? 2
                                : 3,
                          )
                            .fill(0)
                            .map((_, i) => (
                              <td
                                key={i}
                                width={`${100 / (block.type === "grid-1-column" ? 1 : block.type === "grid-2-column" ? 2 : 3)}%`}
                                style={{
                                  padding: "10px",
                                  verticalAlign: "top",
                                  backgroundColor: "#f9fafb",
                                  border: "2px dashed #e5e7eb",
                                  borderRadius: "4px",
                                }}
                              >
                                {block.content.columns &&
                                block.content.columns[i] &&
                                block.content.columns[i].length > 0 ? (
                                  <div className="space-y-3">
                                    {block.content.columns[i].map(
                                      (columnBlock) => (
                                        <div
                                          key={columnBlock.id}
                                          className="mb-3 relative"
                                        >
                                          {columnBlock.type === "header" && (
                                            <div
                                              style={
                                                columnBlock.styles as React.CSSProperties
                                              }
                                            >
                                              <h3>
                                                {columnBlock.content.text || ""}
                                              </h3>
                                            </div>
                                          )}

                                          {columnBlock.type === "text" && (
                                            <div
                                              style={
                                                columnBlock.styles as React.CSSProperties
                                              }
                                            >
                                              {(columnBlock.content.text || "")
                                                .split("\n")
                                                .map(
                                                  (line: string, i: number) => (
                                                    <p key={i}>{line}</p>
                                                  ),
                                                )}
                                            </div>
                                          )}

                                          {columnBlock.type === "button" && (
                                            <div
                                              style={{
                                                textAlign: "center",
                                                padding: "5px",
                                              }}
                                            >
                                              <a
                                                href="#"
                                                style={
                                                  columnBlock.styles as React.CSSProperties
                                                }
                                                onClick={(e) =>
                                                  e.preventDefault()
                                                }
                                              >
                                                {columnBlock.content.text ||
                                                  "Button"}
                                              </a>
                                            </div>
                                          )}

                                          {columnBlock.type === "image" && (
                                            <div
                                              style={{
                                                textAlign: "center",
                                                padding: "5px",
                                              }}
                                            >
                                              <img
                                                src={
                                                  columnBlock.content.src ||
                                                  "https://via.placeholder.com/300x150"
                                                }
                                                alt={
                                                  columnBlock.content.alt || ""
                                                }
                                                style={{
                                                  maxWidth: "100%",
                                                  ...(columnBlock.styles as React.CSSProperties),
                                                }}
                                              />
                                            </div>
                                          )}

                                          {columnBlock.type === "spacer" && (
                                            <div
                                              style={{
                                                height:
                                                  columnBlock.content.height ||
                                                  "20px",
                                              }}
                                            ></div>
                                          )}

                                          {columnBlock.type === "card" && (
                                            <div
                                              style={{
                                                padding:
                                                  columnBlock.content.padding ||
                                                  "16px",
                                                backgroundColor:
                                                  columnBlock.content
                                                    .backgroundColor ||
                                                  "#ffffff",
                                                border: `1px solid ${columnBlock.content.borderColor || "#e5e7eb"}`,
                                                borderRadius: "8px",
                                                boxShadow:
                                                  "0 1px 3px rgba(0, 0, 0, 0.1)",
                                                margin: "10px 0",
                                                width: "100%",
                                                boxSizing: "border-box",
                                                display: "block",
                                                ...(columnBlock.styles as React.CSSProperties),
                                              }}
                                            >
                                              {columnBlock.content.title && (
                                                <h3
                                                  style={{
                                                    fontSize: "18px",
                                                    fontWeight: "bold",
                                                    marginBottom: "8px",
                                                  }}
                                                >
                                                  {columnBlock.content.title}
                                                </h3>
                                              )}
                                              {columnBlock.content
                                                .description && (
                                                <p style={{ color: "#4b5563" }}>
                                                  {
                                                    columnBlock.content
                                                      .description
                                                  }
                                                </p>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      ),
                                    )}
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      textAlign: "center",
                                      padding: "20px",
                                      color: "#9ca3af",
                                    }}
                                  >
                                    Column {i + 1}
                                  </div>
                                )}
                              </td>
                            ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
