'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WriteWordPage() {
  const router = useRouter()

  useEffect(() => {
    // Перенаправляем на страницу выбора уровней
    router.push('/ukrainian/write-word/levels')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Завантаження рівнів...</p>
      </div>
    </div>
  )
}
