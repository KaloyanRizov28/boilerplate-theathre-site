import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co'
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'service-role-key'
  return createClient(
    url,
    serviceRoleKey,
    {
      auth: { persistSession: false },
    }
  )
}
