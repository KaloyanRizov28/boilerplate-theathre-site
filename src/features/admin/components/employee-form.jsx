"use client";

import { buttonBaseClass, inputClass } from '@/features/admin/constants'

function buildFieldChangeHandler(field, onFieldChange) {
  return function handleFieldChange(event) {
    onFieldChange(field, event.target.value)
  }
}

export default function EmployeeForm({
  form,
  editingId,
  preview,
  onFieldChange,
  onFileSelect,
  onClearImage,
  onSubmit,
}) {
  const nameChangeHandler = buildFieldChangeHandler('name', onFieldChange)
  const roleChangeHandler = buildFieldChangeHandler('role', onFieldChange)
  const dateOfBirthChangeHandler = buildFieldChangeHandler('dateOfBirth', onFieldChange)
  const bioChangeHandler = buildFieldChangeHandler('bio', onFieldChange)

  function handleFileChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    onFileSelect(file, URL.createObjectURL(file))
  }

  return (
    <>
      <h3 className="mb-2 text-lg font-medium">
        {editingId ? 'Редакция на служител' : 'Добавяне на служител'}
      </h3>
      <form onSubmit={onSubmit} className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Име</label>
          <input
            value={form.name}
            onChange={nameChangeHandler}
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Роля</label>
          <input
            value={form.role}
            onChange={roleChangeHandler}
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Дата на раждане</label>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={dateOfBirthChangeHandler}
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
                onClick={onClearImage}
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
            onChange={bioChangeHandler}
            className={`${inputClass} h-32`}
          />
        </div>
        <button
          type="submit"
          className={`${buttonBaseClass} ${editingId ? 'bg-blue-500' : 'bg-green-500'}`}
        >
          {editingId ? 'Обнови' : 'Добави'}
        </button>
      </form>
    </>
  )
}
