"use client";

import { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase/client'

const tabs = [
  { key: 'shows', label: 'Shows' },
  { key: 'employees', label: 'Employees' },
  { key: 'performances', label: 'Performances' },
  { key: 'cast', label: 'Cast' },
]

export default function AdminPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('shows')

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-blue-900 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">Admin</h1>
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-left px-3 py-2 rounded transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-700'
                  : 'hover:bg-blue-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {activeTab === 'shows' && <ShowsSection supabase={supabase} />}
        {activeTab === 'employees' && <EmployeesSection supabase={supabase} />}
        {activeTab === 'performances' && <PerformancesSection supabase={supabase} />}
        {activeTab === 'cast' && <CastSection supabase={supabase} />}
      </main>
    </div>
  )
}

function ShowsSection({ supabase }) {
  const emptyForm = {
    title: '',
    slug: '',
    category: '',
    image_URL: '',
    poster_URL: '',
    information: '',
    author: '',
    picture_personalURL: '',
  }
  const pageSize = 10
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)

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

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      await supabase.from('shows').update(form).eq('id', editingId)
    } else {
      await supabase.from('shows').insert([form])
    }
    setForm(emptyForm)
    setEditingId(null)
    fetchData()
  }

  async function handleDelete(id) {
    await supabase.from('shows').delete().eq('id', id)
    fetchData()
  }

  function handleEdit(item) {
    setForm({
      title: item.title || '',
      slug: item.slug || '',
      category: item.category || '',
      image_URL: item.image_URL || '',
      poster_URL: item.poster_URL || '',
      information: item.information || '',
      author: item.author || '',
      picture_personalURL: item.picture_personalURL || '',
    })
    setEditingId(item.id)
  }

  async function handleFileChange(e, key, folder) {
    const file = e.target.files[0]
    if (!file) return
    const filePath = `${folder}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage
      .from('pictures')
      .upload(filePath, file)
    if (!error) {
      const { data } = supabase.storage
        .from('pictures')
        .getPublicUrl(filePath)
      setForm({ ...form, [key]: data.publicUrl })
    }
  }

  return (
    <section className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Shows</h2>
      <div className="flex justify-between mb-4">
        <input
          placeholder="Search shows"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(0)
          }}
          className="border rounded p-2"
        />
        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() =>
              setPage((p) => (p + 1) * pageSize < count ? p + 1 : p)
            }
            disabled={(page + 1) * pageSize >= count}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border rounded p-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Slug</label>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="border rounded p-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Category</label>
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border rounded p-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Author</label>
          <input
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="border rounded p-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Poster</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, 'poster_URL', 'Posters')}
            className="border rounded p-2"
          />
          {form.poster_URL && (
            <img
              src={form.poster_URL}
              alt="poster preview"
              className="mt-2 h-48 object-cover"
            />
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Image</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, 'image_URL', 'BigPicturePlays')}
            className="border rounded p-2"
          />
          {form.image_URL && (
            <img
              src={form.image_URL}
              alt="image preview"
              className="mt-2 h-48 object-cover"
            />
          )}
        </div>
        <div className="flex flex-col sm:col-span-2">
          <label className="text-sm font-medium">Information</label>
          <textarea
            value={form.information}
            onChange={(e) => setForm({ ...form, information: e.target.value })}
            className="border rounded p-2"
          />
        </div>
        <div className="flex flex-col sm:col-span-2">
          <label className="text-sm font-medium">Picture personal URL</label>
          <input
            value={form.picture_personalURL}
            onChange={(e) =>
              setForm({ ...form, picture_personalURL: e.target.value })
            }
            className="border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded self-end"
        >
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>
      <table className="w-full text-sm border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left border-b">ID</th>
            <th className="p-2 text-left border-b">Title</th>
            <th className="p-2 text-left border-b">Category</th>
            <th className="p-2 text-left border-b">Cast</th>
            <th className="p-2 text-left border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="odd:bg-gray-50">
              <td className="p-2 border-b">{item.id}</td>
              <td className="p-2 border-b">{item.title}</td>
              <td className="p-2 border-b">{item.category}</td>
              <td className="p-2 border-b">
                {item.cast_members
                  ?.map((cm) => cm.employees?.name)
                  .filter(Boolean)
                  .join(', ')}
              </td>
              <td className="p-2 border-b space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:underline"
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

  useEffect(() => {
    fetchData()
  }, [search, page])

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
    const payload = { ...form, dateOfBirth: form.dateOfBirth || null }
    if (editingId) {
      await supabase.from('employees').update(payload).eq('id', editingId)
    } else {
      await supabase.from('employees').insert([payload])
    }
    setForm(emptyForm)
    setEditingId(null)
    fetchData()
  }

  async function handleDelete(id) {
    await supabase.from('employees').delete().eq('id', id)
    fetchData()
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
  }

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const filePath = `Actors/${Date.now()}-${file.name}`
    const { error } = await supabase.storage
      .from('pictures')
      .upload(filePath, file)
    if (!error) {
      const { data } = supabase.storage
        .from('pictures')
        .getPublicUrl(filePath)
      setForm({ ...form, profile_picture_URL: data.publicUrl })
    }
  }

  return (
    <section className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Employees</h2>
      <div className="flex justify-between mb-4">
        <input
          placeholder="Search employees"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(0)
          }}
          className="border rounded p-2"
        />
        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() =>
              setPage((p) => (p + 1) * pageSize < count ? p + 1 : p)
            }
            disabled={(page + 1) * pageSize >= count}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded p-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Role</label>
          <input
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border rounded p-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            className="border rounded p-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Profile Picture</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="border rounded p-2"
          />
          {form.profile_picture_URL && (
            <img
              src={form.profile_picture_URL}
              alt="profile preview"
              className="mt-2 h-48 object-cover"
            />
          )}
        </div>
        <div className="flex flex-col sm:col-span-2">
          <label className="text-sm font-medium">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded self-end"
        >
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>
      <table className="w-full text-sm border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left border-b">ID</th>
            <th className="p-2 text-left border-b">Name</th>
            <th className="p-2 text-left border-b">Role</th>
            <th className="p-2 text-left border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="odd:bg-gray-50">
              <td className="p-2 border-b">{item.id}</td>
              <td className="p-2 border-b">{item.name}</td>
              <td className="p-2 border-b">{item.role}</td>
              <td className="p-2 border-b space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:underline"
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
    if (editingId) {
      await supabase
        .from('performances')
        .update({ idShow: form.idShow, time: form.time })
        .eq('id', editingId)
    } else {
      await supabase
        .from('performances')
        .insert([{ idShow: form.idShow, time: form.time }])
    }
    setForm(emptyForm)
    setEditingId(null)
    fetchData()
  }

  async function handleDelete(id) {
    await supabase.from('performances').delete().eq('id', id)
    fetchData()
  }

  function handleEdit(item) {
    setForm({ idShow: item.idShow || '', time: item.time || '' })
    setEditingId(item.id)
  }

  return (
    <section className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Performances</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Show</label>
          <select
            value={form.idShow}
            onChange={(e) => setForm({ ...form, idShow: e.target.value })}
            className="border rounded p-2"
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
            className="border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded self-end"
        >
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>
      <table className="w-full text-sm border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left border-b">ID</th>
            <th className="p-2 text-left border-b">Show</th>
            <th className="p-2 text-left border-b">Time</th>
            <th className="p-2 text-left border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="odd:bg-gray-50">
              <td className="p-2 border-b">{item.id}</td>
              <td className="p-2 border-b">{item.shows?.title}</td>
              <td className="p-2 border-b">{item.time}</td>
              <td className="p-2 border-b space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:underline"
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
    if (editingId) {
      await supabase
        .from('cast_members')
        .update({ idShow: form.idShow, employeeId: form.employeeId })
        .eq('id', editingId)
    } else {
      await supabase
        .from('cast_members')
        .insert([{ idShow: form.idShow, employeeId: form.employeeId }])
    }
    setForm(emptyForm)
    setEditingId(null)
    fetchData()
  }

  async function handleDelete(id) {
    await supabase.from('cast_members').delete().eq('id', id)
    fetchData()
  }

  function handleEdit(item) {
    setForm({ idShow: item.idShow || '', employeeId: item.employeeId || '' })
    setEditingId(item.id)
  }

  return (
    <section className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Cast</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Show</label>
          <select
            value={form.idShow}
            onChange={(e) => setForm({ ...form, idShow: e.target.value })}
            className="border rounded p-2"
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
            className="border rounded p-2"
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
          className="bg-blue-600 text-white px-4 py-2 rounded self-end"
        >
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>
      <table className="w-full text-sm border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left border-b">ID</th>
            <th className="p-2 text-left border-b">Show</th>
            <th className="p-2 text-left border-b">Employee</th>
            <th className="p-2 text-left border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="odd:bg-gray-50">
              <td className="p-2 border-b">{item.id}</td>
              <td className="p-2 border-b">{item.shows?.title}</td>
              <td className="p-2 border-b">{item.employees?.name}</td>
              <td className="p-2 border-b space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:underline"
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

