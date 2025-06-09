'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">เกิดข้อผิดพลาดร้ายแรง</h2>
            <p className="text-gray-600 mb-6">
              ขออภัย เกิดข้อผิดพลาดร้ายแรงขึ้น กรุณารีเฟรชหน้าเว็บ
            </p>
            <button
              onClick={reset}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      </body>
    </html>
  )
} 