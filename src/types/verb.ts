export type Kind = 'salim' | 'muz' | 'mudaaf' | 'ajvaf'

export type Form = 'ferd' | 'tesniye' | 'cem'

export type Person =
  | '1-mutekellim'
  | '2-muzekker'
  | '2-muennes'
  | '2-muzekker-hadis'
  | '2-muennes-hadis'
  | '3-muzekker'
  | '3-muennes'

export type Tense =
  | 'mazi'
  | 'mazi-manfi-ma'
  | 'mazi-manfi-lam'
  | 'muzari'
  | 'muzari-manfi'
  | 'amr'
  | 'amr-manfi'
  | 'mustaqbal-qarib'
  | 'mustaqbal-baeed'
  | 'mustaqbal-manfi'

export interface TenseOption {
  id: Tense
  name: string
  isNegative?: boolean
  hasDividerBefore?: boolean
}

export interface PersonOption {
  id: Person
  name: string
}

export interface VerbRow {
  tense: Tense
  cem: string
  tesniye: string
  ferd: string
  person: Person
  form: Form
}

export interface KindVerbs {
  id: Kind
  name: string
  verbs: string[]
}

export interface AffixPatterns {
  [key: string]: string
}
