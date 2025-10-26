import { TenseOption, KindVerbs, PersonOption } from '@/types/verb'

export const VERB_KINDS: KindVerbs[] = [
  { id: 'salim', name: 'سَالِمٌ', verbs: ['كَتَبَ', 'دَخَلَ', 'ذَهَبَ'] },
  { id: 'muz', name: 'مُعْتَلٌّ', verbs: ['اَخَذَ'] },
  { id: 'mudaaf', name: 'مُضَاعَفٌ', verbs: ['سَدَّ', 'فَرَّ'] },
]

export const TENSE_OPTIONS: TenseOption[] = [
  { id: 'mazi', name: 'المَاضِي' },
  { id: 'mazi-manfi-ma', name: 'المَاضِي المَنْفِي بِمَا', isNegative: true },
  { id: 'mazi-manfi-lam', name: 'المَاضِي المَنْفِي بِلَمْ', isNegative: true },
  { id: 'muzari', name: 'المُضَارِعُ', hasDividerBefore: true },
  { id: 'muzari-manfi', name: 'المُضَارِعُ المَنْفِي', isNegative: true },
  { id: 'amr', name: 'الأَمْرُ', hasDividerBefore: true },
  { id: 'amr-manfi', name: 'الأَمْرُ المَنْفِي', isNegative: true },
  { id: 'mustaqbal-qarib', name: 'المُسْتَقْبَلُ القَرِيبُ', hasDividerBefore: true },
  { id: 'mustaqbal-baeed', name: 'المُسْتَقْبَلُ البَعِيدُ' },
  { id: 'mustaqbal-manfi', name: 'المُسْتَقْبَلُ المَنْفِي', isNegative: true },
]

export const PERSON_OPTIONS: PersonOption[] = [
  { id: '1-mutekellim', name: 'المُتَكَلِّمُ' },
  { id: '2-muzekker', name: 'المُخَاطَبُ المُذَكَّرُ' },
  { id: '2-muennes', name: 'المُخَاطَبَةُ المُؤَنَّثَةُ' },
  { id: '2-muzekker-hadis', name: 'المُخَاطَبُ المُذَكَّرُ (حَدِيثٌ)' },
  { id: '2-muennes-hadis', name: 'المُخَاطَبَةُ المُؤَنَّثَةُ (حَدِيثٌ)' },
  { id: '3-muzekker', name: 'الغَائِبُ المُذَكَّرُ' },
  { id: '3-muennes', name: 'الغَائِبَةُ المُؤَنَّثَةُ' },
]

export const personOrder = PERSON_OPTIONS.map((p) => p.id)

export const ZAMIRS: { [key: string]: string[] } = {
  '1-mutekellim': ['أَنَا', 'نَحْنُ'],
  '2-muzekker': ['أَنْتَ', 'أَنْتُمَا', 'أَنْتُمْ'],
  '2-muennes': ['أَنْتِ', 'أَنْتُمَا', 'أَنْتُنَّ'],
  '2-muzekker-hadis': ['أَنْتَ', 'أَنْتُمَا', 'أَنْتُمْ'],
  '2-muennes-hadis': ['أَنْتِ', 'أَنْتُمَا', 'أَنْتُنَّ'],
  '3-muzekker': ['هُوَ', 'هُمَا', 'هُمْ'],
  '3-muennes': ['هِيَ', 'هُمَا', 'هُنَّ'],
}
