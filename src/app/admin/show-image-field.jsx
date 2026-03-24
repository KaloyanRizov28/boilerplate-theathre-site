"use client";

import { inputClass } from './constants'

export default function ShowImageField({
  label,
  url,
  preview,
  previewAlt,
  previewClassName,
  wrapperClassName,
  onUrlChange,
  onFileSelect,
  onClear,
}) {
  const resolvedPreview = preview || url

  function handleUrlChange(event) {
    onUrlChange(event.target.value)
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    onFileSelect(file, URL.createObjectURL(file))
  }

  return (
    <div className={`flex flex-col ${wrapperClassName}`}>
      <label className="text-sm">{label}</label>
      <input
        className={inputClass}
        placeholder="https://..."
        value={url}
        onChange={handleUrlChange}
      />
      <div className="mt-2 flex items-start gap-3">
        <input
          type="file"
          accept="image/*"
          className={inputClass}
          onChange={handleFileChange}
        />
      </div>
      {resolvedPreview && (
        <div className="mt-2 flex items-center gap-3">
          <img
            src={resolvedPreview}
            alt={previewAlt}
            className={previewClassName}
          />
          <button
            type="button"
            className="rounded bg-red-500 px-3 py-2 text-white"
            onClick={onClear}
          >
            Премахни
          </button>
        </div>
      )}
    </div>
  )
}
