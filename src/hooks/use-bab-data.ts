import { useQuery } from '@tanstack/react-query'

import { ARABIC_NUMERALS } from '@/constants/babs'
import { VERBS_PATH } from '@/constants/paths'
import type { BablarRow } from '@/types/bab'

async function fetchBabData(verbIndex: number): Promise<BablarRow[]> {
  const response = await fetch(`${VERBS_PATH}/bab-${verbIndex}.csv`)
  if (!response.ok) {
    return []
  }

  const text = await response.text()
  const lines = text.trim().split('\n')

  const data = lines.slice(1).map((line, index) => {
    const values = line.split(',')
    return {
      bab: ARABIC_NUMERALS[index] ?? String(index + 1),
      mazi: values[0] ?? '',
      muzari: values[1] ?? '',
      masdar: values[2] ?? '',
      ismAlFail: values[3] ?? '',
      ismAlMafool: values[4] ?? '',
      amr: values[5] ?? '',
    }
  })

  return data as BablarRow[]
}

export function useBabData(verbIndex: number) {
  return useQuery({
    queryKey: ['babData', verbIndex],
    queryFn: () => fetchBabData(verbIndex),
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
