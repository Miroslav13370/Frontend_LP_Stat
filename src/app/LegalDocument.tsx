import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import { PublicLayout } from "./PublicLayout";

type LegalDocumentProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function LegalDocument({
  title,
  description,
  children,
}: LegalDocumentProps) {
  return (
    <PublicLayout>
      <main className="px-4 pb-20 pt-28 sm:px-6 lg:pt-32">
        <article className="mx-auto max-w-4xl">
          <div className="border-b border-white/10 pb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-sm text-[#25f4ee] transition hover:text-white"
            >
              <Image
                src="/lp.png"
                alt="New People logo"
                width={28}
                height={28}
              className="h-7 w-7 rounded-[8px] object-cover"
              />
              New People
            </Link>

            <h1 className="mt-8 text-4xl font-bold leading-tight text-white sm:text-5xl">
              {title}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-white/60">
              {description}
            </p>

            <p className="mt-5 text-sm text-white/50">
              Last updated: May 28, 2026
            </p>
          </div>

          <div className="legal-copy mt-10 space-y-10 text-sm leading-7 text-white/72">
            {children}
          </div>
        </article>
      </main>
    </PublicLayout>
  );
}

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="border-b border-white/10 pb-10 last:border-b-0">
      <h2 className="text-xl font-semibold leading-7 text-white">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
