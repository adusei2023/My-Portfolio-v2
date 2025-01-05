'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { slideUp, fadeIn, staggerContainer } from '@/lib/motion'

export default function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center py-20 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-4xl"
      >
        <motion.h1 
          variants={slideUp}
          className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
        >
          Turning Ideas Into Digital Reality
        </motion.h1>
        
        <motion.p 
          variants={fadeIn}
          className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          Full-stack developer specializing in building exceptional digital experiences. 
          Explore my latest projects and see how I bring ideas to life through code.
        </motion.p>
        
        <motion.div 
          variants={slideUp}
          className="flex gap-4 justify-center"
        >
          <Button size="lg" asChild>
            <Link href="#projects">
              View Projects <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
} 