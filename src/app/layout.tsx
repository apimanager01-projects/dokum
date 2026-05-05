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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={`${geist.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-1 w-full px-4 sm:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
