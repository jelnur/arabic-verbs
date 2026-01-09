export const ARABIC_NUMERALS = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠']

// Highlight configuration for each column: [startChars, endChars]
// Columns order: mazi, muzari, masdar, ismAlFail, ismAlMafool, amr
export const BABLAR_HIGHLIGHT_CONFIG: [number, number][] = [
  [0, 3], // mazi
  [2, 3], // muzari
  [0, 2], // masdar
  [2, 3], // ismAlFail
  [2, 3], // ismAlMafool
  [0, 2], // amr
]

export const BABLAR_VERBS = ['فَعَلَ', 'خَرَجَ', 'شَكَرَ']
