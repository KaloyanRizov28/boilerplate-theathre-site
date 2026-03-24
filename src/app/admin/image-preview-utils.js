export function revokePreview(preview) {
  if (preview?.startsWith('blob:')) {
    URL.revokeObjectURL(preview)
  }
}
