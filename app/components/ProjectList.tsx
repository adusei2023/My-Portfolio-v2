'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import type { Database } from '@/types/supabase'

type Project = Database['public']['Tables']['projects']['Row']

export default function ProjectList({ projects: initialProjects }: { projects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    setIsDeleting(id)
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      setProjects(projects.filter(project => project.id !== id))
      toast.success('Project deleted successfully')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete project')
    } finally {
      setIsDeleting(null)
    }
  }

  const togglePublished = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ published: !currentState })
        .eq('id', id)

      if (error) throw error

      setProjects(projects.map(project => 
        project.id === id 
          ? { ...project, published: !project.published }
          : project
      ))
      
      toast.success(`Project ${!currentState ? 'published' : 'unpublished'}`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update project')
    }
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No projects yet. Add your first project!
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <Card key={project.id}>
          {project.image_url && (
            <div className="relative h-48">
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          )}
          
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{project.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Switch
                  checked={project.published}
                  onCheckedChange={() => togglePublished(project.id, project.published)}
                  aria-label="Toggle publish"
                />
                {project.published ? (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-muted-foreground line-clamp-2 mb-4">
              {project.description}
            </p>
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={`/dashboard/projects/${project.id}`}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(project.id)}
              disabled={isDeleting === project.id}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting === project.id ? 'Deleting...' : 'Delete'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

