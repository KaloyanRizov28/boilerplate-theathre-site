"use client";

import { useState, useEffect } from 'react'
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

export default function AdminPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('shows')

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
        {activeTab === 'shows' && <ShowsSection supabase={supabase} />}
        {activeTab === 'employees' && <EmployeesSection supabase={supabase} />}
        {activeTab === 'performances' && <PerformancesSection supabase={supabase} />}
        {activeTab === 'cast' && <CastSection supabase={supabase} />}
        {activeTab === 'admins' && <AdminsSection />}
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
        message: `Synced ${showCount} shows and ${performanceCount} performances from Entase.`,
      })
      setPage(0)
      await fetchData()
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setSyncing(false)
    }
  }

  async function handleDelete(id) {
    setStatus(null)
    if (!window.confirm('Are you sure you want to delete this show?')) return
    const { error } = await supabase.from('shows').delete().eq('id', id)
    if (error) {
      setStatus({ type: 'error', message: error.message })
    } else {
      setStatus({ type: 'success', message: 'Show deleted.' })
      fetchData()
    }
  }

  return (
    <section className="bg-theater-dark p-6 rounded shadow text-white">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          placeholder="Search shows"
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
          className={`${buttonBaseClass} ${
            syncing ? 'bg-theater-hover text-white' : 'bg-theater-accent'
          } disabled:opacity-60`}
        >
          {syncing ? 'Syncing…' : 'Sync from Entase'}
        </button>
      </div>
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
            <th className="p-2 text-left border-b border-theater-light">Title</th>
            <th className="p-2 text-left border-b border-theater-light">Category</th>
            <th className="p-2 text-left border-b border-theater-light">Cast</th>
            <th className="p-2 text-left border-b border-theater-light">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="odd:bg-theater-light/20">
              <td className="p-2 border-b border-theater-light">{item.id}</td>
              <td className="p-2 border-b border-theater-light">{item.title}</td>
              <td className="p-2 border-b border-theater-light">{item.category}</td>
              <td className="p-2 border-b border-theater-light">
                {item.cast_members
                  ?.map((cm) => cm.employees?.name)
                  .filter(Boolean)
                  .join(', ')}
              </td>
              <td className="p-2 border-b border-theater-light">
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
      setStatus({ type: 'error', message: 'Show and time are required.' })
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
      message: editingId ? 'Performance updated.' : 'Performance added.',
    })
    setForm(emptyForm)
    setEditingId(null)
    fetchData()
  }

  async function handleDelete(id) {
    setStatus(null)
    if (!window.confirm('Are you sure you want to delete this performance?')) return
    const { error } = await supabase
      .from('performances')
      .delete()
      .eq('id', id)
    if (error) {
      setStatus({ type: 'error', message: error.message })
    } else {
      setStatus({ type: 'success', message: 'Performance deleted.' })
      fetchData()
    }
  }

  function handleEdit(item) {
    setForm({ idShow: item.idShow || '', time: item.time || '' })
    setEditingId(item.id)
  }

  return (
    <section className="bg-theater-dark p-6 rounded shadow text-white">
      <h2 className="text-xl font-semibold mb-4">Performances</h2>
      <h3 className="text-lg font-medium mb-2">
        {editingId ? 'Edit Performance Date' : 'Add Performance Date'}
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
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Time</label>
          <input
            type="datetime-local"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            required
            className={inputClass}
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
      <table className="w-full text-sm border border-theater-light">
        <thead className="bg-theater-light">
          <tr>
            <th className="p-2 text-left border-b border-theater-light">ID</th>
            <th className="p-2 text-left border-b border-theater-light">Show</th>
            <th className="p-2 text-left border-b border-theater-light">Time</th>
            <th className="p-2 text-left border-b border-theater-light">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="odd:bg-theater-light/20">
              <td className="p-2 border-b border-theater-light">{item.id}</td>
              <td className="p-2 border-b border-theater-light">{item.shows?.title}</td>
              <td className="p-2 border-b border-theater-light">{item.time}</td>
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

function CastSection({ supabase }) {
  const emptyForm = { idShow: '', employeeId: '' }
  const [items, setItems] = useState([])
  const [shows, setShows] = useState([])
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState(null)

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
    if (!form.idShow || !form.employeeId) {
      setStatus({ type: 'error', message: 'Show and employee are required.' })
      return
    }
    let result
    if (editingId) {
      result = await supabase
        .from('cast_members')
        .update({ idShow: form.idShow, employeeId: form.employeeId })
        .eq('id', editingId)
    } else {
      result = await supabase
        .from('cast_members')
        .insert([{ idShow: form.idShow, employeeId: form.employeeId }])
    }
    if (result.error) {
      setStatus({ type: 'error', message: result.error.message })
      return
    }
    setStatus({
      type: 'success',
      message: editingId ? 'Cast updated.' : 'Cast added.',
    })
    setForm(emptyForm)
    setEditingId(null)
    fetchData()
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
