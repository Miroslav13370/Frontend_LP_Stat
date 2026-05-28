import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaUserShield, FaYoutube } from "react-icons/fa";

import { PlatformTrustNotice } from "./PlatformTrustNotice";
import { PublicLayout } from "./PublicLayout";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");

const getServerPath = (path: string) =>
  serverUrl ? `${serverUrl}${path}` : path;

const metrics = [
  { label: "Supported workflows", value: "TikTok, YouTube, Instagram reports" },
  { label: "TikTok permissions", value: "user.info.basic, video.list" },
  { label: "Review workflows", value: "Moderators and admins" },
];

const workflow = [
  {
    title: "Authorized account connection",
    text: "Creators connect TikTok and YouTube through official OAuth flows. New People stores tokens server-side and uses only approved scopes.",
  },
  {
    title: "Analytics processing",
    text: "Video metadata and account statistics are organized into reporting periods for internal performance review.",
  },
  {
    title: "Moderator operations",
    text: "Administrators assign connected accounts, review submitted reports, and manage internal moderation workflows.",
  },
];

export default function HomePage() {
  return (
    <PublicLayout>
      <main>
        <section className="border-b border-white/10 px-4 pb-16 pt-28 sm:px-6 lg:pb-20 lg:pt-32">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_480px]">
            <div>
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
                <Image
                  src="/lp.png"
                  alt="New People logo"
                  width={24}
                  height={24}
                  priority
                  className="h-6 w-6 rounded-md object-cover"
                />
                New People
              </div>

              <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
                Social account analytics for authorized creator operations.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                New People helps approved team members connect social accounts,
                review video performance, and manage moderator workflows from one
                secure internal platform.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/tiktok/connect"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] bg-[#fe2c55] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff4168]"
                >
                  <FaTiktok className="size-5" />
                  Authorize via TikTok
                </Link>

                <a
                  href={getServerPath("/api/auth/youtube/entry")}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  <FaYoutube className="size-5 text-red-600" />
                  Authorize via Google
                </a>

                <a
                  href="/instagram/connect"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                >
                  <FaInstagram className="size-5 text-[#ffbd59]" />
                  Instagram reports
                </a>

                <Link
                  href="/moderator"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[8px] border border-[#25f4ee]/35 bg-[#25f4ee]/10 px-5 py-3 text-sm font-semibold text-[#25f4ee] transition hover:bg-[#25f4ee]/15"
                >
                  <FaUserShield className="size-5" />
                  Moderator login
                </Link>
              </div>

              <PlatformTrustNotice className="mt-6 max-w-2xl" compact />
            </div>

            <div className="rounded-[8px] border border-white/10 bg-[#101114] shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/lp.png"
                    alt="New People logo"
                    width={34}
                    height={34}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">New People</p>
                    <p className="text-xs text-white/50">Operations view</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  Authorized
                </span>
              </div>

              <div className="grid grid-cols-3 border-b border-white/10">
                {metrics.map((item) => (
                  <div
                    key={item.label}
                    className="border-r border-white/10 px-4 py-5 last:border-r-0"
                  >
                    <p className="text-xs text-white/50">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold leading-5 text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-1 p-5">
                {[
                  ["TikTok account", "video.list data refreshed", "#25f4ee"],
                  ["YouTube channel", "readonly profile connected", "#ffffff"],
                  ["Instagram report", "pending moderator review", "#ffbd59"],
                ].map(([title, detail, color]) => (
                  <div
                    key={title}
                    className="grid grid-cols-[12px_1fr_auto] items-center gap-3 border-b border-white/10 py-4 last:border-b-0"
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{title}</p>
                      <p className="truncate text-xs text-white/50">{detail}</p>
                    </div>
                    <span className="text-xs text-white/40">Review</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 md:grid-cols-3">
              {workflow.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[8px] border border-white/10 bg-white/[0.035] p-6"
                >
                  <h2 className="text-lg font-semibold text-white">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 px-4 py-8 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>
              New People uses official platform APIs only with user consent and
              never collects social media passwords or payment information.
            </p>
            <div className="flex gap-5">
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
