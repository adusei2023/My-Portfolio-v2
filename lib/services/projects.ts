import { supabase } from '@/lib/supabase'
import { AppError } from '@/lib/utils/error'
import type { Project } from '@/types/database'

export async function getProjects(userId?: string) {
  try {
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) throw new AppError(error.message, error.code, 500)
    
    return data as Project[]
  } catch (error) {
    throw error instanceof AppError ? error : new AppError('Failed to fetch projects')
  }
}

export async function createProject(project: Partial<Project>, userId: string) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...project, user_id: userId }])
      .select()
      .single()

    if (error) throw new AppError(error.message, error.code, 500)
    
    return data as Project
  } catch (error) {
    throw error instanceof AppError ? error : new AppError('Failed to create project')
  }
} 