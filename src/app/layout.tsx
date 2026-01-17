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
  title: "Email Sender",
  description: "A modern email template builder and sender application",
  icons: {
    icon: [{ url: "/email-sender.png?v=1", type: "image/png" }],
    shortcut: "/email-sender.png?v=1",
    apple: "/email-sender.png?v=1",
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
          href="/email-sender.png?v=1"
          as="image"
          type="image/png"
          fetchPriority="high"
        />
        <link rel="icon" href="/email-sender.png?v=1" type="image/png" />
        <link rel="apple-touch-icon" href="/email-sender.png?v=1" />
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
