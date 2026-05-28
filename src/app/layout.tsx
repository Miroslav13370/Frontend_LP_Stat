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

export const metadata: Metadata = {
  metadataBase: new URL("https://new-people.online"),
  title: {
    default: "New People ",
    template: "%s | New People",
  },
  description:
    "New People is a platform for viewing social media account analytics and moderator performance statistics.",
  icons: {
    icon: "/lp.ico",
    shortcut: "/lp.ico",
    apple: "/lp.png",
  },
  openGraph: {
    title: "New People",
    description:
      "Platform for viewing social media account analytics and moderator performance statistics.",
    url: "https://new-people.online",
    siteName: "New People",
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
