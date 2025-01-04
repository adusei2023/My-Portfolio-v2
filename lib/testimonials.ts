import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getTestimonials() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user?.id) {
    console.error('No session or user ID found')
    return []
  }

  console.log('Fetching testimonials for user:', session.user.id)
  
  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }

  return testimonials || []
}

export async function getPublicTestimonials() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching public testimonials:', error)
    return []
  }

  return testimonials || []
} 