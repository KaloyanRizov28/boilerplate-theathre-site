import { createClient } from '@/services/supabase/server'

async function getShowBySlug(supabase, slug) {
  const { data } = await supabase
    .from('shows')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  return data
}

async function getShowEmployees(supabase, showId) {
  const { data } = await supabase
    .from('cast_members')
    .select('employees(id, name, role, profile_picture_URL)')
    .eq('idShow', showId)

  return data ?? []
}

export async function getShowPageData(slug) {
  const supabase = await createClient()
  const show = await getShowBySlug(supabase, slug)

  if (!show) {
    return { show: null, employees: [] }
  }

  const employees = await getShowEmployees(supabase, show.id)

  return {
    show,
    employees,
  }
}
