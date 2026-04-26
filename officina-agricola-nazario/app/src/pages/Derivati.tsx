import React, { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend,
} from 'chart.js'
import { PageHeader, KpiCard, Alert, SectionCard, FormField, CostTable } from '../components/UI'
import {
  PRODUCTS_DB, calcolaDerivati, fmtEur, fmtDec, fmt,
  type DerivatiResult,
} from '../lib/business'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const DERIVATI_OPTIONS = Object.entries(PRODUCTS_DB)
  .filter(([, p]) => p.categoria === 'derivato')

interface Props {
  onSave: (result: DerivatiResult) => void
}

export default function Derivati({ onSave }: Props) {
  const [productKey, setProductKey] = useState('')
  const [unita, setUnita] = useState('')
  const [result, setResult] = useState<DerivatiResult | null>(null)
  const [saved, setSaved] = useState(false)

  function handleCalcola() {
    if (!productKey) { alert('Seleziona un prodotto derivato.'); return }
    const unitaVal = parseInt(unita)
    if (!unitaVal || unitaVal <= 0) { alert('Inserisci il numero di unità.'); return }
    setResult(calcolaDerivati(productKey, unitaVal))
    setSaved(false)
  }

  const barData = result ? {
    labels: ['Ricavo Lordo', 'Costi Totali', 'Profitto Netto'],
    datasets: [{
      label: '€',
      data: [result.ricavoLordo, result.costiTotali, result.profittoNetto],
      backgroundColor: ['#cfe0b8', '#f3ddd4', result.profittoNetto >= 0 ? '#3a6227' : '#b85030'],
      borderRadius: 7,
    }],
  } : null

  const costRows = result ? [
    { label: '🌿 Costo materie prime / input', value: fmtEur(result.costoInputTot) },
    { label: '⚡ Energia (trasformazione)', value: fmtEur(result.costoEnergiaTot) },
    { label: 'TOTALE COSTI', value: fmtEur(result.costiTotali), isTotal: true },
  ] : []

  return (
    <div>
      <PageHeader
        kicker="Calcolo Business · Prodotti Trasformati"
        title="Simulatore"
        titleEm="Derivati"
        description="Analisi costi-ricavi per conserve, confetture, erbe essiccate, infusi e box regalo."
      />
      <div style={{ padding: '1.8rem 2.4rem' }}>

        <SectionCard title="Parametri di Simulazione" icon="⚙️">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.3rem', marginBottom: '1.6rem',
          }}>
            <FormField label="Tipo di Prodotto Derivato">
              <select
                className="field-input"
                value={productKey}
                onChange={e => setProductKey(e.target.value)}
              >
                <option value="">— Seleziona —</option>
                {DERIVATI_OPTIONS.map(([key, p]) => (
                  <option key={key} value={key}>
                    {p.emoji} {p.nome}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Numero Unità Prodotte"
              hint={productKey && PRODUCTS_DB[productKey]
                ? `Prezzo vendita: €${fmtDec(PRODUCTS_DB[productKey].km0, 2)}/unità · Costo input: €${fmtDec(PRODUCTS_DB[productKey].costoInput, 2)}`
                : undefined}
            >
              <input
                type="number" className="field-input"
                placeholder="es. 500" min="1" step="10"
                value={unita} onChange={e => setUnita(e.target.value)}
              />
            </FormField>

            {productKey && PRODUCTS_DB[productKey] && (
              <FormField label="Note Prodotto">
                <div style={{
                  padding: '.7rem 1rem',
                  background: 'var(--gold-pale)',
                  border: '1px solid #e8c060',
                  borderRadius: 8,
                  fontSize: 12, color: 'var(--gold)',
                  lineHeight: 1.5,
                }}>
                  <strong>{PRODUCTS_DB[productKey].emoji} {PRODUCTS_DB[productKey].nome}</strong>
                  <br />
                  {PRODUCTS_DB[productKey].note}
                </div>
              </FormField>
            )}
          </div>

          <button className="btn-primary" onClick={handleCalcola}>
            Calcola Margine →
          </button>
        </SectionCard>

        {result && (
          <div className="animate-fade-up">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
              gap: '1rem', marginBottom: '1.4rem',
            }}>
              <KpiCard label="Unità Prodotte" value={fmt(result.unita)} sublabel={result.prodotto.nome} delay={0} />
              <KpiCard
                label="Ricavo Lordo" value={fmtEur(result.ricavoLordo)}
                sublabel={`€${fmtDec(result.prodotto.km0, 2)}/unità`}
                variant="positive" delay={60}
              />
              <KpiCard
                label="Costi Totali" value={fmtEur(result.costiTotali)}
                sublabel="Input + Energia" delay={120}
              />
              <KpiCard
                label="Profitto Netto" value={fmtEur(result.profittoNetto)}
                sublabel={`Margine: ${fmtDec(result.marginePerc, 1)}%`}
                variant={result.profittoNetto >= 0 ? 'positive' : 'negative'} delay={180}
              />
              <KpiCard
                label="ROI"
                value={`${fmtDec(result.roiPerc, 1)}%`}
                sublabel="Ritorno sull'investimento"
                variant={result.roiPerc > 0 ? 'gold' : 'negative'} delay={240}
              />
            </div>

            <div style={{ marginBottom: '1.4rem' }}>
              {result.profittoNetto >= 0 ? (
                <Alert type="success" icon="✅"
                  title="Operazione Redditizia"
                  body={`ROI del <strong>${fmtDec(result.roiPerc, 1)}%</strong> con margine netto <strong>${fmtDec(result.marginePerc, 1)}%</strong>. Ogni euro investito genera <strong>€${fmtDec(1 + result.roiPerc / 100, 2)}</strong>.`}
                />
              ) : (
                <Alert type="danger" icon="⚠️"
                  title="Margine Negativo"
                  body={`La trasformazione genera una perdita di <strong>${fmtEur(Math.abs(result.profittoNetto))}</strong>. Verifica i costi delle materie prime o rivedi il prezzo di vendita.`}
                />
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.4rem', marginBottom: '1.4rem' }}>
              <SectionCard title="Riepilogo Economico" icon="📊">
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

              <SectionCard title="Dettaglio Costi" icon="📋">
                <CostTable rows={costRows} />
                <div style={{
                  marginTop: '1.2rem',
                  padding: '1rem',
                  background: 'var(--cream)',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem' }}>
                    Profitto per Unità
                  </div>
                  <div style={{
                    fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: 600,
                    color: result.profittoNetto >= 0 ? 'var(--moss-mid)' : 'var(--terra)',
                  }}>
                    €{fmtDec(result.unita > 0 ? result.profittoNetto / result.unita : 0, 2)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>per unità prodotta</div>
                </div>
              </SectionCard>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button className="btn-primary" onClick={() => { onSave(result); setSaved(true) }} disabled={saved}>
                {saved ? '✓ Salvato' : '💾 Salva in Dashboard'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
