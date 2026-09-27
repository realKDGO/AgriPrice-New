import { post, errorMessage } from "../../services/api";
import { LegalLinks } from "./Legal";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  TrendingUp,
  History,
  ChartNoAxesCombined,
  Store,
  Calculator,
  FileChartColumn,
  ArrowRight,
  CheckCircle2,
  Send,
} from "lucide-react";
import { useState } from "react";
import { Brand } from "../../components/common/UI";

const features = [
  [
    TrendingUp,
    "Current crop prices",
    "See current crop prices across monitored markets.",
  ],
  [
    History,
    "Historical price records",
    "Review previous prices and understand price movement.",
  ],
  [
    ChartNoAxesCombined,
    "Price forecasting",
    "View expected price movement using historical market information.",
  ],
  [
    Store,
    "Market recommendation",
    "Compare markets using available prices and relevant costs.",
  ],
  [
    Calculator,
    "Profit estimation",
    "Estimate revenue, expenses, and potential net earnings.",
  ],
  [
    FileChartColumn,
    "Reports & analytics",
    "Review summarized market information and trends.",
  ],
];

export default function Landing() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const links = [
    ["#home", "Home"],
    ["#features", "Features"],
    ["#how-it-works", "How It Works"],
    ["#about", "About"],
    ["#contact", "Contact"],
  ];
  return (
    <div className="public-site" id="home">
      <header className="public-header">
        <div className="public-nav">
          <Brand />
          <nav>
            {links.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <div className="public-actions">
            <Link className="text-link" to="/login">
              Sign In
            </Link>
            <Link className="button" to="/register">
              Create Account
            </Link>
          </div>
          <button
            className="icon-button public-menu"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="public-drawer">
            {links.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <Link to="/login">Sign In</Link>
            <Link className="button" to="/register">
              Create Account
            </Link>
          </div>
        )}
      </header>
      <main>
        <section className="landing-hero">
          <div>
            <span className="landing-kicker">
              Crop Price &amp; Market Decision Support
            </span>
            <h1>Know the best time and place to sell your crops.</h1>
            <p>
              Access current and historical crop prices, review price forecasts,
              compare markets, and estimate potential earnings before selling.
            </p>
            <div className="hero-actions">
              <Link className="button hero-create" to="/register">
                Create Account <ArrowRight size={17} />
              </Link>
              <a className="button tertiary hero-explore" href="#features">
                Explore Features <ArrowRight size={17} />
              </a>
            </div>
          </div>
          <aside className="product-preview" aria-label="AgriPrice tools">
            <div className="preview-top">
              <span>Plan your next sale</span>
              <CheckCircle2 size={17} />
            </div>
            <div className="preview-main">
              <img src="/images/rice.jpg" alt="Rice crop" />
              <div>
                <small>Market information</small>
                <strong>Compare</strong>
                <em>Prices and estimated costs</em>
              </div>
            </div>
            <div className="preview-chart">
              <h3>Review the available information</h3>
              <p>
                Explore crop prices, historical trends, and market comparisons
                after signing in.
              </p>
            </div>
            <div className="preview-market">
              <span>Decision support</span>
              <strong>Estimate your net return</strong>
              <small>Use your quantity and expenses</small>
            </div>
          </aside>
        </section>
        <section id="features" className="landing-section">
          <div className="section-intro">
            <span className="landing-kicker">FEATURES</span>
            <h2>Everything you need to make informed selling decisions</h2>
          </div>
          <div className="feature-grid">
            {features.map(([Icon, title, text]) => (
              <article key={title}>
                <span>
                  <Icon size={22} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="how-it-works" className="landing-section how-section">
          <div className="section-intro">
            <span className="landing-kicker">HOW IT WORKS</span>
            <h2>Use information to plan your next sale</h2>
          </div>
          <div className="steps">
            {[
              [
                "01",
                "Check market prices",
                "Review current and historical crop prices.",
              ],
              [
                "02",
                "Analyze your options",
                "Use forecasting and market comparison tools to understand possible selling options.",
              ],
              [
                "03",
                "Plan your sale",
                "Estimate potential earnings and use the available information to support your selling decision.",
              ],
            ].map(([number, title, text]) => (
              <article key={number}>
                <b>{number}</b>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="about" className="landing-section about-section">
          <div>
            <span className="landing-kicker">ABOUT AGRIPRICE</span>
            <h2>Practical market information for informed farm decisions.</h2>
          </div>
          <p>
            AgriPrice is a crop price forecasting and market decision support
            system designed to make agricultural market information easier to
            access and use. It brings crop prices, historical records,
            forecasts, market comparisons, and profit estimation into one
            organized platform.
          </p>
        </section>
        <section id="contact" className="landing-section contact-section">
          <div className="contact-copy">
            <span className="landing-kicker">CONTACT / GET IN TOUCH</span>
            <h2>Have questions about AgriPrice?</h2>
            <p>Send an inquiry and the AgriPrice team will review it.</p>
            <small>Fields marked with an asterisk are required.</small>
          </div>
          {sent ? (
            <div className="contact-success">
              <CheckCircle2 size={23} />
              <div>
                <strong>Message received</strong>
                <p>Thank you for contacting AgriPrice.</p>
              </div>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={async (event) => {
                event.preventDefault();
                const form = event.currentTarget;
                setBusy(true);
                setError("");
                try {
                  await post(
                    "/contact",
                    Object.fromEntries(new FormData(form)),
                  );
                  setSent(true);
                } catch (e) {
                  setError(errorMessage(e));
                } finally {
                  setBusy(false);
                }
              }}
            >
              <label className="contact-field">
                <span>
                  Full name <b>*</b>
                </span>
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="Enter your name"
                  required
                />
              </label>
              <label className="contact-field">
                <span>
                  Email address <b>*</b>
                </span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  required
                />
              </label>
              <label className="contact-field contact-field-wide">
                <span>
                  Subject <b>*</b>
                </span>
                <input
                  name="subject"
                  placeholder="What can we help with?"
                  required
                />
              </label>
              <label className="contact-field contact-field-wide">
                <span>
                  Message <b>*</b>
                </span>
                <textarea
                  name="message"
                  minLength={10}
                  maxLength={5000}
                  placeholder="Write your message here"
                  required
                />
              </label>
              <p className="fine-print contact-field-wide">
                We use your details to review your inquiry.{" "}
                <Link to="/privacy-policy">Privacy Policy</Link>
              </p>
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <button disabled={busy} className="button" type="submit">
                {busy ? "Sending…" : "Send Message"} <Send size={17} />
              </button>
            </form>
          )}
        </section>
      </main>
      <footer className="public-footer">
        <div className="footer-brand">
          <Brand />
          <p>Crop Price Forecasting and Market Decision Support System</p>
        </div>
        <div className="footer-nav">
          <div>
            <strong>Navigation</strong>
            {links.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </div>
          <div>
            <strong>Account</strong>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Create Account</Link>
          </div>
        </div>
        <LegalLinks />
        <small>© 2026 AgriPrice. All rights reserved.</small>
      </footer>
    </div>
  );
}
