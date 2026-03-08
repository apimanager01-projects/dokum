import { LoginForm } from '@/components/auth/LoginForm'

interface Props {
  searchParams: Promise<{ message?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { message } = await searchParams

  return (
    <main className="flex flex-1 items-center justify-center px-4 mt-40 sm:mt-25">
      <div className="max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to Dokum
        </h1>
        <LoginForm message={message} />
      </div>
    </main>
  )
}
