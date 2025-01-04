import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const data = await request.json()
    
    if (!data.name || !data.content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      )
    }

    const testimonialData = {
      name: data.name,
      role: data.role || null,
      company: data.company || null,
      content: data.content,
      image_url: data.image_url || null,
      user_id: session.user.id
    }

    const { data: testimonial, error } = await supabase
      .from('testimonials')
      .insert([testimonialData])
      .select()
      .single()

    if (error) {
      console.error('Error creating testimonial:', error)
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      )
    }

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error in POST /api/testimonials:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  
  try {
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(testimonials)
  } catch (error: any) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
} 