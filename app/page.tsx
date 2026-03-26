'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent mb-6"
        >
          ThinkGames
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 mb-12 font-medium"
        >
          Привіт! Почни свою освітню подорож
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/math"
            className="inline-block px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:from-primary-600 hover:to-secondary-600"
          >
            Математика
          </Link>
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 text-center text-gray-500 text-sm"
      >
        <p>Освітні ігри для дітей 8-12 років</p>
      </motion.div>
    </div>
  )
}
