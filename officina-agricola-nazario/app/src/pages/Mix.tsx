import React, { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend,
} from 'chart.js'
import { PageHeader, Alert, SectionCard, FormField } from '../components/UI'
import {
  PRODUCTS_DB, calcolaColtivazione, fmtEur, fmtEurDec, fmtDec, fmt,
  type ColtivazioneResult,
} from '../lib/business'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const COLTURE_OPTIONS = Object.entries(PRODUCTS_DB)
  .filter(([, p]) => p.categoria === 'coltivazione')

interface MixRow {
  id: number
  productKey: string
  mq: string
}

let rowCounter = 2

export default function Mix() {
  const [rows, setRows] = useState<MixRow[]>([
    { id: 1, productKey: '', mq: '' },
    { id: 2, productKey: '', mq: '' },
  ])
  const [results, setResults] = useState<ColtivazioneResult[] | null>(null)

  function addRow() {
    rowCounter++
    setRows(r => [...r, { id: rowCounter, productKey: '', mq: '' }])
  }

  function removeRow(id: number) {
    setRows(r => r.filter(row => row.id !== id))
  }

  function updateRow(id: number, field: keyof MixRow, value: string) {
    setRows(r => r.map(row => row.id === id ? { ...row, [field]: value } : row))
  }

  function handleCalcola() {
    const valids = rows.filter(r => r.productKey && parseFloat(r.mq) > 0)
    if (valids.length === 0) {
      alert('Aggiungi almeno una coltura con superficie valida.')
      return
    }
    const res = valids.map(r => calcolaColtivazione(r.productKey, parseFloat(r.mq)))
    setResults(res)
  }

  const totalRicavi = results?.reduce((s, r) => s + r.ricavoLordo, 0) ?? 0
  const totalCosti = results?.reduce((s, r) => s + r.costiTotali, 0) ?? 0
  const totalProfitto = results?.reduce((s, r) => s + r.profittoNetto, 0) ?? 0
  const totalMq = results?.reduce((s, r) => s + r.mq, 0) ?? 0

  const barData = results ? {
    labels: results.map(r => r.prodotto.emoji + ' ' + r.prodotto.nome.split(' ').slice(0, 2).join(' ')),
    datasets: [
      {
        label: 'Ricavo',
        data: results.map(r => r.ricavoLordo),
        backgroundColor: '#cfe0b8',
        borderRadius: 5,
      },
      {
        label: 'Costi',
        data: results.map(r => r.costiTotali),
        backgroundColor: '#f3ddd4',
        borderRadius: 5,
      },
      {
        label: 'Profitto',
        data: results.map(r => r.profittoNetto),
        backgroundColor: results.map(r => r.profittoNetto >= 0 ? '#3a6227' : '#b85030'),
        borderRadius: 5,
      },
    ],
  } : null

  return (
    <div>
      <PageHeader
        kicker="Analisi Portfolio · Mix di Produzione"
        title="Mix"
        titleEm="Produttivo"
        description="Confronta più colture in parallelo per ottimizzare l'allocazione della tua superficie disponibile."
      />
      <div style={{ padding: '1.8rem 2.4rem' }}>

        <SectionCard title="Composizione del Portfolio" icon="⚖️">
          <div style={{ marginBottom: '1.4rem' }}>
            {rows.map((row, idx) => (
              <div key={row.id} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr auto',
                gap: '1rem', alignItems: 'end',
                marginBottom: '.9rem',
                padding: '1.1rem', background: 'var(--cream)',
                border: '1px solid var(--border)', borderRadius: 10,
                position: 'relative',
              }}>
                <span style={{
                  position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)',
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'var(--moss)', color: '#fff',
                  fontFamily: 'var(--mono)', fontSize: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{idx + 1}</span>

                <FormField label="Coltura">
                  <select
                    className="field-input"
                    value={row.productKey}
                    onChange={e => updateRow(row.id, 'productKey', e.target.value)}
                  >
                    <option value="">— Seleziona —</option>
                    {COLTURE_OPTIONS.map(([key, p]) => (
                      <option key={key} value={key}>{p.emoji} {p.nome}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Superficie (mq)">
                  <input
                    type="number" className="field-input"
                    placeholder="es. 200" min="0" step="50"
                    value={row.mq}
                    onChange={e => updateRow(row.id, 'mq', e.target.value)}
                  />
                </FormField>

                <button
                  style={{
                    padding: '.45rem .7rem', fontSize: 11, borderRadius: 6,
                    border: '1px solid #fca5a5', background: '#fef2f2', color: '#dc2626',
                    cursor: 'pointer', marginBottom: 1,
                  }}
                  onClick={() => removeRow(row.id)}
                >✕</button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={addRow}
              style={{
                display: 'flex', alignItems: 'center', gap: '.45rem',
                padding: '.65rem 1.3rem', background: 'none',
                border: '1.5px dashed var(--moss-pale)', borderRadius: 8,
                cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 13,
                color: 'var(--moss-mid)', transition: 'all .15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--moss-faint)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none' }}
            >
              + Aggiungi Coltura
            </button>
            <button className="btn-primary" onClick={handleCalcola}>
              Calcola Portfolio →
            </button>
          </div>
        </SectionCard>

        {results && (
          <div className="animate-fade-up">
            {/* Summary KPI strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem', marginBottom: '1.4rem',
            }}>
              {[
                { label: 'Superficie Totale', value: `${fmt(totalMq)} mq` },
                { label: 'Ricavi Totali', value: fmtEur(totalRicavi), color: 'var(--moss-mid)' },
                { label: 'Costi Totali', value: fmtEur(totalCosti) },
                { label: 'Profitto Netto', value: fmtEur(totalProfitto), color: totalProfitto >= 0 ? 'var(--moss-mid)' : 'var(--terra)' },
              ].map((k, i) => (
                <div key={i} className="kpi-card">
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 8.5, letterSpacing: '.13em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem' }}>
                    {k.label}
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '1.7rem', fontWeight: 600, color: k.color ?? 'var(--ink)' }}>
                    {k.value}
                  </div>
                </div>
              ))}
            </div>

            {totalProfitto < 0 && (
              <Alert type="warning" icon="⚠️"
                title="Portfolio in Perdita"
                body={`Il mix attuale genera una perdita netta di <strong>${fmtEur(Math.abs(totalProfitto))}</strong>. Considera di riallocare la superficie verso colture con maggiore marginalità.`}
              />
            )}

            {/* Detail table */}
            <SectionCard title="Dettaglio Portfolio" icon="📋" style={{ marginBottom: '1.4rem' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Coltura</th>
                      <th>mq</th>
                      <th>kg/anno</th>
                      <th>Ricavo</th>
                      <th>Costi</th>
                      <th>Profitto</th>
                      <th>€/mq</th>
                      <th>Margine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i}>
                        <td style={{ textAlign: 'left' }}>
                          <strong>{r.prodotto.emoji} {r.prodotto.nome}</strong>
                        </td>
                        <td>{fmt(r.mq)}</td>
                        <td>{fmt(r.kg)}</td>
                        <td>{fmtEur(r.ricavoLordo)}</td>
                        <td>{fmtEur(r.costiTotali)}</td>
                        <td className={r.profittoNetto >= 0 ? 'profit-pos' : 'profit-neg'}>
                          {fmtEur(r.profittoNetto)}
                        </td>
                        <td>{fmtEurDec(r.profittoPerMq)}</td>
                        <td>{fmtDec(r.marginePerc, 1)}%</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td style={{ textAlign: 'left' }}>TOTALE</td>
                      <td>{fmt(totalMq)}</td>
                      <td>—</td>
                      <td>{fmtEur(totalRicavi)}</td>
                      <td>{fmtEur(totalCosti)}</td>
                      <td className={totalProfitto >= 0 ? 'profit-pos' : 'profit-neg'}>
                        {fmtEur(totalProfitto)}
                      </td>
                      <td>{fmtEurDec(totalMq > 0 ? totalProfitto / totalMq : 0)}</td>
                      <td>{fmtDec(totalRicavi > 0 ? (totalProfitto / totalRicavi) * 100 : 0, 1)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Bar chart */}
            {barData && (
              <SectionCard title="Confronto Ricavo / Costi / Profitto" icon="📊">
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: { font: { family: "'Geist'", size: 11 }, color: '#6e6551' },
                      },
                      tooltip: { callbacks: { label: ctx => ` €${fmt(Number(ctx.parsed.y ?? 0))}` } },
                    },
                    scales: {
                      y: { ticks: { callback: (v: unknown) => '€' + fmt(Number(v)) } },
                    },
                  }}
                />
              </SectionCard>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
