import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-200px)] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="font-mono text-sm font-bold text-brand">404</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-base text-gray-600">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="btn-brand mt-8 inline-flex h-12 items-center gap-3 rounded-lg bg-brand px-6 text-base font-bold text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_0.25)] hover:bg-brand-dark"
      >
        Back to start
        <span aria-hidden="true" className="text-2xl leading-none">{'->'}</span>
      </Link>
    </div>
  )
}
