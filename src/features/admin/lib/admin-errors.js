export function getFriendlyStorageErrorMessage(error) {
  if (!error) {
    return 'Възникна неочаквана грешка.'
  }

  const message = error.message || 'Възникна неочаквана грешка.'

  if (message.toLowerCase().includes('row level security')) {
    return (
      'Нямате права за качване на изображения. ' +
      'Моля, коригирайте Supabase политиките, за да позволите запис в bucket-а pictures.'
    )
  }

  return message
}
