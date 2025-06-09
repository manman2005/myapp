export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-gray-400">กำลังโหลด...</p>
      </div>
    </div>
  )
} 