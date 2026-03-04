'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Invalid email or password.' }
  }

  redirect('/')
}

export async function signUp(formData: FormData) {
  const email = (formData.get('email') as string).trim()
  const password = formData.get('password') as string
  const fullName = (formData.get('fullName') as string).trim()
  const consentGiven = formData.get('consentGiven') === 'true'

  if (!consentGiven) {
    return { error: 'Du musst die Datenschutzerklärung akzeptieren.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, consent_accepted_at: new Date().toISOString() } },
  })

  if (error) return { error: error.message ?? 'Registrierung fehlgeschlagen.' }
  redirect('/auth/login?message=Bitte bestätige deine E-Mail-Adresse.')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export async function acceptConsent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { error } = await supabase.auth.updateUser({
    data: { consent_accepted_at: new Date().toISOString() },
  })
  if (error) redirect('/')
  redirect('/')
}

export async function withdrawConsent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  await supabase.auth.updateUser({ data: { consent_accepted_at: null } })
  await supabase.auth.signOut()
  return {}
}
