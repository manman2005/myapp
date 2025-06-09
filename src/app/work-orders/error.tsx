'use client'

export default function WorkOrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-6">
      <div className="bg-red-50 dark:bg-red-900/50 rounded-lg p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              เกิดข้อผิดพลาด
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{error.message || 'ไม่สามารถโหลดรายการงานได้'}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 