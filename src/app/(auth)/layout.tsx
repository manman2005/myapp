import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Sidebar } from '@/components/Sidebar'
import { Suspense } from 'react'
import Loading from './loading'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return redirect('/sign-in')
  }

  return (
    <div className="flex h-screen dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  )
} 