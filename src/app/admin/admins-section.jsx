"use client"

import { useState } from 'react'
import StatusMessage from '../../components/ui/status-message'

const inputClass =
  'border border-theater-light rounded p-2 bg-theater-light text-white'
const buttonBaseClass = 'text-theater-dark px-4 py-2 rounded self-end'

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
    <section className="bg-theater-dark p-6 rounded shadow text-white">
      <h2 className="text-xl font-semibold mb-4">Admin Permissions</h2>
      <form onSubmit={handleSubmit} className="flex gap-4 items-end mb-4">
        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium">User Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <button type="submit" className={`${buttonBaseClass} bg-green-500`}>
          Make Admin
        </button>
      </form>
      <StatusMessage status={status} onClear={() => setStatus(null)} />
    </section>
  )
}
