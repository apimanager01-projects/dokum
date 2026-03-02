import { RegisterForm } from '@/components/auth/RegisterForm'

// TODO: re-enable when registration opens
// import Link from 'next/link'
// export default function RegisterPage() {
//   return (
//     <main className="flex flex-1 items-center justify-center bg-gray-50 px-4">
//       <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm text-center">
//         <h1 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">
//           Registration closed
//         </h1>
//         <p className="mb-6 text-sm text-gray-500">
//           Registration is currently disabled. Please contact an administrator to get access.
//         </p>
//         <Link href="/auth/login" className="text-sm font-medium text-brand underline">
//           Back to sign in
//         </Link>
//       </div>
//     </main>
//   )
// }

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Create an account
        </h1>
        <RegisterForm />
      </div>
    </main>
  )
}
