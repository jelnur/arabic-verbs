import localFont from 'next/font/local'

import { QueryProvider } from '@/lib/query-provider'

import type { Metadata } from 'next'
import './globals.css'

const shaikhHamdullah = localFont({
  src: '../../public/fonts/ShaikhHamdullahMushaf.ttf',
  display: 'swap',
  variable: '--font-shaikh-hamdullah',
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
      <body className={shaikhHamdullah.variable}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
