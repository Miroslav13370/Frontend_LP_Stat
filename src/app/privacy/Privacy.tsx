import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#101026] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <Link href="/" className="text-sm text-pink-300 hover:underline">
          ← На главную
        </Link>

        <h1 className="mt-6 text-4xl font-bold">Privacy Policy</h1>

        <p className="mt-4 text-sm text-white/60">Last updated: May 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-white/75">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Who we are</h2>
            <p className="mt-2">
              This service is operated by New People organization. The service
              helps authorized team members manage connected social media
              accounts and view performance analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              2. Information we collect
            </h2>
            <p className="mt-2">
              We may collect account identifiers, display names, profile images,
              channel or profile links, video metadata, publication dates, view
              counts, like counts, comment counts, share counts, and related
              analytics received through approved platform APIs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              3. How we use information
            </h2>
            <p className="mt-2">
              We use this information to display statistics, calculate internal
              performance reports, manage account assignments, prevent duplicate
              account connections, and support authorized administrative tasks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              4. TikTok and YouTube data
            </h2>
            <p className="mt-2">
              If you connect a TikTok or YouTube account, we use only the data
              permitted by the access scopes granted during authorization. You
              may revoke access through the relevant platform settings or by
              contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              5. Data sharing
            </h2>
            <p className="mt-2">
              We do not sell personal data. Access to analytics is limited to
              authorized users, moderators, and administrators who need it for
              internal reporting and account management.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              6. Data retention
            </h2>
            <p className="mt-2">
              We keep data only as long as needed for analytics, reporting,
              security, legal, or operational purposes. Cached statistics may be
              refreshed or deleted when accounts are updated or disconnected.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">7. Security</h2>
            <p className="mt-2">
              We use access controls, authentication, and server-side permission
              checks to protect account data from unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">8. Contact</h2>
            <p className="mt-2">
              For privacy questions or data access requests, contact:
              <br />
              <a
                href="mailto:info@newpeople.com"
                className="text-pink-300 hover:underline"
              >
                info@newpeople.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
