'use client'

import { Checkbox, FormControlLabel } from '@mui/material'
import { useEffect, useState } from 'react'


import { MuiSelect } from '@/components/ui/mui-select'
import { VERB_KINDS, TENSE_OPTIONS, personOrder, PERSON_OPTIONS, ZAMIRS } from '@/constants/verbs'
import { useVerbAffixes } from '@/hooks/use-verb-affixes'
import { useVerbData } from '@/hooks/use-verb-data'
import { Form, Person, Kind, Tense } from '@/types/verb'
import { parseWord } from '@/utils/arabic'

import styles from './page.module.css'
import packageJson from '../../package.json'

const STORAGE_KEY = 'selections'

interface StoredSelections {
  verbKind: string
  verbIndex: number
  tense: string
  showPronouns: boolean
}

export default function Home() {
  const [selectedVerbKind, setSelectedVerbKind] = useState<string>(VERB_KINDS[0].id)
  const [selectedTense, setSelectedTense] = useState<string>(TENSE_OPTIONS[0].id)
  const [selectedVerbIndex, setSelectedVerbIndex] = useState<number>(0)
  const [showPronouns, setShowPronouns] = useState<boolean>(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Use react-query to fetch and cache verb data and affix patterns
  const { data: verbData = [], isLoading } = useVerbData(
    selectedVerbKind as Kind,
    selectedVerbIndex
  )
  const { data: affixPatterns = {} } = useVerbAffixes(
    selectedVerbKind as Kind,
    selectedTense as Tense
  )

  // Load saved selections from localStorage after hydration
  useEffect(() => {
    setIsHydrated(true)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const {
          verbKind,
          verbIndex,
          tense,
          showPronouns: savedShowPronouns,
        } = JSON.parse(saved) as StoredSelections
        if (verbKind) setSelectedVerbKind(verbKind)
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
      verbKind: selectedVerbKind,
      verbIndex: selectedVerbIndex,
      tense: selectedTense,
      showPronouns,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections))
  }, [selectedVerbKind, selectedVerbIndex, selectedTense, showPronouns, isHydrated])

  const renderWithAffixes = (text: string, person: Person, form: Form) => {
    if (!text) return text

    const patternKey = `${person}-${form}`
    const lengthes = affixPatterns[patternKey]

    if (!lengthes) return text

    const [prefixLength, suffixLength] = lengthes.split('-').map((x) => +x)

    const chars = parseWord(text, prefixLength, suffixLength)

    return (
      <>
        {chars.map(({ char, type }, index) => (
          <span key={index} className={type === 'stem' ? undefined : styles.affixRed}>
            {char}
          </span>
        ))}
      </>
    )
  }

  const renderTable = () => {
    const filteredData = verbData.filter((row) => row.tense === selectedTense)

    return (
      <table className={styles.verbTable}>
        <thead>
          <tr>
            <th style={{ display: showPronouns ? 'none' : 'table-cell' }}>شَخْصٌ</th>
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
            const isFirstInSection = person.endsWith('muzekker') || person === '1-mutekellim'

            return (
              <tr
                key={person}
                data-person={personNumber}
                className={isFirstInSection ? styles.sectionStart : ''}
              >
                <td style={{ display: showPronouns ? 'none' : 'table-cell' }}>
                  {PERSON_OPTIONS.find((p) => p.id === person)?.name}
                </td>

                <td>
                  {showPronouns && ZAMIRS[person]?.[0] && (
                    <span className={styles.pronoun}>{ZAMIRS[person][0]} </span>
                  )}
                  {renderWithAffixes(row.ferd, person as Person, 'ferd')}
                </td>

                {person === '1-mutekellim' ? (
                  <td colSpan={2} className={styles.combinedCell}>
                    {showPronouns && ZAMIRS[person]?.[1] && (
                      <span className={styles.pronoun}>{ZAMIRS[person][1]} </span>
                    )}
                    {renderWithAffixes(row.cem, person as Person, 'cem')}
                  </td>
                ) : (
                  <>
                    <td>
                      {showPronouns && ZAMIRS[person]?.[1] && (
                        <span className={styles.pronoun}>{ZAMIRS[person][1]} </span>
                      )}
                      {renderWithAffixes(row.tesniye, person as Person, 'tesniye')}
                    </td>

                    <td>
                      {showPronouns && ZAMIRS[person]?.[2] && (
                        <span className={styles.pronoun}>{ZAMIRS[person][2]} </span>
                      )}
                      {renderWithAffixes(row.cem, person as Person, 'cem')}
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
    setSelectedVerbKind(value as string)
    // Auto-select the first verb if available
    const newForm = VERB_KINDS.find((form) => form.id === value)
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
              value={selectedVerbKind}
              onChange={handleVerbFormChange}
              options={VERB_KINDS.map((form) => ({
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
                VERB_KINDS.find((kind) => kind.id === selectedVerbKind)?.verbs.map(
                  (verb, index) => ({
                    value: index,
                    label: verb,
                  })
                ) ?? []
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
              options={TENSE_OPTIONS.map((tense) => ({
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
