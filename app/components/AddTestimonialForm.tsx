'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'

export default function AddTestimonialForm() {
  const [authorName, setAuthorName] = useState('')
  const [authorTitle, setAuthorTitle] = useState('')
  const [content, setContent] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let avatarUrl = ''
      if (avatar) {
        const fileExt = avatar.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatar)

        if (uploadError) throw uploadError
        avatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`
      }

      const { error } = await supabase.from('testimonials').insert([
        {
          author_name: authorName,
          author_title: authorTitle,
          content,
          avatar_url: avatarUrl,
        },
      ])

      if (error) throw error
      toast.success('Testimonial added successfully!')
      router.refresh()
      
      // Reset form
      setAuthorName('')
      setAuthorTitle('')
      setContent('')
      setAvatar(null)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="Author Name"
        required
      />
      <Input
        type="text"
        value={authorTitle}
        onChange={(e) => setAuthorTitle(e.target.value)}
        placeholder="Author Title/Position"
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Testimonial Content"
        required
      />
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setAvatar(e.target.files?.[0] || null)}
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Testimonial'}
      </Button>
    </form>
  )
} 