'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                เกิดข้อผิดพลาด
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                {error.message || 'มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง'}
              </p>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 