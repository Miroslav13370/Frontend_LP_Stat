import { LegalDocument, LegalSection } from "../LegalDocument";

const contactEmail = "info@new-people.online";

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="New People Privacy Policy"
      description="This Privacy Policy explains how New People collects, uses, stores, and protects information when authorized users connect social media accounts and use the New People analytics and moderation platform."
    >
      <LegalSection title="1. Who we are">
        <p>
          New People operates the website and service available at{" "}
          <a href="https://new-people.online">https://new-people.online</a>.
          New People is an internal social account analytics and moderator
          operations platform for authorized users. In this Privacy Policy,
          &quot;New People&quot;, &quot;we&quot;, &quot;us&quot;, and
          &quot;our&quot; refer to the operator of this service.
        </p>
        <p>
          New People is not TikTok, YouTube, Google, Instagram, Meta, or an
          affiliate of those companies. We use their official APIs only when a
          user or account owner authorizes access.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>Depending on how you use the service, we may collect:</p>
        <ul>
          <li>
            Account and login data for moderators, administrators, and
            Instagram report editors, such as login name, password hash,
            authentication status, role, manually registered Instagram account
            URL, username, optional avatar URL, and related account assignment
            data.
          </li>
          <li>
            TikTok OAuth data authorized through TikTok Login Kit, including
            TikTok open ID, username, display name, avatar URL, access token,
            refresh token, token expiration metadata, and public video metadata
            available through the approved scopes.
          </li>
          <li>
            TikTok public video analytics available through the{" "}
            <code>video.list</code> permission, such as video IDs, titles,
            descriptions, cover images, share URLs, publication timestamps,
            view counts, like counts, comment counts, and share counts.
          </li>
          <li>
            YouTube and Google OAuth data authorized by the user, including the
            Google account identifier, YouTube channel ID, channel title,
            channel description, custom URL, thumbnail URL, access token,
            refresh token when provided, token expiration metadata, and
            readonly YouTube statistics needed for reporting.
          </li>
          <li>
            Instagram reporting data entered into the service by authorized
            users, including Instagram account username, account URL, optional
            avatar URL, report periods, reported view counts, like counts,
            video counts, viral video URLs, report status, rejection reasons,
            and moderator verification activity.
          </li>
          <li>
            Operational data such as connected account status, moderator
            assignment, author-content flags, plan targets, analytics periods,
            cached statistics, audit timestamps, error logs, and basic request
            metadata needed to secure and operate the service.
          </li>
          <li>
            Cookies and similar storage used for secure sessions and account
            routing, including HTTP-only access and refresh token cookies for
            authenticated users and cookies that remember the last connected
            TikTok or YouTube account on the same browser.
          </li>
        </ul>
        <p>
          We do not intentionally collect government identifiers, payment card
          numbers, precise geolocation, biometric identifiers, health data, or
          other sensitive personal information unless you voluntarily include
          it in content that you submit to the service.
        </p>
      </LegalSection>

      <LegalSection title="3. TikTok API and OAuth usage">
        <p>
          New People uses TikTok Login Kit and TikTok APIs to support account
          connection and analytics. The app requests the TikTok scopes{" "}
          <code>user.info.basic</code> and <code>video.list</code>. These
          permissions allow us to read basic profile information and the
          authorized user&apos;s public video list and video statistics. We do not
          use TikTok APIs to post content, send messages, follow accounts,
          modify profiles, or take actions on a user&apos;s behalf.
        </p>
        <p>
          TikTok access tokens and refresh tokens are stored on the server side
          and are used only to retrieve the authorized account profile, refresh
          access when permitted, and load analytics needed for New People
          reporting. Users may revoke TikTok access from their TikTok account
          settings or by contacting us.
        </p>
      </LegalSection>

      <LegalSection title="4. YouTube, Google, and Instagram usage">
        <p>
          For YouTube, New People uses Google OAuth and readonly YouTube API
          access to identify the connected channel and retrieve channel or
          video statistics for internal analytics. Our use and transfer of
          information received from Google APIs will adhere to the{" "}
          <a href="https://developers.google.com/terms/api-services-user-data-policy">
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>
        <p>
          For Instagram, New People currently uses an internal editor reporting
          workflow instead of public Instagram OAuth. Authorized editors create
          or access an Instagram report account, submit metrics and viral video
          report data, and moderators review, approve, or reject those
          submissions. We use Instagram report data only for account
          identification, analytics, reporting, assignment, and moderator review
          functions within New People.
        </p>
      </LegalSection>

      <LegalSection title="5. How we use information">
        <p>We use the information described above to:</p>
        <ul>
          <li>Authenticate authorized users and protect account access.</li>
          <li>
            Connect TikTok and YouTube accounts after OAuth authorization and
            manage Instagram report accounts submitted by authorized editors.
          </li>
          <li>Display account profiles, public video metadata, and analytics.</li>
          <li>
            Calculate internal reporting periods, performance summaries, and
            moderator workflow statistics.
          </li>
          <li>
            Assign connected accounts to moderators and allow administrators to
            manage access, review reports, approve or reject submissions, and
            maintain data quality.
          </li>
          <li>
            Refresh access tokens, cache statistics, prevent duplicate account
            connections, diagnose errors, and maintain service security.
          </li>
          <li>
            Comply with applicable laws, platform policies, security requests,
            and enforce our Terms of Service.
          </li>
        </ul>
        <p>
          We do not sell personal information. We do not use connected social
          account data for third-party advertising, credit decisions, employment
          eligibility decisions, facial recognition, biometric identification,
          or training external artificial intelligence models.
        </p>
      </LegalSection>

      <LegalSection title="6. Legal bases and user consent">
        <p>
          Where privacy laws such as the GDPR or UK GDPR apply, we process
          personal data based on one or more lawful bases: consent for OAuth
          account connection, performance of the service requested by authorized
          users, legitimate interests in operating a secure analytics platform,
          and compliance with legal obligations.
        </p>
        <p>
          You may withdraw OAuth consent by revoking access through TikTok,
          Google, or YouTube account settings, or by contacting us. For
          Instagram report workflows, you may request report account removal or
          deletion by contacting us. Withdrawal does not affect processing that
          occurred before access was revoked.
        </p>
      </LegalSection>

      <LegalSection title="7. Sharing and disclosure">
        <p>
          We share information only as needed to operate New People and comply
          with law. This may include:
        </p>
        <ul>
          <li>
            Authorized New People administrators, moderators, and editors who
            need access for account management, analytics, or report review.
          </li>
          <li>
            Service providers that host infrastructure, databases, security,
            monitoring, or communication systems on our behalf.
          </li>
          <li>
            TikTok, Google, YouTube, Meta, or Instagram when required to
            maintain OAuth authorization, API access, platform compliance, or
            user-requested revocation, or to address platform compliance for
            submitted report data.
          </li>
          <li>
            Regulators, courts, law enforcement, or other parties when required
            by applicable law or necessary to protect rights, safety, security,
            or service integrity.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Cookies and sessions">
        <p>
          New People uses cookies for authentication, session refresh, account
          routing, and security. Authentication cookies are configured as
          HTTP-only and are intended to reduce exposure to client-side script
          access. In production, cookies are configured to use secure transport
          where applicable.
        </p>
        <p>
          New People does not use third-party advertising cookies on the public
          website. Blocking required cookies may prevent login, account
          connection, or moderator workflows from functioning.
        </p>
      </LegalSection>

      <LegalSection title="9. Data retention">
        <p>
          We keep connected account data, OAuth tokens, profile data, analytics
          records, and moderator workflow records while the account remains
          connected, while the data is needed for reporting, or while retention
          is required for security, legal, compliance, backup, or operational
          purposes.
        </p>
        <p>
          If you request deletion or disconnect an account, we will delete or
          de-identify the relevant records within a reasonable period, normally
          within 30 days, unless retention is required for legal, security,
          platform compliance, fraud prevention, dispute resolution, or backup
          purposes. Backup copies may persist for a limited period before they
          are overwritten or deleted.
        </p>
      </LegalSection>

      <LegalSection title="10. Security">
        <p>
          We use server-side token handling, HTTP-only cookies, role-based
          access controls, validation, password hashing, restricted
          administrator functions, and operational monitoring to help protect
          information. No internet service is completely secure, but we work to
          maintain safeguards appropriate to the nature of the data we process.
        </p>
        <p>
          You are responsible for keeping your own login credentials secure and
          for ensuring that any social account you connect is connected with
          proper authority.
        </p>
      </LegalSection>

      <LegalSection title="11. Your choices and rights">
        <p>
          Depending on your location, you may have rights to request access,
          correction, deletion, portability, restriction, objection, withdrawal
          of consent, or information about how your personal data is processed.
          California residents may also have rights under the CCPA/CPRA,
          including the right to know, delete, correct, and opt out of sale or
          sharing. New People does not sell or share personal information for
          cross-context behavioral advertising.
        </p>
        <p>
          To exercise privacy rights or request account disconnection, contact{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. We may need to
          verify your identity or authority over the relevant account before
          completing a request.
        </p>
      </LegalSection>

      <LegalSection title="12. International processing">
        <p>
          New People and its service providers may process information in
          countries where we or our providers operate. Where required, we use
          appropriate safeguards for international transfers and process data
          only for the purposes described in this Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection title="13. Children">
        <p>
          New People is intended for authorized business or organizational users
          and is not directed to children. Do not use New People if you are not
          old enough to grant valid consent under the laws and platform rules
          that apply to you.
        </p>
      </LegalSection>

      <LegalSection title="14. Changes to this policy">
        <p>
          We may update this Privacy Policy to reflect changes in the service,
          laws, platform requirements, or security practices. The updated
          version will be posted on this page with a new &quot;Last updated&quot;
          date.
        </p>
      </LegalSection>

      <LegalSection title="15. Contact">
        <p>
          For privacy requests, account deletion, data access, platform data
          questions, or security concerns, contact New People at{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
