'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PageHeaderProps } from '../../types'

const colorClasses = {
  purple: 'from-purple-600 to-indigo-600',
  orange: 'from-orange-600 to-amber-600',
  blue: 'from-blue-600 to-indigo-600',
}

const hoverColors = {
  purple: 'hover:text-purple-600',
  orange: 'hover:text-orange-600',
  blue: 'hover:text-blue-600',
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  showBack = true, 
  backHref = '/',
  backLabel = 'Назад до головної',
  color = 'purple'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      {showBack && (
        <Link
          href={backHref}
          className={`inline-flex items-center text-gray-600 ${hoverColors[color]} transition-colors mb-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md`}
        >
          ← {backLabel}
        </Link>
      )}
      
      <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent mb-4`}>
        {title}
      </h1>
    </motion.div>
  )
}
