"use client";

import { useEffect, useState } from 'react'
import StatusMessage from '@/components/ui/status-message'
import { buttonBaseClass, inputClass, selectClass } from '@/features/admin/constants'
import { useAdminSupabaseClient } from '@/features/admin/components/admin-supabase-provider'

const EMPTY_PERFORMANCE_FORM = { idShow: '', time: '' }

export default function PerformancesSection() {
  const supabase = useAdminSupabaseClient()
  const [items, setItems] = useState([])
  const [shows, setShows] = useState([])
  const [form, setForm] = useState(EMPTY_PERFORMANCE_FORM)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    void fetchShows()
    void fetchData()
  }, [])

  function clearStatus() {
    setStatus(null)
  }

  async function fetchShows() {
    const { data } = await supabase.from('shows').select('id, title')

    if (data) {
      setShows(data)
    }
  }

  async function fetchData() {
    const { data } = await supabase
      .from('performances')
      .select('id, idShow, time, shows(title)')
      .order('id')

    if (data) {
      setItems(data)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus(null)

    if (!form.idShow || !form.time) {
      setStatus({ type: 'error', message: 'Спектакъл и време са задължителни.' })
      return
    }

    const result = editingId
      ? await supabase
          .from('performances')
          .update({ idShow: form.idShow, time: form.time })
          .eq('id', editingId)
      : await supabase
          .from('performances')
          .insert([{ idShow: form.idShow, time: form.time }])

    if (result.error) {
      setStatus({ type: 'error', message: result.error.message })
      return
    }

    setStatus({
      type: 'success',
      message: editingId ? 'Представлението е обновено.' : 'Представлението е добавено.',
    })
    setForm(EMPTY_PERFORMANCE_FORM)
    setEditingId(null)
    await fetchData()
  }

  function handleEdit(item) {
    setForm({ idShow: item.idShow || '', time: item.time || '' })
    setEditingId(item.id)
  }

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  return (
    <section className="space-y-6 text-white">
      <h2 className="mb-4 text-xl font-semibold text-white">Представления</h2>

      <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h3 className="mb-4 text-lg font-medium text-theater-blue">
          {editingId ? 'Редакция на дата на представление' : 'Добавяне на дата на представление'}
        </h3>
        <form onSubmit={handleSubmit} className="grid items-end gap-6 sm:grid-cols-3">
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-300">Спектакъл</label>
            <select
              value={form.idShow}
              onChange={(event) => updateField('idShow', event.target.value)}
              required
              className={selectClass}
            >
              <option value="">Изберете спектакъл</option>
              {shows.map((show) => (
                <option key={show.id} value={show.id} className="text-theater-dark">
                  {show.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-300">Дата и час</label>
            <div className="relative">
              <input
                type="datetime-local"
                value={form.time}
                onChange={(event) => updateField('time', event.target.value)}
                required
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="submit"
            className={`${buttonBaseClass} h-[46px] ${
              editingId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
            } text-white shadow-lg shadow-green-900/20`}
          >
            {editingId ? 'Обнови' : 'Добави представление'}
          </button>
        </form>
      </div>

      <StatusMessage status={status} onClear={clearStatus} />

      <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/10 text-xs font-semibold uppercase tracking-wider text-gray-300">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Спектакъл</th>
              <th className="p-4">Време</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-gray-400">{item.id}</td>
                <td className="p-4 font-medium text-white">{item.shows?.title}</td>
                <td className="p-4 text-gray-300">
                  {new Date(item.time).toLocaleDateString('bg-BG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleEdit(item)}
                    className="font-medium text-theater-blue transition-colors hover:text-white"
                  >
                    Редакция
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
