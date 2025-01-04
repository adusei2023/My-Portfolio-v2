import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    // Check if user is authenticated
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create admin client with service role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create bucket if it doesn't exist
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError)
      return NextResponse.json({ error: 'Failed to list buckets' }, { status: 500 })
    }

    const bucketExists = buckets?.some(b => b.name === 'project-images')

    if (!bucketExists) {
      const { error: createError } = await supabaseAdmin.storage.createBucket('project-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/*']
      })

      if (createError) {
        console.error('Error creating bucket:', createError)
        return NextResponse.json({ error: 'Failed to create bucket' }, { status: 500 })
      }

      // Set up bucket policies
      const { error: policyError } = await supabaseAdmin.query(`
        create policy "Authenticated users can upload images"
        on storage.objects for insert 
        to authenticated 
        with check (bucket_id = 'project-images');

        create policy "Images are publicly accessible"
        on storage.objects for select
        to public
        using (bucket_id = 'project-images');

        create policy "Users can delete their own images"
        on storage.objects for delete
        to authenticated
        using (bucket_id = 'project-images' and auth.uid() = owner);
      `)

      if (policyError) {
        console.error('Error setting policies:', policyError)
        return NextResponse.json({ error: 'Failed to set policies' }, { status: 500 })
      }
    }

    return NextResponse.json({ message: 'Storage configured successfully' })
  } catch (error) {
    console.error('Error setting up storage:', error)
    return NextResponse.json(
      { error: 'Failed to configure storage' },
      { status: 500 }
    )
  }
} 