'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Github, Globe } from 'lucide-react'
import type { Project } from '@/types/database'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden">
        <div className="relative h-48">
          {project.image_url ? (
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              No image
            </div>
          )}
        </div>
        
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          {project.tags && (
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="gap-2">
          {project.github_url && (
            <Button asChild size="sm" variant="outline">
              <Link href={project.github_url} target="_blank">
                <Github className="w-4 h-4 mr-2" />
                Code
              </Link>
            </Button>
          )}
          {project.live_url && (
            <Button asChild size="sm">
              <Link href={project.live_url} target="_blank">
                <Globe className="w-4 h-4 mr-2" />
                Live
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
} 