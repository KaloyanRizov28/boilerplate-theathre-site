import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../../lib/supabase/admin'

export async function POST(request) {
  const body = await request.json()
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('employees').insert([body])
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data, { status: 200 })
}

export async function PUT(request) {
  const { id, ...updates } = await request.json()
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data, { status: 200 })
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { error } = await supabase.from('employees').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ success: true }, { status: 200 })
}
