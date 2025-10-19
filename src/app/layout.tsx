import { Scheherazade_New } from 'next/font/google'

import { QueryProvider } from '@/lib/query-provider'

import type { Metadata } from 'next'
import './globals.css'

const scheherazade = Scheherazade_New({
  weight: ['400', '700'],
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-scheherazade',
})

export const metadata: Metadata = {
  title: 'تعلم تصريف الأفعال العربية',
  description: 'تعلم تصريف الأفعال العربية في الماضي والمضارع والأمر',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${scheherazade.variable} font-sans`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
