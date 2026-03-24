"use client";

import { useEffect, useState } from 'react'
import StatusMessage from '@/components/ui/status-message'
import { inputClass } from '@/features/admin/constants'
import AdminPagination from '@/features/admin/components/admin-pagination'
import { useAdminSupabaseClient } from '@/features/admin/components/admin-supabase-provider'
import EmployeeForm from '@/features/admin/components/employee-form'
import EmployeesTable from '@/features/admin/components/employees-table'
import { getFriendlyStorageErrorMessage } from '@/features/admin/lib/admin-errors'
import { revokePreview } from '@/features/admin/lib/image-preview-utils'

const EMPTY_EMPLOYEE_FORM = {
  name: '',
  role: '',
  dateOfBirth: '',
  bio: '',
  profile_picture_URL: '',
}

const pageSize = 10

export default function EmployeesSection() {
  const supabase = useAdminSupabaseClient()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(EMPTY_EMPLOYEE_FORM)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)
  const [status, setStatus] = useState(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    void fetchData()
  }, [page, search])

  function clearStatus() {
    setStatus(null)
  }

  async function fetchData() {
    const from = page * pageSize
    const to = from + pageSize - 1
    const { data, count: totalCount } = await supabase
      .from('employees')
      .select('*', { count: 'exact' })
      .ilike('name', `%${search}%`)
      .order('id')
      .range(from, to)

    if (data) {
      setItems(data)
    }

    if (totalCount !== null) {
      setCount(totalCount)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
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
      const { error } = await supabase.storage.from('pictures').upload(filePath, file)

      if (error) {
        setStatus({ type: 'error', message: getFriendlyStorageErrorMessage(error) })
        return
      }

      const { data } = supabase.storage.from('pictures').getPublicUrl(filePath)
      payload.profile_picture_URL = data.publicUrl
    }

    const result = editingId
      ? await supabase.from('employees').update(payload).eq('id', editingId)
      : await supabase.from('employees').insert([payload])

    if (result.error) {
      setStatus({
        type: 'error',
        message: getFriendlyStorageErrorMessage(result.error),
      })
      return
    }

    setStatus({
      type: 'success',
      message: editingId ? 'Служителят е обновен.' : 'Служителят е добавен.',
    })
    resetForm()
    await fetchData()
  }

  async function handleDelete(id) {
    setStatus(null)

    if (!window.confirm('Сигурни ли сте, че искате да изтриете този служител?')) {
      return
    }

    const { error } = await supabase.from('employees').delete().eq('id', id)

    if (error) {
      setStatus({ type: 'error', message: getFriendlyStorageErrorMessage(error) })
      return
    }

    setStatus({ type: 'success', message: 'Служителят е изтрит.' })
    await fetchData()
  }

  function handleEdit(item) {
    revokePreview(preview)
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

  function updateField(field, value) {
    setForm({ ...form, [field]: value })
  }

  function handleFileSelect(selectedFile, nextPreview) {
    revokePreview(preview)
    setForm({ ...form, profile_picture_URL: '' })
    setFile(selectedFile)
    setPreview(nextPreview)
  }

  function handleClearImage() {
    revokePreview(preview)
    setPreview(null)
    setFile(null)
    setForm({ ...form, profile_picture_URL: '' })
  }

  function resetForm() {
    revokePreview(preview)
    setForm(EMPTY_EMPLOYEE_FORM)
    setEditingId(null)
    setFile(null)
    setPreview(null)
  }

  function handleSearchChange(event) {
    setSearch(event.target.value)
    setPage(0)
  }

  return (
    <section className="space-y-6 text-white">
      <h2 className="mb-4 text-xl font-semibold">Служители</h2>
      <div className="mb-4">
        <input
          placeholder="Търсене на служители"
          value={search}
          onChange={handleSearchChange}
          className={inputClass}
        />
      </div>

      <EmployeeForm
        form={form}
        editingId={editingId}
        preview={preview}
        onFieldChange={updateField}
        onFileSelect={handleFileSelect}
        onClearImage={handleClearImage}
        onSubmit={handleSubmit}
      />

      <StatusMessage status={status} onClear={clearStatus} />

      <AdminPagination
        page={page}
        pageSize={pageSize}
        count={count}
        setPage={setPage}
      />

      <EmployeesTable items={items} onEdit={handleEdit} onDelete={handleDelete} />
    </section>
  )
}
