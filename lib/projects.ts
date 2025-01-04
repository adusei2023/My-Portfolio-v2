import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getProjects() {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user?.id) {
      console.error('No session or user ID found')
      return []
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }

    return projects || []
  } catch (error) {
    console.error('Error in getProjects:', error)
    return []
  }
}

export async function getPublicProjects() {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Error fetching public projects:', error)
      return []
    }

    return projects || []
  } catch (error) {
    console.error('Error in getPublicProjects:', error)
    return []
  }
} 