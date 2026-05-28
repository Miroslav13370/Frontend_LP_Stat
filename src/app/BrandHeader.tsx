import Image from "next/image";
import Link from "next/link";

export function BrandHeader() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#08090b]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          aria-label="New People home"
          className="flex min-w-0 items-center gap-3"
        >
          <Image
            src="/lp.png"
            alt="New People logo"
            width={44}
            height={44}
            priority
            className="h-11 w-11 shrink-0 rounded-[8px] object-cover ring-1 ring-white/10"
          />

          <span className="truncate text-lg font-bold text-white">
            New People
          </span>
        </Link>

        <nav
          aria-label="Public navigation"
          className="flex items-center gap-4 text-sm text-white/70 sm:gap-6"
        >
          <Link href="/" className="hidden transition hover:text-white sm:block">
            Home
          </Link>

          <Link href="/terms" className="transition hover:text-white">
            Terms
          </Link>

          <Link href="/privacy" className="transition hover:text-white">
            Privacy
          </Link>

          <a
            href="mailto:info@new-people.online"
            className="hidden transition hover:text-white sm:block"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
