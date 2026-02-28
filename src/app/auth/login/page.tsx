import { LoginForm } from '@/components/auth/LoginForm'

interface Props {
  searchParams: Promise<{ message?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { message } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to Dokum
        </h1>
        <LoginForm message={message} />
      </div>
    </main>
  )
}
