import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { apiResponse, apiError } from '@/lib/utils/api'
import { getProjects, createProject } from '@/lib/services/projects'
import { AppError } from '@/lib/utils/error'

export async function GET() {
  try {
    const projects = await getProjects()
    return apiResponse(projects)
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      throw new AppError('Unauthorized', 'AUTH_ERROR', 401)
    }

    const data = await request.json()
    const project = await createProject(data, session.user.id)
    
    return apiResponse(project, 201)
  } catch (error) {
    return apiError(error)
  }
}

