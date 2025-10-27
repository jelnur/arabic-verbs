const splitByDiacritics = (text: string): string[] => {
  // Normalize to NFC for consistent combining mark behavior
  const normalized = text.normalize('NFC')

  // Match all Arabic letters and combining marks separately
  const result = normalized.match(/[\p{L}\p{M}]/gu)

  return result ?? []
}

interface Parts {
  char: string
  type: 'prefix' | 'stem' | 'suffix'
}

export const parseWord = (text: string, prefixLength: number, suffixLength: number): Parts[] => {
  const chars = splitByDiacritics(text)

  const result = chars.map((char, index) => {
    if (index < prefixLength) return { char, type: 'prefix' }

    if (index >= chars.length - suffixLength) return { char, type: 'suffix' }

    return { char, type: 'stem' }
  })

  console.log(result)

  return result as Parts[]
}
