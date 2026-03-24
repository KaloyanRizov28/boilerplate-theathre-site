"use client";

import { buttonBaseClass, inputClass } from './constants'
import ShowImageField from './show-image-field'
import { SHOW_IMAGE_FIELDS } from './show-form-config'

function buildFieldChangeHandler(field, onFieldChange) {
  return function handleFieldChange(event) {
    onFieldChange(field, event.target.value)
  }
}

function buildUrlChangeHandler(field, onFieldChange) {
  return function handleUrlChange(value) {
    onFieldChange(field, value)
  }
}

function buildImageSelectHandler(key, onImageSelect) {
  return function handleImageSelect(file, preview) {
    onImageSelect(key, file, preview)
  }
}

function buildImageClearHandler(key, onImageClear) {
  return function handleImageClear() {
    onImageClear(key)
  }
}

export default function ShowEditForm({
  editingTitle,
  form,
  uploads,
  onFieldChange,
  onImageSelect,
  onImageClear,
  onSubmit,
  onCancel,
}) {
  const titleChangeHandler = buildFieldChangeHandler('title', onFieldChange)
  const categoryChangeHandler = buildFieldChangeHandler('category', onFieldChange)
  const authorChangeHandler = buildFieldChangeHandler('author', onFieldChange)
  const informationChangeHandler = buildFieldChangeHandler('information', onFieldChange)

  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 grid gap-6 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
    >
      <h3 className="text-lg font-semibold">Редакция на спектакъл: {editingTitle}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className="text-sm">Заглавие</label>
          <input
            className={inputClass}
            value={form.title}
            onChange={titleChangeHandler}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm">Категория</label>
          <input
            className={inputClass}
            value={form.category}
            onChange={categoryChangeHandler}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm">Автор</label>
          <input
            className={inputClass}
            value={form.author}
            onChange={authorChangeHandler}
          />
        </div>
        <div className="flex flex-col sm:col-span-2">
          <label className="text-sm">Информация</label>
          <textarea
            className={`${inputClass} h-32`}
            value={form.information}
            onChange={informationChangeHandler}
          />
        </div>

        {SHOW_IMAGE_FIELDS.map((field) => (
          <ShowImageField
            key={field.key}
            label={field.label}
            url={form[field.urlField]}
            preview={uploads[field.key]?.preview}
            previewAlt={field.previewAlt}
            previewClassName={field.previewClassName}
            wrapperClassName={field.wrapperClassName}
            onUrlChange={buildUrlChangeHandler(field.urlField, onFieldChange)}
            onFileSelect={buildImageSelectHandler(field.key, onImageSelect)}
            onClear={buildImageClearHandler(field.key, onImageClear)}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <button type="submit" className={`${buttonBaseClass} bg-blue-500`}>
          Запази промените
        </button>
        <button
          type="button"
          className={`${buttonBaseClass} bg-theater-hover text-white`}
          onClick={onCancel}
        >
          Отказ
        </button>
      </div>
    </form>
  )
}
