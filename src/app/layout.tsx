import localFont from 'next/font/local'

import { QueryProvider } from '@/lib/query-provider'

import type { Metadata } from 'next'
import './globals.css'

// Preload font with display: swap for better performance
const shaikhHamdullah = localFont({
  src: [
    {
      path: '../../public/fonts/ShaikhHamdullahMushaf.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-shaikh-hamdullah',
  preload: true,
  adjustFontFallback: false,
  fallback: [],
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
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
