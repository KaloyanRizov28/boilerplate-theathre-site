"use client"

import { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase/client'

const tabs = [
  { key: 'shows', label: 'Shows' },
  { key: 'employees', label: 'Employees' },
  { key: 'performances', label: 'Performances' },
  { key: 'cast_members', label: 'Cast Members' },
]

export default function AdminPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('shows')

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 bg-gray-100 border-r p-4">
        <h1 className="text-xl font-bold mb-6">Dashboard</h1>
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-left px-3 py-2 rounded transition-colors ${
                activeTab === tab.key ? 'bg-white shadow font-medium' : 'hover:bg-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        {activeTab === 'shows' && <ShowsSection supabase={supabase} />}
        {activeTab === 'employees' && <EmployeesSection supabase={supabase} />}
        {activeTab === 'performances' && <PerformancesSection supabase={supabase} />}
        {activeTab === 'cast_members' && <CastMembersSection supabase={supabase} />}
      </main>
    </div>
  )
}

function ShowsSection({ supabase }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', image_url: '' })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data } = await supabase.from('shows').select('*')
    if (data) setItems(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await supabase.from('shows').insert([{ title: form.title, image_url: form.image_url }])
    setForm({ title: '', image_url: '' })
    fetchData()
  }

  async function handleDelete(id) {
    await supabase.from('shows').delete().eq('id', id)
    fetchData()
  }

  return (
    <section className="bg-white p-6 rounded shadow">
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            className="border rounded p-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Image URL</label>
          <input
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="Image URL"
            className="border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded self-end"
        >
          Add
        </button>
      </form>
      <table className="w-full text-sm border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border-b">ID</th>
            <th className="text-left p-2 border-b">Title</th>
            <th className="text-left p-2 border-b">Image URL</th>
            <th className="text-left p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => (
            <tr key={item.id} className="odd:bg-gray-50">
              <td className="p-2 border-b">{item.id}</td>
              <td className="p-2 border-b">{item.title}</td>
              <td className="p-2 border-b">{item.image_url}</td>
              <td className="p-2 border-b">
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function EmployeesSection({ supabase }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', role: '' })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data } = await supabase.from('employees').select('*')
    if (data) setItems(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await supabase.from('employees').insert([{ name: form.name, role: form.role }])
    setForm({ name: '', role: '' })
    fetchData()
  }

  async function handleDelete(id) {
    await supabase.from('employees').delete().eq('id', id)
    fetchData()
  }

  return (
    <section className="bg-white p-6 rounded shadow">
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            className="border rounded p-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Role</label>
          <input
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="Role"
            className="border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded self-end"
        >
          Add
        </button>
      </form>
      <table className="w-full text-sm border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border-b">ID</th>
            <th className="text-left p-2 border-b">Name</th>
            <th className="text-left p-2 border-b">Role</th>
            <th className="text-left p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => (
            <tr key={item.id} className="odd:bg-gray-50">
              <td className="p-2 border-b">{item.id}</td>
              <td className="p-2 border-b">{item.name}</td>
              <td className="p-2 border-b">{item.role}</td>
              <td className="p-2 border-b">
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function PerformancesSection({ supabase }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ idShow: '', time: '' })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data } = await supabase.from('performances').select('*')
    if (data) setItems(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await supabase.from('performances').insert([{ idShow: form.idShow, time: form.time }])
    setForm({ idShow: '', time: '' })
    fetchData()
  }

  async function handleDelete(id) {
    await supabase.from('performances').delete().eq('id', id)
    fetchData()
  }

  return (
    <section className="bg-white p-6 rounded shadow">
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Show ID</label>
          <input
            value={form.idShow}
            onChange={(e) => setForm({ ...form, idShow: e.target.value })}
            placeholder="Show ID"
            className="border rounded p-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Time</label>
          <input
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            placeholder="Time"
            className="border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded self-end"
        >
          Add
        </button>
      </form>
      <table className="w-full text-sm border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border-b">ID</th>
            <th className="text-left p-2 border-b">Show ID</th>
            <th className="text-left p-2 border-b">Time</th>
            <th className="text-left p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => (
            <tr key={item.id} className="odd:bg-gray-50">
              <td className="p-2 border-b">{item.id}</td>
              <td className="p-2 border-b">{item.idShow}</td>
              <td className="p-2 border-b">{item.time}</td>
              <td className="p-2 border-b">
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function CastMembersSection({ supabase }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ idShow: '', employeeId: '' })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data } = await supabase.from('cast_members').select('*')
    if (data) setItems(data)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await supabase.from('cast_members').insert([{ idShow: form.idShow, employeeId: form.employeeId }])
    setForm({ idShow: '', employeeId: '' })
    fetchData()
  }

  async function handleDelete(id) {
    await supabase.from('cast_members').delete().eq('id', id)
    fetchData()
  }

  return (
    <section className="bg-white p-6 rounded shadow">
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Show ID</label>
          <input
            value={form.idShow}
            onChange={(e) => setForm({ ...form, idShow: e.target.value })}
            placeholder="Show ID"
            className="border rounded p-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Employee ID</label>
          <input
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            placeholder="Employee ID"
            className="border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded self-end"
        >
          Add
        </button>
      </form>
      <table className="w-full text-sm border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border-b">ID</th>
            <th className="text-left p-2 border-b">Show ID</th>
            <th className="text-left p-2 border-b">Employee ID</th>
            <th className="text-left p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => (
            <tr key={item.id} className="odd:bg-gray-50">
              <td className="p-2 border-b">{item.id}</td>
              <td className="p-2 border-b">{item.idShow}</td>
              <td className="p-2 border-b">{item.employeeId}</td>
              <td className="p-2 border-b">
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
