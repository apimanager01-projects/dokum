'use client'

import type { ReactNode } from 'react'
import { signInWithOAuth } from '@/actions/auth'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.2 3-7.2z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" />
      <path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9z" />
      <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.7 9.7 0 0 0 12 2a10 10 0 0 0-8.9 5.5l3.3 2.6C7.2 7.8 9.4 6 12 6z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M16.5 12.9c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.7-1.8-3.3-1.9-1.4-.1-2.7.8-3.4.8s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 7 1.1 9.2.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.2-2.5 1.2-2.6 0 0-2.6-1-2.6-3.4zM14.3 6.1c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 0 2-.5 2.7-1.3z" />
    </svg>
  )
}

function SocialButton({
  provider,
  label,
  children,
}: {
  provider: 'google' | 'apple'
  label: string
  children: ReactNode
}) {
  return (
    <form action={signInWithOAuth.bind(null, provider)}>
      <button
        type="submit"
        className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 text-sm font-bold text-gray-800 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50"
      >
        {children}
        {label}
      </button>
    </form>
  )
}

export function SocialAuthButtons() {
  return (
    <div className="grid gap-3">
      <SocialButton provider="google" label="Continue with Google">
        <GoogleIcon />
      </SocialButton>
      <SocialButton provider="apple" label="Continue with Apple">
        <AppleIcon />
      </SocialButton>
    </div>
  )
}
