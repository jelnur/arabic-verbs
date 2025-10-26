import { useQuery } from '@tanstack/react-query'

import { VERBS_PATH } from '@/constants/paths'
import type { Kind, VerbRow } from '@/types/verb'

async function fetchVerbData(kind: Kind, verbIndex: number): Promise<VerbRow[]> {
  const response = await fetch(`${VERBS_PATH}/${kind}-${verbIndex}.csv`)
  if (!response.ok) {
    throw new Error(`Failed to fetch verb data: ${response.statusText}`)
  }

  const text = await response.text()
  const lines = text.trim().split('\n')

  const data = lines.slice(1).map((line) => {
    const values = line.split(',')
    return {
      tense: values[0] ?? '',
      cem: values[1] ?? '',
      tesniye: values[2] ?? '',
      ferd: values[3] ?? '',
      person: values[4] ?? '',
    }
  })

  return data as unknown as VerbRow[]
}

export function useVerbData(kind: Kind, verbIndex: number) {
  return useQuery({
    queryKey: ['verbData', kind, verbIndex],
    queryFn: () => fetchVerbData(kind, verbIndex),
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
