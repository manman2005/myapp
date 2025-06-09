'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Wrench,
  Users,
  FileText,
  Settings,
  LogOut,
  Loader2
} from 'lucide-react'

interface SidebarLinkProps {
  href: string
  icon: React.ElementType
  title: string
  isActive: boolean
}

function SidebarLink({ href, icon: Icon, title, isActive }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      )}
    >
      <Icon className="w-5 h-5" />
      {title}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
      setIsSigningOut(false)
    }
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-md">
      <div className="p-4">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">SVC Computer</h1>
      </div>
      <nav className="mt-4">
        <Link 
          href="/dashboard" 
          className={`flex items-center px-4 py-2 ${
            isActive('/dashboard')
              ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <span className="mr-2">📊</span>
          แดชบอร์ด
        </Link>
        <Link 
          href="/work-orders" 
          className={`flex items-center px-4 py-2 ${
            isActive('/work-orders')
              ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <span className="mr-2">📝</span>
          รายการงาน
        </Link>
        <Link 
          href="/customers" 
          className={`flex items-center px-4 py-2 ${
            isActive('/customers')
              ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <span className="mr-2">👥</span>
          ลูกค้า
        </Link>
        <Link 
          href="/reports" 
          className={`flex items-center px-4 py-2 ${
            isActive('/reports')
              ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <span className="mr-2">📈</span>
          รายงาน
        </Link>
        <Link 
          href="/settings" 
          className={`flex items-center px-4 py-2 ${
            isActive('/settings')
              ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <span className="mr-2">⚙️</span>
          ตั้งค่า
        </Link>
      </nav>
      <div className="p-4 border-t dark:border-gray-700">
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className={cn(
            'flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isSigningOut
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          )}
        >
          {isSigningOut ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
          {isSigningOut ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
        </button>
      </div>
    </aside>
  )
} 