'use client'

import { Checkbox, FormControlLabel } from '@mui/material'
import { useEffect, useState } from 'react'

import { MuiSelect } from '@/components/ui/mui-select'
import { useVerbData } from '@/hooks/use-verb-data'

import styles from './page.module.css'
import packageJson from '../../package.json'

const verbForms = [
  { id: 'salim', name: 'سَالِمٌ', verbs: ['كَتَبَ', 'دَخَلَ', 'ذَهَبَ'] },
  { id: 'muz', name: 'مُعْتَلٌّ', verbs: ['اَخَذَ'] },
  { id: 'mudaaf', name: 'مُضَاعَفٌ', verbs: ['سَدَّ', 'فَرَّ'] },
]

const tenses = [
  { id: 'mazi', name: 'المَاضِي' },
  { id: 'mazi-manfi-ma', name: 'المَاضِي المَنْفِي بِمَا', isNegative: true },
  { id: 'mazi-manfi-lam', name: 'المَاضِي المَنْفِي بِلَمْ', isNegative: true },
  { id: 'muzari', name: 'المُضَارِعُ', hasDividerBefore: true },
  { id: 'amr', name: 'الأَمْرُ' },
  { id: 'mustaqbal-qarib', name: 'المُسْتَقْبَلُ القَرِيبُ', hasDividerBefore: true },
  { id: 'mustaqbal-baeed', name: 'المُسْتَقْبَلُ البَعِيدُ' },
  { id: 'mustaqbal-manfi', name: 'المُسْتَقْبَلُ المَنْفِي', isNegative: true },
]

const personLabels: { [key: string]: string } = {
  '1': 'المُتَكَلِّمُ',
  '2-muzekker': 'المُخَاطَبُ المُذَكَّرُ',
  '2-muennes': 'المُخَاطَبَةُ المُؤَنَّثَةُ',
  '2-muzekker-modern': 'المُخَاطَبُ المُذَكَّرُ (حَدِيثٌ)',
  '2-muennes-modern': 'المُخَاطَبَةُ المُؤَنَّثَةُ (حَدِيثٌ)',
  '3-muzekker': 'الغَائِبُ المُذَكَّرُ',
  '3-muennes': 'الغَائِبَةُ المُؤَنَّثَةُ',
}

const personOrder = Object.keys(personLabels)

const STORAGE_KEY = 'arabicVerbsSelections'

// Person pronouns for each conjugation
const personPronouns: { [key: string]: string[] } = {
  '1': ['أَنَا', 'نَحْنُ'],
  '2-muzekker': ['أَنْتَ', 'أَنْتُمَا', 'أَنْتُمْ'],
  '2-muennes': ['أَنْتِ', 'أَنْتُمَا', 'أَنْتُنَّ'],
  '2-muzekker-modern': ['أَنْتَ', 'أَنْتُمَا', 'أَنْتُمْ'],
  '2-muennes-modern': ['أَنْتِ', 'أَنْتُمَا', 'أَنْتُنَّ'],
  '3-muzekker': ['هُوَ', 'هُمَا', 'هُمْ'],
  '3-muennes': ['هِيَ', 'هُمَا', 'هُنَّ'],
}

interface StoredSelections {
  verbForm: string
  verbIndex: number
  tense: string
  showPronouns: boolean
}

export default function Home() {
  const [selectedVerbForm, setSelectedVerbForm] = useState<string>(verbForms[0].id)
  const [selectedTense, setSelectedTense] = useState<string>(tenses[0].id)
  const [selectedVerbIndex, setSelectedVerbIndex] = useState<number>(0)
  const [showPronouns, setShowPronouns] = useState<boolean>(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Use react-query to fetch and cache verb data indefinitely
  const { data: verbData = [], isLoading } = useVerbData(selectedVerbForm, selectedVerbIndex)

  // Load saved selections from localStorage after hydration
  useEffect(() => {
    setIsHydrated(true)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const {
          verbForm,
          verbIndex,
          tense,
          showPronouns: savedShowPronouns,
        } = JSON.parse(saved) as StoredSelections
        if (verbForm) setSelectedVerbForm(verbForm)
        if (typeof verbIndex === 'number') setSelectedVerbIndex(verbIndex)
        if (tense) setSelectedTense(tense)
        if (typeof savedShowPronouns === 'boolean') setShowPronouns(savedShowPronouns)
      }
    } catch (error) {
      console.error('Error loading saved selections:', error)
    }
  }, [])

  // Save selections to localStorage when they change (only after hydration)
  useEffect(() => {
    if (!isHydrated) return

    const selections: StoredSelections = {
      verbForm: selectedVerbForm,
      verbIndex: selectedVerbIndex,
      tense: selectedTense,
      showPronouns,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections))
  }, [selectedVerbForm, selectedVerbIndex, selectedTense, showPronouns, isHydrated])

  const renderTable = () => {
    // Filter data by selected tense
    const filteredData = verbData.filter((row) => row.tense === selectedTense)

    return (
      <table className={styles.verbTable}>
        <thead>
          <tr>
            <th>شَخْصٌ</th>
            <th>مُفْرَدٌ</th>
            <th>تَثْنِيَةٌ</th>
            <th>جَمْعٌ</th>
          </tr>
        </thead>
        <tbody>
          {personOrder.map((person) => {
            const row = filteredData.find((d) => d.person === person)
            if (!row) return null

            // Skip rows where all verb forms are empty
            if (!row.ferd && !row.tesniye && !row.cem) return null

            const personNumber = person.split('-')[0]
            const isFirstInSection = person.endsWith('muzekker') || person === '1'
            return (
              <tr
                key={person}
                data-person={personNumber}
                className={isFirstInSection ? styles.sectionStart : ''}
              >
                <td className={isFirstInSection ? styles.sectionStart : ''}>
                  {personLabels[person]}
                </td>
                <td>
                  {showPronouns && personPronouns[person]?.[0] && (
                    <span className={styles.pronoun}>{personPronouns[person][0]} </span>
                  )}
                  {row.ferd}
                </td>
                {person === '1' ? (
                  <td colSpan={2} className={styles.combinedCell}>
                    {showPronouns && personPronouns[person]?.[1] && (
                      <span className={styles.pronoun}>{personPronouns[person][1]} </span>
                    )}
                    {row.tesniye || row.cem}
                  </td>
                ) : (
                  <>
                    <td>
                      {showPronouns && personPronouns[person]?.[1] && (
                        <span className={styles.pronoun}>{personPronouns[person][1]} </span>
                      )}
                      {row.tesniye}
                    </td>
                    <td>
                      {showPronouns && personPronouns[person]?.[2] && (
                        <span className={styles.pronoun}>{personPronouns[person][2]} </span>
                      )}
                      {row.cem}
                    </td>
                  </>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  // Handle verb form change and auto-select first verb
  const handleVerbFormChange = (value: string | number) => {
    setSelectedVerbForm(value as string)
    // Auto-select the first verb if available
    const newForm = verbForms.find((form) => form.id === value)
    if (newForm && newForm.verbs.length > 0) {
      setSelectedVerbIndex(0)
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2 className={styles.title}>تَعَلَّمْ تَصْرِيفَ الأَفْعَالِ الْعَرَبِيَّةِ</h2>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <MuiSelect
              // label="نَوْعُ الفِعْلِ:"
              // labelId="verb-form-label"
              value={selectedVerbForm}
              onChange={handleVerbFormChange}
              options={verbForms.map((form) => ({
                value: form.id,
                label: form.name,
              }))}
              className={styles.formControl}
            />
          </div>

          <div className={styles.controlGroup}>
            <MuiSelect
              // label="الفِعْلُ:"
              // labelId="verb-label"
              value={selectedVerbIndex}
              onChange={(value) => setSelectedVerbIndex(value as number)}
              options={
                verbForms
                  .find((form) => form.id === selectedVerbForm)
                  ?.verbs.map((verb, index) => ({
                    value: index,
                    label: verb,
                  })) ?? []
              }
              className={styles.formControl}
            />
          </div>

          <div className={styles.controlGroup}>
            <MuiSelect
              // label="الزَّمَنُ:"
              // labelId="tense-label"
              value={selectedTense}
              onChange={(value) => setSelectedTense(value as string)}
              options={tenses.map((tense) => ({
                value: tense.id,
                label: tense.name,
                hasDividerBefore: tense.hasDividerBefore,
                isNegative: tense.isNegative,
              }))}
              className={styles.formControl}
            />
          </div>
        </div>

        <div className={styles.checkboxContainer}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showPronouns}
                onChange={(e) => setShowPronouns(e.target.checked)}
                sx={{
                  color: '#4a90e2',
                  '&.Mui-checked': {
                    color: '#4a90e2',
                  },
                }}
              />
            }
            label={<span className={styles.checkboxLabel}>أَظْهِرِ الضَّمَائِرَ</span>}
            sx={{
              direction: 'rtl',
            }}
          />
        </div>

        <div className={styles.tableContainer}>
          {isLoading ? <div className={styles.loading}>جَارٍ التَّحْمِيلُ...</div> : renderTable()}
        </div>

        <div className={styles.footer}>
          <a
            href="https://github.com/jelnur/arabic-verbs"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            Edit on GitHub
          </a>

          <span className={styles.version}>v{packageJson.version}</span>
        </div>
      </main>
    </div>
  )
}
