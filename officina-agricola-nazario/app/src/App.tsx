import React, { useState } from 'react'
import Sidebar, { type TabId } from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Coltivazioni from './pages/Coltivazioni'
import Derivati from './pages/Derivati'
import Mix from './pages/Mix'
import Optimizer from './pages/Optimizer'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { ColtivazioneResult, DerivatiResult } from './lib/business'

export interface DashboardData {
  coltivazioni: ColtivazioneResult[]
  derivati: DerivatiResult[]
}

const INITIAL_DATA: DashboardData = { coltivazioni: [], derivati: [] }

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [data, setData] = useLocalStorage<DashboardData>('oan_data', INITIAL_DATA)

  function saveColtivazione(result: ColtivazioneResult) {
    setData(d => ({ ...d, coltivazioni: [...d.coltivazioni, result] }))
  }

  function saveDerivato(result: DerivatiResult) {
    setData(d => ({ ...d, derivati: [...d.derivati, result] }))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 'dashboard'    && <Dashboard data={data} />}
        {activeTab === 'coltivazioni' && <Coltivazioni onSave={saveColtivazione} />}
        {activeTab === 'derivati'     && <Derivati onSave={saveDerivato} />}
        {activeTab === 'mix'          && <Mix />}
        {activeTab === 'optimizer'    && <Optimizer />}
      </main>
    </div>
  )
}
