'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { Upload } from 'lucide-react'
import type { Database } from '@/types/supabase'

export default function AddProjectForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get('title') as string
      const description = formData.get('description') as string
      const githubUrl = formData.get('github_url') as string
      const liveUrl = formData.get('live_url') as string
      const featured = formData.get('featured') === 'on'
      const tags = formData.get('tags') as string
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean)

      let imageUrl = null
      if (imageFile) {
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
        .insert({
          title,
          description,
          github_url: githubUrl,
          live_url: liveUrl,
          image_url: imageUrl,
          featured,
          tags: tagArray,
          published: true
        })

      if (error) throw error

      toast.success('Project added successfully')
      router.refresh()
      e.currentTarget.reset()
      setImageFile(null)
    } catch (error: any) {
      toast.error(error.message || 'Failed to add project')
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
          name="title"
          required
          placeholder="Enter project title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          placeholder="Describe your project"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="github_url">GitHub URL</Label>
        <Input
          id="github_url"
          name="github_url"
          type="url"
          placeholder="https://github.com/username/project"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="live_url">Live URL</Label>
        <Input
          id="live_url"
          name="live_url"
          type="url"
          placeholder="https://your-project.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="react, nextjs, typescript"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Project Image</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Image
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

      <div className="flex items-center gap-2">
        <Switch id="featured" name="featured" />
        <Label htmlFor="featured">Feature this project</Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Adding Project...' : 'Add Project'}
      </Button>
    </form>
  )
}

