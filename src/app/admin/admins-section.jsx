"use client"

import { useState } from 'react'
import StatusMessage from '@/components/ui/status-message'

const inputClass =
  'w-full border border-white/10 rounded-lg p-2.5 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theater-blue/50 focus:border-theater-blue/50 transition-all'
const buttonBaseClass = 'px-4 py-2.5 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'

export default function AdminsSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)
    const res = await fetch('/api/admin/make-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) {
      setStatus({ type: 'error', message: data.error || 'Failed to update' })
    } else {
      setStatus({ type: 'success', message: 'User granted admin rights.' })
      setEmail('')
    }
  }

  return (
    <section className="text-white space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Администраторски Права</h2>

      <div className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex flex-col flex-1 w-full">
            <label className="text-sm font-medium text-gray-300 mb-2">Email на потребител</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className={`${buttonBaseClass} bg-green-500 hover:bg-green-600 text-white w-full md:w-auto shadow-lg shadow-green-900/20`}
          >
            Направи Админ
          </button>
        </form>
      </div>

      <StatusMessage status={status} onClear={() => setStatus(null)} />
    </section>
  )
}
