import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 mt-20 sm:mt-15">
      <div className="max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Konto erstellen
        </h1>
        <RegisterForm />
      </div>
    </main>
  )
}
