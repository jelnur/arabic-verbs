import { useQuery } from '@tanstack/react-query';

interface VerbRow {
  tense: string;
  cem: string;
  tesniye: string;
  ferd: string;
  person: string;
}

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/arabic-verbs' : '';

async function fetchVerbData(verbForm: string, verbIndex: number): Promise<VerbRow[]> {
  const response = await fetch(`${BASE_PATH}/verbs/${verbForm}-${verbIndex}.csv`);
  if (!response.ok) {
    throw new Error(`Failed to fetch verb data: ${response.statusText}`);
  }

  const text = await response.text();
  const lines = text.trim().split('\n');

  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      tense: values[0] || '',
      cem: values[1] || '',
      tesniye: values[2] || '',
      ferd: values[3] || '',
      person: values[4] || '',
    };
  });

  return data as unknown as VerbRow[];
}

export function useVerbData(verbForm: string, verbIndex: number) {
  return useQuery({
    queryKey: ['verbData', verbForm, verbIndex],
    queryFn: () => fetchVerbData(verbForm, verbIndex),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
