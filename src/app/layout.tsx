import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Dokum',
  description: 'Document viewer',
  icons: {
    apple: '/apple-touch-icon.png',
  },
}

/**
 * `modal` is the overlay slot (#70): a parallel route that stays empty until a
 * client-side navigation is intercepted into it. It hangs off the ROOT layout
 * because a document may be opened from anywhere in the app, and it sits
 * outside `<main>` because the dialog it renders lives in the top layer and
 * must not inherit the page's padding. `children` keeps rendering the page the
 * student came from while the slot is filled — that is what preserves the live
 * inputs nothing persists.
 */
export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    /*
     * The font variables sit on <html>, not <body> (#117, landed by #122).
     * Tailwind emits `--font-sans: var(--font-geist-sans)` at `:root`, so with
     * next/font's variables scoped to <body> the `font-sans` utility resolved
     * to nothing and the product had no chosen typeface — #113 found it, #117
     * decided the fix. CSS variables inherit, so nothing else moves.
     *
     * The ground and the ink come from `body` in globals.css rather than from
     * utilities here: the ground carries a grain tile, which wants the
     * `background` shorthand, and it must have exactly one author.
     */
    <html lang="de" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="dokum-ground antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 w-full px-4 sm:px-8">{children}</main>
        {modal}
        <Footer />
      </body>
    </html>
  )
}
