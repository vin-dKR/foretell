import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type ButtonTone = "primary" | "outline" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tone?: ButtonTone;
  icon?: LucideIcon;
}

export function Button({ children, tone = "primary", icon: Icon, className = "", ...props }: ButtonProps) {
  return (
    <button className={`button button-${tone} ${className}`} {...props}>
      {Icon ? <Icon aria-hidden="true" size={15} strokeWidth={2.1} /> : null}
      <span>{children}</span>
    </button>
  );
}

export function Panel({ title, eyebrow, action, children, className = "" }: {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`admin-card ${className}`}>
      {title || eyebrow || action ? (
        <header className="panel-header">
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? <h2>{title}</h2> : null}
          </div>
          {action}
        </header>
      ) : null}
      <div className="admin-card-content">{children}</div>
    </section>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-badge status-${tone}`}>{status}</span>;
}

export function Metric({ label, value, note, accent = "neutral" }: {
  label: string;
  value: string;
  note: string;
  accent?: "neutral" | "green" | "indigo" | "amber";
}) {
  return (
    <div className={`metric metric-${accent}`}>
      <p className="metric-label">{label}</p>
      <strong>{value}</strong>
      <span>{note}</span>
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}
