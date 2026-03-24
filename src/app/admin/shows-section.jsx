"use client";

import { useEffect, useState } from 'react'
import StatusMessage from '@/components/ui/status-message'
import AdminPagination from './admin-pagination'
import { getFriendlyStorageErrorMessage } from './admin-errors'
import { buttonBaseClass, inputClass } from './constants'
import { revokePreview } from './image-preview-utils'
import ShowEditForm from './show-edit-form'
import {
  buildShowForm,
  createEmptyShowUploads,
  EMPTY_SHOW_FORM,
  SHOW_IMAGE_FIELD_MAP,
  SHOW_IMAGE_KEYS,
} from './show-form-config'
import ShowsTable from './shows-table'

const pageSize = 10

export default function ShowsSection({ supabase }) {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)
  const [status, setStatus] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_SHOW_FORM)
  const [uploads, setUploads] = useState(createEmptyShowUploads)

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
      .from('shows')
      .select('*, cast_members!left(employees(name))', { count: 'exact' })
      .ilike('title', `%${search}%`)
      .order('id')
      .range(from, to)

    if (data) {
      setItems(data)
    }

    if (totalCount !== null) {
      setCount(totalCount)
    }
  }

  async function handleSync() {
    setStatus(null)
    setSyncing(true)

    try {
      const response = await fetch('/api/entase/sync', { method: 'POST' })
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

  async function handleDelete(id) {
    setStatus(null)

    if (!window.confirm('Сигурни ли сте, че искате да изтриете този спектакъл?')) {
      return
    }

    const { error } = await supabase.from('shows').delete().eq('id', id)

    if (error) {
      setStatus({ type: 'error', message: error.message })
      return
    }

    setStatus({ type: 'success', message: 'Спектакълът е изтрит.' })
    await fetchData()
  }

  function handleEdit(show) {
    resetForm()
    setEditing(show)
    setForm(buildShowForm(show))
  }

  function updateField(field, value) {
    setForm({ ...form, [field]: value })
  }

  function updateImageSelection(key, file, preview) {
    const fieldConfig = SHOW_IMAGE_FIELD_MAP[key]

    revokePreview(uploads[key]?.preview)

    setUploads({
      ...uploads,
      [key]: { file, preview },
    })

    setForm({
      ...form,
      [fieldConfig.urlField]: '',
    })
  }

  function clearImageField(key) {
    const fieldConfig = SHOW_IMAGE_FIELD_MAP[key]

    revokePreview(uploads[key]?.preview)

    setUploads({
      ...uploads,
      [key]: { file: null, preview: null },
    })

    setForm({
      ...form,
      [fieldConfig.urlField]: '',
    })
  }

  function resetForm() {
    for (const key of SHOW_IMAGE_KEYS) {
      revokePreview(uploads[key]?.preview)
    }

    setEditing(null)
    setForm(EMPTY_SHOW_FORM)
    setUploads(createEmptyShowUploads())
  }

  async function uploadIfNeeded(file, folder) {
    if (!file) {
      return null
    }

    const timestamp = Date.now()
    const sanitizedName = file.name?.replace(/[^\w.\-]+/g, '_') || 'image.jpg'
    const path = `Shows/${folder}/${timestamp}-${sanitizedName}`
    const { error } = await supabase.storage.from('pictures').upload(path, file)

    if (error) {
      throw new Error(getFriendlyStorageErrorMessage(error))
    }

    const { data } = supabase.storage.from('pictures').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleUpdate(event) {
    event.preventDefault()

    if (!editing) {
      return
    }

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

    try {
      for (const field of Object.values(SHOW_IMAGE_FIELD_MAP)) {
        const file = uploads[field.key]?.file

        if (file) {
          payload[field.urlField] = await uploadIfNeeded(file, field.folder)
        }
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Неуспешно качване на изображение.',
      })
      return
    }

    const { error } = await supabase
      .from('shows')
      .update(payload)
      .eq('id', editing.id)

    if (error) {
      setStatus({ type: 'error', message: error.message })
      return
    }

    setStatus({ type: 'success', message: 'Спектакълът е обновен.' })
    resetForm()
    await fetchData()
  }

  function handleSearchChange(event) {
    setSearch(event.target.value)
    setPage(0)
  }

  return (
    <section className="space-y-6 text-white">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          placeholder="Търсене на спектакли"
          value={search}
          onChange={handleSearchChange}
          className={inputClass}
        />
        <button
          onClick={handleSync}
          disabled={syncing}
          className={`${buttonBaseClass} ${
            syncing ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
          } disabled:opacity-60`}
        >
          {syncing ? 'Синхронизиране…' : 'Синхронизирай от Entase'}
        </button>
      </div>

      <StatusMessage status={status} onClear={clearStatus} />

      {editing && (
        <ShowEditForm
          editingTitle={editing.title}
          form={form}
          uploads={uploads}
          onFieldChange={updateField}
          onImageSelect={updateImageSelection}
          onImageClear={clearImageField}
          onSubmit={handleUpdate}
          onCancel={resetForm}
        />
      )}

      <AdminPagination
        page={page}
        pageSize={pageSize}
        count={count}
        setPage={setPage}
      />

      <ShowsTable items={items} onEdit={handleEdit} onDelete={handleDelete} />
    </section>
  )
}
