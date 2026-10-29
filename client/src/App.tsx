import { type FormEvent, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpRight,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  FilePlus2,
  Filter,
  Landmark,
  LayoutDashboard,
  LogIn,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";
import { activity, markets, navigation, type Market, type Outcome, type Page } from "./data";
import { Button, Field, Metric, Panel, StatusBadge } from "./components/ui";

type ModalName = "create" | "wager" | "funds" | "resolve" | "access" | null;

interface AppProps {
  initialSidebarCollapsed?: boolean;
  initialPage?: Page;
  initialMarketId?: string;
  initialOutcome?: Outcome;
  initialAction?: "create" | "wager" | "signin" | "signup";
}

const pageDetails: Record<Exclude<Page, "market-detail">, { tag: string; title: string; description: string }> = {
  overview: { tag: "Operations / Overview", title: "Command centre", description: "A quiet snapshot of markets, positions, and account activity." },
  markets: { tag: "Markets / Registry", title: "Market registry", description: "Browse active questions and inspect the current side distribution." },
  portfolio: { tag: "Markets / Positions", title: "My positions", description: "Review your open exposure and recently resolved orders." },
  activity: { tag: "Account / Activity", title: "Activity ledger", description: "A visual-only record of your hard-coded wallet and market activity." },
  wallet: { tag: "Account / Wallet", title: "Wallet", description: "Manage your demo market balance before connecting the API." },
};

function formatSide(side: Outcome) {
  return side === "yes" ? "Yes" : "No";
}

function App({
  initialSidebarCollapsed = false,
  initialPage = "overview",
  initialMarketId = markets[0].id,
  initialOutcome = "yes",
  initialAction,
}: AppProps) {
  const [page, setPage] = useState<Page>(initialPage);
  const [activeMarketId, setActiveMarketId] = useState(initialMarketId);
  const [modal, setModal] = useState<ModalName>(
    initialAction === "signin" || initialAction === "signup" ? "access" : initialAction ?? null,
  );
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome>(initialOutcome);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(initialSidebarCollapsed);
  const [toast, setToast] = useState<string | null>(null);

  const activeMarket = markets.find((market) => market.id === activeMarketId) ?? markets[0];
  const detail = page === "market-detail" ? {
    tag: `Markets / ${activeMarket.number}`,
    title: activeMarket.title,
    description: activeMarket.description,
  } : pageDetails[page];

  const changePage = (nextPage: Page) => {
    setPage(nextPage);
    setMobileNavOpen(false);
  };

  const showMarket = (market: Market) => {
    setActiveMarketId(market.id);
    setPage("market-detail");
  };

  const complete = (message: string) => {
    setModal(null);
    setToast(message);
  };

  const openWager = (outcome: Outcome) => {
    setSelectedOutcome(outcome);
    setModal("wager");
  };

  return (
    <div className={`app-shell ${sidebarCollapsed ? "app-shell-collapsed" : ""}`}>
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`} aria-label="Primary navigation">
        <div className="brand-row">
          <button className="brand" onClick={() => changePage("overview")} aria-label="Go to command centre">
            <span className="brand-mark">F.</span>
            <span><strong>Foretell</strong><small>Prediction Markets</small></span>
          </button>
          <button className="icon-button mobile-only" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X size={17} /></button>
        </div>

        <nav className="nav-groups">
          {navigation.map((group) => (
            <div className="nav-group" key={group.label}>
              <p className="nav-label">{group.label}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = item.label === "Sign in" ? false : page === item.page;
                return (
                  <button
                    className={`nav-item ${active ? "nav-item-active" : ""}`}
                    key={item.label}
                    title={sidebarCollapsed ? item.label : undefined}
                    onClick={() => item.label === "Sign in" ? setModal("access") : changePage(item.page)}
                  >
                    <Icon size={17} strokeWidth={1.9} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="member-card">
            <span className="avatar">VK</span>
            <span><strong>Vinod Kumar</strong><small>Demo workspace</small></span>
            <MoreHorizontal size={16} aria-hidden="true" />
          </div>
          <button
            className="collapse-control"
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!sidebarCollapsed}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
            <span>{sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
          </button>
        </div>
      </aside>
      {mobileNavOpen ? <button className="nav-backdrop" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" /> : null}

      <main className={`workspace ${sidebarCollapsed ? "workspace-expanded" : ""}`}>
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-only" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={19} /></button>
            <div className="breadcrumbs" aria-label="Breadcrumb">
              <button onClick={() => changePage("overview")}>Foretell</button>
              <ChevronRight size={14} />
              <span>{page === "market-detail" ? "Market detail" : detail.title}</span>
            </div>
          </div>
          <div className="topbar-actions">
            <span className="environment-chip"><span /> Demo environment</span>
            <button className="icon-button" aria-label="Notifications"><Bell size={17} /></button>
            <a className="help-button" href="/" aria-label="Back to Foretell home"><ArrowLeft size={15} /> Home</a>
          </div>
        </header>

        <div className="page-frame">
          <section className="page-heading">
            <div>
              <p className="eyebrow">{detail.tag}</p>
              <h1>{detail.title}</h1>
              <p className="page-description">{detail.description}</p>
            </div>
            <div className="heading-actions">
              {page === "market-detail" ? (
                <Button tone="outline" icon={ArrowLeft} onClick={() => changePage("markets")}>All markets</Button>
              ) : null}
              {page === "wallet" ? <Button tone="outline" icon={LogIn} onClick={() => setModal("access")}>Sign in</Button> : null}
              {page === "overview" || page === "markets" ? <Button icon={Plus} onClick={() => setModal("create")}>Create market</Button> : null}
              {page === "market-detail" ? <Button tone="outline" icon={SlidersHorizontal} onClick={() => setModal("resolve")}>Resolve</Button> : null}
            </div>
          </section>

          {page === "overview" ? <Overview onMarketClick={showMarket} onCreate={() => setModal("create")} onFund={() => setModal("funds")} /> : null}
          {page === "markets" ? <Markets onMarketClick={showMarket} onCreate={() => setModal("create")} /> : null}
          {page === "market-detail" ? <MarketDetail market={activeMarket} onOrder={openWager} onResolve={() => setModal("resolve")} /> : null}
          {page === "portfolio" ? <Portfolio onMarketClick={showMarket} /> : null}
          {page === "activity" ? <ActivityLedger /> : null}
          {page === "wallet" ? <Wallet onFund={() => setModal("funds")} onAccess={() => setModal("access")} /> : null}
        </div>
      </main>

      {modal === "create" ? <CreateMarketModal onClose={() => setModal(null)} onComplete={complete} /> : null}
      {modal === "wager" ? <WagerModal market={activeMarket} selectedOutcome={selectedOutcome} setSelectedOutcome={setSelectedOutcome} onClose={() => setModal(null)} onComplete={complete} /> : null}
      {modal === "funds" ? <FundsModal onClose={() => setModal(null)} onComplete={complete} /> : null}
      {modal === "resolve" ? <ResolveModal market={activeMarket} onClose={() => setModal(null)} onComplete={complete} /> : null}
      {modal === "access" ? <AccessModal initialMode={initialAction === "signup" ? "signup" : "signin"} onClose={() => setModal(null)} onComplete={complete} /> : null}
      {toast ? <div className="toast" role="status"><Check size={16} /><span>{toast}</span><button onClick={() => setToast(null)} aria-label="Dismiss notification"><X size={15} /></button></div> : null}
    </div>
  );
}

function Overview({ onMarketClick, onCreate, onFund }: { onMarketClick: (market: Market) => void; onCreate: () => void; onFund: () => void }) {
  return <>
    <div className="metric-strip">
      <Metric label="Wallet balance" value="₹2,480.50" note="Demo credit available" accent="green" />
      <Metric label="Open positions" value="06" note="Across 4 markets" accent="indigo" />
      <Metric label="Active markets" value="24" note="3 closing today" />
      <Metric label="Settled return" value="+₹1,826" note="Last 30 days" accent="amber" />
    </div>
    <div className="dashboard-grid">
      <Panel eyebrow="01 / Market activity" title="Markets requiring attention" action={<button className="text-action" onClick={() => onMarketClick(markets[0])}>View registry <ArrowUpRight size={14} /></button>}>
        <div className="market-list">
          {markets.slice(0, 3).map((market) => <MarketRow market={market} key={market.id} onClick={() => onMarketClick(market)} />)}
        </div>
      </Panel>
      <Panel eyebrow="02 / Wallet" title="Available balance" action={<WalletCards size={17} className="muted-icon" />}>
        <div className="wallet-summary">
          <div><span className="wallet-number">₹2,480.50</span><span className="available-tag">Available</span></div>
          <p>Use this hard-coded wallet state to wire your add-balance endpoint later.</p>
          <div className="wallet-actions"><Button icon={Plus} onClick={onFund}>Add demo funds</Button><Button tone="outline" icon={ArrowDownToLine}>View ledger</Button></div>
        </div>
      </Panel>
    </div>
    <div className="dashboard-grid dashboard-bottom">
      <Panel eyebrow="03 / Position exposure" title="Current exposure" action={<StatusBadge status="Demo data" />}>
        <div className="exposure-stack">
          <ExposureRow title="Bengaluru Metro before 11 AM" side="Yes" amount="₹250" chance="62%" width={62} />
          <ExposureRow title="India wins next ODI series" side="Yes" amount="₹400" chance="71%" width={71} />
          <ExposureRow title="Mobile app launches in October" side="No" amount="₹150" chance="55%" width={55} />
        </div>
      </Panel>
      <Panel eyebrow="04 / Quick action" title="Create a prediction market">
        <div className="quick-action"><span className="quick-icon"><FilePlus2 size={19} /></span><div><strong>Start a new question</strong><p>Set a close date, seed amount, and concise resolution criteria.</p></div><Button onClick={onCreate}>Create market</Button></div>
      </Panel>
    </div>
  </>;
}

function Markets({ onMarketClick, onCreate }: { onMarketClick: (market: Market) => void; onCreate: () => void }) {
  return <>
    <div className="toolbar"><div className="search-box"><Search size={17} /><input aria-label="Search markets" placeholder="Search markets by title, category, or ID…" /></div><div className="toolbar-actions"><Button tone="outline" icon={Filter}>Filters</Button><Button tone="outline" icon={SlidersHorizontal}>Open only</Button><Button icon={Plus} onClick={onCreate}>Create market</Button></div></div>
    <Panel eyebrow="Registry" title="All markets" action={<span className="result-count">24 total</span>}>
      <div className="table-scroll"><table className="data-table"><thead><tr><th>Market</th><th>Status</th><th>Distribution</th><th>Volume</th><th>Closes</th><th aria-label="Actions" /></tr></thead><tbody>{markets.map((market) => <tr key={market.id} onClick={() => onMarketClick(market)} className="clickable-row"><td><div className="market-cell"><span className="market-index">{market.number.slice(-2)}</span><span><strong>{market.title}</strong><small>{market.category} · {market.participants} participants</small></span></div></td><td><StatusBadge status={market.status} /></td><td><OutcomeMeter yes={market.yes} no={market.no} compact /></td><td className="numeric">{market.volume}</td><td className="muted-cell">{market.expires}</td><td><button className="row-action" aria-label={`Open ${market.title}`}><ChevronRight size={17} /></button></td></tr>)}</tbody></table></div>
    </Panel>
  </>;
}

function MarketDetail({ market, onOrder, onResolve }: { market: Market; onOrder: (side: Outcome) => void; onResolve: () => void }) {
  return <>
    <div className="market-detail-layout">
      <div className="detail-main">
        <Panel eyebrow={`${market.number} / ${market.category}`} title="Market context" action={<StatusBadge status={market.status} />}>
          <div className="rule-block"><p>{market.description}</p><div className="rule-meta"><span><Clock3 size={15} /> {market.expires}</span><span><Landmark size={15} /> {market.participants} participants</span><span><TrendingUp size={15} /> {market.volume} volume</span></div></div>
        </Panel>
        <Panel eyebrow="Current distribution" title="Where the market stands">
          <div className="large-meter"><OutcomeMeter yes={market.yes} no={market.no} /><div className="meter-legend"><span><i className="yes-dot" /> Yes pool <strong>₹11,420</strong></span><span><i className="no-dot" /> No pool <strong>₹7,000</strong></span></div></div>
        </Panel>
        <Panel eyebrow="Resolution criteria" title="How this market resolves">
          <div className="criteria"><span className="criteria-icon"><ShieldCheck size={18} /></span><p>This preview keeps the rules visible near the action. Connect your creator-only resolve endpoint and an evidence source here later.</p></div>
        </Panel>
      </div>
      <aside className="order-panel admin-card"><div className="panel-header"><div><p className="eyebrow">Order ticket</p><h2>Take a position</h2></div><span className="secure-label"><ShieldCheck size={14} /> Local preview</span></div><div className="admin-card-content"><p className="order-copy">Pick the outcome you believe will resolve true. No backend request is sent in this version.</p><div className="side-buttons"><button className="side-button side-yes" onClick={() => onOrder("yes")}><span>Yes</span><strong>{market.yes}¢</strong><small>Implied chance</small></button><button className="side-button side-no" onClick={() => onOrder("no")}><span>No</span><strong>{market.no}¢</strong><small>Implied chance</small></button></div><div className="ticket-summary"><span>Available balance</span><strong>₹2,480.50</strong></div><Button className="ticket-full" icon={ArrowUpRight} onClick={() => onOrder("yes")}>Place a position</Button><button className="resolve-link" onClick={onResolve}>Market owner? Resolve this market <ChevronRight size={14} /></button></div></aside>
    </div>
  </>;
}

function Portfolio({ onMarketClick }: { onMarketClick: (market: Market) => void }) {
  return <>
    <div className="metric-strip"><Metric label="Total exposure" value="₹800.00" note="Across 3 open markets" accent="amber" /><Metric label="Potential return" value="₹1,986.40" note="If all positions resolve" accent="green" /><Metric label="Resolved P/L" value="+₹1,826.50" note="All time demo figure" accent="indigo" /></div>
    <Panel eyebrow="Open positions" title="Your active exposure" action={<StatusBadge status="3 active" />}><div className="table-scroll"><table className="data-table"><thead><tr><th>Market</th><th>Position</th><th>Order amount</th><th>Current chance</th><th>Potential payout</th><th /></tr></thead><tbody>{markets.slice(0, 3).map((market, index) => { const side: Outcome = index === 2 ? "no" : "yes"; return <tr className="clickable-row" key={market.id} onClick={() => onMarketClick(market)}><td><strong>{market.title}</strong><small>{market.number} · {market.expires}</small></td><td><span className={`side-label ${side}`}>{formatSide(side)}</span></td><td className="numeric">₹{index === 0 ? "250" : index === 1 ? "400" : "150"}.00</td><td className="numeric">{side === "yes" ? market.yes : market.no}%</td><td className="numeric positive">₹{index === 0 ? "403.22" : index === 1 ? "563.18" : "270.00"}</td><td><ChevronRight size={17} /></td></tr>; })}</tbody></table></div></Panel>
  </>;
}

function ActivityLedger() {
  return <Panel eyebrow="Wallet and orders" title="Transaction ledger" action={<div className="toolbar-actions"><Button tone="outline" icon={Filter}>Filters</Button><Button tone="outline" icon={CreditCard}>Export</Button></div>}><div className="table-scroll"><table className="data-table"><thead><tr><th>Reference</th><th>Activity</th><th>Type</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead><tbody>{activity.map((entry) => <tr key={entry.id}><td className="reference">{entry.id}</td><td><strong>{entry.item}</strong></td><td className="muted-cell">{entry.type}</td><td className={`numeric ${entry.amount.startsWith("+") ? "positive" : ""}`}>{entry.amount}</td><td className="muted-cell">{entry.date}</td><td><StatusBadge status={entry.state} /></td></tr>)}</tbody></table></div></Panel>;
}

function Wallet({ onFund, onAccess }: { onFund: () => void; onAccess: () => void }) {
  return <div className="wallet-page"><Panel eyebrow="Demo balance" title="Wallet overview" action={<StatusBadge status="Sandbox" />}><div className="wallet-overview"><div><p className="wallet-number">₹2,480.50</p><span>Available to place positions</span></div><div className="wallet-overview-actions"><Button icon={Plus} onClick={onFund}>Add demo funds</Button><Button tone="outline" icon={LogIn} onClick={onAccess}>Sign in</Button></div></div><div className="wallet-breakdown"><span><small>Funds in positions</small><strong>₹800.00</strong></span><span><small>Resolved return</small><strong className="positive">+₹1,826.50</strong></span><span><small>Markets created</small><strong>02</strong></span></div></Panel><Panel eyebrow="Important" title="Wire this when you are ready"><div className="notice"><Sparkles size={18} /><p>This button is deliberately a local preview. Connect it to <code>/api/user/add-balance</code> only after you add a real balance and transaction ledger flow.</p></div></Panel></div>;
}

function MarketRow({ market, onClick }: { market: Market; onClick: () => void }) {
  return <button className="market-row" onClick={onClick}><span className="market-index">{market.number.slice(-2)}</span><span className="market-row-content"><span className="market-row-title"><strong>{market.title}</strong><StatusBadge status={market.status} /></span><small>{market.category} · {market.volume} volume · {market.expires}</small><OutcomeMeter yes={market.yes} no={market.no} compact /></span><ChevronRight size={17} className="muted-icon" /></button>;
}

function OutcomeMeter({ yes, no, compact = false }: { yes: number; no: number; compact?: boolean }) {
  return <div className={`outcome-meter ${compact ? "outcome-meter-compact" : ""}`}><div className="meter-values"><span>Yes <strong>{yes}%</strong></span><span>No <strong>{no}%</strong></span></div><div className="meter-track"><span style={{ width: `${yes}%` }} /></div></div>;
}

function ExposureRow({ title, side, amount, chance, width }: { title: string; side: string; amount: string; chance: string; width: number }) {
  return <div className="exposure-row"><div><strong>{title}</strong><span>{side} · {amount} order</span></div><div className="exposure-bar"><span style={{ width: `${width}%` }} /></div><strong>{chance}</strong></div>;
}

function ModalFrame({ title, eyebrow, children, onClose }: { title: string; eyebrow: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="modal-layer" role="presentation"><button className="modal-backdrop" onClick={onClose} aria-label="Close dialog" /><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header className="modal-header"><div><p className="eyebrow">{eyebrow}</p><h2 id="modal-title">{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></header>{children}</section></div>;
}

function CreateMarketModal({ onClose, onComplete }: { onClose: () => void; onComplete: (message: string) => void }) {
  const submit = (event: FormEvent) => { event.preventDefault(); onComplete("Market draft created locally — ready to connect your create endpoint."); };
  return <ModalFrame eyebrow="Market / Create" title="Create a market" onClose={onClose}><form className="modal-body form-grid" onSubmit={submit}><Field label="Market question"><input autoFocus required defaultValue="Will Bengaluru Metro reach Whitefield before 11 AM?" /></Field><Field label="Resolution criteria"><textarea required defaultValue="Resolves Yes if the first train reaches Whitefield (Kadugodi) before 11:00 AM IST on Friday." /></Field><div className="form-columns"><Field label="Close date and time"><input required type="datetime-local" defaultValue="2026-10-30T11:00" /></Field><Field label="Initial seed amount"><div className="input-prefix"><span>₹</span><input required type="number" min="10" defaultValue="100" /></div></Field></div><div className="form-note"><ShieldCheck size={15} /> Visual preview only. Submitting never calls the backend.</div><div className="modal-actions"><Button type="button" tone="outline" onClick={onClose}>Cancel</Button><Button type="submit" icon={Plus}>Create local draft</Button></div></form></ModalFrame>;
}

function WagerModal({ market, selectedOutcome, setSelectedOutcome, onClose, onComplete }: { market: Market; selectedOutcome: Outcome; setSelectedOutcome: (outcome: Outcome) => void; onClose: () => void; onComplete: (message: string) => void }) {
  const submit = (event: FormEvent) => { event.preventDefault(); onComplete(`${formatSide(selectedOutcome)} position previewed for ${market.number}.`); };
  return <ModalFrame eyebrow={`Order / ${market.number}`} title="Place a position" onClose={onClose}><form className="modal-body form-grid" onSubmit={submit}><div className="market-preview"><small>{market.category}</small><strong>{market.title}</strong></div><div className="outcome-toggle"><button className={selectedOutcome === "yes" ? "selected yes" : ""} type="button" onClick={() => setSelectedOutcome("yes")}>Yes <strong>{market.yes}¢</strong></button><button className={selectedOutcome === "no" ? "selected no" : ""} type="button" onClick={() => setSelectedOutcome("no")}>No <strong>{market.no}¢</strong></button></div><Field label="Amount to spend"><div className="input-prefix"><span>₹</span><input autoFocus required type="number" min="1" defaultValue="250" /></div><small>Available demo balance: ₹2,480.50</small></Field><div className="quote-box"><span>Selected outcome</span><strong>{formatSide(selectedOutcome)} at {selectedOutcome === "yes" ? market.yes : market.no}¢</strong><span>Estimated payout</span><strong>₹403.22</strong></div><div className="modal-actions"><Button type="button" tone="outline" onClick={onClose}>Cancel</Button><Button type="submit" icon={ArrowUpRight}>Place local order</Button></div></form></ModalFrame>;
}

function FundsModal({ onClose, onComplete }: { onClose: () => void; onComplete: (message: string) => void }) {
  const submit = (event: FormEvent) => { event.preventDefault(); onComplete("Demo funds added visually. No wallet balance was changed on the server."); };
  return <ModalFrame eyebrow="Wallet / Credit" title="Add demo funds" onClose={onClose}><form className="modal-body form-grid" onSubmit={submit}><div className="notice"><Sparkles size={18} /><p>This is deliberately hard-coded. It mirrors the add-balance form but will not make a request.</p></div><Field label="Amount"><div className="input-prefix"><span>₹</span><input autoFocus required type="number" min="1" defaultValue="500" /></div></Field><div className="modal-actions"><Button type="button" tone="outline" onClick={onClose}>Cancel</Button><Button type="submit" icon={Plus}>Add demo funds</Button></div></form></ModalFrame>;
}

function ResolveModal({ market, onClose, onComplete }: { market: Market; onClose: () => void; onComplete: (message: string) => void }) {
  const [resolution, setResolution] = useState<"yes" | "no" | "canceled">("yes");
  const submit = (event: FormEvent) => { event.preventDefault(); onComplete(`${market.number} marked ${resolution.toUpperCase()} in local preview.`); };
  return <ModalFrame eyebrow={`Owner action / ${market.number}`} title="Resolve market" onClose={onClose}><form className="modal-body form-grid" onSubmit={submit}><div className="notice"><ShieldCheck size={18} /><p>In the real app this should be restricted to the market creator after closure. This screen is only the UI shell.</p></div><div className="resolution-options">{(["yes", "no", "canceled"] as const).map((option) => <button type="button" className={resolution === option ? "resolution-selected" : ""} key={option} onClick={() => setResolution(option)}><span>{option === "canceled" ? "Cancel & refund" : `Resolve ${option.toUpperCase()}`}</span>{resolution === option ? <Check size={16} /> : null}</button>)}</div><div className="modal-actions"><Button type="button" tone="outline" onClick={onClose}>Cancel</Button><Button type="submit" tone={resolution === "canceled" ? "danger" : "primary"}>{resolution === "canceled" ? "Preview cancellation" : "Preview resolution"}</Button></div></form></ModalFrame>;
}

function AccessModal({ initialMode = "signin", onClose, onComplete }: { initialMode?: "signin" | "signup"; onClose: () => void; onComplete: (message: string) => void }) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const submit = (event: FormEvent) => { event.preventDefault(); onComplete(mode === "signin" ? "Sign-in UI submitted locally." : "Account creation UI submitted locally."); };
  return <ModalFrame eyebrow="Account / Access" title={mode === "signin" ? "Sign in" : "Create account"} onClose={onClose}><form className="modal-body form-grid" onSubmit={submit}><div className="auth-tabs"><button type="button" className={mode === "signin" ? "auth-tab-active" : ""} onClick={() => setMode("signin")}>Sign in</button><button type="button" className={mode === "signup" ? "auth-tab-active" : ""} onClick={() => setMode("signup")}>Create account</button></div>{mode === "signup" ? <Field label="Name"><input required placeholder="Vinod Kumar" /></Field> : null}<Field label="Email"><input required type="email" placeholder="you@example.com" /></Field><Field label="Password"><input required type="password" minLength={8} placeholder="At least 8 characters" /></Field><div className="form-note"><ShieldCheck size={15} /> This form is presentation-only. Wire it to your auth endpoints later.</div><div className="modal-actions"><Button type="button" tone="outline" onClick={onClose}>Cancel</Button><Button type="submit" icon={mode === "signin" ? LogIn : Plus}>{mode === "signin" ? "Sign in locally" : "Create local account"}</Button></div></form></ModalFrame>;
}

export default App;
