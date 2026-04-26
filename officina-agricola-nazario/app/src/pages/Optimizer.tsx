import React, { useState } from 'react'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, ArcElement, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend,
} from 'chart.js'
import { PageHeader, Alert, SectionCard, FormField } from '../components/UI'
import {
  runOptimizer, fmtEur, fmtEurDec, fmtDec, fmt,
  type OptimizerResult,
} from '../lib/business'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const PALETTE = ['#3a6227','#c49020','#b85030','#1e4f7a','#527a38','#8c6008','#7d3418','#6e6551']

const RISK_CONFIG: Record<number, { label: string; emoji: string; color: string }> = {
  1: { label: 'Minimo',    emoji: '🟢', color: '#3a6227' },
  2: { label: 'Basso',     emoji: '🟡', color: '#527a38' },
  3: { label: 'Moderato',  emoji: '🟠', color: '#c49020' },
  4: { label: 'Alto',      emoji: '🔴', color: '#b85030' },
  5: { label: 'Massimo',   emoji: '⛔', color: '#7d3418' },
}

export default function Optimizer() {
  const [superficie, setSuperficie] = useState('')
  const [riskLvl, setRiskLvl] = useState(3)
  const [maxTip, setMaxTip] = useState(5)
  const [result, setResult] = useState<OptimizerResult | null>(null)

  function handleOptimize() {
    const sup = parseFloat(superficie)
    if (!sup || sup <= 0) { alert('Inserisci la superficie disponibile.'); return }
    setResult(runOptimizer(sup, riskLvl, maxTip))
  }

  const labels = result?.portfolio.map(r => r.prodotto.emoji + ' ' + r.prodotto.nome.split(' ').slice(0, 2).join(' ')) ?? []

  const doughnutData = result ? {
    labels,
    datasets: [{
      data: result.portfolio.map(r => r.sup),
      backgroundColor: PALETTE,
      borderWidth: 2, borderColor: '#fff',
    }],
  } : null

  const barData = result ? {
    labels,
    datasets: [{
      label: 'Profitto (€)',
      data: result.portfolio.map(r => r.profitto),
      backgroundColor: result.portfolio.map((r, i) => r.profitto >= 0 ? PALETTE[i % PALETTE.length] : '#b85030'),
      borderRadius: 6,
    }],
  } : null

  return (
    <div>
      <PageHeader
        kicker="Algoritmo di Ottimizzazione · Portfolio Colture"
        title="Portfolio"
        titleEm="Optimizer"
        description="Inserisci la superficie disponibile e il tuo profilo di rischio: l'algoritmo calcola la combinazione ottimale di colture per massimizzare il profitto."
      />
      <div style={{ padding: '1.8rem 2.4rem' }}>

        {/* Input */}
        <SectionCard title="Parametri Ottimizzatore" icon="⚡" style={{
          background: 'linear-gradient(135deg, var(--cream) 0%, #fff 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <span style={{
            position: 'absolute', right: '1.8rem', top: '1.2rem',
            fontSize: 55, opacity: .06, pointerEvents: 'none',
          }}>⚡</span>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.3rem', marginBottom: '1.6rem',
          }}>
            <FormField label="Superficie Disponibile (mq)" hint="Superficie totale da ottimizzare">
              <input
                type="number" className="field-input"
                placeholder="es. 2000" min="100" step="100"
                value={superficie} onChange={e => setSuperficie(e.target.value)}
              />
            </FormField>

            <FormField label="Profilo di Rischio">
              <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 5].map(lvl => {
                  const cfg = RISK_CONFIG[lvl]
                  const isActive = riskLvl === lvl
                  return (
                    <button
                      key={lvl}
                      onClick={() => setRiskLvl(lvl)}
                      style={{
                        padding: '.45rem .75rem',
                        borderRadius: 7,
                        border: `1.5px solid ${isActive ? cfg.color : 'var(--border)'}`,
                        background: isActive ? cfg.color : 'var(--cream)',
                        color: isActive ? '#fff' : 'var(--muted)',
                        fontSize: 12, fontWeight: isActive ? 600 : 400,
                        cursor: 'pointer', transition: 'all .14s',
                        display: 'flex', alignItems: 'center', gap: '.3rem',
                      }}
                    >
                      {cfg.emoji} {cfg.label}
                    </button>
                  )
                })}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: '.4rem' }}>
                Seleziona rischio massimo accettabile (include tutti i livelli ≤)
              </div>
            </FormField>

            <FormField label="Max Tipologie di Colture" hint="Numero massimo di prodotti nel portfolio">
              <input
                type="range" min="2" max="8" step="1"
                value={maxTip} onChange={e => setMaxTip(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--moss)' }}
              />
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 11, color: 'var(--muted)', marginTop: '.3rem',
              }}>
                <span>2 (focalizzato)</span>
                <span style={{ fontWeight: 600, color: 'var(--moss)' }}>{maxTip} colture</span>
                <span>8 (diversificato)</span>
              </div>
            </FormField>
          </div>

          <button className="btn-primary" onClick={handleOptimize}>
            ⚡ Ottimizza Portfolio →
          </button>
        </SectionCard>

        {result && (
          <div className="animate-fade-up">
            {/* Alert header */}
            <div style={{ marginBottom: '1.4rem' }}>
              <Alert
                type="info"
                icon={RISK_CONFIG[riskLvl].emoji}
                title={`Profilo ${RISK_CONFIG[riskLvl].label} — ${result.portfolio.length} colture selezionate`}
                body={`L'algoritmo ha selezionato le colture con rischio ≤ ${riskLvl} e le ha ponderate per profitto/mq.${result.mdopCosto > 0 ? ` <strong>Manodopera (${result.mdopTipo}) inclusa: ${fmtEur(result.mdopCosto)}</strong>` : ''}`}
              />
            </div>

            {/* KPI strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem', marginBottom: '1.6rem',
            }}>
              {[
                { label: 'Superficie Allocata', value: `${fmt(result.supTotale)} mq` },
                { label: 'Ricavi Annui', value: fmtEur(result.ricTot), color: 'var(--moss-mid)' },
                { label: 'Costi Totali', value: fmtEur(result.costiTot) },
                { label: 'Profitto Netto', value: fmtEur(result.profTot), color: result.profTot >= 0 ? 'var(--moss-mid)' : 'var(--terra)' },
                { label: '€/mq Medio', value: fmtEurDec(result.supTotale > 0 ? result.profTot / result.supTotale : 0) },
                { label: 'Margine Netto', value: `${fmtDec(result.ricTot > 0 ? (result.profTot / result.ricTot) * 100 : 0, 1)}%` },
              ].map((k, i) => (
                <div key={i} className="kpi-card">
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 8.5, letterSpacing: '.13em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem' }}>
                    {k.label}
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '1.55rem', fontWeight: 600, color: k.color ?? 'var(--ink)' }}>
                    {k.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.4rem', marginBottom: '1.4rem' }}>
              <SectionCard title="Allocazione Superficie Ottimale" icon="🍩">
                {doughnutData && (
                  <Doughnut
                    data={doughnutData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { font: { family: "'Geist'", size: 11 }, color: '#6e6551', padding: 12, usePointStyle: true },
                        },
                        tooltip: {
                          callbacks: {
                            label: ctx => {
                              const total = (ctx.dataset.data as number[]).reduce((a, b) => (a ?? 0) + (b ?? 0), 0)
                              const perc = total > 0 ? ((((ctx.parsed as number) ?? 0) / total) * 100).toFixed(1) : '0'
                              return ` ${ctx.label}: ${fmt(ctx.parsed)} mq (${perc}%)`
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              </SectionCard>

              <SectionCard title="Contributo al Profitto" icon="📊">
                {barData && (
                  <Bar
                    data={barData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: ctx => ` €${fmt(Number(ctx.parsed.y ?? 0))}` } },
                      },
                      scales: {
                        y: { ticks: { callback: (v: unknown) => '€' + fmt(Number(v)) } },
                      },
                    }}
                  />
                )}
              </SectionCard>
            </div>

            {/* Detail table */}
            <SectionCard title="Piano Portfolio Ottimizzato" icon="📋">
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Coltura</th>
                      <th>Rischio</th>
                      <th>mq allocati</th>
                      <th>kg stimati</th>
                      <th>Ricavi</th>
                      <th>Costi</th>
                      <th>Profitto</th>
                      <th>€/mq</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.portfolio.map((r, i) => {
                      const pmq = r.sup > 0 ? r.profitto / r.sup : 0
                      const rc = RISK_CONFIG[r.prodotto.rischio]
                      return (
                        <tr key={i}>
                          <td style={{ textAlign: 'left' }}>
                            <strong>{r.prodotto.emoji} {r.prodotto.nome}</strong>
                          </td>
                          <td>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem' }}>
                              <span style={{ width: 8, height: 8, borderRadius: '50%', background: rc.color, display: 'inline-block' }} />
                              {rc.emoji} {rc.label}
                            </span>
                          </td>
                          <td>{fmt(r.sup)}</td>
                          <td>{fmt(r.kg)}</td>
                          <td>{fmtEur(r.ricavo)}</td>
                          <td>{fmtEur(r.costiBase)}</td>
                          <td className={r.profitto >= 0 ? 'profit-pos' : 'profit-neg'}>
                            {fmtEur(r.profitto)}
                          </td>
                          <td>{fmtEurDec(pmq)}</td>
                        </tr>
                      )
                    })}
                    <tr className="total-row">
                      <td style={{ textAlign: 'left' }} colSpan={2}>
                        TOTALE (man. {result.mdopTipo}{result.mdopCosto > 0 ? `: ${fmtEur(result.mdopCosto)}` : ': —'})
                      </td>
                      <td>{fmt(result.supTotale)}</td>
                      <td>—</td>
                      <td>{fmtEur(result.ricTot)}</td>
                      <td>{fmtEur(result.costiTot)}</td>
                      <td className={result.profTot >= 0 ? 'profit-pos' : 'profit-neg'}>
                        {fmtEur(result.profTot)}
                      </td>
                      <td>{fmtEurDec(result.supTotale > 0 ? result.profTot / result.supTotale : 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Bottom alerts */}
            <div style={{ marginTop: '1.2rem' }}>
              {result.profTot >= 0 && result.portfolio.length > 0 && (() => {
                const top = [...result.portfolio].sort((a, b) => (b.profitto / b.sup) - (a.profitto / a.sup))[0]
                return (
                  <Alert type="success" icon="🏆"
                    title="Coltura Top del Portfolio"
                    body={`<strong>${top.prodotto.emoji} ${top.prodotto.nome}</strong> è la più performante con <strong>${fmtEurDec(top.sup > 0 ? top.profitto / top.sup : 0)}/mq</strong>. Considera di ampliarla se hai superficie aggiuntiva.`}
                  />
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
