import type { Metadata, Viewport } from "next";
import { Fira_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
import ToastProvider from "../components/providers/ToastProvider";
import { ToastProvider as OriginalToastProvider } from "../components/ui/use-toast";

const firaMono = Fira_Mono({
  variable: "--font-fira-mono",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sendly",
  description: "A modern email template builder and sender application powered by Sendly",
  icons: {
    icon: [{ url: "/sendly-logo.png", type: "image/png" }],
    shortcut: "/sendly-logo.png",
    apple: "/sendly-logo.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#3A4A74",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload key logo assets */}
        <link
          rel="preload"
          href="/sendly-logo.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />
        <link rel="icon" href="/sendly-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/sendly-logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${firaMono.variable} antialiased`}>
        <OriginalToastProvider>
          <ToastProvider>
            <Navigation />
            <main>{children}</main>
          </ToastProvider>
        </OriginalToastProvider>
      </body>
    </html>
  );
}
