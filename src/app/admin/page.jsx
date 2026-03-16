"use client";

import { useState, useEffect, useRef } from 'react'
import { createClient } from '../../../lib/supabase/client'
import StatusMessage from '../../components/ui/status-message'
import AdminsSection from './admins-section'
import ContentSection from './content-section'

const tabs = [
  { key: 'shows', label: 'Спектакли' },
  { key: 'employees', label: 'Служители' },
  { key: 'performances', label: 'Представления' },
  { key: 'cast', label: 'Актьорски състав' },
  { key: 'admins', label: 'Администратори' },
  { key: 'content', label: 'Съдържание' },
]


const inputClass =
  'w-full border border-white/10 rounded-lg p-2.5 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theater-blue/50 focus:border-theater-blue/50 transition-all'
const buttonBaseClass = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'
const selectClass =
  'w-full border border-white/10 rounded-lg p-2.5 bg-theater-light text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-theater-blue/50'

export default function AdminPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('shows')

  return (
    <div className="flex h-screen bg-theater-dark text-white overflow-hidden selection:bg-theater-blue/30">
      {/* Sidebar */}
      <aside className="w-64 bg-theater-light/50 border-r border-white/5 flex flex-col backdrop-blur-md">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-xl font-bold tracking-tight text-white">Админ Панел</h1>
          <p className="text-xs text-gray-400 mt-1">Управление на съдържанието</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group flex items-center justify-between ${activeTab === tab.key
                ? 'bg-theater-blue text-white shadow-lg shadow-theater-blue/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              {tab.label}
              {activeTab === tab.key && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/login'
            }}
            className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-3 rounded-lg transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Изход
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black/20">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{tabs.find(t => t.key === activeTab)?.label}</h2>
            <div className="h-1 w-12 bg-theater-blue rounded-full"></div>
          </div>

          <div className="bg-theater-light/30 border border-white/5 rounded-xl shadow-2xl backdrop-blur-sm overflow-hidden min-h-[500px]">
            {activeTab === 'shows' && <ShowsSection supabase={supabase} />}
            {activeTab === 'employees' && <EmployeesSection supabase={supabase} />}
            {activeTab === 'performances' && <PerformancesSection supabase={supabase} />}
            {activeTab === 'cast' && <CastSection supabase={supabase} />}
            {activeTab === 'admins' && <AdminsSection />}
            {activeTab === 'content' && <ContentSection supabase={supabase} />}
          </div>
        </div>
      </main>
    </div>
  )
}

function ShowsSection({ supabase }) {
  const pageSize = 10
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)
  const [status, setStatus] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [editing, setEditing] = useState(null) // current show being edited
  const [form, setForm] = useState({
    title: '',
    category: '',
    author: '',
    information: '',
    image_URL: '',
    poster_URL: '',
    picture_personalURL: '',
  })
  // File upload state for images
  const [posterFile, setPosterFile] = useState(null)
  const [posterPreview, setPosterPreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [landscapeFile, setLandscapeFile] = useState(null)
  const [landscapePreview, setLandscapePreview] = useState(null)



  useEffect(() => {
    fetchData()
  }, [search, page])

  async function fetchData() {
    const from = page * pageSize
    const to = from + pageSize - 1
    const { data, count } = await supabase
      .from('shows')
      .select('*, cast_members!left(employees(name))', { count: 'exact' })
      .ilike('title', `%${search}%`)
      .order('id')
      .range(from, to)
    if (data) setItems(data)
    if (count !== null) setCount(count)
  }

  async function handleSync() {

    setStatus(null)
    setSyncing(true)
    try {
      const response = await fetch('/api/entase/sync', {
        method: 'POST',
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Failed to sync with Entase.')
      }
      const { showCount = 0, performanceCount = 0 } = result
      setStatus({
        type: 'success',
        message: `Синхронизирани са ${showCount} спектакъла и ${performanceCount} представления от Entase.`,
      })
      setPage(0)
      await fetchData()
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setSyncing(false)
    }
  }

  // Removed automatic sync on mount; use the button to sync manually.

  async function handleDelete(id) {
    setStatus(null)
    if (!window.confirm('Сигурни ли сте, че искате да изтриете този спектакъл?')) return
    const { error } = await supabase.from('shows').delete().eq('id', id)
    if (error) {
      setStatus({ type: 'error', message: error.message })
    } else {
      setStatus({ type: 'success', message: 'Спектакълът е изтрит.' })
      fetchData()
    }
  }

  function handleEdit(show) {
    setEditing(show)
    setForm({
      title: show.title || '',
      category: show.category || '',
      author: show.author || '',
      information: show.information || '',
      image_URL: show.image_URL || '',
      poster_URL: show.poster_URL || '',
      picture_personalURL: show.picture_personalURL || '',
    })
    // Seed previews with existing URLs and clear pending files
    setPosterPreview(show.poster_URL || null)
    setImagePreview(show.image_URL || null)
    setLandscapePreview(show.picture_personalURL || null)
    setPosterFile(null)
    setImageFile(null)
    setLandscapeFile(null)
  }

  async function handleUpdate(e) {
    e?.preventDefault?.()
    if (!editing) return
    setStatus(null)
    const payload = {
      title: String(form.title || '').trim(),
      category: String(form.category || '').trim(),
      author: String(form.author || '').trim(),
      information: String(form.information || '').trim(),
      image_URL: form.image_URL?.trim() || null,
      poster_URL: form.poster_URL?.trim() || null,
      picture_personalURL: form.picture_personalURL?.trim() || null,
    }

    // Upload helper
    async function uploadIfNeeded(file, folder) {
      if (!file) return null
      const ts = Date.now()
      const sanitized = file.name?.replace(/[^\w.\-]+/g, '_') || 'image.jpg'
      const path = `Shows/${folder}/${ts}-${sanitized}`
      const { error } = await supabase.storage.from('pictures').upload(path, file)
      if (error) {
        throw new Error(error.message)
      }
      const { data } = supabase.storage.from('pictures').getPublicUrl(path)
      return data.publicUrl
    }

    try {
      // Upload files if provided and override URLs
      if (posterFile) {
        const url = await uploadIfNeeded(posterFile, 'poster')
        payload.poster_URL = url
      }
      if (imageFile) {
        const url = await uploadIfNeeded(imageFile, 'image')
        payload.image_URL = url
      }
      if (landscapeFile) {
        const url = await uploadIfNeeded(landscapeFile, 'landscape')
        payload.picture_personalURL = url
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Неуспешно качване на изображение.' })
      return
    }
    const { error } = await supabase
      .from('shows')
      .update(payload)
      .eq('id', editing.id)
    if (error) {
      setStatus({ type: 'error', message: error.message })
    } else {
      setStatus({ type: 'success', message: 'Спектакълът е обновен.' })
      setEditing(null)
      // Clear files and previews after save
      setPosterFile(null); setPosterPreview(null)
      setImageFile(null); setImagePreview(null)
      setLandscapeFile(null); setLandscapePreview(null)
      await fetchData()
    }
  }

  return (
    <section className="text-white space-y-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          placeholder="Търсене на спектакли"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(0)
          }}
          className={inputClass}
        />
        <button
          onClick={handleSync}
          disabled={syncing}
          className={`${buttonBaseClass} ${syncing ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
            } disabled:opacity-60`}
        >
          {syncing ? 'Синхронизиране…' : 'Синхронизирай от Entase'}
        </button>
      </div>
      <StatusMessage status={status} onClear={() => setStatus(null)} />

      {editing && (
        <form
          onSubmit={handleUpdate}
          className="mb-8 grid gap-6 border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold">Редакция на спектакъл: {editing.title}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm">Заглавие</label>
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm">Категория</label>
              <input
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm">Автор</label>
              <input
                className={inputClass}
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
            </div>
            <div className="flex flex-col sm:col-span-2">
              <label className="text-sm">Информация</label>
              <textarea
                className={`${inputClass} h-32`}
                value={form.information}
                onChange={(e) => setForm({ ...form, information: e.target.value })}
              />
            </div>
            {/* Poster uploader */}
            <div className="flex flex-col">
              <label className="text-sm">Постер</label>
              <input
                className={inputClass}
                placeholder="https://..."
                value={form.poster_URL}
                onChange={(e) => setForm({ ...form, poster_URL: e.target.value })}
              />
              <div className="mt-2 flex items-start gap-3">
                <input
                  type="file"
                  accept="image/*"
                  className={inputClass}
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    setPosterFile(f)
                    setPosterPreview(URL.createObjectURL(f))
                  }}
                />
              </div>
              {(posterPreview || form.poster_URL) && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={posterPreview || form.poster_URL}
                    alt="poster preview"
                    className="h-40 w-28 object-cover rounded"
                  />
                  {(posterPreview || form.poster_URL) && (
                    <button
                      type="button"
                      className="rounded bg-red-500 px-3 py-2 text-white"
                      onClick={() => { setPosterFile(null); setPosterPreview(null); setForm((p) => ({ ...p, poster_URL: '' })) }}
                    >
                      Премахни
                    </button>
                  )}
                </div>
              )}
            </div>
            {/* Main image uploader */}
            <div className="flex flex-col">
              <label className="text-sm">Основно изображение</label>
              <input
                className={inputClass}
                placeholder="https://..."
                value={form.image_URL}
                onChange={(e) => setForm({ ...form, image_URL: e.target.value })}
              />
              <div className="mt-2 flex items-start gap-3">
                <input
                  type="file"
                  accept="image/*"
                  className={inputClass}
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    setImageFile(f)
                    setImagePreview(URL.createObjectURL(f))
                  }}
                />
              </div>
              {(imagePreview || form.image_URL) && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={imagePreview || form.image_URL}
                    alt="image preview"
                    className="h-32 w-56 object-cover rounded"
                  />
                  {(imagePreview || form.image_URL) && (
                    <button
                      type="button"
                      className="rounded bg-red-500 px-3 py-2 text-white"
                      onClick={() => { setImageFile(null); setImagePreview(null); setForm((p) => ({ ...p, image_URL: '' })) }}
                    >
                      Премахни
                    </button>
                  )}
                </div>
              )}
            </div>
            {/* Landscape image uploader */}
            <div className="flex flex-col sm:col-span-2">
              <label className="text-sm">Хоризонтално изображение</label>
              <input
                className={inputClass}
                placeholder="https://..."
                value={form.picture_personalURL}
                onChange={(e) => setForm({ ...form, picture_personalURL: e.target.value })}
              />
              <div className="mt-2 flex items-start gap-3">
                <input
                  type="file"
                  accept="image/*"
                  className={inputClass}
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    setLandscapeFile(f)
                    setLandscapePreview(URL.createObjectURL(f))
                  }}
                />
              </div>
              {(landscapePreview || form.picture_personalURL) && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={landscapePreview || form.picture_personalURL}
                    alt="landscape preview"
                    className="h-40 w-full object-cover rounded"
                  />
                  {(landscapePreview || form.picture_personalURL) && (
                    <button
                      type="button"
                      className="rounded bg-red-500 px-3 py-2 text-white"
                      onClick={() => { setLandscapeFile(null); setLandscapePreview(null); setForm((p) => ({ ...p, picture_personalURL: '' })) }}
                    >
                      Премахни
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className={`${buttonBaseClass} bg-blue-500`}>
              Запази промените
            </button>
            <button
              type="button"
              className={`${buttonBaseClass} bg-theater-hover text-white`}
              onClick={() => setEditing(null)}
            >
              Отказ
            </button>
          </div>
        </form>
      )}
      <div className="flex justify-end mb-2 space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-2 py-1 border border-theater-light rounded disabled:opacity-50 bg-theater-light"
        >
          Назад
        </button>
        <button
          onClick={() =>
            setPage((p) => (p + 1) * pageSize < count ? p + 1 : p)
          }
          disabled={(page + 1) * pageSize >= count}
          className="px-2 py-1 border border-theater-light rounded disabled:opacity-50 bg-theater-light"
        >
          Напред
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-white/10 text-gray-300 font-semibold tracking-wider">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Заглавие</th>
              <th className="p-4">Категория</th>
              <th className="p-4">Състав</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-gray-400">{item.id}</td>
                <td className="p-4 font-medium text-white">{item.title}</td>
                <td className="p-4 text-gray-300">{item.category}</td>
                <td className="p-4 text-gray-400 max-w-xs truncate">
                  {item.cast_members
                    ?.map((cm) => cm.employees?.name)
                    .filter(Boolean)
                    .join(', ')}
                </td>
                <td className="p-4 text-right space-x-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-theater-blue hover:text-white font-medium transition-colors"
                  >
                    Редакция
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    Изтрий
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

function EmployeesSection({ supabase }) {
  const emptyForm = {
    name: '',
    role: '',
    dateOfBirth: '',
    bio: '',
    profile_picture_URL: '',
  }
  const pageSize = 10
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)
  const [status, setStatus] = useState(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    fetchData()
  }, [search, page])

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  async function fetchData() {
    const from = page * pageSize
    const to = from + pageSize - 1
    const { data, count } = await supabase
      .from('employees')
      .select('*', { count: 'exact' })
      .ilike('name', `%${search}%`)
      .order('id')
      .range(from, to)
    if (data) setItems(data)
    if (count !== null) setCount(count)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)
    if (!form.name.trim() || !form.role.trim()) {
      setStatus({ type: 'error', message: 'Име и роля са задължителни.' })
      return
    }
    const payload = {
      ...form,
      dateOfBirth: form.dateOfBirth || null,
      profile_picture_URL: form.profile_picture_URL || null,
    }

    if (file) {
      const filePath = `Actors/${Date.now()}-${file.name}`
      const { error } = await supabase.storage
        .from('pictures')
        .upload(filePath, file)
      if (error) {
        setStatus({ type: 'error', message: getFriendlyErrorMessage(error) })
        return
      }
      const { data } = supabase.storage
        .from('pictures')
        .getPublicUrl(filePath)
      payload.profile_picture_URL = data.publicUrl
    }
    let result
    if (editingId) {
      result = await supabase.from('employees').update(payload).eq('id', editingId)
    } else {
      result = await supabase.from('employees').insert([payload])
    }
    if (result.error) {
      setStatus({
        type: 'error',
        message: getFriendlyErrorMessage(result.error),
      })
      return
    }
    setStatus({
      type: 'success',
      message: editingId ? 'Служителят е обновен.' : 'Служителят е добавен.',
    })
    setForm(emptyForm)
    setEditingId(null)
    setFile(null)
    setPreview(null)
    fetchData()
  }

  async function handleDelete(id) {
    setStatus(null)
    if (!window.confirm('Сигурни ли сте, че искате да изтриете този служител?')) return
    const { error } = await supabase.from('employees').delete().eq('id', id)
    if (error) {
      setStatus({ type: 'error', message: getFriendlyErrorMessage(error) })
    } else {
      setStatus({ type: 'success', message: 'Служителят е изтрит.' })
      fetchData()
    }
  }

  function handleEdit(item) {
    setForm({
      name: item.name || '',
      role: item.role || '',
      dateOfBirth: item.dateOfBirth || '',
      bio: item.bio || '',
      profile_picture_URL: item.profile_picture_URL || '',
    })
    setEditingId(item.id)
    setFile(null)
    setPreview(item.profile_picture_URL || null)
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    setForm((prev) => ({ ...prev, profile_picture_URL: '' }))
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }

  function handleClearImage() {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setFile(null)
    setForm((prev) => ({ ...prev, profile_picture_URL: '' }))
  }

  function getFriendlyErrorMessage(error) {
    if (!error) {
      return 'Възникна неочаквана грешка.'
    }
    const message = error.message || 'Възникна неочаквана грешка.'
    if (message.toLowerCase().includes('row level security')) {
      return (
        'Нямате права за качване на изображения. ' +
        'Моля, коригирайте Supabase политиките, за да позволите запис в bucket-а pictures.'
      )
    }
    return message
  }

  return (
    <section className="text-white space-y-6">
      <h2 className="text-xl font-semibold mb-4">Служители</h2>
      <div className="mb-4">
        <input
          placeholder="Търсене на служители"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(0)
          }}
          className={inputClass}
        />
      </div>
      <h3 className="text-lg font-medium mb-2">
        {editingId ? 'Редакция на служител' : 'Добавяне на служител'}
      </h3>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Име</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Роля</label>
          <input
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Дата на раждане</label>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Снимка на профил</label>
          <input
            type="file"
            onChange={handleFileChange}
            className={inputClass}
          />
          {(preview || form.profile_picture_URL) && (
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
              <img
                src={preview || form.profile_picture_URL}
                alt="преглед на снимка"
                className="h-48 w-48 rounded object-cover"
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="rounded bg-red-500 px-3 py-2 text-white"
              >
                Премахни снимката
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:col-span-2">
          <label className="text-sm font-medium">Биография</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className={`${inputClass} h-32`}
          />
        </div>
        <button
          type="submit"
          className={`${buttonBaseClass} ${editingId ? 'bg-blue-500' : 'bg-green-500'
            }`}
        >
          {editingId ? 'Обнови' : 'Добави'}
        </button>
      </form>
      <StatusMessage status={status} onClear={() => setStatus(null)} />
      <div className="flex justify-end mb-2 space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-2 py-1 border border-theater-light rounded disabled:opacity-50 bg-theater-light"
        >
          Назад
        </button>
        <button
          onClick={() =>
            setPage((p) => (p + 1) * pageSize < count ? p + 1 : p)
          }
          disabled={(page + 1) * pageSize >= count}
          className="px-2 py-1 border border-theater-light rounded disabled:opacity-50 bg-theater-light"
        >
          Напред
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-white/10 text-gray-300 font-semibold tracking-wider">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Име</th>
              <th className="p-4">Роля</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-gray-400">{item.id}</td>
                <td className="p-4 font-medium text-white flex items-center gap-3">
                  {item.profile_picture_URL && (
                    <img src={item.profile_picture_URL} alt="" className="w-8 h-8 rounded-full object-cover" />
                  )}
                  {item.name}
                </td>
                <td className="p-4 text-gray-300">{item.role}</td>
                <td className="p-4 text-right space-x-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-theater-blue hover:text-white font-medium transition-colors"
                  >
                    Редакция
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    Изтрий
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

function PerformancesSection({ supabase }) {
  const emptyForm = { idShow: '', time: '' }
  const [items, setItems] = useState([])
  const [shows, setShows] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetchShows()
    fetchData()
  }, [])

  async function fetchShows() {
    const { data } = await supabase.from('shows').select('id, title')
    if (data) setShows(data)
  }

  async function fetchData() {
    const { data } = await supabase
      .from('performances')
      .select('id, idShow, time, shows(title)')
      .order('id')
    if (data) setItems(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)
    if (!form.idShow || !form.time) {
      setStatus({ type: 'error', message: 'Спектакъл и време са задължителни.' })
      return
    }
    let result
    if (editingId) {
      result = await supabase
        .from('performances')
        .update({ idShow: form.idShow, time: form.time })
        .eq('id', editingId)
    } else {
      result = await supabase
        .from('performances')
        .insert([{ idShow: form.idShow, time: form.time }])
    }
    if (result.error) {
      setStatus({ type: 'error', message: result.error.message })
      return
    }
    setStatus({
      type: 'success',
      message: editingId ? 'Представлението е обновено.' : 'Представлението е добавено.',
    })
    setForm(emptyForm)
    setEditingId(null)
    fetchData()
  }

  // Deleting performances is disabled in the UI

  function handleEdit(item) {
    setForm({ idShow: item.idShow || '', time: item.time || '' })
    setEditingId(item.id)
  }

  return (
    <section className="text-white space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Представления</h2>

      <div className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm mb-8">
        <h3 className="text-lg font-medium mb-4 text-theater-blue">
          {editingId ? 'Редакция на дата на представление' : 'Добавяне на дата на представление'}
        </h3>
        <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-3 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-2">Спектакъл</label>
            <select
              value={form.idShow}
              onChange={(e) => setForm({ ...form, idShow: e.target.value })}
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
            <label className="text-sm font-medium text-gray-300 mb-2">Дата и час</label>
            <div className="relative">
              <input
                type="datetime-local"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="submit"
            className={`${buttonBaseClass} h-[46px] ${editingId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
              } text-white shadow-lg shadow-green-900/20`}
          >
            {editingId ? 'Обнови' : 'Добави представление'}
          </button>
        </form>
      </div>

      <StatusMessage status={status} onClear={() => setStatus(null)} />

      <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-white/10 text-gray-300 font-semibold tracking-wider">
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
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-theater-blue hover:text-white font-medium transition-colors"
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

function CastSection({ supabase }) {
  const emptyForm = { idShow: '', employeeId: '', employeeIds: [] }
  const [items, setItems] = useState([])
  const [shows, setShows] = useState([])
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState(null)
  const [filterShowId, setFilterShowId] = useState('')
  const [employeeSearch, setEmployeeSearch] = useState('')

  useEffect(() => {
    fetchShows()
    fetchEmployees()
    fetchData()
  }, [])

  async function fetchShows() {
    const { data } = await supabase.from('shows').select('id, title')
    if (data) setShows(data)
  }

  async function fetchEmployees() {
    const { data } = await supabase.from('employees').select('id, name')
    if (data) setEmployees(data)
  }

  async function fetchData() {
    const { data } = await supabase
      .from('cast_members')
      .select('id, idShow, employeeId, shows(title), employees(name)')
      .order('id')
    if (data) setItems(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)
    try {
      if (editingId) {
        if (!form.idShow || !form.employeeId) {
          setStatus({ type: 'error', message: 'Спектакъл и служител са задължителни.' })
          return
        }
        const { error } = await supabase
          .from('cast_members')
          .update({ idShow: form.idShow, employeeId: form.employeeId })
          .eq('id', editingId)
        if (error) throw error
        setStatus({ type: 'success', message: 'Съставът е обновен.' })
      } else {
        if (!form.idShow) {
          setStatus({ type: 'error', message: 'Изберете спектакъл.' })
          return
        }
        // Compute diff: additions and removals
        const assignedSet = new Set(
          items
            .filter((i) => String(i.idShow) === String(form.idShow))
            .map((i) => String(i.employeeId))
        )
        const selectedSet = new Set((form.employeeIds || []).map(String))
        const toAdd = Array.from(selectedSet).filter((id) => !assignedSet.has(id))
        const toRemove = Array.from(assignedSet).filter((id) => !selectedSet.has(id))

        // Apply changes
        if (toAdd.length) {
          const payload = toAdd.map((empId) => ({ idShow: form.idShow, employeeId: empId }))
          const { error } = await supabase.from('cast_members').insert(payload)
          if (error) throw error
        }
        if (toRemove.length) {
          const { error } = await supabase
            .from('cast_members')
            .delete()
            .eq('idShow', form.idShow)
            .in('employeeId', toRemove)
          if (error) throw error
        }

        const addedMsg = toAdd.length ? `${toAdd.length} добавени` : null
        const removedMsg = toRemove.length ? `${toRemove.length} премахнати` : null
        const msg = [addedMsg, removedMsg].filter(Boolean).join(', ') || 'Няма промени'
        setStatus({ type: 'success', message: `Съставът е записан. ${msg}.` })
      }
      setForm(emptyForm)
      setEditingId(null)
      fetchData()
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Грешка при запис на състав.' })
    }
  }

  async function handleDelete(id) {
    setStatus(null)
    if (!window.confirm('Сигурни ли сте, че искате да изтриете този участник?')) return
    const { error } = await supabase.from('cast_members').delete().eq('id', id)
    if (error) {
      setStatus({ type: 'error', message: error.message })
    } else {
      setStatus({ type: 'success', message: 'Участникът е изтрит.' })
      fetchData()
    }
  }

  function handleEdit(item) {
    setForm({ idShow: item.idShow || '', employeeId: item.employeeId || '', employeeIds: [] })
    setEditingId(item.id)
  }

  // When a show is selected (and not in single-row edit), preselect current cast for that show
  useEffect(() => {
    if (!form?.idShow || editingId) return
    const assigned = items
      .filter((i) => String(i.idShow) === String(form.idShow))
      .map((i) => String(i.employeeId))
    setForm((prev) => ({ ...prev, employeeIds: assigned }))
  }, [form?.idShow, items, editingId])

  async function handleDeleteCast(item) {
    try {
      setStatus(null)
      const showName = item?.shows?.title || 'спектакъл'
      const empName = item?.employees?.name || 'участник'
      const ok = window.confirm(`Премахване на „${empName}“ от „${showName}“?`)
      if (!ok) return
      const { error } = await supabase
        .from('cast_members')
        .delete()
        .eq('id', item.id)
      if (error) throw error
      setStatus({ type: 'success', message: 'Участникът е изтрит.' })
      fetchData()
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Грешка при изтриване.' })
    }
  }

  return (
    <section className="text-white space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Актьорски състав</h2>

      <div className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm mb-8">
        <h3 className="text-lg font-medium mb-4 text-theater-blue">
          {editingId ? 'Редакция на участник' : 'Управление на състава'}
        </h3>
        <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-3 mb-4 items-start">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-2">Спектакъл</label>
            <select
              value={form.idShow}
              onChange={(e) => { setForm({ ...form, idShow: e.target.value }); setFilterShowId(e.target.value) }}
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
          {editingId ? (
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-2">Служител</label>
              <select
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                required
                className={selectClass}
              >
                <option value="">Изберете служител</option>
                {[...employees]
                  .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'bg', { sensitivity: 'base' }))
                  .map((emp) => (
                    <option key={emp.id} value={emp.id} className="text-theater-dark">
                      {emp.name}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-2">Служители</label>
              <input
                type="text"
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                placeholder="Търсене по име"
                className="mb-2 w-full border border-white/10 rounded-lg p-2.5 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theater-blue/50"
                disabled={!form.idShow}
              />
              <div className="max-h-60 overflow-auto border border-white/10 rounded-lg p-2 bg-black/20 text-white space-y-1 custom-scrollbar">
                {[...employees]
                  .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'bg', { sensitivity: 'base' }))
                  .filter((emp) => (employeeSearch ? (emp.name || '').toLowerCase().includes(employeeSearch.toLowerCase()) : true))
                  .map((emp) => {
                    const checked = (form.employeeIds || []).map(String).includes(String(emp.id))
                    return (
                      <label key={emp.id} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${checked ? 'bg-theater-blue/20 text-theater-blue' : 'hover:bg-white/5 text-gray-300'}`}>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-theater-blue focus:ring-offset-gray-900"
                          value={emp.id}
                          disabled={!form.idShow}
                          checked={checked}
                          onChange={(e) => {
                            const id = String(emp.id)
                            if (e.target.checked) {
                              setForm((prev) => ({ ...prev, employeeIds: Array.from(new Set([...(prev.employeeIds || []).map(String), id])) }))
                            } else {
                              setForm((prev) => ({ ...prev, employeeIds: (prev.employeeIds || []).filter((x) => String(x) !== id) }))
                            }
                          }}
                        />
                        <span className="flex-1 truncate">{emp.name}</span>
                      </label>
                    )
                  })}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Избрани: <span className="text-white font-medium">{(form.employeeIds || []).length}</span>
              </div>
            </div>
          )}
          <div className="flex items-end h-full">
            <button
              type="submit"
              className={`${buttonBaseClass} w-full h-[46px] mt-6 sm:mt-0 ${editingId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
                } text-white shadow-lg shadow-green-900/20`}
            >
              {editingId ? 'Обнови' : 'Запази състав'}
            </button>
          </div>
        </form>
      </div>

      <div className="mb-6 flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10">
        <div className="text-sm text-gray-300">
          {filterShowId
            ? <span className="flex items-center gap-2">Показва състава за: <span className="font-bold text-white">{shows.find(s => String(s.id) === String(filterShowId))?.title || 'избрания спектакъл'}</span></span>
            : 'Показва състава за всички спектакли'}
        </div>
        {filterShowId && (
          <button
            type="button"
            onClick={() => setFilterShowId('')}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 text-sm transition-colors border border-white/5"
          >
            Покажи всички
          </button>
        )}
      </div>

      <StatusMessage status={status} onClear={() => setStatus(null)} />

      <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-white/10 text-gray-300 font-semibold tracking-wider">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Спектакъл</th>
              <th className="p-4">Служител</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items
              .filter((item) => !filterShowId || String(item.idShow) === String(filterShowId))
              .map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-gray-400">{item.id}</td>
                  <td className="p-4 font-medium text-white">{item.shows?.title}</td>
                  <td className="p-4 text-gray-300">{item.employees?.name}</td>
                  <td className="p-4 text-right space-x-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-theater-blue hover:text-white font-medium transition-colors"
                    >
                      Редакция
                    </button>
                    <button
                      onClick={() => handleDeleteCast(item)}
                      className="text-red-400 hover:text-red-300 font-medium transition-colors"
                    >
                      Премахни
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
