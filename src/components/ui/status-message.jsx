import React from 'react'

export default function StatusMessage({ status, onClear }) {
  if (!status) return null
  const base =
    status.type === 'error' ? 'bg-red-600' : 'bg-green-600'
  return (
    <div className={`${base} text-white p-2 rounded mb-4`}>
      <div className="flex justify-between items-center">
        <span>{status.message}</span>
        {onClear && (
          <button
            onClick={onClear}
            className="font-bold ml-4"
            aria-label="Close message"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  )
}
