import React, { useMemo } from 'react'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
} from 'chart.js'
import { PageHeader, KpiCard, SectionCard } from '../components/UI'
import { PRODUCTS_DB, calcolaColtivazione, fmtEur, fmtDec, fmt } from '../lib/business'
import type { DashboardData } from '../App'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const PALETTE = ['#3a6227','#c49020','#b85030','#1e4f7a','#527a38','#8c6008','#7d3418','#6e6551']

interface Props { data: DashboardData }

export default function Dashboard({ data }: Props) {
  // Aggregate all saved simulations
  const stats = useMemo(() => {
    const coltivazioni = data.coltivazioni
    if (coltivazioni.length === 0) return null

    const totalRicavi = coltivazioni.reduce((s, c) => s + c.ricavoLordo, 0)
    const totalCosti = coltivazioni.reduce((s, c) => s + c.costiTotali, 0)
    const totalProfitto = coltivazioni.reduce((s, c) => s + c.profittoNetto, 0)
    const totalMq = coltivazioni.reduce((s, c) => s + c.mq, 0)
    const avgMargine = totalRicavi > 0 ? (totalProfitto / totalRicavi) * 100 : 0

    return { totalRicavi, totalCosti, totalProfitto, totalMq, avgMargine }
  }, [data])

  const barData = useMemo(() => {
    const items = data.coltivazioni.slice(-8)
    return {
      labels: items.map(c => c.prodotto.emoji + ' ' + c.prodotto.nome.split(' ').slice(0, 2).join(' ')),
      datasets: [
        {
          label: 'Ricavi',
          data: items.map(c => c.ricavoLordo),
          backgroundColor: '#cfe0b8',
          borderRadius: 5,
        },
        {
          label: 'Profitto',
          data: items.map(c => c.profittoNetto),
          backgroundColor: items.map(c => c.profittoNetto >= 0 ? '#3a6227' : '#b85030'),
          borderRadius: 5,
        },
      ],
    }
  }, [data])

  const doughnutData = useMemo(() => {
    const items = data.coltivazioni.slice(-6)
    return {
      labels: items.map(c => c.prodotto.emoji + ' ' + c.prodotto.nome.split(' ').slice(0, 2).join(' ')),
      datasets: [{
        data: items.map(c => Math.max(c.ricavoLordo, 0)),
        backgroundColor: PALETTE,
        borderWidth: 2,
        borderColor: '#fff',
      }],
    }
  }, [data])

  const productCount = Object.values(PRODUCTS_DB).filter(p => p.categoria === 'coltivazione').length

  return (
    <div>
      <PageHeader
        kicker="Dashboard · Panoramica Business"
        title="Officina Agricola"
        titleEm="Nazario"
        description="Riepilogo delle simulazioni salvate. Avvia una nuova analisi dalle sezioni Coltivazioni o Derivati."
      />
      <div style={{ padding: '1.8rem 2.4rem' }}>

        {/* Hero KPIs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '1.1rem', marginBottom: '1.8rem',
        }}>
          <KpiCard
            label="Colture Disponibili"
            value={String(productCount)}
            sublabel="Nel database prodotti"
            delay={0}
          />
          <KpiCard
            label="Simulazioni Salvate"
            value={String(data.coltivazioni.length)}
            sublabel="Coltivazioni analizzate"
            delay={60}
          />
          {stats ? (
            <>
              <KpiCard
                label="Ricavi Totali Stimati"
                value={fmtEur(stats.totalRicavi)}
                sublabel="Somma simulazioni attive"
                variant="positive"
                delay={120}
              />
              <KpiCard
                label="Profitto Netto Totale"
                value={fmtEur(stats.totalProfitto)}
                sublabel={`Margine medio: ${fmtDec(stats.avgMargine, 1)}%`}
                variant={stats.totalProfitto >= 0 ? 'positive' : 'negative'}
                delay={180}
              />
              <KpiCard
                label="Superficie Totale"
                value={`${fmt(stats.totalMq)} mq`}
                sublabel="Somma superfici simulate"
                delay={240}
              />
            </>
          ) : (
            <div className="kpi-card animate-fade-up" style={{
              gridColumn: 'span 3',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '.5rem',
              padding: '2.5rem', textAlign: 'center',
              animationDelay: '120ms',
            }}>
              <div style={{ fontSize: 36 }}>🌱</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--ink)' }}>
                Nessuna simulazione ancora
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                Vai su <strong>Coltivazioni</strong> per iniziare la prima analisi
              </div>
            </div>
          )}
        </div>

        {/* Charts row */}
        {data.coltivazioni.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '1.4rem', marginBottom: '1.6rem',
          }}>
            <SectionCard title="Contributo ai Ricavi" icon="🍩">
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { font: { family: "'Geist'", size: 11 }, color: '#6e6551', padding: 14, usePointStyle: true },
                    },
                    tooltip: {
                      callbacks: {
                        label: ctx => {
                          const total = (ctx.dataset.data as number[]).reduce((a, b) => (a ?? 0) + (b ?? 0), 0)
                          const perc = ((((ctx.parsed as number) ?? 0) / total) * 100).toFixed(1)
                          return ` ${ctx.label}: ${fmtEur(ctx.parsed)} (${perc}%)`
                        },
                      },
                    },
                  },
                }}
              />
            </SectionCard>

            <SectionCard title="Ricavi vs Profitto" icon="📊">
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
          </div>
        )}

        {/* Quick reference */}
        <SectionCard title="Catalogo Prodotti" icon="📋" subtitle="— database interno">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Prodotto</th>
                  <th>€/kg km0</th>
                  <th>kg/mq/anno</th>
                  <th>Rischio</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(PRODUCTS_DB)
                  .filter(([, p]) => p.categoria === 'coltivazione')
                  .map(([key, p]) => (
                    <tr key={key}>
                      <td style={{ textAlign: 'left' }}>
                        <strong>{p.emoji} {p.nome}</strong>
                      </td>
                      <td>{fmtDec(p.km0, 2)}</td>
                      <td>{p.yield_kg_per_sqm ?? '—'}</td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '.35rem',
                        }}>
                          {['🟢','🟡','🟠','🔴','⛔'][p.rischio - 1]}
                          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Liv. {p.rischio}</span>
                        </span>
                      </td>
                      <td style={{ textAlign: 'left', fontSize: 11, color: 'var(--muted)' }}>
                        {p.note}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

      </div>
    </div>
  )
}
