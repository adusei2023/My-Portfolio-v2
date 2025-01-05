'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Project } from '@/types/database'
import ProjectActions from './ProjectActions'
import { scaleIn } from '@/lib/motion'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
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
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
          <ProjectActions projectId={project.id} />
        </div>
        <p className="text-gray-600 mb-4">{project.description}</p>
        {project.tags && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

