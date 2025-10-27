'use client'

import { useEffect, useState } from 'react'

export function FontLoader({ children }: { children: React.ReactNode }) {
  const [isFontReady, setIsFontReady] = useState(false)

  useEffect(() => {
    // Check if the font is already loaded
    const checkFont = () => {
      if (document.fonts) {
        document.fonts.ready.then(() => {
          setIsFontReady(true)
        })
      } else {
        // Fallback for browsers that don't support document.fonts
        setTimeout(() => {
          setIsFontReady(true)
        }, 100)
      }
    }

    checkFont()
  }, [])

  return <div className={isFontReady ? 'font-loaded' : ''}>{children}</div>
}
