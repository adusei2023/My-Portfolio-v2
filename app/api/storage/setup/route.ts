import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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

      // Set up bucket policies using rpc
      const { error: policyError } = await supabaseAdmin.rpc('setup_storage_policies', {
        bucket_id: 'project-images'
      })

      if (policyError) {
        console.error('Error setting policies:', policyError)
        return NextResponse.json({ error: 'Failed to set policies' }, { status: 500 })
      }
    }

    return NextResponse.json({ message: 'Storage setup completed' })
  } catch (error) {
    console.error('Error in storage setup:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 