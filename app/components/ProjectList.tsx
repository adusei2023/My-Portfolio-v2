'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { Project } from '@/types'
import ProjectActions from './ProjectActions'

interface ProjectListProps {
  projects: Project[]
}

export default function ProjectList({ projects }: ProjectListProps) {
  if (!projects?.length) {
    return <p>No projects found.</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="relative group overflow-hidden rounded-lg border p-4 hover:shadow-md transition-shadow"
        >
          {project.image_url && (
            <div className="aspect-video overflow-hidden rounded-md mb-4">
              <img
                src={project.image_url}
                alt={project.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <h3 className="font-semibold mb-2">{project.title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {project.description}
          </p>
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-gray-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  GitHub
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Live Demo
                </a>
              )}
            </div>
            <ProjectActions projectId={project.id} />
          </div>
        </div>
      ))}
    </div>
  )
}

