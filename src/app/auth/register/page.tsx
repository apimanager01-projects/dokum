import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <main className="-mx-4 flex flex-col items-center justify-center bg-[#fffdf8] px-4 py-10 sm:-mx-8" style={{ minHeight: 'calc(100svh - 66px)' }}>
      <section className="w-full max-w-[430px]">
        <div className="mb-10 text-center">
          <h1 className="text-[2rem] font-black tracking-tight text-gray-950">
            Create your account
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            Structured practice materials for mastering finance courses
          </p>
        </div>
        <RegisterForm />
      </section>

      <p className="mt-auto max-w-[430px] pt-10 text-center text-sm leading-snug text-gray-500">
        By creating an account, you agree to our{' '}
        <a href="/agb" className="underline underline-offset-2">
          Terms
        </a>{' '}
        and{' '}
        <a href="/datenschutz" className="underline underline-offset-2">
          Privacy policy
        </a>
        .
      </p>
    </main>
  )
}
