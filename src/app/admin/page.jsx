import { redirect } from 'next/navigation'
import { ADMIN_DEFAULT_PATH } from '@/features/admin/constants'

export default function AdminPage() {
  redirect(ADMIN_DEFAULT_PATH)
}
