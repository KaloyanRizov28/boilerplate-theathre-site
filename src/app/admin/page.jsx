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
    <div className="p-4">
      <nav className="flex gap-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={activeTab === tab.key ? 'font-bold' : ''}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {activeTab === 'shows' && <ShowsSection supabase={supabase} />}
      {activeTab === 'employees' && <EmployeesSection supabase={supabase} />}
      {activeTab === 'performances' && <PerformancesSection supabase={supabase} />}
      {activeTab === 'cast_members' && <CastMembersSection supabase={supabase} />}
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
    <section>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="border p-1"
        />
        <input
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          placeholder="Image URL"
          className="border p-1"
        />
        <button type="submit" className="border px-2">Add</button>
      </form>
      <table className="border-collapse border">
        <thead>
          <tr>
            <th className="border px-2">ID</th>
            <th className="border px-2">Title</th>
            <th className="border px-2">Image URL</th>
            <th className="border px-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => (
            <tr key={item.id}>
              <td className="border px-2">{item.id}</td>
              <td className="border px-2">{item.title}</td>
              <td className="border px-2">{item.image_url}</td>
              <td className="border px-2">
                <button onClick={() => handleDelete(item.id)} className="text-red-500">Delete</button>
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
    <section>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          className="border p-1"
        />
        <input
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          placeholder="Role"
          className="border p-1"
        />
        <button type="submit" className="border px-2">Add</button>
      </form>
      <table className="border-collapse border">
        <thead>
          <tr>
            <th className="border px-2">ID</th>
            <th className="border px-2">Name</th>
            <th className="border px-2">Role</th>
            <th className="border px-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => (
            <tr key={item.id}>
              <td className="border px-2">{item.id}</td>
              <td className="border px-2">{item.name}</td>
              <td className="border px-2">{item.role}</td>
              <td className="border px-2">
                <button onClick={() => handleDelete(item.id)} className="text-red-500">Delete</button>
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
    <section>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          value={form.idShow}
          onChange={(e) => setForm({ ...form, idShow: e.target.value })}
          placeholder="Show ID"
          className="border p-1"
        />
        <input
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          placeholder="Time"
          className="border p-1"
        />
        <button type="submit" className="border px-2">Add</button>
      </form>
      <table className="border-collapse border">
        <thead>
          <tr>
            <th className="border px-2">ID</th>
            <th className="border px-2">Show ID</th>
            <th className="border px-2">Time</th>
            <th className="border px-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => (
            <tr key={item.id}>
              <td className="border px-2">{item.id}</td>
              <td className="border px-2">{item.idShow}</td>
              <td className="border px-2">{item.time}</td>
              <td className="border px-2">
                <button onClick={() => handleDelete(item.id)} className="text-red-500">Delete</button>
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
    <section>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          value={form.idShow}
          onChange={(e) => setForm({ ...form, idShow: e.target.value })}
          placeholder="Show ID"
          className="border p-1"
        />
        <input
          value={form.employeeId}
          onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
          placeholder="Employee ID"
          className="border p-1"
        />
        <button type="submit" className="border px-2">Add</button>
      </form>
      <table className="border-collapse border">
        <thead>
          <tr>
            <th className="border px-2">ID</th>
            <th className="border px-2">Show ID</th>
            <th className="border px-2">Employee ID</th>
            <th className="border px-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => (
            <tr key={item.id}>
              <td className="border px-2">{item.id}</td>
              <td className="border px-2">{item.idShow}</td>
              <td className="border px-2">{item.employeeId}</td>
              <td className="border px-2">
                <button onClick={() => handleDelete(item.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
