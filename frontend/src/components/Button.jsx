import React from 'react'
import { motion } from 'framer-motion'

export default function Button({children, onClick, className='', ariaLabel}){
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      className={`px-4 py-3 rounded-lg bg-gray-800/30 hover:bg-gray-700/40 ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  )
}
