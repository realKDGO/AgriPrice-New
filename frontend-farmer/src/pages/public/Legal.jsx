import { Link } from "react-router-dom";
import { Brand } from "../../components/common/UI";
export function LegalLinks() {
  return (
    <nav className="legal-links" aria-label="Legal information">
      <Link to="/privacy-policy">Privacy Policy</Link>
      <Link to="/terms">Terms and Conditions</Link>
      <Link to="/cookie-policy">Cookie Policy</Link>
    </nav>
  );
}
const content = {
  "privacy-policy": {
    title: "Privacy Policy",
    sections: [
      [
        "Information we collect",
        "AgriPrice collects your first name, last name, email address, password hash, role, account status, sign-in timestamps, preferences, and terms acknowledgment. Contact forms collect your name, email, subject, and message. MAO crop uploads contain crop photographs. Avoid including people or personal information in crop photos.",
      ],
      [
        "Why we use it",
        "Account information supports sign-in, access control, profile management, and relevant notifications. Inquiry details help administrators review and respond to your message. Security event records, including an IP address where recorded, help investigate sign-in failures and administrative actions. Crop and price records support agricultural information and decision-support tools.",
      ],
      [
        "Access and service providers",
        "Authorized administrators manage account details and inquiries. MAO users manage agricultural records. Farmers cannot read other users’ profiles. Passwords are hashed and are not displayed to administrators. PostgreSQL records and crop photos are intended to be hosted by Supabase. Hosting providers may process technical request logs. Uploaded crop images can be read publicly. The operator must publish its identity and final hosting-provider details before public launch.",
      ],
      [
        "Storage and safeguards",
        "The application uses role checks, input validation, limited sign-in attempts, hashed passwords, and expiring sessions. HTTPS must be enabled in production. These measures reduce risk but do not guarantee protection against every threat. Information may be processed outside the Philippines depending on the selected hosting region.",
      ],
      [
        "Retention",
        "Account data is retained while needed to provide the account and address legitimate operational obligations. Security and inquiry records should be kept only as long as needed for their stated purposes. The operator must establish and publish an approved retention schedule before collecting production personal data. Deletion requests may require identity verification and review of applicable retention obligations.",
      ],
      [
        "Your choices and requests",
        "You can edit profile information, change your password, and manage optional in-app notifications in Settings. To request access, correction, or deletion, use the Contact form and identify the request without including your password or identity documents. An administrator must review these requests. You may also contact the National Privacy Commission about privacy concerns.",
      ],
      [
        "Cookies and third parties",
        "A necessary refresh cookie maintains your signed-in session. Access tokens are held in memory. Preferences are saved to your account. This build includes no advertising, analytics tracking, external maps, embedded videos, or social widgets. See the Cookie Policy for details.",
      ],
      [
        "Privacy principles",
        "This notice is informed by Philippine privacy principles, including transparency, legitimate purpose, proportionality, and data-subject rights. It does not assert that AgriPrice has received a compliance certification.",
      ],
    ],
  },
  terms: {
    title: "Terms and Conditions",
    sections: [
      [
        "Using AgriPrice",
        "AgriPrice provides crop prices, historical records, forecasts, market comparisons, and earnings estimates to support agricultural decisions. Use the service lawfully and provide accurate account information. Public registration creates a Farmer account. MAO accounts are created by an authorized administrator.",
      ],
      [
        "Account responsibilities",
        "Keep your password private. Do not share privileged accounts, impersonate others, upload harmful files, interfere with the service, or attempt to access records outside your permissions. Notify the operator through Contact if you suspect unauthorized use.",
      ],
      [
        "Prices and estimates",
        "Available prices reflect recorded quotations and their stated dates and sources. MAO verification is an internal review and is not a government endorsement. A quotation may differ from the price available when you sell. Forecasts estimate future trends from historical records and can be inaccurate, especially when conditions change. No future price, best market, forecast accuracy, or profit is guaranteed.",
      ],
      [
        "Market comparisons and profit",
        "Recommendations rank available markets by estimated net return using quantity, verified selling prices, and estimated costs. Transportation is an estimate. Add relevant expenses and independently confirm sale conditions. Profit margin, when shown, is estimated net earnings divided by gross revenue. These tools do not execute sales or establish sales volume.",
      ],
      [
        "Uploads and branding",
        "Only upload crop photos you are authorized to use. Do not upload personal or unlawful content. AgriPrice branding and supplied materials remain subject to their owners’ rights. Using the application does not transfer those rights.",
      ],
      [
        "Availability and account access",
        "The service may be interrupted for maintenance or technical reasons. Administrators may suspend accounts for misuse, unauthorized access, or account-security concerns. Access decisions should be reviewed through the operator’s Contact channel where appropriate.",
      ],
      [
        "Changes and contact",
        "Changes to these terms should be published with an updated version date. Material changes may require renewed acknowledgment. Send inquiries through the Contact form. The operator’s legal identity, contact details, and applicable operational terms must be finalized before public launch. These terms do not claim legal enforceability in every jurisdiction.",
      ],
    ],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    sections: [
      [
        "Necessary session cookie",
        "The agriprice_refresh cookie is used to renew your authenticated session. It is HttpOnly so application JavaScript cannot read it. Production configuration uses Secure cookies over HTTPS. Its default expiry is seven days and may be configured by the operator. Token rotation replaces it when a session is renewed. Signing out clears the cookie and revokes the corresponding session family.",
      ],
      [
        "Other application state",
        "The access token exists in page memory and disappears when the page closes or reloads. Profile, language, notification, and appearance preferences are stored with your account in the database. This rebuild does not use localStorage as a database or sessionStorage for authentication.",
      ],
      [
        "Optional cookies",
        "This build does not include advertising cookies, analytics cookies, tracking scripts, or third-party embeds. It therefore does not display an optional-cookie consent banner. If optional tracking is introduced, the policy and controls must be updated before it loads where consent is required.",
      ],
      [
        "Managing cookies",
        "You can clear or block cookies through your browser settings. Blocking the necessary session cookie can prevent persistent sign-in or token renewal. Sign Out ends the application session. Notification preferences are managed separately in Settings.",
      ],
    ],
  },
};
export default function Legal({ kind }) {
  const document = content[kind];
  return (
    <div className="public-site">
      <header className="public-header">
        <div className="public-nav">
          <Brand />
          <nav>
            <Link to="/">Home</Link>
            <Link to="/#features">Features</Link>
            <Link to="/#contact">Contact</Link>
          </nav>
          <div className="public-actions">
            <Link to="/login">Sign In</Link>
            <Link className="button" to="/register">
              Create Account
            </Link>
          </div>
        </div>
      </header>
      <main className="legal-document">
        <h1>{document.title}</h1>
        <p className="muted">Version: September 11, 2026</p>
        <nav aria-label="Contents">
          <ol>
            {document.sections.map(([title], i) => (
              <li key={title}>
                <a href={`#section-${i}`}>{title}</a>
              </li>
            ))}
          </ol>
        </nav>
        {document.sections.map(([title, text], i) => (
          <section id={`section-${i}`} key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
        {kind === "privacy-policy" && (
          <p>
            References:{" "}
            <a href="https://privacy.gov.ph/data-privacy-act/">
              Data Privacy Act of 2012
            </a>{" "}
            and{" "}
            <a href="https://privacy.gov.ph/implementing-rules-regulations-data-privacy-act-2012/">
              implementing rules
            </a>
            .
          </p>
        )}
      </main>
      <footer className="public-footer">
        <Brand />
        <LegalLinks />
      </footer>
    </div>
  );
}
