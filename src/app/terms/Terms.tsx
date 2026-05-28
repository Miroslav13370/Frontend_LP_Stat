import { LegalDocument, LegalSection } from "../LegalDocument";

const contactEmail = "info@new-people.online";

export default function TermsPage() {
  return (
    <LegalDocument
      title="New People Terms of Service"
      description="These Terms of Service govern access to and use of New People, including social account connection, analytics, moderator review, and administrative workflows."
    >
      <LegalSection title="1. Agreement to these Terms">
        <p>
          By accessing or using New People, you agree to these Terms of Service
          and to the New People Privacy Policy. If you use New People on behalf
          of an organization, you represent that you are authorized to bind that
          organization and to connect or manage the relevant social accounts.
        </p>
        <p>
          If you do not agree to these Terms, or if you do not have authority to
          use the service or connect an account, you must not use New People.
        </p>
      </LegalSection>

      <LegalSection title="2. The service">
        <p>
          New People is a social account analytics and moderator operations
          platform. Authorized users can connect TikTok and YouTube accounts,
          view account and video statistics, assign accounts to moderators,
          submit or review Instagram report data, and manage administrator
          workflows.
        </p>
        <p>
          New People is not affiliated with TikTok, YouTube, Google, Instagram,
          or Meta. Those third-party platforms remain responsible for their own
          products, APIs, terms, policies, and account settings.
        </p>
      </LegalSection>

      <LegalSection title="3. Eligibility and authorized users">
        <p>
          New People is intended for authorized business or organizational users
          who are permitted to access the connected accounts and related
          analytics. You must be legally able to enter into these Terms and old
          enough to provide valid consent under the laws and platform rules that
          apply to you.
        </p>
        <p>
          Administrators are responsible for controlling access, assigning
          moderators, removing users who should no longer have access, and
          ensuring that internal use of New People complies with applicable laws
          and workplace or organizational policies.
        </p>
      </LegalSection>

      <LegalSection title="4. Account registration and security">
        <p>
          You must provide accurate login information, keep credentials
          confidential, and promptly notify us if you believe your account or a
          connected social account has been compromised. You are responsible for
          activity that occurs under your credentials unless caused by our
          failure to use reasonable security safeguards.
        </p>
        <p>
          We may suspend or restrict access if we believe an account is
          unauthorized, compromised, harmful, or being used in violation of
          these Terms, applicable law, or platform requirements.
        </p>
      </LegalSection>

      <LegalSection title="5. Connected social accounts">
        <p>
          You may connect a TikTok or YouTube account, or create an Instagram
          report account, only if you have the right to authorize New People to
          access and process the account data for analytics and moderation
          purposes. Connecting an account or submitting Instagram report data
          confirms that you have permission from the account owner or
          organization.
        </p>
        <p>
          New People uses official OAuth or platform authorization flows for
          TikTok and YouTube where available. Instagram reporting currently uses
          internal editor accounts and moderator-reviewed submissions rather
          than public Instagram OAuth. You can revoke platform access through
          the relevant third-party platform settings or by contacting us at{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </LegalSection>

      <LegalSection title="6. TikTok permissions and API use">
        <p>
          New People uses TikTok Login Kit and TikTok APIs for authorized
          account analytics. The app requests <code>user.info.basic</code> and{" "}
          <code>video.list</code>. These scopes are used to read basic profile
          data and public video list data for the connected TikTok account.
        </p>
        <p>
          You must not use New People to misrepresent TikTok data, remove or
          obscure creator attribution, bypass TikTok permissions, scrape TikTok
          outside approved API access, or violate TikTok Developer Terms,
          TikTok Developer Guidelines, Community Guidelines, or other TikTok
          policies.
        </p>
      </LegalSection>

      <LegalSection title="7. YouTube, Google, and Instagram requirements">
        <p>
          When you connect or use YouTube data, you must comply with the{" "}
          <a href="https://www.youtube.com/t/terms">YouTube Terms of Service</a>
          , the{" "}
          <a href="https://developers.google.com/youtube/terms/api-services-terms-of-service">
            YouTube API Services Terms of Service
          </a>
          , and applicable Google API policies. New People uses YouTube access
          only for readonly analytics and channel identification.
        </p>
        <p>
          When you submit or manage Instagram report data, you must comply with
          applicable Instagram and Meta terms and platform policies. You may not
          submit false reports, impersonate account owners, or upload report
          data you are not authorized to provide.
        </p>
      </LegalSection>

      <LegalSection title="8. User responsibilities">
        <p>You agree that you will:</p>
        <ul>
          <li>Use New People only for lawful, authorized analytics purposes.</li>
          <li>
            Keep login credentials, OAuth access, and connected account data
            secure and confidential.
          </li>
          <li>
            Ensure that all connected account owners have granted any necessary
            permissions and notices.
          </li>
          <li>
            Review reports and account assignments carefully before using them
            for internal decisions.
          </li>
          <li>
            Promptly disconnect accounts or remove users when authorization is
            withdrawn or no longer valid.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Prohibited activities">
        <p>You must not:</p>
        <ul>
          <li>
            Access, connect, or process any account without proper authority.
          </li>
          <li>
            Sell, license, disclose, or transfer platform data except as
            permitted by the relevant platform policies and applicable law.
          </li>
          <li>
            Use New People for surveillance, harassment, discrimination,
            unlawful profiling, or deceptive activity.
          </li>
          <li>
            Reverse engineer, overload, attack, scan, or interfere with the
            service, APIs, connected platforms, or other users.
          </li>
          <li>
            Attempt to bypass access controls, impersonate another person,
            submit false information, or hide unauthorized activity.
          </li>
          <li>
            Use data from New People to train external AI models or build
            competing datasets unless you have all required rights and platform
            permissions.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="10. Analytics and reports">
        <p>
          New People calculates analytics, summaries, report periods, account
          status, plan targets, and moderator workflow information based on data
          received through authorized platform APIs or submitted by authorized
          users. Analytics may be delayed, incomplete, or different from numbers
          shown directly inside TikTok, YouTube, Instagram, Meta, or other
          third-party services.
        </p>
        <p>
          New People is an operational reporting tool. You remain responsible
          for validating data before relying on it for legal, financial,
          employment, compensation, or disciplinary decisions.
        </p>
      </LegalSection>

      <LegalSection title="11. Privacy and data protection">
        <p>
          Our Privacy Policy explains how we collect, use, retain, disclose, and
          protect information. By using New People, you agree that we may
          process information as described in the Privacy Policy and as needed
          to provide the service.
        </p>
        <p>
          You are responsible for providing any notices and obtaining any
          consents required from account owners, employees, contractors,
          creators, moderators, or other individuals whose data you process
          through New People.
        </p>
      </LegalSection>

      <LegalSection title="12. Intellectual property">
        <p>
          New People, including its website, interface, code, branding, and
          service design, is owned by New People or its licensors. You receive a
          limited, revocable, non-exclusive, non-transferable right to use New
          People for authorized internal purposes under these Terms.
        </p>
        <p>
          TikTok, YouTube, Google, Instagram, Meta, and their respective names,
          logos, APIs, and content remain owned by their respective owners. No
          rights are granted to those third-party brand features except as
          permitted by their own terms and brand rules.
        </p>
      </LegalSection>

      <LegalSection title="13. Service availability and changes">
        <p>
          We may update, suspend, restrict, or discontinue any part of New
          People when needed for maintenance, security, compliance, platform API
          changes, or business reasons. Third-party API availability, review
          outcomes, scopes, quotas, and data fields may change outside our
          control.
        </p>
      </LegalSection>

      <LegalSection title="14. Termination">
        <p>
          You may stop using New People at any time and may request account
          disconnection or deletion by contacting{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. We may suspend
          or terminate access if you violate these Terms, platform policies,
          applicable law, or if continued access creates security, legal, or
          operational risk.
        </p>
        <p>
          After termination, provisions that by their nature should survive will
          remain in effect, including privacy, data protection, intellectual
          property, disclaimers, limitations of liability, indemnity, and
          dispute-related provisions.
        </p>
      </LegalSection>

      <LegalSection title="15. Disclaimers">
        <p>
          New People is provided on an &quot;as is&quot; and &quot;as
          available&quot; basis. To the maximum extent permitted by law, we
          disclaim warranties of
          merchantability, fitness for a particular purpose, non-infringement,
          uninterrupted availability, accuracy, and error-free operation.
        </p>
      </LegalSection>

      <LegalSection title="16. Limitation of liability">
        <p>
          To the maximum extent permitted by law, New People will not be liable
          for indirect, incidental, special, consequential, exemplary, or
          punitive damages, or for lost profits, lost revenue, lost data,
          business interruption, platform suspension, or third-party API changes
          arising from or related to the service.
        </p>
      </LegalSection>

      <LegalSection title="17. Indemnity">
        <p>
          You agree to defend, indemnify, and hold New People harmless from
          claims, damages, liabilities, losses, costs, and expenses arising from
          your use of the service, connected accounts, report submissions,
          violation of these Terms, violation of platform policies, violation of
          law, or infringement of third-party rights.
        </p>
      </LegalSection>

      <LegalSection title="18. Changes to these Terms">
        <p>
          We may update these Terms from time to time. The updated version will
          be posted on this page with a new &quot;Last updated&quot; date.
          Continued use of New People after an update means you accept the
          updated Terms.
        </p>
      </LegalSection>

      <LegalSection title="19. Contact">
        <p>
          For questions about these Terms, connected account access, revocation,
          data deletion, or platform compliance, contact New People at{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
