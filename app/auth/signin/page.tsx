import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AuthForm from '@/components/AuthForm'

export default async function SignIn({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const supabase = createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <AuthForm />
      {searchParams?.message && (
        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
          {searchParams.message}
        </p>
      )}
    </div>
  )
} 