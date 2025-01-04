import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getProjects } from '@/lib/projects'
import { getTestimonials } from '@/lib/testimonials'
import ProjectList from '../components/ProjectList'
import AddProjectForm from '../components/AddProjectForm'
import TestimonialList from '../components/TestimonialList'
import AddTestimonialForm from '../components/AddTestimonialForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SignOutButton from '../components/SignOutButton'
import AddProjectButton from '../components/AddProjectButton'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Auth error:', sessionError)
      redirect('/auth/signin')
    }

    if (!session) {
      redirect('/auth/signin')
    }

    const [projects, testimonials] = await Promise.all([
      getProjects(),
      getTestimonials()
    ])

    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <SignOutButton />
        </div>
        
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            <div className="space-y-8">
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Your Projects</h2>
                  <AddProjectButton />
                </div>
                <ProjectList projects={projects} />
              </section>
              
              <section id="add-project-form">
                <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
                <AddProjectForm />
              </section>
            </div>
          </TabsContent>
          
          <TabsContent value="testimonials">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">Your Testimonials</h2>
                <TestimonialList testimonials={testimonials} />
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">Add New Testimonial</h2>
                <AddTestimonialForm />
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    redirect('/auth/signin')
  }
}

