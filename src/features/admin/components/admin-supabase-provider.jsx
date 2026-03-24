"use client";

import { createContext, useContext, useRef } from 'react'
import { createClient } from '@/services/supabase/client'

const AdminSupabaseContext = createContext(null)

export function AdminSupabaseProvider({ children }) {
  const supabaseRef = useRef(null)

  if (!supabaseRef.current) {
    supabaseRef.current = createClient()
  }

  return (
    <AdminSupabaseContext.Provider value={supabaseRef.current}>
      {children}
    </AdminSupabaseContext.Provider>
  )
}

export function useAdminSupabaseClient() {
  const supabase = useContext(AdminSupabaseContext)

  if (!supabase) {
    throw new Error('useAdminSupabaseClient must be used inside AdminSupabaseProvider.')
  }

  return supabase
}
