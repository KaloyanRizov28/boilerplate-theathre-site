"use client";

export default function StatusMessage({ status }) {
  if (!status) return null;
  const color = status.type === 'error' ? 'text-red-500' : 'text-green-500';
  return <p className={`mt-4 ${color}`}>{status.message}</p>;
}
