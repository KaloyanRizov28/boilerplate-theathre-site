"use client";

import { useEffect, useState } from 'react'
import StatusMessage from '@/components/ui/status-message'
import CastForm from './cast-form'
import CastTable from './cast-table'
import {
  buildCastPayload,
  computeCastChanges,
  findShowTitleById,
  getAssignedEmployeeIds,
} from './cast-section-utils'

const EMPTY_CAST_FORM = { idShow: '', employeeId: '', employeeIds: [] }

export default function CastSection({ supabase }) {
  const [items, setItems] = useState([])
  const [shows, setShows] = useState([])
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(EMPTY_CAST_FORM)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState(null)
  const [filterShowId, setFilterShowId] = useState('')
  const [employeeSearch, setEmployeeSearch] = useState('')

  useEffect(() => {
    void fetchShows()
    void fetchEmployees()
    void fetchData()
  }, [])

  useEffect(() => {
    if (!form.idShow || editingId) {
      return
    }

    const assignedEmployeeIds = getAssignedEmployeeIds(items, form.idShow)

    setForm({
      ...form,
      employeeIds: assignedEmployeeIds,
    })
  }, [editingId, form.idShow, items])

  function clearStatus() {
    setStatus(null)
  }

  async function fetchShows() {
    const { data } = await supabase.from('shows').select('id, title')

    if (data) {
      setShows(data)
    }
  }

  async function fetchEmployees() {
    const { data } = await supabase.from('employees').select('id, name')

    if (data) {
      setEmployees(data)
    }
  }

  async function fetchData() {
    const { data } = await supabase
      .from('cast_members')
      .select('id, idShow, employeeId, shows(title), employees(name)')
      .order('id')

    if (data) {
      setItems(data)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
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

        if (error) {
          throw error
        }

        setStatus({ type: 'success', message: 'Съставът е обновен.' })
      } else {
        if (!form.idShow) {
          setStatus({ type: 'error', message: 'Изберете спектакъл.' })
          return
        }

        const { toAdd, toRemove } = computeCastChanges(
          items,
          form.idShow,
          form.employeeIds
        )

        if (toAdd.length) {
          const payload = buildCastPayload(form.idShow, toAdd)
          const { error } = await supabase.from('cast_members').insert(payload)

          if (error) {
            throw error
          }
        }

        if (toRemove.length) {
          const { error } = await supabase
            .from('cast_members')
            .delete()
            .eq('idShow', form.idShow)
            .in('employeeId', toRemove)

          if (error) {
            throw error
          }
        }

        const changeSummaryParts = []

        if (toAdd.length) {
          changeSummaryParts.push(`${toAdd.length} добавени`)
        }

        if (toRemove.length) {
          changeSummaryParts.push(`${toRemove.length} премахнати`)
        }

        setStatus({
          type: 'success',
          message: `Съставът е записан. ${changeSummaryParts.join(', ') || 'Няма промени'}.`,
        })
      }

      setForm(EMPTY_CAST_FORM)
      setEditingId(null)
      setEmployeeSearch('')
      await fetchData()
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Грешка при запис на състав.',
      })
    }
  }

  function handleEdit(item) {
    setForm({
      idShow: item.idShow || '',
      employeeId: item.employeeId || '',
      employeeIds: [],
    })
    setEditingId(item.id)
    setEmployeeSearch('')
  }

  async function handleDeleteCast(item) {
    try {
      setStatus(null)

      const showName = item?.shows?.title || 'спектакъл'
      const employeeName = item?.employees?.name || 'участник'
      const confirmed = window.confirm(`Премахване на „${employeeName}“ от „${showName}“?`)

      if (!confirmed) {
        return
      }

      const { error } = await supabase.from('cast_members').delete().eq('id', item.id)

      if (error) {
        throw error
      }

      setStatus({ type: 'success', message: 'Участникът е изтрит.' })
      await fetchData()
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Грешка при изтриване.',
      })
    }
  }

  function handleSelectedShowChange(showId) {
    setForm({ ...form, idShow: showId })
    setFilterShowId(showId)
  }

  function handleEmployeeSelectionChange(employeeIds) {
    setForm({
      ...form,
      employeeIds,
    })
  }

  function handleFilterReset() {
    setFilterShowId('')
  }

  function handleSingleEmployeeChange(employeeId) {
    setForm({ ...form, employeeId })
  }

  return (
    <section className="space-y-6 text-white">
      <h2 className="mb-4 text-xl font-semibold text-white">Актьорски състав</h2>

      <CastForm
        editingId={editingId}
        form={form}
        shows={shows}
        employees={employees}
        employeeSearch={employeeSearch}
        onShowChange={handleSelectedShowChange}
        onEmployeeChange={handleSingleEmployeeChange}
        onEmployeeSearchChange={setEmployeeSearch}
        onEmployeeIdsChange={handleEmployeeSelectionChange}
        onSubmit={handleSubmit}
      />

      <div className="mb-6 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="text-sm text-gray-300">
          {filterShowId ? (
            <span className="flex items-center gap-2">
              Показва състава за:
              <span className="font-bold text-white">
                {findShowTitleById(shows, filterShowId) || 'избрания спектакъл'}
              </span>
            </span>
          ) : (
            'Показва състава за всички спектакли'
          )}
        </div>
        {filterShowId && (
          <button
            type="button"
            onClick={handleFilterReset}
            className="rounded-lg border border-white/5 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
          >
            Покажи всички
          </button>
        )}
      </div>

      <StatusMessage status={status} onClear={clearStatus} />

      <CastTable
        items={items}
        filterShowId={filterShowId}
        onEdit={handleEdit}
        onDelete={handleDeleteCast}
      />
    </section>
  )
}
