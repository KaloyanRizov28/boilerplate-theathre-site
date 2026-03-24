import { createClient } from '@/services/supabase/server'

export async function getProgramShows() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('shows')
    .select(`
      id,
      title,
      author,
      slug,
      image_URL,
      poster_URL,
      category,
      performances!inner (
        id,
        time,
        venue
      )
    `)

  if (error) {
    return []
  }

  return data ?? []
}
