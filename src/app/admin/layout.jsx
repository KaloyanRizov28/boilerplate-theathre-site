import { redirect } from 'next/navigation'
import AdminShell from '@/features/admin/components/admin-shell'
import { AdminSupabaseProvider } from '@/features/admin/components/admin-supabase-provider'
import { createClient } from '@/services/supabase/server'

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect('/login')
  }

  return (
    <AdminSupabaseProvider>
      <AdminShell>{children}</AdminShell>
    </AdminSupabaseProvider>
  )
}
