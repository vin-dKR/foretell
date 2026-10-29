import { useState } from "react";
import { ArrowUpRight, Check, ChevronRight, Trophy } from "lucide-react";
import { type Market, type Outcome } from "../../data";

// An illustrative history, not live market data.
const sampleHistory = [42, 44, 43, 48, 47, 45, 51, 53, 50, 55, 54, 58, 57, 54, 60, 62, 60, 65, 64, 66, 63, 68, 67, 71];

export function MarketPreview({ market }: { market: Market }) {
  const [side, setSide] = useState<Outcome>("yes");
  const share = market[side];
  const points = sampleHistory.map((value, index) => {
    const percentage = side === "yes" ? value : 100 - value;
    return `${8 + index * 16.6},${144 - percentage * 1.3}`;
  }).join(" ");
  const endpointY = 144 - share * 1.3;

  return (
    <div className="lp-preview-stage">
      <div className="lp-stage-label" aria-hidden="true">
        <span>01 / A QUESTION. TWO POSSIBILITIES.</span>
        <span>F — 023</span>
      </div>
      <div className="lp-ticket-frame">
        <article className={`lp-ticket lp-ticket-${side}`} aria-label="Interactive sample market">
          <header className="lp-ticket-top flex items-center justify-between">
            <span className="lp-ticket-topic"><Trophy size={14} /> Sport / Cricket</span>
            <span className="lp-sample-label">Sample market</span>
          </header>
          <div className="lp-ticket-body">
            <div className="lp-ticket-question flex items-start justify-between gap-5">
              <h2>{market.title}</h2>
              <span className="lp-market-glyph" aria-hidden="true"><Trophy size={23} strokeWidth={1.5} /></span>
            </div>
            <div className="lp-ticket-value flex items-end justify-between">
              <div aria-live="polite">
                <strong>{share}<span>%</span></strong>
                <span className="lp-share-label">{side === "yes" ? "Yes" : "No"} pool share</span>
              </div>
              <span className="lp-ticket-reference">{market.number}</span>
            </div>
            <figure className="lp-history">
              <svg viewBox="0 0 432 158" role="img" aria-label={`Illustrative ${side} pool share ending at ${share} percent`}>
                <g className="lp-chart-grid">
                  {[35, 79, 123].map((y) => <line key={y} x1="0" x2="400" y1={y} y2={y} />)}
                  {[8, 104, 200, 296, 390].map((x) => <line key={x} x1={x} x2={x} y1="10" y2="144" />)}
                </g>
                <text x="410" y="39">75</text>
                <text x="410" y="83">50</text>
                <text x="410" y="127">25</text>
                <polyline points={`8,148 ${points} 389.8,148`} className="lp-chart-area" />
                <polyline points={points} className="lp-chart-line" />
                <circle cx="389.8" cy={endpointY} r="8" className="lp-chart-halo" />
                <circle cx="389.8" cy={endpointY} r="3" className="lp-chart-point" />
              </svg>
              <figcaption><span>ILLUSTRATIVE HISTORY</span><span>CURRENT SPLIT</span></figcaption>
            </figure>
            <div className="lp-outcomes" role="group" aria-label="Choose a sample outcome">
              {(["yes", "no"] as const).map((outcome) => (
                <button
                  key={outcome}
                  type="button"
                  className={`lp-outcome lp-outcome-${outcome}`}
                  aria-pressed={side === outcome}
                  onClick={() => setSide(outcome)}
                >
                  <span className="lp-outcome-check">{side === outcome ? <Check size={12} /> : null}</span>
                  <span>{outcome === "yes" ? "Yes" : "No"}</span>
                  <strong>{market[outcome]}%</strong>
                </button>
              ))}
            </div>
            <a className="lp-button lp-button-primary lp-ticket-action" href={`/app?market=${market.id}&side=${side}`}>
              Preview {side === "yes" ? "Yes" : "No"} position <ArrowUpRight size={16} />
            </a>
          </div>
          <footer className="lp-ticket-footer flex items-center justify-between">
            <span><span className="lp-dot" /> Demo pool <strong>{market.volume}</strong></span>
            <span>{market.participants} participants <ChevronRight size={12} /></span>
          </footer>
        </article>
      </div>
      <div className="lp-stage-caption"><span>YOUR PERSPECTIVE, ON THE RECORD.</span><span>YES / NO</span></div>
    </div>
  );
}
