"use client";

import { useRef, useState } from 'react'
import { createClient } from '@/services/supabase/client'
import AdminsSection from './admins-section'
import CastSection from './cast-section'
import ContentSection from './content-section'
import { ADMIN_TABS } from './constants'
import EmployeesSection from './employees-section'
import PerformancesSection from './performances-section'
import ShowsSection from './shows-section'

function getActiveTabLabel(activeTab) {
  return ADMIN_TABS.find((tab) => tab.key === activeTab)?.label || 'Админ Панел'
}

export default function AdminPage() {
  const supabaseRef = useRef(null)
  const [activeTab, setActiveTab] = useState('shows')

  if (!supabaseRef.current) {
    supabaseRef.current = createClient()
  }

  const supabase = supabaseRef.current

  function handleSignOut() {
    void supabase.auth.signOut().then(() => {
      window.location.href = '/login'
    })
  }

  function renderActiveSection() {
    switch (activeTab) {
      case 'shows':
        return <ShowsSection supabase={supabase} />
      case 'employees':
        return <EmployeesSection supabase={supabase} />
      case 'performances':
        return <PerformancesSection supabase={supabase} />
      case 'cast':
        return <CastSection supabase={supabase} />
      case 'admins':
        return <AdminsSection />
      case 'content':
        return <ContentSection supabase={supabase} />
      default:
        return <ShowsSection supabase={supabase} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-theater-dark text-white selection:bg-theater-blue/30">
      <aside className="flex w-64 flex-col border-r border-white/5 bg-theater-light/50 backdrop-blur-md">
        <div className="border-b border-white/5 p-6">
          <h1 className="text-xl font-bold tracking-tight text-white">Админ Панел</h1>
          <p className="mt-1 text-xs text-gray-400">Управление на съдържанието</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`group flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-theater-blue text-white shadow-lg shadow-theater-blue/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/5 p-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Изход
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-black/20">
        <div className="mx-auto max-w-7xl p-8">
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold text-white">
              {getActiveTabLabel(activeTab)}
            </h2>
            <div className="h-1 w-12 rounded-full bg-theater-blue"></div>
          </div>

          <div className="min-h-[500px] overflow-hidden rounded-xl border border-white/5 bg-theater-light/30 shadow-2xl backdrop-blur-sm">
            {renderActiveSection()}
          </div>
        </div>
      </main>
    </div>
  )
}
