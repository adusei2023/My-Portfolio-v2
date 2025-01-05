'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import TestimonialCard from './TestimonialCard'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Database } from '@/types/supabase'

type Testimonial = Database['public']['Tables']['testimonials']['Row']

export default function TestimonialList({ testimonials: initialTestimonials }: { testimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    
    setIsDeleting(id)
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTestimonials(testimonials.filter(t => t.id !== id))
      toast.success('Testimonial deleted successfully')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete testimonial')
    } finally {
      setIsDeleting(null)
    }
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No testimonials yet. Add your first testimonial!
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="relative group">
          <TestimonialCard testimonial={testimonial} />
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleDelete(testimonial.id)}
            disabled={isDeleting === testimonial.id}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  )
} 