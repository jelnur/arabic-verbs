import type { Metadata } from "next";
import { Scheherazade_New } from "next/font/google";
import "./globals.css";

const scheherazade = Scheherazade_New({
  weight: ['400', '700'],
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-scheherazade',
});

export const metadata: Metadata = {
  title: "تعلم تصريف الأفعال العربية - Arabic Verb Conjugation",
  description: "تعلم تصريف الأفعال العربية في الماضي والمضارع والأمر",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${scheherazade.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
