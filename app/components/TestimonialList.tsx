'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import Image from 'next/image'

interface Testimonial {
  id: string
  author_name: string
  author_title: string
  content: string
  avatar_url: string
}

export default function TestimonialList({ testimonials: initialTestimonials }: { testimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    author_name: '',
    author_title: '',
    content: '',
  })

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id)
    setEditForm({
      author_name: testimonial.author_name,
      author_title: testimonial.author_title,
      content: testimonial.content,
    })
  }

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update(editForm)
        .eq('id', id)

      if (error) throw error

      setTestimonials(testimonials.map(t => 
        t.id === id ? { ...t, ...editForm } : t
      ))
      setEditingId(null)
      toast.success('Testimonial updated successfully!')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTestimonials(testimonials.filter(t => t.id !== id))
      toast.success('Testimonial deleted successfully!')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-6">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="border p-4 rounded-lg">
          {editingId === testimonial.id ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editForm.author_name}
                onChange={(e) => setEditForm({ ...editForm, author_name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={editForm.author_title}
                onChange={(e) => setEditForm({ ...editForm, author_title: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <textarea
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <div className="space-x-2">
                <Button onClick={() => handleUpdate(testimonial.id)}>Save</Button>
                <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-4">
                {testimonial.avatar_url && (
                  <Image
                    src={testimonial.avatar_url}
                    alt={testimonial.author_name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-bold">{testimonial.author_name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.author_title}</p>
                </div>
              </div>
              <p className="text-gray-700">{testimonial.content}</p>
              <div className="mt-4 space-x-2">
                <Button variant="outline" onClick={() => handleEdit(testimonial)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(testimonial.id)}>Delete</Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
} 