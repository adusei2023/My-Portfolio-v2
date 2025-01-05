import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getPublicProjects } from '@/lib/projects'
import ProjectCard from '@/components/ProjectCard'
import AnimatedSection from '@/components/AnimatedSection'

export default async function Home() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const projects = await getPublicProjects()

  return (
    <div>
      {/* Hero Section */}
      <main className="max-w-4xl mx-auto py-20 px-4">
        <AnimatedSection className="text-center space-y-8">
          <h1 className="text-5xl font-bold">
            Welcome to Your Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Showcase your projects, share your work, and connect with others.
          </p>
          
          <div className="flex justify-center gap-4">
            {session ? (
              <Button asChild size="lg">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </AnimatedSection>

        {/* Projects Section */}
        <section id="projects" className="py-20">
          <AnimatedSection className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Featured Projects</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <AnimatedSection className="text-center space-y-8">
            <h2 className="text-3xl font-bold">Get in Touch</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a question or want to work together?
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Contact Me</Link>
            </Button>
          </AnimatedSection>
        </section>
      </main>
    </div>
  )
}
