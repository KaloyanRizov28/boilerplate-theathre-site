export const ADMIN_NAV_ITEMS = [
  { key: 'shows', label: 'Спектакли', href: '/admin/shows' },
  { key: 'employees', label: 'Служители', href: '/admin/employees' },
  { key: 'performances', label: 'Представления', href: '/admin/performances' },
  { key: 'cast', label: 'Актьорски състав', href: '/admin/cast' },
  { key: 'admins', label: 'Администратори', href: '/admin/admins' },
  { key: 'content', label: 'Съдържание', href: '/admin/content' },
]

export const ADMIN_DEFAULT_PATH = ADMIN_NAV_ITEMS[0].href

export function getActiveAdminNavItem(pathname) {
  for (const item of ADMIN_NAV_ITEMS) {
    if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
      return item
    }
  }

  return ADMIN_NAV_ITEMS[0]
}

export const inputClass =
  'w-full border border-white/10 rounded-lg p-2.5 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theater-blue/50 focus:border-theater-blue/50 transition-all'

export const buttonBaseClass =
  'px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'

export const selectClass =
  'w-full border border-white/10 rounded-lg p-2.5 bg-theater-light text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-theater-blue/50'
