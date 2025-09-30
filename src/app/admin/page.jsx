"use client";

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '../../../lib/supabase/client'
import StatusMessage from '../../components/ui/status-message'
import AdminsSection from './admins-section'

const tabs = [
  { key: 'shows', label: 'Shows' },
  { key: 'employees', label: 'Employees' },
  { key: 'performances', label: 'Performances' },
  { key: 'cast', label: 'Cast' },
  { key: 'admins', label: 'Admins' },
]

const inputClass =
  'border border-theater-light rounded p-2 bg-theater-light text-white'
const buttonBaseClass = 'text-theater-dark px-4 py-2 rounded self-end'
const selectClass =
  `${inputClass} cursor-pointer focus:ring-2 focus:ring-theater-accent`

function getValueAtPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

function getFirstValue(obj, paths) {
  for (const path of paths) {
    const value = getValueAtPath(obj, path)
    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }
  return undefined
}

function toArray(value) {
  if (Array.isArray(value)) return value
  if (value === undefined || value === null) return []
  return [value]
}

function extractPerformances(production) {
  const candidates = [
    production.performances,
    production.events,
    production.performance,
    production.productionPerformances,
    production.slots,
  ]
  for (const candidate of candidates) {
    const arr = toArray(candidate)
    if (arr.length > 0) {
      return arr
    }
  }
  return []
}

function getPerformanceRawDate(performance) {
  return getFirstValue(performance, [
    'startAt',
    'start_at',
    'start',
    'startTime',
    'startsAt',
    'starts_at',
    'time',
    'date',
  ])
}

function getPerformanceDateValue(performance) {
  const raw = getPerformanceRawDate(performance)
  if (!raw) return null
  const parsed = new Date(raw)
  if (!Number.isNaN(parsed.valueOf())) {
    return parsed
  }
  return null
}

function getPerformanceDate(performance) {
  const raw = getPerformanceRawDate(performance)
  if (!raw) return '-'
  const parsed = getPerformanceDateValue(performance)
  if (parsed) {
    return parsed.toLocaleString()
  }
  return typeof raw === 'string' ? raw : JSON.stringify(raw)
}

function getProductionId(production) {
  return (
    getFirstValue(production, ['id', 'production.id', 'productionId', 'entaseId']) ||
    null
  )
}

function getProductionTitle(production) {
  return (
    getFirstValue(production, ['title', 'name', 'production.title', 'production.name']) ||
    'Untitled production'
  )
}

function getProductionSlug(production) {
  return (
    getFirstValue(production, ['slug', 'production.slug', 'slugified', 'slug_raw']) ||
    ''
  )
}

function getProductionCategory(production) {
  return (
    getFirstValue(production, [
      'category',
      'production.category',
      'categories.0.name',
      'tags.0',
    ]) || ''
  )
}

function getProductionPoster(production) {
  return (
    getFirstValue(production, [
      'posterUrl',
      'poster_url',
      'poster',
      'poster.image',
      'images.poster',
      'assets.poster',
      'media.poster',
    ]) || ''
  )
}

function getProductionDescription(production) {
  return (
    getFirstValue(production, [
      'information',
      'synopsis',
      'description',
      'summary',
      'details',
      'about',
    ]) || ''
  )
}

export default function AdminPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('shows')
  const [productions, setProductions] = useState([])
  const [productionsLoading, setProductionsLoading] = useState(true)
  const [productionsError, setProductionsError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadProductions() {
      setProductionsLoading(true)
      setProductionsError(null)
      try {
        const response = await fetch('/api/entase/productions')
        if (!response.ok) {
          throw new Error(`Failed to load productions (${response.status})`)
        }
        const payload = await response.json()
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.productions)
            ? payload.productions
            : Array.isArray(payload?.data)
              ? payload.data
              : []
        if (isMounted) {
          setProductions(items)
        }
      } catch (error) {
        if (isMounted) {
          setProductionsError(
            error instanceof Error ? error.message : 'Unknown error'
          )
        }
      } finally {
        if (isMounted) {
          setProductionsLoading(false)
        }
      }
    }

    loadProductions()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="flex h-screen bg-theater-light text-white">
      <aside className="w-64 bg-theater-dark text-white p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Admin</h1>
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-left px-3 py-2 rounded transition-colors ${
                activeTab === tab.key
                  ? 'bg-theater-accent text-theater-dark'
                  : 'hover:bg-theater-hover'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = '/login'
          }}
          className="mt-auto bg-theater-accent text-theater-dark px-3 py-2 rounded"
        >
          Log out
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {activeTab === 'shows' && (
          <ShowsSection
            productions={productions}
            isLoading={productionsLoading}
            error={productionsError}
          />
        )}
        {activeTab === 'employees' && <EmployeesSection supabase={supabase} />}
        {activeTab === 'performances' && (
          <PerformancesSection
            productions={productions}
            isLoading={productionsLoading}
            error={productionsError}
          />
        )}
        {activeTab === 'cast' && (
          <CastSection
            supabase={supabase}
            productions={productions}
          />
        )}
        {activeTab === 'admins' && <AdminsSection />}
      </main>
    </div>
  )
}

function ShowsSection({ productions, isLoading, error }) {
  const [search, setSearch] = useState('')

  const normalizedShows = useMemo(() => {
    return (productions ?? []).map((production, index) => {
      const id = getProductionId(production) ?? `production-${index}`
      const title = getProductionTitle(production)
      const slug = getProductionSlug(production)
      const category = getProductionCategory(production)
      const description = getProductionDescription(production)
      const poster = getProductionPoster(production)
      const performances = extractPerformances(production).map((performance, perfIndex) => ({
        id:
          getFirstValue(performance, ['id', 'performanceId', 'uuid', 'slug']) ??
          `${id}-performance-${perfIndex}`,
        time: getPerformanceDate(performance),
        venue:
          getFirstValue(performance, [
            'venue.name',
            'venue',
            'location.name',
            'location',
            'space',
          ]) ?? '',
      }))

      return {
        id,
        title,
        slug,
        category,
        description,
        poster,
        performances,
      }
    })
  }, [productions])

  const filteredShows = useMemo(() => {
    if (!search.trim()) return normalizedShows
    const term = search.trim().toLowerCase()
    return normalizedShows.filter((show) => {
      const haystack = [show.id, show.title, show.slug, show.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [normalizedShows, search])

  return (
    <section className="bg-theater-dark p-6 rounded shadow text-white">
      <h2 className="text-xl font-semibold mb-2">Shows</h2>
      <p className="text-sm text-theater-accent/80 mb-4">
        Read-only data synced from Entase productions.
      </p>
      <div className="mb-4">
        <input
          placeholder="Search productions"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass}
        />
      </div>
      {isLoading && (
        <p className="text-sm text-theater-accent">Loading productions…</p>
      )}
      {error && !isLoading && (
        <p className="text-sm text-red-400">Failed to load productions: {error}</p>
      )}
      {!isLoading && !error && filteredShows.length === 0 && (
        <p className="text-sm text-white/70">No productions found.</p>
      )}
      <div className="grid gap-4">
        {filteredShows.map((show) => (
          <article
            key={show.id}
            className="border border-theater-light rounded p-4 bg-theater-light/40"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
              {show.poster && (
                <img
                  src={show.poster}
                  alt={`${show.title} poster`}
                  className="w-32 h-48 object-cover rounded mb-3 sm:mb-0"
                />
              )}
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-lg font-semibold">{show.title}</h3>
                  <p className="text-xs text-white/60">ID: {show.id}</p>
                </div>
                {show.slug && (
                  <p className="text-sm">
                    <span className="font-medium text-white/80">Slug:</span>{' '}
                    {show.slug}
                  </p>
                )}
                {show.category && (
                  <p className="text-sm">
                    <span className="font-medium text-white/80">Category:</span>{' '}
                    {show.category}
                  </p>
                )}
                {show.description && (
                  <p className="text-sm text-white/80 whitespace-pre-line">
                    {typeof show.description === 'string'
                      ? show.description
                      : JSON.stringify(show.description, null, 2)}
                  </p>
                )}
                {show.performances.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      Upcoming performances
                    </p>
                    <ul className="mt-1 space-y-1 text-sm text-white/70">
                      {show.performances.slice(0, 5).map((performance) => (
                        <li key={performance.id}>
                          {performance.time}
                          {performance.venue && ` · ${performance.venue}`}
                        </li>
                      ))}
                      {show.performances.length > 5 && (
                        <li className="text-xs text-white/50">
                          +{show.performances.length - 5} more performance
                          {show.performances.length - 5 === 1 ? '' : 's'}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
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
      setStatus({ type: 'error', message: 'Name and role are required.' })
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
      message: editingId ? 'Employee updated.' : 'Employee added.',
    })
    setForm(emptyForm)
    setEditingId(null)
    setFile(null)
    setPreview(null)
    fetchData()
  }

  async function handleDelete(id) {
    setStatus(null)
    if (!window.confirm('Are you sure you want to delete this employee?')) return
    const { error } = await supabase.from('employees').delete().eq('id', id)
    if (error) {
      setStatus({ type: 'error', message: getFriendlyErrorMessage(error) })
    } else {
      setStatus({ type: 'success', message: 'Employee deleted.' })
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
      return 'An unexpected error occurred.'
    }
    const message = error.message || 'An unexpected error occurred.'
    if (message.toLowerCase().includes('row level security')) {
      return (
        'You do not have permission to upload images. ' +
        'Please adjust your Supabase policies to allow inserting into the pictures bucket.'
      )
    }
    return message
  }

  return (
    <section className="bg-theater-dark p-6 rounded shadow text-white">
      <h2 className="text-xl font-semibold mb-4">Employees</h2>
      <div className="mb-4">
        <input
          placeholder="Search employees"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(0)
          }}
          className={inputClass}
        />
      </div>
      <h3 className="text-lg font-medium mb-2">
        {editingId ? 'Edit Employee' : 'Add New Employee'}
      </h3>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Role</label>
          <input
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Profile Picture</label>
          <input
            type="file"
            onChange={handleFileChange}
            className={inputClass}
          />
          {(preview || form.profile_picture_URL) && (
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
              <img
                src={preview || form.profile_picture_URL}
                alt="profile preview"
                className="h-48 w-48 rounded object-cover"
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="rounded bg-red-500 px-3 py-2 text-white"
              >
                Remove picture
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:col-span-2">
          <label className="text-sm font-medium">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className={`${inputClass} h-32`}
          />
        </div>
        <button
          type="submit"
          className={`${buttonBaseClass} ${
            editingId ? 'bg-blue-500' : 'bg-green-500'
          }`}
        >
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>
      <StatusMessage status={status} onClear={() => setStatus(null)} />
      <div className="flex justify-end mb-2 space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-2 py-1 border border-theater-light rounded disabled:opacity-50 bg-theater-light"
        >
          Prev
        </button>
        <button
          onClick={() =>
            setPage((p) => (p + 1) * pageSize < count ? p + 1 : p)
          }
          disabled={(page + 1) * pageSize >= count}
          className="px-2 py-1 border border-theater-light rounded disabled:opacity-50 bg-theater-light"
        >
          Next
        </button>
      </div>
      <table className="w-full text-sm border border-theater-light">
        <thead className="bg-theater-light">
          <tr>
            <th className="p-2 text-left border-b border-theater-light">ID</th>
            <th className="p-2 text-left border-b border-theater-light">Name</th>
            <th className="p-2 text-left border-b border-theater-light">Role</th>
            <th className="p-2 text-left border-b border-theater-light">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="odd:bg-theater-light/20">
              <td className="p-2 border-b border-theater-light">{item.id}</td>
              <td className="p-2 border-b border-theater-light">{item.name}</td>
              <td className="p-2 border-b border-theater-light">{item.role}</td>
              <td className="p-2 border-b border-theater-light space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-theater-accent hover:text-[#27AAE1] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-[#27AAE1] hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function PerformancesSection({ productions, isLoading, error }) {
  const [search, setSearch] = useState('')

  const performances = useMemo(() => {
    return (productions ?? []).flatMap((production, productionIndex) => {
      const showId = getProductionId(production) ?? `production-${productionIndex}`
      const showTitle = getProductionTitle(production)
      const showSlug = getProductionSlug(production)
      return extractPerformances(production).map((performance, performanceIndex) => {
        const id =
          getFirstValue(performance, ['id', 'performanceId', 'uuid', 'slug']) ||
          `${showId}-performance-${performanceIndex}`
        const venue =
          getFirstValue(performance, [
            'venue.name',
            'venue',
            'location.name',
            'location',
            'space',
          ]) || ''
        const timezone =
          getFirstValue(performance, ['timezone', 'timeZone', 'tz']) || ''
        const status =
          getFirstValue(performance, ['status', 'state']) || ''
        const parsedDate = getPerformanceDateValue(performance)

        return {
          id,
          showId,
          showTitle,
          showSlug,
          venue,
          timezone,
          status,
          dateLabel: getPerformanceDate(performance),
          timestamp: parsedDate ? parsedDate.getTime() : null,
        }
      })
    })
  }, [productions])

  const sortedPerformances = useMemo(() => {
    return [...performances].sort((a, b) => {
      if (a.timestamp === null && b.timestamp === null) return 0
      if (a.timestamp === null) return 1
      if (b.timestamp === null) return -1
      return a.timestamp - b.timestamp
    })
  }, [performances])

  const filteredPerformances = useMemo(() => {
    if (!search.trim()) return sortedPerformances
    const term = search.trim().toLowerCase()
    return sortedPerformances.filter((performance) => {
      const haystack = [
        performance.showTitle,
        performance.showSlug,
        performance.showId,
        performance.venue,
        performance.dateLabel,
        performance.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [sortedPerformances, search])

  return (
    <section className="bg-theater-dark p-6 rounded shadow text-white">
      <h2 className="text-xl font-semibold mb-2">Performances</h2>
      <p className="text-sm text-theater-accent/80 mb-4">
        Synced performance schedule from Entase. Editing is managed via Entase.
      </p>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <input
          placeholder="Search performances"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass}
        />
        <span className="text-xs text-white/60">
          Showing {filteredPerformances.length} of {performances.length} performances
        </span>
      </div>
      {isLoading && (
        <p className="text-sm text-theater-accent">Loading performances…</p>
      )}
      {error && !isLoading && (
        <p className="text-sm text-red-400">Failed to load performances: {error}</p>
      )}
      {!isLoading && !error && filteredPerformances.length === 0 && (
        <p className="text-sm text-white/70">No performances available.</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-theater-light">
          <thead className="bg-theater-light">
            <tr>
              <th className="p-2 text-left border-b border-theater-light">Show</th>
              <th className="p-2 text-left border-b border-theater-light">Slug</th>
              <th className="p-2 text-left border-b border-theater-light">Performance</th>
              <th className="p-2 text-left border-b border-theater-light">Venue</th>
              <th className="p-2 text-left border-b border-theater-light">Timezone</th>
              <th className="p-2 text-left border-b border-theater-light">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPerformances.map((performance) => (
              <tr key={performance.id} className="odd:bg-theater-light/20">
                <td className="p-2 border-b border-theater-light">
                  <div className="font-medium text-white">{performance.showTitle}</div>
                  <div className="text-xs text-white/60">{performance.showId}</div>
                </td>
                <td className="p-2 border-b border-theater-light">{performance.showSlug}</td>
                <td className="p-2 border-b border-theater-light">{performance.dateLabel}</td>
                <td className="p-2 border-b border-theater-light">{performance.venue || '-'}</td>
                <td className="p-2 border-b border-theater-light">{performance.timezone || '-'}</td>
                <td className="p-2 border-b border-theater-light">{performance.status || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function CastSection({ supabase, productions }) {
  const emptyForm = { idShow: '', employeeId: '' }
  const [items, setItems] = useState([])
  const [shows, setShows] = useState([])
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState(null)

  const entaseProductionIds = useMemo(() => {
    return (productions ?? [])
      .map((production) => {
        const id = getProductionId(production)
        return id !== null && id !== undefined ? String(id) : null
      })
      .filter(Boolean)
  }, [productions])

  useEffect(() => {
    fetchShows()
  }, [supabase, entaseProductionIds])

  useEffect(() => {
    fetchEmployees()
    fetchData()
  }, [])

  async function fetchShows() {
    const { data } = await supabase
      .from('shows')
      .select('id, title, slug')
      .order('title')
    if (data) {
      const entaseSet = new Set(entaseProductionIds)
      const filtered = data.filter((show) => {
        const slug = show.slug ? String(show.slug).trim() : ''
        if (!slug) return false
        if (slug.toLowerCase().startsWith('entase:')) return true
        return entaseSet.has(slug)
      })
      setShows(filtered)
    }
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
    if (!form.idShow || !form.employeeId) {
      setStatus({ type: 'error', message: 'Show and employee are required.' })
      return
    }

    try {
      const payload = {
        id: editingId ?? undefined,
        showId: form.idShow,
        employeeId: form.employeeId,
      }
      const response = await fetch('/api/assignments', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        let message = `Failed to save cast assignment (${response.status})`
        try {
          const body = await response.json()
          message = body?.error || body?.message || message
        } catch (parseError) {
          // Ignore JSON parsing errors
        }
        throw new Error(message)
      }

      setStatus({
        type: 'success',
        message: editingId ? 'Cast updated.' : 'Cast added.',
      })
      setForm(emptyForm)
      setEditingId(null)
      fetchData()
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to save cast assignment.',
      })
    }
  }

  async function handleDelete(id) {
    setStatus(null)
    if (!window.confirm('Are you sure you want to delete this cast member?')) return
    const { error } = await supabase.from('cast_members').delete().eq('id', id)
    if (error) {
      setStatus({ type: 'error', message: error.message })
    } else {
      setStatus({ type: 'success', message: 'Cast member deleted.' })
      fetchData()
    }
  }

  function handleEdit(item) {
    setForm({ idShow: item.idShow || '', employeeId: item.employeeId || '' })
    setEditingId(item.id)
  }

  return (
    <section className="bg-theater-dark p-6 rounded shadow text-white">
      <h2 className="text-xl font-semibold mb-4">Cast</h2>
      <h3 className="text-lg font-medium mb-2">
        {editingId ? 'Edit Cast Member' : 'Add Cast Member'}
      </h3>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Show</label>
          <select
            value={form.idShow}
            onChange={(e) => setForm({ ...form, idShow: e.target.value })}
            required
            className={selectClass}
          >
            <option value="">Select show</option>
            {shows.map((show) => (
              <option key={show.id} value={show.id}>
                {show.title}
                {show.slug ? ` (${show.slug})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Employee</label>
          <select
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            required
            className={selectClass}
          >
            <option value="">Select employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className={`${buttonBaseClass} ${
            editingId ? 'bg-blue-500' : 'bg-green-500'
          }`}
        >
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>
      <StatusMessage status={status} onClear={() => setStatus(null)} />
      <table className="w-full text-sm border border-theater-light">
        <thead className="bg-theater-light">
          <tr>
            <th className="p-2 text-left border-b border-theater-light">ID</th>
            <th className="p-2 text-left border-b border-theater-light">Show</th>
            <th className="p-2 text-left border-b border-theater-light">Employee</th>
            <th className="p-2 text-left border-b border-theater-light">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="odd:bg-theater-light/20">
              <td className="p-2 border-b border-theater-light">{item.id}</td>
              <td className="p-2 border-b border-theater-light">{item.shows?.title}</td>
              <td className="p-2 border-b border-theater-light">{item.employees?.name}</td>
              <td className="p-2 border-b border-theater-light space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-theater-accent hover:text-[#27AAE1] hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-[#27AAE1] hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
