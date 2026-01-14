'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth-store'
import { Store, LogOut } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function AdminHeader() {
  const router = useRouter()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/admin')
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40">
      <div className="flex items-center justify-between h-full px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Store className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Admin
          </span>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  )
}
