'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import type { Database } from '@/types/supabase'

type Project = Database['public']['Tables']['projects']['Row']

export default function EditProjectForm({ project }: { project: Project }) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description || '',
    github_url: project.github_url || '',
    live_url: project.live_url || '',
    tags: project.tags?.join(', ') || '',
    featured: project.featured || false,
    published: project.published || false,
  })
  
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let imageUrl = project.image_url
      if (imageFile) {
        // Delete old image if it exists
        if (project.image_url) {
          const oldImagePath = project.image_url.split('/').pop()
          if (oldImagePath) {
            await supabase.storage
              .from('project-images')
              .remove([oldImagePath])
          }
        }

        // Upload new image
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName)

        imageUrl = publicUrl
      }

      const { error } = await supabase
        .from('projects')
        .update({
          ...formData,
          image_url: imageUrl,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        })
        .eq('id', project.id)

      if (error) throw error

      toast.success('Project updated successfully')
      router.refresh()
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update project')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Project Image</Label>
        {project.image_url && !imageFile && (
          <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {project.image_url ? 'Change Image' : 'Add Image'}
          </Button>
          {imageFile && (
            <span className="text-sm text-muted-foreground">
              {imageFile.name}
            </span>
          )}
        </div>
        <Input
          id="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="github_url">GitHub URL</Label>
        <Input
          id="github_url"
          type="url"
          value={formData.github_url}
          onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="live_url">Live URL</Label>
        <Input
          id="live_url"
          type="url"
          value={formData.live_url}
          onChange={(e) => setFormData(prev => ({ ...prev, live_url: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
          />
          <Label htmlFor="featured">Feature this project</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
          />
          <Label htmlFor="published">Publish project</Label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Saving Changes...' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
} 