import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getPublicProjects } from '@/lib/projects'
import ProjectList from './components/ProjectList'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  
  try {
    const projects = await getPublicProjects()

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold mb-8">Featured Projects</h1>
          <ProjectList projects={projects} />
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error in Home page:', error)
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold mb-8">Featured Projects</h1>
          <p>Error loading projects. Please try again later.</p>
        </div>
      </main>
    )
  }
}

