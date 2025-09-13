import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../lib/supabase/admin'

export async function POST(request) {
  const { email, is_admin = true } = await request.json()
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: list, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 400 })
  }
  const user = list.users.find((u) => u.email === email)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { is_admin },
  })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ success: true })
}
