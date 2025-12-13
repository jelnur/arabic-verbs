import { BablarRow } from '@/types/bab'

export const ARABIC_NUMERALS = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠']

// Highlight configuration for each column: [startChars, endChars]
// Columns order: mazi, muzari, masdar, ismAlFail, ismAlMafool, amr
export const BABLAR_HIGHLIGHT_CONFIG: [number, number][] = [
  [0, 2], // mazi
  [2, 2], // muzari
  [0, 2], // masdar
  [0, 2], // ismAlFail
  [2, 2], // ismAlMafool
  [0, 2], // amr
]

export const BABLAR_VERBS = ['فَعَلَ', 'خَرَجَ']

export const BABLAR_DATA: BablarRow[] = [
  {
    bab: '١',
    mazi: 'فَعَلَ',
    muzari: 'يَفْعَلُ',
    masdar: 'فُعُولٌ',
    ismAlFail: 'فَاعِلٌ',
    ismAlMafool: 'مَفْعُولٌ',
    amr: 'افْعَلْ',
  },
  {
    bab: '٢',
    mazi: 'فَعَّلَ',
    muzari: 'يُفَعِّلُ',
    masdar: 'تَفْعِيلٌ',
    ismAlFail: 'مُفَعِّلٌ',
    ismAlMafool: 'مُفَعَّلٌ',
    amr: 'فَعِّلْ',
  },
  {
    bab: '٣',
    mazi: 'فَاعَلَ',
    muzari: 'يُفَاعِلُ',
    masdar: 'مُفَاعَلَةٌ / فِعَالٌ',
    ismAlFail: 'مُفَاعِلٌ',
    ismAlMafool: 'مُفَاعَلٌ',
    amr: 'فَاعِلْ',
  },
  {
    bab: '٤',
    mazi: 'أَفْعَلَ',
    muzari: 'يُفْعِلُ',
    masdar: 'اِفْعَالٌ',
    ismAlFail: 'مُفْعِلٌ',
    ismAlMafool: 'مُفْعَلٌ',
    amr: 'أَفْعِلْ',
  },
  {
    bab: '٥',
    mazi: 'تَفَعَّلَ',
    muzari: 'يَتَفَعَّلُ',
    masdar: 'تَفَعُّلٌ',
    ismAlFail: 'مُتَفَعِّلٌ',
    ismAlMafool: 'مُتَفَعَّلٌ',
    amr: 'تَفَعَّلْ',
  },
  {
    bab: '٦',
    mazi: 'تَفَاعَلَ',
    muzari: 'يَتَفَاعَلُ',
    masdar: 'تَفَاعُلٌ',
    ismAlFail: 'مُتَفَاعِلٌ',
    ismAlMafool: 'مُتَفَاعَلٌ',
    amr: 'تَفَاعَلْ',
  },
]
