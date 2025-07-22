import { Sidebar } from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 bg-gray-100 dark:bg-gray-900">
        {children}
      </main>
    </div>
  )
} 