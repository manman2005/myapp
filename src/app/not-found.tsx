import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            404 - ไม่พบหน้าที่คุณต้องการ
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            หน้าที่คุณกำลังค้นหาอาจถูกลบ ย้าย หรือไม่มีอยู่จริง
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  )
} 