import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Code2,
  Compass,
  Menu,
  Plus,
  TrainFront,
  Trophy,
  X,
} from "lucide-react";
import { markets, type Market } from "../../data";
import { MarketPreview } from "./MarketPreview";
import "./landing.css";

const sampleMarkets = [markets[1], markets[0], markets[2]];
const categories = ["All markets", "Sport", "Local events", "Technology"];
const categoryIcons = { Sport: Trophy, "Local events": TrainFront, Technology: Code2 };
const faqs = [
  {
    question: "What is a prediction market?",
    answer: "It starts with a question about a future event. You choose Yes or No and put an amount behind your prediction. When the outcome is resolved, positions on the winning side receive a share of the market pool.",
  },
  {
    question: "What do the percentages mean?",
    answer: "They show how the sample market pool is split between Yes and No. A larger share means more of the pool is on that side; it does not guarantee that outcome.",
  },
  {
    question: "How does a market get resolved?",
    answer: "Each market has a question, a closing time, and resolution criteria. The creator records Yes or No when the result is known. The pool is shared proportionally among winning positions. A canceled market refunds positions and the creator’s seed.",
  },
  {
    question: "Can I create my own market?",
    answer: "Yes. Start with a clear question, add the criteria for resolving it, choose a closing time, and provide an initial seed amount. The seed is split between the Yes and No pools to get the market started.",
  },
  {
    question: "Does this demo use real money?",
    answer: "No. This version uses sample markets and a demo wallet. You can explore the interface and preview a position without making a payment or placing a real-money order.",
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="landing" id="top">
      <a className="lp-skip-link" href="#landing-main">Skip to content</a>
      <header className="lp-header">
        <div className="lp-container lp-header-inner flex items-center justify-between">
          <a className="lp-brand" href="/" aria-label="Foretell home">
            <span className="lp-brand-mark">F<span>.</span></span>
            <span>Foretell<span className="lp-brand-divider" /><small>PREDICTION MARKETS</small></span>
          </a>
          <nav className="lp-nav" aria-label="Main navigation">
            <a href="#markets">Markets</a>
            <a href="#how-it-works">How it works</a>
            <a href="#questions">FAQ</a>
          </nav>
          <div className="lp-header-actions flex items-center gap-5">
            <a className="lp-signin" href="/app?auth=signin">Sign in</a>
            <a className="lp-button lp-button-primary lp-header-cta" href="/app?auth=signup">Get started <ArrowUpRight size={14} /></a>
            <button
              className="lp-menu-toggle"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="landing-mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {menuOpen ? (
          <nav className="lp-mobile-nav" id="landing-mobile-menu" aria-label="Mobile navigation" onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false); }}>
            <a href="#markets" onClick={() => setMenuOpen(false)}>Markets <ArrowDown size={14} /></a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works <ArrowDown size={14} /></a>
            <a href="#questions" onClick={() => setMenuOpen(false)}>Frequently asked questions <ArrowDown size={14} /></a>
            <a href="/app?auth=signin">Sign in <ArrowUpRight size={14} /></a>
          </nav>
        ) : null}
      </header>

      <main id="landing-main">
        <section className="lp-container lp-hero" aria-labelledby="hero-title">
          <div className="lp-hero-copy">
            <a className="lp-announcement" href="/app"><span className="lp-dot" /> THE FORETELL DEMO IS OPEN <ArrowUpRight size={12} /></a>
            <h1 id="hero-title">See it coming?<br />Make <span>your call.</span></h1>
            <p className="lp-hero-description">Big match. Next launch. Tomorrow’s headline.<br className="lp-desktop-break" /> Turn what you think will happen into a Yes or No.</p>
            <div className="lp-hero-actions flex flex-wrap items-center gap-3">
              <a className="lp-button lp-button-primary lp-button-large" href="/app?view=markets">Explore markets <ArrowUpRight size={17} /></a>
              <a className="lp-button lp-button-secondary lp-button-large" href="#how-it-works">How it works <ArrowDown size={15} /></a>
            </div>
            <div className="lp-hero-note flex items-center gap-2"><Check size={13} /><span>Start with a point of view. Explore with demo funds.</span></div>
            <div className="lp-hero-footnote"><span className="lp-mini-cross" aria-hidden="true">+</span><p>A small market for the big <em>“what if?”</em></p></div>
          </div>
          <MarketPreview market={markets[1]} />
        </section>

        <div className="lp-principles-wrap">
          <div className="lp-container lp-principles">
            <div><span className="lp-mono">01 /</span><strong>Two sides. Your choice.</strong><span>Yes or No. Keep it simple.</span></div>
            <div><span className="lp-mono">02 /</span><strong>One shared pool.</strong><span>Every position adds to the market.</span></div>
            <div><span className="lp-mono">03 /</span><strong>A result that settles it.</strong><span>The winning side shares the pool.</span></div>
          </div>
        </div>

        <MarketShowcase />

        <section className="lp-how-wrap" id="how-it-works" aria-labelledby="how-title">
          <div className="lp-container lp-how">
            <div className="lp-section-heading">
              <div><p className="lp-overline">02 / FROM HUNCH TO OUTCOME</p><h2 id="how-title">Less noise.<br />More conviction.</h2></div>
              <p>You don’t need to know everything.<br />Just find a question you care about.</p>
            </div>
            <div className="lp-steps">
              <article className="lp-step">
                <div className="lp-step-top"><span>01</span><Compass size={20} strokeWidth={1.5} /></div>
                <div className="lp-step-visual lp-question-visual" aria-hidden="true"><span>WILL IT HAPPEN?</span><strong>That’s the question<span>_</span></strong></div>
                <h3>Find your question.</h3>
                <p>Explore a market, read its criteria, and check when positions close.</p>
              </article>
              <article className="lp-step">
                <div className="lp-step-top"><span>02</span><ArrowUpRight size={21} strokeWidth={1.5} /></div>
                <div className="lp-step-visual lp-choice-visual" aria-hidden="true"><span><Check size={13} /> YES</span><span>NO</span><small>MAKE YOUR CALL</small></div>
                <h3>Back your perspective.</h3>
                <p>Choose Yes or No, then decide how much of your balance to put behind it.</p>
              </article>
              <article className="lp-step">
                <div className="lp-step-top"><span>03</span><Check size={21} strokeWidth={1.5} /></div>
                <div className="lp-step-visual lp-result-visual" aria-hidden="true"><span className="lp-result-check"><Check size={17} /></span><span>THE RESULT IS IN<strong>Resolved: Yes</strong></span></div>
                <h3>Let the outcome speak.</h3>
                <p>Once resolved, winning positions receive a proportional share of the pool.</p>
              </article>
            </div>
            <div className="lp-creator-note flex items-center justify-between gap-4">
              <p><Plus size={15} /><span>Have a question of your own? <strong>Make a market for it.</strong></span></p>
              <a className="lp-text-link" href="/app?create=1">Create a market <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </section>

        <section className="lp-container lp-faq" id="questions" aria-labelledby="faq-title">
          <div className="lp-faq-heading"><p className="lp-overline">03 / THE DETAILS</p><h2 id="faq-title">Good questions.<br />Straight answers.</h2><p>A few things to know<br />before your first prediction.</p><CircleHelp size={24} strokeWidth={1.3} /></div>
          <div className="lp-faq-list">
            {faqs.map((faq) => (
              <details key={faq.question} className="lp-faq-item" name="foretell-faq">
                <summary>{faq.question}<Plus size={16} aria-hidden="true" /></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="lp-container lp-final" aria-labelledby="final-title">
          <div className="lp-final-art" aria-hidden="true"><span>YES</span><span>NO</span><i>?</i></div>
          <div><p className="lp-overline">THE NEXT MOVE IS YOURS</p><h2 id="final-title">Everyone has an opinion.<br />What’s your prediction?</h2><a className="lp-button lp-button-primary lp-button-large" href="/app?view=markets">Find your first market <ArrowUpRight size={17} /></a></div>
          <span className="lp-final-index" aria-hidden="true">F / 01</span>
        </section>
      </main>

      <footer className="lp-container lp-footer">
        <div className="lp-footer-top flex items-center justify-between gap-6">
          <a className="lp-brand" href="#top" aria-label="Foretell, back to top"><span className="lp-brand-mark">F<span>.</span></span><span>Foretell</span></a>
          <nav aria-label="Footer navigation"><a href="#markets">Markets</a><a href="#how-it-works">How it works</a><a href="#questions">FAQ</a><a href="/app">Open app <ArrowUpRight size={13} /></a></nav>
        </div>
        <div className="lp-footer-bottom flex items-center justify-between gap-4"><p>A little foresight goes a long way.</p><span><span className="lp-dot" /> DEMO EXPERIENCE · SAMPLE DATA</span></div>
      </footer>
    </div>
  );
}

function MarketShowcase() {
  const [category, setCategory] = useState("All markets");
  const visibleMarkets = sampleMarkets.filter((market) => category === "All markets" || market.category === category);

  return (
    <section className="lp-container lp-markets" id="markets" aria-labelledby="markets-title">
      <div className="lp-section-heading">
        <div><p className="lp-overline">01 / FIND YOUR EDGE</p><h2 id="markets-title">What’s on your radar?</h2><p>Different questions. Different perspectives. Pick yours.</p></div>
        <a className="lp-text-link" href="/app?view=markets">Browse all markets <ArrowUpRight size={15} /></a>
      </div>
      <div className="lp-market-toolbar">
        <div className="lp-categories" role="group" aria-label="Filter sample markets">
          {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}{item === "All markets" ? <span>{sampleMarkets.length}</span> : null}</button>)}
        </div>
        <span className="lp-market-demo-label"><span className="lp-dot" /> SAMPLE MARKETS</span>
      </div>
      <div className="lp-market-grid">
        {visibleMarkets.map((market) => <SampleMarketCard key={market.id} market={market} />)}
      </div>
      <div className="lp-market-caption"><span aria-live="polite">Showing {visibleMarkets.length} sample {visibleMarkets.length === 1 ? "market" : "markets"}</span><span>Curiosity is a good place to start. <ArrowRight size={13} /></span></div>
    </section>
  );
}

function SampleMarketCard({ market }: { market: Market }) {
  const Icon = categoryIcons[market.category as keyof typeof categoryIcons] ?? Compass;

  return (
    <article className="lp-market-card">
      <div className="lp-card-top"><span><Icon size={14} />{market.category}</span><span className={`lp-card-status ${market.status === "Closing soon" ? "lp-card-closing" : ""}`}><span className="lp-dot" />{market.status}</span></div>
      <h3><a href={`/app?market=${market.id}`}>{market.title}<ArrowUpRight size={16} aria-hidden="true" /></a></h3>
      <div className="lp-card-share"><span>Yes <strong>{market.yes}%</strong></span><span>No <strong>{market.no}%</strong></span></div>
      <div className="lp-card-meter" aria-hidden="true"><span style={{ width: `${market.yes}%` }} /></div>
      <div className="lp-card-meta"><span>Demo pool <strong>{market.volume}</strong></span><span><Clock3 size={12} />{market.expires.replace("Closes in ", "")}</span></div>
      <div className="lp-card-actions"><a href={`/app?market=${market.id}&side=yes`}>Predict Yes <ArrowUpRight size={13} /></a><a href={`/app?market=${market.id}&side=no`}>Predict No <ArrowUpRight size={13} /></a></div>
    </article>
  );
}
