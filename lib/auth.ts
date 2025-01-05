// Centralized authentication logic
import { supabase } from './supabaseClient'

export async function getSession() {
  const { data: session, error } = await supabase.auth.getSession()
  if (error) throw new Error(`Error getting session: ${error.message}`)
  return session
}

export async function isAuthenticated() {
  const session = await getSession()
  return !!session?.session
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(`Error signing out: ${error.message}`)
} 