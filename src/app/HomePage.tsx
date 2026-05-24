import Link from "next/link";

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
        <div className="absolute left-[-120px] top-20 h-96 w-96 rounded-full bg-[#ff4fa3]/30 blur-[130px]" />
        <div className="absolute bottom-10 right-[-120px] h-96 w-96 rounded-full bg-[#5b4dff]/30 blur-[130px]" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-5xl pt-24 text-center">
          <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/75 backdrop-blur">
            Social Media Analytics Platform
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Аналитика социальных аккаунтов в одном месте
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/65">
            Внутренний сервис организации «Новые люди» для подключения
            социальных аккаунтов, просмотра статистики видео, анализа активности
            и управления командной работой.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Link
              href={`${serverUrl}/api/auth/tiktok`}
              className="rounded-2xl bg-[#ff4fa3] px-7 py-4 text-base font-bold text-white shadow-lg shadow-[#ff4fa3]/25 transition hover:scale-[1.03] hover:bg-[#ff2f93]"
            >
              Авторизовать TikTok
            </Link>

            <Link
              href={`${serverUrl}/api/auth/youtube`}
              className="rounded-2xl bg-white px-7 py-4 text-base font-bold text-[#14142f] transition hover:scale-[1.03] hover:bg-white/90"
            >
              Авторизовать YouTube
            </Link>

            <Link
              href="/instagram/connect"
              className="rounded-2xl bg-linear-to-r from-[#ff4fa3] to-[#8b7cff] px-7 py-4 text-base font-bold text-white shadow-lg shadow-[#ff4fa3]/25 transition hover:scale-[1.03]"
            >
              Подключить Instagram
            </Link>

            <Link
              href="/moderator"
              className="rounded-2xl border border-white/15 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur transition hover:scale-[1.03] hover:bg-white/15"
            >
              Войти как модератор
            </Link>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
              <p className="text-3xl font-black text-[#ff4fa3]">Connect</p>
              <p className="mt-2 text-sm text-white/55">
                подключение аккаунтов и ручные отчёты
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
              <p className="text-3xl font-black text-white">Stats</p>
              <p className="mt-2 text-sm text-white/55">
                просмотры, видео и активность
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
              <p className="text-3xl font-black text-[#8b7cff]">Admin</p>
              <p className="mt-2 text-sm text-white/55">
                управление командой и аккаунтами
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
