export interface Project {
  id: string
  created_at: string
  updated_at: string
  title: string
  description?: string
  image_url?: string
  github_url?: string
  live_url?: string
  tags?: string[]
  user_id: string
}

export interface Testimonial {
  id: string
  created_at: string
  updated_at: string
  name: string
  role?: string
  company?: string
  content: string
  image_url?: string
  user_id: string
} 
