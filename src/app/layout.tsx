import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppLayout } from "./RootLayout";
import { Toaster } from "sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://new-people.online";
const siteDescription =
  "New People is a social account analytics and moderator operations platform for authorized TikTok, YouTube, and Instagram report workflows.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "New People",
  title: {
    default: "New People",
    template: "%s | New People",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/lp.png", type: "image/png", sizes: "1254x1254" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "1254x1254" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "New People",
    description: siteDescription,
    url: siteUrl,
    siteName: "New People",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/lp.png",
        width: 1254,
        height: 1254,
        alt: "New People logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "New People",
    description: siteDescription,
    images: ["/lp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppLayout>
          {children}
          <Toaster richColors position="top-center" />
        </AppLayout>
      </body>
    </html>
  );
}
