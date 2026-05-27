import Link from "next/link";
import { FaInstagram, FaTiktok, FaUserShield, FaYoutube } from "react-icons/fa";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#14142f] text-white">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#14142f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-black tracking-wide">
            Новые <span className="text-[#ff4fa3]">люди</span>
          </Link>

          <nav className="flex items-center gap-5 text-sm text-white/70">
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative flex min-h-screen items-center justify-center px-6 py-10">
        <div className="absolute -left-30 top-20 h-96 w-96 rounded-full bg-[#ff4fa3]/30 blur-[130px]" />
        <div className="absolute -right-30 bottom-10 h-96 w-96 rounded-full bg-[#5b4dff]/30 blur-[130px]" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-5xl pt-24 text-center">
          <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/75 backdrop-blur">
            Social Media Analytics Platform
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Social media account analytics in one place
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/65">
            Internal platform for connecting social accounts, viewing video
            statistics, analyzing activity, and managing team workflows.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
            <a
              href={`${serverUrl}/api/auth/tiktok/entry`}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#ff4fa3] px-7 py-4 text-base font-bold text-white shadow-lg shadow-[#ff4fa3]/25 transition hover:scale-[1.03] hover:bg-[#ff2f93]"
            >
              <FaTiktok className="size-5" />
              Connect TikTok Account
            </a>

            <a
              href={`${serverUrl}/api/auth/youtube/entry`}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 text-base font-bold text-[#14142f] transition hover:scale-[1.03] hover:bg-white/90"
            >
              <FaYoutube className="size-5 text-red-600" />
              Connect YouTube Account
            </a>

            <a
              href={`${serverUrl}/api/auth/instagram`}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#ff4fa3] to-[#8b7cff] px-7 py-4 text-base font-bold text-white shadow-lg shadow-[#ff4fa3]/25 transition hover:scale-[1.03]"
            >
              <FaInstagram className="size-5" />
              Connect Instagram Account
            </a>

            <Link
              href="/moderator"
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur transition hover:scale-[1.03] hover:bg-white/15"
            >
              <FaUserShield className="size-5" />
              Moderator Login
            </Link>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
              <p className="text-3xl font-black text-[#ff4fa3]">Connect</p>
              <p className="mt-2 text-sm text-white/55">
                connect accounts and submit manual reports
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
              <p className="text-3xl font-black text-white">Stats</p>
              <p className="mt-2 text-sm text-white/55">
                video views, statistics, and account activity
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur">
              <p className="text-3xl font-black text-[#8b7cff]">Admin</p>
              <p className="mt-2 text-sm text-white/55">
                manage team members and connected accounts
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-center gap-5 text-sm text-white/45">
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>

            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
