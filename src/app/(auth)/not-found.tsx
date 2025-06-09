import Link from 'next/link'

export default function AuthNotFound() {
  return (
    <div className="p-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/50 rounded-lg p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              404 - ไม่พบหน้าที่คุณต้องการ
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>หน้าที่คุณกำลังค้นหาอาจถูกลบ ย้าย หรือไม่มีอยู่จริง</p>
            </div>
            <div className="mt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                กลับหน้าแดชบอร์ด
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 