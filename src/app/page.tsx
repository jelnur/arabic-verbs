'use client'

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
  { id: 'muzari', name: 'المُضَارِعُ' },
  { id: 'amr', name: 'الأَمْرُ' },
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

interface StoredSelections {
  verbForm: string
  verbIndex: number
  tense: string
}

export default function Home() {
  const [selectedVerbForm, setSelectedVerbForm] = useState<string>(verbForms[0].id)
  const [selectedTense, setSelectedTense] = useState<string>(tenses[0].id)
  const [selectedVerbIndex, setSelectedVerbIndex] = useState<number>(0)
  const [isHydrated, setIsHydrated] = useState(false)

  // Use react-query to fetch and cache verb data indefinitely
  const { data: verbData = [], isLoading } = useVerbData(selectedVerbForm, selectedVerbIndex)

  // Load saved selections from localStorage after hydration
  useEffect(() => {
    setIsHydrated(true)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const { verbForm, verbIndex, tense } = JSON.parse(saved) as StoredSelections
        if (verbForm) setSelectedVerbForm(verbForm)
        if (typeof verbIndex === 'number') setSelectedVerbIndex(verbIndex)
        if (tense) setSelectedTense(tense)
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
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections))
  }, [selectedVerbForm, selectedVerbIndex, selectedTense, isHydrated])

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
                <td>{row.ferd}</td>
                {person === '1' ? (
                  <td colSpan={2} className={styles.combinedCell}>
                    {row.tesniye || row.cem}
                  </td>
                ) : (
                  <>
                    <td>{row.tesniye}</td>
                    <td>{row.cem}</td>
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
              }))}
              className={styles.formControl}
            />
          </div>
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
