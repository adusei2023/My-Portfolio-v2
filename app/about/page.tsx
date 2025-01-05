import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection'

export default async function About() {
  const supabase = createClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .single()

  if (!profile) {
    notFound()
  }

  return (
    <main className="max-w-4xl mx-auto py-20 px-4">
      <AnimatedSection className="space-y-8">
        <h1 className="text-4xl font-bold mb-8">About Me</h1>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{profile.full_name}</h2>
            <p className="text-lg text-muted-foreground">
              {profile.bio}
            </p>
            <Button asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>

          {profile.avatar_url && (
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </AnimatedSection>
    </main>
  )
} 