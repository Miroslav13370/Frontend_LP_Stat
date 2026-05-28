import Image from "next/image";
import Link from "next/link";

export function BrandHeader() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#14142f]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/lp.png"
            alt="New People logo"
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-xl object-cover"
          />

          <span className="text-lg font-black tracking-wide text-white">
            New People
          </span>
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
  );
}
