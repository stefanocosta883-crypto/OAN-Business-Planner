import React, { useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { PageHeader, KpiCard, Alert, SectionCard, FormField, CostTable } from '../components/UI'
import {
  PRODUCTS_DB, calcolaColtivazione, fmtEur, fmtEurDec, fmtDec, fmt,
  type ColtivazioneResult,
} from '../lib/business'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLTURE_OPTIONS = Object.entries(PRODUCTS_DB)
  .filter(([, p]) => p.categoria === 'coltivazione')

interface Props {
  onSave: (result: ColtivazioneResult) => void
}

export default function Coltivazioni({ onSave }: Props) {
  const [mode, setMode] = useState<'mq' | 'kg'>('mq')
  const [productKey, setProductKey] = useState('')
  const [mq, setMq] = useState('')
  const [kg, setKg] = useState('')
  const [result, setResult] = useState<ColtivazioneResult | null>(null)
  const [saved, setSaved] = useState(false)

  function handleCalcola() {
    if (!productKey) { alert('Seleziona un tipo di coltura.'); return }
    const p = PRODUCTS_DB[productKey]
    let calcMq: number

    if (mode === 'mq') {
      calcMq = parseFloat(mq)
      if (!calcMq || calcMq <= 0) { alert('Inserisci una superficie valida.'); return }
    } else {
      const kgVal = parseFloat(kg)
      if (!kgVal || kgVal <= 0) { alert('Inserisci una produzione target valida.'); return }
      calcMq = kgVal / (p.yield_kg_per_sqm ?? 1)
    }

    const res = calcolaColtivazione(productKey, Math.round(calcMq))
    setResult(res)
    setSaved(false)
  }

  function handleSave() {
    if (!result) return
    onSave(result)
    setSaved(true)
  }

  const chartData = result ? {
    labels: ['Energia', 'Sementi/Input', 'Ammortamento', 'Logistica', 'Manodopera'],
    datasets: [{
      data: [
        result.costoEnergia, result.costoInput, result.costoAmmort,
        result.costoLog, result.costoMdop,
      ],
      backgroundColor: ['#3a6227','#c49020','#b85030','#1e4f7a','#6e6551'],
      borderWidth: 2, borderColor: '#fff',
    }],
  } : null

  const costRows = result ? [
    { label: '⚡ Energia / irrigazione', value: fmtEur(result.costoEnergia) },
    { label: '🌱 Sementi & input', value: fmtEur(result.costoInput) },
    { label: '🔧 Ammortamento impianto', value: fmtEur(result.costoAmmort) },
    { label: '🚚 Logistica & commerciale', value: fmtEur(result.costoLog) },
    { label: '👷 Manodopera', value: result.costoMdop > 0 ? fmtEur(result.costoMdop) : 'Familiare (€0)' },
    { label: 'TOTALE COSTI', value: fmtEur(result.costiTotali), isTotal: true },
  ] : []

  return (
    <div>
      <PageHeader
        kicker="Calcolo Business · Produzione Primaria"
        title="Simulatore"
        titleEm="Coltivazioni"
        description="Calcolo bidirezionale: inserisci i mq disponibili oppure i kg target — il sistema calcola l'altro valore automaticamente."
      />
      <div style={{ padding: '1.8rem 2.4rem' }}>

        {/* Input section */}
        <SectionCard title="Parametri di Simulazione" icon="⚙️">
          {/* Toggle */}
          <div className="toggle-group" style={{ marginBottom: '1.4rem' }}>
            <button className={`toggle-btn ${mode === 'mq' ? 'active' : ''}`} onClick={() => setMode('mq')}>
              Da mq → stima kg
            </button>
            <button className={`toggle-btn ${mode === 'kg' ? 'active' : ''}`} onClick={() => setMode('kg')}>
              Da kg → calcola mq
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.3rem', marginBottom: '1.6rem',
          }}>
            <FormField label="Tipo di Coltura">
              <select
                className="field-input"
                value={productKey}
                onChange={e => setProductKey(e.target.value)}
              >
                <option value="">— Seleziona —</option>
                {COLTURE_OPTIONS.map(([key, p]) => (
                  <option key={key} value={key}>
                    {p.emoji} {p.nome}
                  </option>
                ))}
              </select>
            </FormField>

            {mode === 'mq' ? (
              <FormField
                label="Superficie Coltivata (mq)"
                hint={productKey && PRODUCTS_DB[productKey]
                  ? `Resa attesa: ~${fmtDec((PRODUCTS_DB[productKey].yield_kg_per_sqm ?? 0) * parseFloat(mq || '0'), 0)} kg/anno`
                  : undefined}
              >
                <input
                  type="number" className="field-input"
                  placeholder="es. 500" min="0" step="100"
                  value={mq} onChange={e => setMq(e.target.value)}
                />
              </FormField>
            ) : (
              <FormField
                label="Produzione Target (kg/anno)"
                hint={productKey && PRODUCTS_DB[productKey] && kg
                  ? `Superficie necessaria: ~${fmt(parseFloat(kg) / (PRODUCTS_DB[productKey].yield_kg_per_sqm ?? 1))} mq`
                  : undefined}
              >
                <input
                  type="number" className="field-input"
                  placeholder="es. 2000" min="0" step="100"
                  value={kg} onChange={e => setKg(e.target.value)}
                />
              </FormField>
            )}
          </div>

          <button className="btn-primary" onClick={handleCalcola}>
            Calcola Profitto →
          </button>
        </SectionCard>

        {/* Results */}
        {result && (
          <div className="animate-fade-up">
            {/* KPI row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))',
              gap: '1rem', marginBottom: '1.4rem',
            }}>
              <KpiCard
                label="Ricavo Lordo" value={fmtEur(result.ricavoLordo)}
                sublabel={result.isIngrosso ? 'Mix km0 + ingrosso' : 'Vendita diretta km0'}
                variant="positive" delay={0}
              />
              <KpiCard
                label="Costi Totali" value={fmtEur(result.costiTotali)}
                sublabel="Energia + Input + Ammort + Log" delay={60}
              />
              <KpiCard
                label="Profitto Netto" value={fmtEur(result.profittoNetto)}
                sublabel={`Margine: ${fmtDec(result.marginePerc, 1)}%`}
                variant={result.profittoNetto >= 0 ? 'positive' : 'negative'} delay={120}
              />
              <KpiCard
                label="Profitto / mq" value={fmtEurDec(result.profittoPerMq)}
                sublabel="Efficienza superficiale" delay={180}
              />
              <KpiCard
                label="Produzione Stimata" value={`${fmt(result.kg)} kg`}
                sublabel={`su ${fmt(result.mq)} mq`} delay={240}
              />
            </div>

            {/* Alerts */}
            <div style={{ marginBottom: '1.4rem' }}>
              {result.profittoNetto < 0 && (
                <Alert type="danger" icon="⚠️"
                  title="Marginalità Negativa"
                  body={`Con ${fmt(result.mq)} mq il progetto genera una <strong>perdita di ${fmtEur(Math.abs(result.profittoNetto))}</strong>. Considera di aumentare la superficie o rivedere i canali di vendita.`}
                />
              )}
              {result.profittoNetto > 0 && result.marginePerc > 30 && (
                <Alert type="success" icon="🏆"
                  title="Ottima Marginalità"
                  body={`Margine netto del <strong>${fmtDec(result.marginePerc, 1)}%</strong> — performance eccellente per questa coltura.`}
                />
              )}
              {result.isIngrosso && (
                <Alert type="info" icon="📦"
                  title="Canale Ingrosso Attivato"
                  body={`Produzione sopra soglia (${fmt(result.kg)} kg). Il 40% viene valorizzato all'ingrosso (sconto 35%).`}
                />
              )}
            </div>

            {/* Charts + table */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '1.4rem', marginBottom: '1.4rem' }}>
              <SectionCard title="Incidenza Costi" icon="🍩">
                {chartData && (
                  <Doughnut
                    data={chartData}
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
                              return ` ${ctx.label}: €${fmt(ctx.parsed)} (${perc}%)`
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              </SectionCard>

              <SectionCard title="Dettaglio Costi" icon="📋">
                <CostTable rows={costRows} />
              </SectionCard>
            </div>

            {/* Save button */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button className="btn-primary" onClick={handleSave} disabled={saved}>
                {saved ? '✓ Salvato in Dashboard' : '💾 Salva in Dashboard'}
              </button>
              {saved && (
                <span style={{ fontSize: 12, color: 'var(--moss-mid)' }}>
                  Simulazione aggiunta alla Dashboard
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
