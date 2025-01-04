'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  image_url?: string
  github_url?: string
  live_url?: string
  tags?: string[]
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.image_url || '/placeholder-project.jpg'}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <CardHeader>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{project.title}</h3>
          <div className="flex flex-wrap gap-2">
            {project.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{project.description}</p>
      </CardContent>
      <CardFooter className="gap-4">
        {project.github_url && (
          <Link
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
            Source
          </Link>
        )}
        {project.live_url && (
          <Link
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Live Demo
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}

