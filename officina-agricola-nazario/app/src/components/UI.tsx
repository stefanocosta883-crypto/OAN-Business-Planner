import React from 'react'

// ── PAGE HEADER ──────────────────────────────
interface PageHeaderProps {
  kicker: string
  title: string
  titleEm?: string
  description?: string
}
export function PageHeader({ kicker, title, titleEm, description }: PageHeaderProps) {
  return (
    <div style={{
      padding: '2.4rem 2.6rem 1.8rem',
      background: 'var(--cream)',
      borderBottom: '1px solid var(--border)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', right: -60, top: -60,
        width: 260, height: 260, borderRadius: '50%',
        background: 'var(--moss-faint)', opacity: .5, pointerEvents: 'none',
      }} />
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.15em',
        textTransform: 'uppercase', color: 'var(--moss)',
        marginBottom: '.45rem', position: 'relative', zIndex: 1,
      }}>{kicker}</div>
      <h2 style={{
        fontFamily: 'var(--serif)', fontSize: '2.1rem', fontWeight: 600,
        color: 'var(--ink)', lineHeight: 1.2, position: 'relative', zIndex: 1,
      }}>
        {title}{' '}
        {titleEm && <em style={{ color: 'var(--terra)', fontStyle: 'italic' }}>{titleEm}</em>}
      </h2>
      {description && (
        <p style={{
          color: 'var(--muted)', marginTop: '.55rem',
          maxWidth: 560, fontSize: 13, position: 'relative', zIndex: 1,
        }}>{description}</p>
      )}
    </div>
  )
}

// ── KPI CARD ─────────────────────────────────
interface KpiCardProps {
  label: string
  value: string
  sublabel?: string
  variant?: 'default' | 'positive' | 'negative' | 'gold'
  delay?: number
}
export function KpiCard({ label, value, sublabel, variant = 'default', delay = 0 }: KpiCardProps) {
  const valueColor =
    variant === 'positive' ? 'var(--moss-mid)' :
    variant === 'negative' ? 'var(--terra)' :
    variant === 'gold'     ? 'var(--gold)' :
    'var(--ink)'

  return (
    <div className="kpi-card animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 8.5, letterSpacing: '.14em',
        textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.55rem',
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--serif)', fontSize: '1.85rem', fontWeight: 600,
        color: valueColor, lineHeight: 1.1, marginBottom: '.25rem',
      }}>{value}</div>
      {sublabel && (
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{sublabel}</div>
      )}
    </div>
  )
}

// ── ALERT ─────────────────────────────────────
interface AlertProps {
  type: 'success' | 'warning' | 'danger' | 'info'
  icon: string
  title: string
  body: string
}
export function Alert({ type, icon, title, body }: AlertProps) {
  return (
    <div className={`alert alert-${type}`} style={{ marginBottom: '.85rem' }}>
      <div style={{ fontSize: 18, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: '.25rem' }}>{title}</div>
        <div
          style={{ fontSize: 12, lineHeight: 1.5 }}
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    </div>
  )
}

// ── SECTION CARD ─────────────────────────────
interface SectionCardProps {
  title: string
  icon?: string
  subtitle?: string
  children: React.ReactNode
  style?: React.CSSProperties
}
export function SectionCard({ title, icon, subtitle, children, style }: SectionCardProps) {
  return (
    <div className="card" style={{ marginBottom: '1.6rem', ...style }}>
      <div style={{
        fontFamily: 'var(--serif)', fontSize: '1.15rem', fontWeight: 600,
        color: 'var(--ink)', marginBottom: '1.3rem',
        display: 'flex', alignItems: 'center', gap: '.55rem',
      }}>
        {icon && <span>{icon}</span>}
        {title}
        {subtitle && (
          <small style={{
            fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 400,
            color: 'var(--muted)', fontStyle: 'normal',
          }}>{subtitle}</small>
        )}
      </div>
      {children}
    </div>
  )
}

// ── FORM FIELD ────────────────────────────────
interface FormFieldProps {
  label: string
  hint?: string
  children: React.ReactNode
}
export function FormField({ label, hint, children }: FormFieldProps) {
  return (
    <div>
      <label style={{
        display: 'block', fontFamily: 'var(--mono)',
        fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: '.55rem',
      }}>{label}</label>
      {children}
      {hint && (
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: '.35rem' }}>{hint}</div>
      )}
    </div>
  )
}

// ── COST TABLE ────────────────────────────────
interface CostRow { label: string; value: string; isTotal?: boolean }
interface CostTableProps { rows: CostRow[] }
export function CostTable({ rows }: CostTableProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th style={{ textAlign: 'left' }}>Voce di Costo</th>
          <th>Importo</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={row.isTotal ? 'total-row' : ''}>
            <td style={{ textAlign: 'left' }}>{row.label}</td>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
