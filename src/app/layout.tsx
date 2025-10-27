import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

import { FontLoader } from '@/components/ui/font-loader'
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
  fallback: ['Tahoma', 'sans-serif'],
})

// Fallback font for initial render
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: false,
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
    <html lang="ar" dir="rtl" className={`${inter.variable} font-sans`}>
      <head>
        <link
          rel="preload"
          href="/fonts/ShaikhHamdullahMushaf.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'ShaikhHamdullahMushaf';
                src: url('/fonts/ShaikhHamdullahMushaf.ttf') format('truetype');
                font-display: swap;
                font-weight: 400;
                font-style: normal;
              }
            `,
          }}
        />
      </head>
      <body className={`${shaikhHamdullah.variable}`}>
        <QueryProvider>
          <FontLoader>{children}</FontLoader>
        </QueryProvider>
      </body>
    </html>
  )
}
