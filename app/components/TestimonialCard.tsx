import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { Database } from '@/types/supabase'

type Testimonial = Database['public']['Tables']['testimonials']['Row']

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        {testimonial.image_url && (
          <div className="relative h-12 w-12 rounded-full overflow-hidden">
            <Image
              src={testimonial.image_url}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <h3 className="font-semibold">{testimonial.name}</h3>
          <p className="text-sm text-muted-foreground">
            {testimonial.role} at {testimonial.company}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{testimonial.content}</p>
      </CardContent>
    </Card>
  )
} 