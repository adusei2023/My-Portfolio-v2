'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'

export default function AddProjectForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    github_url: '',
    live_url: '',
    tags: '',
  })
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const setupStorage = async () => {
    try {
      const response = await fetch('/api/storage/setup', {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to set up storage')
      }
      return true
    } catch (error) {
      console.error('Storage setup error:', error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      let image_url = ''
      if (image) {
        try {
          // Upload image
          const fileExt = image.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          
          const { error: uploadError, data } = await supabase.storage
            .from('project-images')
            .upload(`projects/${fileName}`, image, {
              cacheControl: '3600',
              upsert: false,
              contentType: image.type
            })

          if (uploadError) {
            console.error('Upload error:', uploadError)
            throw new Error('Failed to upload image')
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('project-images')
            .getPublicUrl(`projects/${fileName}`)

          image_url = publicUrl
        } catch (uploadError) {
          console.error('Image upload error:', uploadError)
          toast.error('Failed to upload image. Continuing without image...')
        }
      }

      // Create project
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image_url,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create project')
      }

      toast.success('Project added successfully!')
      router.refresh()
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        github_url: '',
        live_url: '',
        tags: '',
      })
      setImage(null)
    } catch (error: any) {
      console.error('Error adding project:', error)
      toast.error(error.message || 'Failed to add project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title *
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description *
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium mb-1">
          Project Image
        </label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </div>

      <div>
        <label htmlFor="github_url" className="block text-sm font-medium mb-1">
          GitHub URL
        </label>
        <Input
          id="github_url"
          type="url"
          value={formData.github_url}
          onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="live_url" className="block text-sm font-medium mb-1">
          Live URL
        </label>
        <Input
          id="live_url"
          type="url"
          value={formData.live_url}
          onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          Tags (comma-separated)
        </label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="Next.js, React, TypeScript"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Project'}
      </Button>
    </form>
  )
}

