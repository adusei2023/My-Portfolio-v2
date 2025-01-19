'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Github, Globe } from 'lucide-react'
import { scaleIn } from '@/lib/motion'
import type { Database } from '@/types/supabase'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectCardProps {
  project: Project
  actions?: boolean
}

export default function ProjectCard({ project, actions = false }: ProjectCardProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      layout
    >
      <Card className="overflow-hidden">
        {project.image_url && (
          <div className="relative h-48">
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <CardHeader>
          <div className="space-y-2">
            <Link 
              href={`/projects/${project.id}`}
              className="text-xl font-semibold hover:underline"
            >
              {project.title}
            </Link>
            
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground">
            {project.description}
          </p>
        </CardContent>
        
        <CardFooter className="gap-4">
          {project.github_url && (
            <Button asChild variant="outline" size="sm">
              <Link href={project.github_url} target="_blank">
                <Github className="w-4 h-4 mr-2" />
                View Code
              </Link>
            </Button>
          )}
          {project.live_url && (
            <Button asChild size="sm">
              <Link href={project.live_url} target="_blank">
                <Globe className="w-4 h-4 mr-2" />
                Live Demo
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

