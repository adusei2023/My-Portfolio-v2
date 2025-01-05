'use client'

import { motion } from 'framer-motion'
import { staggerContainer, fadeIn } from '@/lib/motion'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
}

export default function AnimatedSection({ children, className }: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  )
} 