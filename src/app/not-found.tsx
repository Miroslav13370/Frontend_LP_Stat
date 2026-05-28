import Image from "next/image";
import Link from "next/link";

import { PublicLayout } from "./PublicLayout";

export default function NotFound() {
  return (
    <PublicLayout>
      <main className="flex min-h-screen items-center justify-center px-6 py-28">
        <section className="w-full max-w-xl rounded-[8px] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/30">
          <Image
            src="/lp.png"
            alt="New People logo"
            width={72}
            height={72}
            className="mx-auto h-[72px] w-[72px] rounded-[8px] object-cover"
          />

          <p className="mt-6 text-sm font-semibold text-[#25f4ee]">
            New People
          </p>

          <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Page not found
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/60">
            The page does not exist or is no longer available.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[8px] bg-[#25f4ee] px-6 py-3 text-sm font-semibold text-black hover:bg-[#6ffbf6]"
          >
            Back to New People
          </Link>
        </section>
      </main>
    </PublicLayout>
  );
}
