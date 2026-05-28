import type { Metadata } from "next";
import Link from "next/link";
import { FaTiktok } from "react-icons/fa";

import { PublicLayout } from "@/src/app/PublicLayout";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");

const getServerPath = (path: string) =>
  serverUrl ? `${serverUrl}${path}` : path;

export const metadata: Metadata = {
  title: "Connect TikTok",
  description:
    "Connect a TikTok account to New People using TikTok Login Kit permissions user.info.basic and video.list.",
  alternates: {
    canonical: "/tiktok/connect",
  },
};

export default function TikTokConnectPage() {
  return (
    <PublicLayout>
      <main className="flex min-h-screen items-center justify-center px-4 py-28">
        <section className="w-full max-w-2xl rounded-[8px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 sm:p-8">
          <p className="text-sm font-semibold text-[#25f4ee]">New People</p>

          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            Connect TikTok account
          </h1>

          <p className="mt-4 text-sm leading-7 text-white/65">
            New People will redirect you to the official TikTok authorization
            screen. The requested permissions are <code>user.info.basic</code>{" "}
            and <code>video.list</code> for account analytics.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={getServerPath("/api/auth/tiktok/entry")}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] bg-[#fe2c55] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff4168]"
            >
              <FaTiktok className="size-5" />
              Continue with TikTok
            </a>

            <Link
              href="/privacy"
              className="inline-flex min-h-12 items-center justify-center rounded-[8px] border border-white/10 px-5 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/[0.06] hover:text-white"
            >
              Privacy Policy
            </Link>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
