import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Create an account
        </h1>
        <RegisterForm />
      </div>
    </main>
  )
}
