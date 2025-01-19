import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Github, Globe } from 'lucide-react'
import Link from 'next/link'
import type { Database } from '@/types/supabase'

type Project = Database['public']['Tables']['projects']['Row']

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .eq('id', params.id)
    .single()

  if (!project || !project.published) {
    notFound()
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <div className="space-y-8">
        {project.image_url && (
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{project.title}</h1>
          
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="prose dark:prose-invert max-w-none">
            {project.description}
          </div>

          <div className="flex gap-4 pt-4">
            {project.github_url && (
              <Button asChild variant="outline">
                <Link href={project.github_url} target="_blank">
                  <Github className="w-4 h-4 mr-2" />
                  View Code
                </Link>
              </Button>
            )}
            {project.live_url && (
              <Button asChild>
                <Link href={project.live_url} target="_blank">
                  <Globe className="w-4 h-4 mr-2" />
                  Live Demo
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 