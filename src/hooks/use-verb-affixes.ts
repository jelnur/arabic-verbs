import { useQuery } from '@tanstack/react-query'

import { VERBS_PATH } from '@/constants/paths'
import { AffixPatterns , Kind, Tense } from '@/types/verb'

async function fetchAffixes(kind: Kind, tense: Tense): Promise<AffixPatterns> {
  const url = `${VERBS_PATH}/${kind}-affixes.csv`
  const res = await fetch(url)
  if (!res.ok) return {}

  const text = await res.text()
  const lines = text.trim().split('\n')
  if (lines.length <= 1) return {}

  const patterns: AffixPatterns = {}

  // Skip header
  for (const line of lines.slice(1)) {
    const [_tense, cem = '', tesniye = '', ferd = '', person] = line
      .split(',')
      .map((s) => s.trim() ?? '')

    if (_tense !== tense) continue

    patterns[`${person}-ferd`] = ferd
    patterns[`${person}-tesniye`] = tesniye
    patterns[`${person}-cem`] = cem
  }

  return patterns
}

export function useVerbAffixes(kind: Kind, tense: Tense) {
  return useQuery<AffixPatterns>({
    queryKey: ['verbAffixes', kind, tense],
    queryFn: () => fetchAffixes(kind, tense),
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
