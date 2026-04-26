// ═══════════════════════════════════════════════
// PRODUCTS DATABASE — Officina Agricola Nazario
// ═══════════════════════════════════════════════

export type ProductCategory = 'coltivazione' | 'derivato'

export interface Product {
  nome: string
  categoria: ProductCategory
  tipo: string
  km0: number        // €/kg o €/unità
  yield_kg_per_sqm: number | null  // null per derivati
  costoInput: number  // €/mq (coltivazioni) o €/unità (derivati)
  costoEnergia: number
  rischio: 1 | 2 | 3 | 4 | 5
  emoji: string
  note: string
}

export const PRODUCTS_DB: Record<string, Product> = {
  microgreens: {
    nome: 'Microgreens Gourmet', categoria: 'coltivazione', tipo: 'microgreens',
    km0: 80.00, yield_kg_per_sqm: 4.5, costoInput: 6.00, costoEnergia: 0.60,
    rischio: 4, emoji: '🌱', note: 'Tunnel, 12 mesi. Alto valore, alta variabilità'
  },
  ortaggiGourmet: {
    nome: 'Ortaggi Gourmet', categoria: 'coltivazione', tipo: 'ortaggi',
    km0: 5.50, yield_kg_per_sqm: 6.0, costoInput: 0.90, costoEnergia: 0.15,
    rischio: 2, emoji: '🥗', note: 'Letti 75cm × 30m'
  },
  pomodori: {
    nome: 'Pomodori Antichi Heirloom', categoria: 'coltivazione', tipo: 'ortaggi',
    km0: 4.20, yield_kg_per_sqm: 7.0, costoInput: 0.85, costoEnergia: 0.15,
    rischio: 2, emoji: '🍅', note: 'Varietà antiche, ottima marginalità'
  },
  zucchine: {
    nome: 'Zucchine', categoria: 'coltivazione', tipo: 'ortaggi',
    km0: 2.80, yield_kg_per_sqm: 8.0, costoInput: 0.80, costoEnergia: 0.15,
    rischio: 1, emoji: '🥒', note: 'Coltura stabile e affidabile'
  },
  insalate: {
    nome: 'Insalate Miste Premium (CSA)', categoria: 'coltivazione', tipo: 'ortaggi',
    km0: 6.00, yield_kg_per_sqm: 5.0, costoInput: 0.90, costoEnergia: 0.15,
    rischio: 2, emoji: '🥬', note: 'Vendita diretta CSA, prezzi stabili'
  },
  erbeOfficinali: {
    nome: 'Erbe Officinali (secche + fresche)', categoria: 'coltivazione', tipo: 'officinali',
    km0: 18.00, yield_kg_per_sqm: 1.8, costoInput: 1.80, costoEnergia: 0.20,
    rischio: 3, emoji: '🌿', note: 'Doppia valorizzazione fresco + essiccato'
  },
  piccoliFrutti: {
    nome: 'Piccoli Frutti (lamponi, more, ribes)', categoria: 'coltivazione', tipo: 'frutta',
    km0: 9.50, yield_kg_per_sqm: 2.0, costoInput: 1.30, costoEnergia: 0.18,
    rischio: 3, emoji: '🫐', note: 'Alta stagionalità, buona marginalità'
  },
  mele: {
    nome: 'Mele', categoria: 'coltivazione', tipo: 'frutta',
    km0: 2.20, yield_kg_per_sqm: 3.5, costoInput: 1.20, costoEnergia: 0.15,
    rischio: 1, emoji: '🍎', note: 'Coltura perenne stabile'
  },
  cerealiAntichi: {
    nome: 'Cereali Antichi (farro, enkir)', categoria: 'coltivazione', tipo: 'cereali',
    km0: 1.20, yield_kg_per_sqm: 0.55, costoInput: 0.55, costoEnergia: 0.10,
    rischio: 1, emoji: '🌾', note: 'Basso rischio, ottimo per ammortizzare la superficie'
  },
  uovaCompost: {
    nome: 'Uova + Compost Pollame', categoria: 'coltivazione', tipo: 'allevamento',
    km0: 0.38, yield_kg_per_sqm: 260, costoInput: 2.50, costoEnergia: 0.25,
    rischio: 2, emoji: '🥚', note: 'Resa in uova/mq recinto; compost valorizzato internamente'
  },
  pestiFreschi: {
    nome: 'Pesti Freschi', categoria: 'derivato', tipo: 'derivati',
    km0: 9.50, yield_kg_per_sqm: null, costoInput: 3.20, costoEnergia: 0.45,
    rischio: 3, emoji: '🫙', note: 'Vasetto 180g — basilico, rucola, erbe miste'
  },
  conserveSottolio: {
    nome: "Conserve Sott'olio", categoria: 'derivato', tipo: 'derivati',
    km0: 7.80, yield_kg_per_sqm: null, costoInput: 2.80, costoEnergia: 0.40,
    rischio: 2, emoji: '🫙', note: 'Vasetto 280g — pomodori, zucchine'
  },
  confetture: {
    nome: 'Confetture Varietà Antiche', categoria: 'derivato', tipo: 'derivati',
    km0: 6.80, yield_kg_per_sqm: null, costoInput: 2.20, costoEnergia: 0.40,
    rischio: 2, emoji: '🍯', note: 'Vasetto 220g — varietà antiche'
  },
  marmellate: {
    nome: 'Marmellate', categoria: 'derivato', tipo: 'derivati',
    km0: 7.20, yield_kg_per_sqm: null, costoInput: 2.40, costoEnergia: 0.40,
    rischio: 1, emoji: '🍯', note: 'Classica produzione stabile'
  },
  erbeEssiccate: {
    nome: 'Erbe Essiccate & Blend', categoria: 'derivato', tipo: 'derivati',
    km0: 14.00, yield_kg_per_sqm: null, costoInput: 4.50, costoEnergia: 0.60,
    rischio: 3, emoji: '🌿', note: 'Busta 50g — officinali essiccate'
  },
  infusiTisane: {
    nome: 'Infusi & Tisane Bio', categoria: 'derivato', tipo: 'derivati',
    km0: 8.00, yield_kg_per_sqm: null, costoInput: 2.50, costoEnergia: 0.35,
    rischio: 2, emoji: '🍵', note: 'Confezione 25 filtri'
  },
  boxRegalo: {
    nome: 'Box Regalo "San Nazario"', categoria: 'derivato', tipo: 'derivati',
    km0: 38.00, yield_kg_per_sqm: null, costoInput: 12.00, costoEnergia: 0.80,
    rischio: 3, emoji: '🎁', note: 'Box assortito premium, 4-6 prodotti'
  },
}

// ═══════════════════════════════════════════════
// BUSINESS RULES
// ═══════════════════════════════════════════════
export const RULES = {
  soglia_ingrosso: 500,       // kg sopra cui si vende anche all'ingrosso
  sconto_ingrosso: 0.65,      // 65% del prezzo km0
  quota_ingrosso: 0.40,       // 40% della produzione all'ingrosso se sopra soglia
  costo_logistica_km0: 0.08,  // 8% del ricavo km0
  costo_logistica_ing: 0.04,
  ammort_rate: 0.015,         // 1.5% del valore impianto per anno
  valore_impianto_mq: 18.00,  // €/mq
  soglia_familiare: 5000,     // mq sotto cui manodopera familiare
  costo_mdop_familiare: 0,
  costo_mdop_part_time: 12000,
  soglia_part_time: 15000,
  costo_mdop_full_time: 28000,
}

// ═══════════════════════════════════════════════
// CALCULATION ENGINE
// ═══════════════════════════════════════════════

export function calcRicavo(kg: number, prezzoKm0: number, isIngrosso: boolean) {
  let lordo: number
  let costoLog: number
  if (isIngrosso) {
    const kgKm0 = kg * (1 - RULES.quota_ingrosso)
    const kgIng = kg * RULES.quota_ingrosso
    const ricavoKm0 = kgKm0 * prezzoKm0
    const ricavoIng = kgIng * prezzoKm0 * RULES.sconto_ingrosso
    lordo = ricavoKm0 + ricavoIng
    costoLog = ricavoKm0 * RULES.costo_logistica_km0 + ricavoIng * RULES.costo_logistica_ing
  } else {
    lordo = kg * prezzoKm0
    costoLog = lordo * RULES.costo_logistica_km0
  }
  return { lordo, costoLog }
}

export function calcAmmortamento(mq: number) {
  return mq * RULES.valore_impianto_mq * RULES.ammort_rate
}

export function calcManodopera(mq: number): { costo: number; tipo: string } {
  if (mq < RULES.soglia_familiare) return { costo: 0, tipo: 'familiare' }
  if (mq < RULES.soglia_part_time) return { costo: RULES.costo_mdop_part_time, tipo: 'part-time' }
  return { costo: RULES.costo_mdop_full_time, tipo: 'full-time' }
}

export interface ColtivazioneResult {
  prodotto: Product
  mq: number
  kg: number
  ricavoLordo: number
  costoEnergia: number
  costoInput: number
  costoAmmort: number
  costoLog: number
  costoMdop: number
  costiTotali: number
  profittoNetto: number
  marginePerc: number
  profittoPerMq: number
  breakEvenMq: number
  isIngrosso: boolean
}

export function calcolaColtivazione(productKey: string, mq: number): ColtivazioneResult {
  const p = PRODUCTS_DB[productKey]
  const kg = mq * (p.yield_kg_per_sqm ?? 0)
  const isIngrosso = kg >= RULES.soglia_ingrosso
  const { lordo, costoLog } = calcRicavo(kg, p.km0, isIngrosso)
  const costoEnergia = mq * p.costoEnergia
  const costoInput = mq * p.costoInput
  const costoAmmort = calcAmmortamento(mq)
  const { costo: costoMdop } = calcManodopera(mq)
  const costiTotali = costoEnergia + costoInput + costoAmmort + costoLog + costoMdop
  const profittoNetto = lordo - costiTotali
  const marginePerc = lordo > 0 ? (profittoNetto / lordo) * 100 : 0
  const profittoPerMq = mq > 0 ? profittoNetto / mq : 0

  // Break-even: ricavi = costi => mq * resa * prezzo = mq * (costi_var) + costi_fissi
  // semplificato: BEP = costiTotali_fissi / (ricavo_per_mq - costi_var_per_mq)
  const ricavoPerMq = p.yield_kg_per_sqm! * p.km0
  const costiVarPerMq = p.costoInput + p.costoEnergia
  const costiRicorrentiPerMq = RULES.valore_impianto_mq * RULES.ammort_rate
  const marginalePerMq = ricavoPerMq - costiVarPerMq - costiRicorrentiPerMq
  const breakEvenMq = marginalePerMq > 0
    ? Math.ceil(RULES.costo_mdop_familiare / marginalePerMq)
    : 0

  return {
    prodotto: p, mq, kg, ricavoLordo: lordo,
    costoEnergia, costoInput, costoAmmort, costoLog, costoMdop,
    costiTotali, profittoNetto, marginePerc, profittoPerMq, breakEvenMq, isIngrosso
  }
}

export interface DerivatiResult {
  prodotto: Product
  unita: number
  ricavoLordo: number
  costoInputTot: number
  costoEnergiaTot: number
  costiTotali: number
  profittoNetto: number
  marginePerc: number
  roiPerc: number
}

export function calcolaDerivati(productKey: string, unita: number): DerivatiResult {
  const p = PRODUCTS_DB[productKey]
  const ricavoLordo = unita * p.km0
  const costoInputTot = unita * p.costoInput
  const costoEnergiaTot = unita * p.costoEnergia
  const costiTotali = costoInputTot + costoEnergiaTot
  const profittoNetto = ricavoLordo - costiTotali
  const marginePerc = ricavoLordo > 0 ? (profittoNetto / ricavoLordo) * 100 : 0
  const roiPerc = costiTotali > 0 ? (profittoNetto / costiTotali) * 100 : 0
  return { prodotto: p, unita, ricavoLordo, costoInputTot, costoEnergiaTot, costiTotali, profittoNetto, marginePerc, roiPerc }
}

// ═══════════════════════════════════════════════
// OPTIMIZER
// ═══════════════════════════════════════════════
export interface OptimizerRow {
  key: string
  prodotto: Product
  sup: number
  kg: number
  ricavo: number
  costiBase: number
  profitto: number
  profMq: number
}

export interface OptimizerResult {
  portfolio: OptimizerRow[]
  supTotale: number
  ricTot: number
  costiTot: number
  profTot: number
  mdopCosto: number
  mdopTipo: string
}

export function runOptimizer(supDisp: number, riskLvl: number, maxTip: number): OptimizerResult {
  const candidati = Object.entries(PRODUCTS_DB)
    .filter(([, p]) => p.categoria === 'coltivazione' && p.rischio <= riskLvl)
    .map(([key, p]) => {
      const ricavoMq = (p.yield_kg_per_sqm ?? 0) * p.km0
      const costiMq = p.costoInput + p.costoEnergia
      const profMq = ricavoMq - costiMq
      return { key, p, profMq }
    })
    .sort((a, b) => b.profMq - a.profMq)

  const selezionati = candidati.slice(0, Math.min(maxTip, candidati.length))
  const totProfMq = selezionati.reduce((s, c) => s + Math.max(c.profMq, 0.01), 0)

  const allocazioni = selezionati.map(c => {
    const quota = Math.max(c.profMq, 0.01) / totProfMq
    const quotaClamped = Math.min(Math.max(quota, 0.10), 0.60)
    return { ...c, quotaClamped }
  })

  const totQuote = allocazioni.reduce((s, a) => s + a.quotaClamped, 0)

  const portfolio: OptimizerRow[] = allocazioni.map(a => {
    const supAllocata = Math.round((a.quotaClamped / totQuote) * supDisp / 100) * 100
    const kg = supAllocata * (a.p.yield_kg_per_sqm ?? 0)
    const isIng = kg >= RULES.soglia_ingrosso
    const { lordo: ricavo, costoLog } = calcRicavo(kg, a.p.km0, isIng)
    const energia = supAllocata * a.p.costoEnergia
    const input = supAllocata * a.p.costoInput
    const ammort = calcAmmortamento(supAllocata)
    const costiBase = energia + input + ammort + costoLog
    const profitto = ricavo - costiBase
    return { key: a.key, prodotto: a.p, sup: supAllocata, kg, ricavo, costiBase, profitto, profMq: a.profMq }
  })

  // Fix last row rounding
  const supUsata = portfolio.reduce((s, r) => s + r.sup, 0)
  if (portfolio.length > 0 && supUsata !== supDisp) {
    portfolio[portfolio.length - 1].sup += (supDisp - supUsata)
  }

  const supTotale = portfolio.reduce((s, r) => s + r.sup, 0)
  const { costo: mdopCosto, tipo: mdopTipo } = calcManodopera(supTotale)

  let ricTot = 0, costiTot = 0
  portfolio.forEach(r => { ricTot += r.ricavo; costiTot += r.costiBase })
  costiTot += mdopCosto
  const profTot = ricTot - costiTot

  return { portfolio, supTotale, ricTot, costiTot, profTot, mdopCosto, mdopTipo }
}

// ═══════════════════════════════════════════════
// FORMATTERS
// ═══════════════════════════════════════════════
export const fmt = (n: number) =>
  new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0 }).format(n)

export const fmtDec = (n: number, d = 2) =>
  new Intl.NumberFormat('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n)

export const fmtEur = (n: number) => `€${fmt(n)}`
export const fmtEurDec = (n: number, d = 2) => `€${fmtDec(n, d)}`
