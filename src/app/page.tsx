'use client'

import { Checkbox, FormControlLabel, Tab, Tabs } from '@mui/material'
import { useEffect, useState } from 'react'

import { MuiSelect } from '@/components/ui/mui-select'
import { VERB_KINDS, TENSE_OPTIONS, personOrder, PERSON_OPTIONS, ZAMIRS } from '@/constants/verbs'
import { BABLAR_VERBS, BABLAR_HIGHLIGHT_CONFIG } from '@/constants/babs'
import { useBabData } from '@/hooks/use-bab-data'
import { useVerbAffixes } from '@/hooks/use-verb-affixes'
import { useVerbData } from '@/hooks/use-verb-data'
import { Form, Person, Kind, Tense } from '@/types/verb'
import { parseWord, parseWordWithHighlight } from '@/utils/arabic'

import styles from './page.module.css'
import packageJson from '../../package.json'

const STORAGE_KEY = 'selections'
const TAB_STORAGE_KEY = 'selectedTab'

interface StoredSelections {
  verbKind: string
  verbIndex: number
  tense: string
  showPronouns: boolean
}

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [selectedVerbKind, setSelectedVerbKind] = useState<string>(VERB_KINDS[0].id)
  const [selectedTense, setSelectedTense] = useState<string>(TENSE_OPTIONS[0].id)
  const [selectedVerbIndex, setSelectedVerbIndex] = useState<number>(0)
  const [showPronouns, setShowPronouns] = useState<boolean>(false)
  const [isHydrated, setIsHydrated] = useState<boolean>(false)

  // For bablar tab - only verb selector with "faala" (فَعَلَ)
  const [selectedBablarVerbIndex, setSelectedBablarVerbIndex] = useState<number>(0)

  // Use react-query to fetch and cache verb data and affix patterns
  const { data: verbData = [], isLoading } = useVerbData(
    selectedVerbKind as Kind,
    selectedVerbIndex
  )
  const { data: affixPatterns = {} } = useVerbAffixes(
    selectedVerbKind as Kind,
    selectedTense as Tense
  )

  // Load bablar data from CSV
  const { data: bablarData = [], isLoading: isLoadingBablar } = useBabData(selectedBablarVerbIndex)

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

      const savedTab = localStorage.getItem(TAB_STORAGE_KEY)
      if (savedTab !== null) {
        const tabIndex = parseInt(savedTab, 10)
        if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 1) {
          setSelectedTab(tabIndex)
        }
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

  // Save selected tab to localStorage when it changes (only after hydration)
  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem(TAB_STORAGE_KEY, selectedTab.toString())
  }, [selectedTab, isHydrated])

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

  const renderBablarCell = (text: string, columnIndex: number) => {
    // Detect Safari browser
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    // Split by ' \ ' (backslash) or ' / ' (forward slash) and render each verb on a separate line
    const verbs = text.split(/\s*[\\/]\s*/)

    return (
      <>
        {verbs.map((verb, verbIndex) => {
          // In Safari, render without highlighting to preserve text joining
          if (isSafari) {
            return (
              <span key={verbIndex}>
                {verb.trim()}
                {verbIndex < verbs.length - 1 && <br />}
              </span>
            )
          }

          // In other browsers, apply highlighting
          const [startChars, endChars] = BABLAR_HIGHLIGHT_CONFIG[columnIndex]
          const parts = parseWordWithHighlight(verb.trim(), startChars, endChars)

          // Group consecutive parts of the same type to avoid breaking Arabic text joining
          const groupedParts: Array<{ text: string; type: 'prefix' | 'stem' | 'suffix' }> = []
          let currentGroup: { text: string; type: 'prefix' | 'stem' | 'suffix' } | null = null

          parts.forEach((part) => {
            if (currentGroup && currentGroup.type === part.type) {
              currentGroup.text += part.char
            } else {
              if (currentGroup) {
                groupedParts.push(currentGroup)
              }
              currentGroup = { text: part.char, type: part.type }
            }
          })
          if (currentGroup) {
            groupedParts.push(currentGroup)
          }

          return (
            <span key={verbIndex}>
              {groupedParts.map((group, index) => (
                <span key={index} className={group.type === 'stem' ? undefined : styles.affixRed}>
                  {group.text}
                </span>
              ))}
              {verbIndex < verbs.length - 1 && <br />}
            </span>
          )
        })}
      </>
    )
  }

  const renderBablarTable = () => {
    return (
      <table className={styles.bablarTable}>
        <thead>
          <tr>
            <th>البَابُ</th>
            <th>المَاضِي</th>
            <th>المُضَارِعُ</th>
            <th>المَصْدَرُ</th>
            <th>اسْمُ الفَاعِلِ</th>
            <th>اسْمُ المَفْعُولِ</th>
            <th>الأَمْرُ</th>
          </tr>
        </thead>
        <tbody>
          {bablarData.map((row) => (
            <tr key={row.bab}>
              <td className={styles.babNumber}>{row.bab}</td>
              <td>{renderBablarCell(row.mazi, 0)}</td>
              <td>{renderBablarCell(row.muzari, 1)}</td>
              <td>{renderBablarCell(row.masdar, 2)}</td>
              <td>{renderBablarCell(row.ismAlFail, 3)}</td>
              <td>{renderBablarCell(row.ismAlMafool, 4)}</td>
              <td>{renderBablarCell(row.amr, 5)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const renderVerbsTab = () => (
    <>
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <MuiSelect
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
            value={selectedVerbIndex}
            onChange={(value) => setSelectedVerbIndex(value as number)}
            options={
              VERB_KINDS.find((kind) => kind.id === selectedVerbKind)?.verbs.map((verb, index) => ({
                value: index,
                label: verb,
              })) ?? []
            }
            className={styles.formControl}
          />
        </div>

        <div className={styles.controlGroup}>
          <MuiSelect
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
    </>
  )

  const renderBablarTab = () => (
    <>
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <MuiSelect
            value={selectedBablarVerbIndex}
            onChange={(value) => setSelectedBablarVerbIndex(value as number)}
            options={BABLAR_VERBS.map((verb, index) => ({
              value: index,
              label: verb,
            }))}
            className={styles.formControl}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        {isLoadingBablar ? (
          <div className={styles.loading}>جَارٍ التَّحْمِيلُ...</div>
        ) : (
          renderBablarTable()
        )}
      </div>
    </>
  )

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2 className={styles.title}>تَعَلَّمْ تَصْرِيفَ الأَفْعَالِ الْعَرَبِيَّةِ</h2>

        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          sx={{
            width: '100%',
            maxWidth: '1200px',
            '& .MuiTabs-indicator': {
              backgroundColor: '#4a90e2',
            },
            direction: 'rtl',
          }}
        >
          <Tab
            label="الأَفْعَالُ"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 500,
              color: selectedTab === 0 ? '#4a90e2' : '#6c757d',
              '&.Mui-selected': {
                color: '#4a90e2',
              },
            }}
          />
          <Tab
            label="البَابُ"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 500,
              color: selectedTab === 1 ? '#4a90e2' : '#6c757d',
              '&.Mui-selected': {
                color: '#4a90e2',
              },
            }}
          />
        </Tabs>

        <div className={styles.tabContent}>
          {selectedTab === 0 ? renderVerbsTab() : renderBablarTab()}
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
