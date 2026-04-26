import React from 'react'
import logoUrl from '../assets/logo.jpg'

export type TabId = 'dashboard' | 'coltivazioni' | 'derivati' | 'mix' | 'optimizer'

interface NavItem {
  id: TabId
  label: string
  emoji: string
  badge?: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',    label: 'Dashboard',       emoji: '📊' },
  { id: 'coltivazioni', label: 'Coltivazioni',     emoji: '🥬' },
  { id: 'derivati',     label: 'Derivati',         emoji: '🫙' },
  { id: 'mix',          label: 'Mix Produttivo',   emoji: '⚖️' },
  { id: 'optimizer',    label: 'Optimizer',        emoji: '⚡', badge: 'AI' },
]

interface SidebarProps {
  activeTab: TabId
  onTabChange: (id: TabId) => void
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside
      style={{
        background: 'var(--moss)',
        width: 248,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div style={{
        padding: '1.6rem 1.3rem 1.3rem',
        borderBottom: '1px solid rgba(255,255,255,.1)',
        display: 'flex', alignItems: 'center', gap: '.9rem',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 10,
          overflow: 'hidden', flexShrink: 0,
          border: '1px solid rgba(255,255,255,.18)',
          background: 'rgba(255,255,255,.08)',
        }}>
          <img src={logoUrl} alt="OAN Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '.16em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,.38)', marginBottom: '.2rem',
          }}>Cuneese · Bio · Est. 2026</div>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 600,
            color: '#fff', lineHeight: 1.2, fontStyle: 'italic',
          }}>Officina Agricola<br />Nazario</h1>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', marginTop: '.15rem' }}>
            Agri-Planner Strategico
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '1rem 0', flex: 1 }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '.16em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,.28)',
          padding: '.8rem 1.3rem .4rem', display: 'block',
        }}>Strumenti</span>

        {NAV_ITEMS.map(item => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '.65rem',
                width: '100%', padding: '.5rem 1.3rem',
                background: isActive ? 'rgba(255,255,255,.1)' : 'none',
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--sans)', fontSize: 12,
                color: isActive ? '#fff' : 'rgba(255,255,255,.48)',
                fontWeight: isActive ? 500 : 400,
                textAlign: 'left', transition: 'all .14s',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.8)'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.06)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.48)'
                  ;(e.currentTarget as HTMLElement).style.background = 'none'
                }
              }}
            >
              {isActive && (
                <span style={{
                  position: 'absolute', left: 0, top: 6, bottom: 6,
                  width: 2.5, background: 'var(--gold-light)', borderRadius: '0 2px 2px 0',
                }} />
              )}
              <span style={{
                width: 20, height: 20, borderRadius: 5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11,
                background: isActive ? 'rgba(196,144,32,.25)' : 'rgba(255,255,255,.07)',
                flexShrink: 0,
              }}>{item.emoji}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span style={{
                  marginLeft: 'auto',
                  fontFamily: 'var(--mono)', fontSize: 8.5,
                  background: 'var(--gold-light)', color: '#fff',
                  padding: '1px 5px', borderRadius: 20, fontWeight: 500,
                }}>{item.badge}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '.9rem 1.3rem',
        borderTop: '1px solid rgba(255,255,255,.1)',
        fontSize: 10, color: 'rgba(255,255,255,.3)',
      }}>
        <span style={{
          display: 'inline-block', width: 6, height: 6,
          borderRadius: '50%', background: '#7ec85a', marginRight: '.4rem',
          verticalAlign: 'middle',
        }} />
        Sistema attivo · v1.0.0
        <br />
        <span style={{ fontSize: 9, opacity: .7 }}>San Nazario, Narzole CN</span>
      </div>
    </aside>
  )
}
