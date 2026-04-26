# Officina Agricola Nazario — Agri-Business Planner

> San Nazario, Narzole (CN) · Est. 2026

Un'applicazione web professionale per la pianificazione e l'analisi economica del business agricolo (microgreens, ortaggi, derivati).

## Stack Tecnico

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** (design system personalizzato)
- **Chart.js** + **react-chartjs-2** (visualizzazioni)
- **localStorage** (persistenza dati lato client)

## Architettura (Monorepo)

```
officina-agricola-nazario/
├── app/                        # Frontend React + Vite
│   └── src/
│       ├── assets/             # Logo e immagini
│       ├── components/         # Componenti UI riusabili
│       │   ├── Sidebar.tsx     # Navigazione laterale
│       │   └── UI.tsx          # KpiCard, Alert, PageHeader, ...
│       ├── hooks/
│       │   └── useLocalStorage.ts
│       ├── lib/
│       │   └── business.ts     # DB prodotti + motore di calcolo
│       ├── pages/
│       │   ├── Dashboard.tsx   # KPI aggregati + grafici
│       │   ├── Coltivazioni.tsx # Simulatore produzione primaria
│       │   ├── Derivati.tsx    # Simulatore prodotti trasformati
│       │   ├── Mix.tsx         # Portfolio multi-coltura
│       │   └── Optimizer.tsx   # Ottimizzatore algoritmico
│       ├── App.tsx
│       └── main.tsx
├── docs/                       # Documentazione modello di business
└── scripts/                    # Utility
```

## Installazione e Avvio

```bash
# Dalla root del monorepo
cd app
npm install
npm run dev
```

Apri `http://localhost:5173`

## Build per Produzione

```bash
cd app
npm run build
# Output in app/dist/
```

## Funzionalità

### 📊 Dashboard
- KPI aggregati (ricavi totali, profitto netto, margine medio)
- Grafici: contributo ai ricavi (donut), ricavi vs profitto (bar)
- Catalogo prodotti con parametri tecnici

### 🥬 Coltivazioni
- Calcolo bidirezionale: da mq → stima kg / da kg → calcola mq
- Tutti i costi: energia, sementi, ammortamento impianto, logistica, manodopera
- Analisi canale ingrosso (soglia automatica)
- Break-even e marginalità
- Grafici incidenza costi

### 🫙 Derivati
- Analisi costi-ricavi per conserve, confetture, erbe, infusi, box regalo
- ROI per unità prodotta

### ⚖️ Mix Produttivo
- Portfolio multi-coltura in parallelo
- Confronto tabellare e grafico

### ⚡ Optimizer
- Algoritmo greedy ponderato per profitto/mq
- Profilo di rischio configurabile (1–5)
- Allocazione proporzionale con clamping (10%–60% per coltura)
- Manodopera automatica (familiare / part-time / full-time)

## Dati e Persistenza

Tutte le simulazioni salvate vengono memorizzate in `localStorage` sotto la chiave `oan_data`. I dati persistono tra sessioni del browser.

## Design System

Colori estratti dal file originale `agri_planner.html`:
- `--moss` / `--paper` / `--terra` / `--gold`
- Tipografia: `Cormorant Garamond` (serif) + `Geist` (sans) + `Geist Mono`

---

*Officina Agricola Nazario · San Nazario, Narzole CN*
