import { createClient } from '@/services/supabase/server'
import { groupEmployeesByRole } from './group-employees'

export async function getTeamGroups() {
  const supabase = await createClient()
  const { data: employees } = await supabase
    .from('employees')
    .select('id, name, role, profile_picture_URL')
    .order('name')

  return groupEmployeesByRole(employees)
}
