import Link from "next/link";
import { BrandHeader } from "../BrandHeader";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#101026] px-6 py-28 text-white">
      <BrandHeader />

      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <Link href="/" className="text-sm text-pink-300 hover:underline">
          ← Back to New People
        </Link>

        <h1 className="mt-6 text-4xl font-bold">New People Terms of Service</h1>

        <p className="mt-4 text-sm text-white/60">Last updated: May 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-white/75">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Overview</h2>
            <p className="mt-2">
              This service is provided by New People for internal analytics,
              account management, and performance reporting across connected
              social media accounts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              2. Use of the service
            </h2>
            <p className="mt-2">
              You may use New People only if you are authorized by the
              organization. The service is intended for moderators,
              administrators, and approved team members.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              3. Connected accounts
            </h2>
            <p className="mt-2">
              Users may connect social media accounts only when they have the
              right to do so. By connecting an account, you confirm that you
              have permission to access and process related statistics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">4. Data usage</h2>
            <p className="mt-2">
              New People uses account identifiers, public profile data, video
              metadata, and performance metrics such as views, likes, comments,
              and publication dates to calculate reports and internal summaries.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              5. Restrictions
            </h2>
            <p className="mt-2">
              You must not use New People for unauthorized access, account
              abuse, misleading activity, scraping beyond approved API access,
              or actions that violate TikTok, YouTube, Google, or other platform
              policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              6. Availability
            </h2>
            <p className="mt-2">
              New People may update, suspend, or discontinue parts of the
              service when needed for maintenance, security, or compliance
              reasons.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">7. Contact</h2>
            <p className="mt-2">
              For questions about these Terms, contact us at:
              <br />
              <a
                href="mailto:info@new-people.online"
                className="text-pink-300 hover:underline"
              >
                info@new-people.online
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
