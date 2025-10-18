'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';

interface VerbRow {
  tense: string;
  cem: string;
  tesniye: string;
  ferd: string;
  person: string;
}

const verbForms = [
  { id: 'salim', name: 'سَالِمٌ', verbs: ['كَتَبَ', 'دَخَلَ'] },
  { id: 'muz', name: 'مُعْتَلٌّ', verbs: [] },
  { id: 'mudaaf', name: 'مُضَاعَفٌ', verbs: ['مَدَّ'] },
];

const tenses = [
  { id: 'mazi', name: 'المَاضِي' },
  { id: 'muzari', name: 'المُضَارِعُ' },
  { id: 'amr', name: 'الأَمْرُ' },
];

const personLabels: { [key: string]: string } = {
  '1': 'المُتَكَلِّمُ',
  '2-muzekker': 'المُخَاطَبُ المُذَكَّرُ',
  '2-muzekker-modern': 'المُخَاطَبُ المُذَكَّرُ (حَدِيثٌ)',
  '2-muennes': 'المُخَاطَبَةُ المُؤَنَّثَةُ',
  '2-muennes-modern': 'المُخَاطَبَةُ المُؤَنَّثَةُ (حَدِيثٌ)',
  '3-muzekker': 'الغَائِبُ المُذَكَّرُ',
  '3-muennes': 'الغَائِبَةُ المُؤَنَّثَةُ',
};

const personOrder = ['1', '2-muzekker', '2-muzekker-modern', '2-muennes', '2-muennes-modern', '3-muzekker', '3-muennes'];

const STORAGE_KEY = 'arabicVerbsSelections';

interface StoredSelections {
  verbForm: string;
  verbIndex: number;
  tense: string;
}

const getInitialState = (): { verbForm: string; verbIndex: number; tense: string } => {
  if (typeof window === 'undefined') {
    return {
      verbForm: verbForms[0].id,
      verbIndex: 0,
      tense: tenses[0].id,
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { verbForm, verbIndex, tense } = JSON.parse(saved);
      return {
        verbForm: verbForm || verbForms[0].id,
        verbIndex: typeof verbIndex === 'number' ? verbIndex : 0,
        tense: tense || tenses[0].id,
      };
    }
  } catch (error) {
    console.error('Error loading saved selections:', error);
  }

  return {
    verbForm: verbForms[0].id,
    verbIndex: 0,
    tense: tenses[0].id,
  };
};

export default function Home() {
  const [selectedVerbForm, setSelectedVerbForm] = useState<string>(() => getInitialState().verbForm);
  const [selectedTense, setSelectedTense] = useState<string>(() => getInitialState().tense);
  const [selectedVerbIndex, setSelectedVerbIndex] = useState<number>(() => getInitialState().verbIndex);
  const [verbData, setVerbData] = useState<VerbRow[]>([]);
  const [loading, setLoading] = useState(false);

  const loadVerbData = useCallback(async (skipLoading = false) => {
    if (!skipLoading) {
      setLoading(true);
    }
    try {
      const basePath = process.env.NODE_ENV === 'production' ? '/arabic-verbs' : '';
      const response = await fetch(`${basePath}/verbs/${selectedVerbForm}-${selectedVerbIndex}.csv`);
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

      setVerbData(data);
    } catch (error) {
      console.error('Error loading verb data:', error);
      setVerbData([]);
    }
    if (!skipLoading) {
      setLoading(false);
    }
  }, [selectedVerbIndex, selectedVerbForm]);

  // Load verb data when dependencies change
  useEffect(() => {
    loadVerbData();
  }, [loadVerbData]);

  // Save selections to localStorage when they change
  useEffect(() => {
    const selections: StoredSelections = {
      verbForm: selectedVerbForm,
      verbIndex: selectedVerbIndex,
      tense: selectedTense,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
  }, [selectedVerbForm, selectedVerbIndex, selectedTense]);

  const renderTable = () => {
    // Filter data by selected tense
    const filteredData = verbData.filter(row => row.tense === selectedTense);

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
          {personOrder.map(person => {
            const row = filteredData.find(d => d.person === person);
            if (!row) return null;

            // Skip rows where all verb forms are empty
            if (!row.ferd && !row.tesniye && !row.cem) return null;

            const personNumber = person.split('-')[0];
            const isFirstInSection = person.endsWith('muzekker') || person === '1';
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
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label>نَوْعُ الفِعْلِ:</label>
            <select
              value={selectedVerbForm}
              onChange={(e) => setSelectedVerbForm(e.target.value)}
              className={styles.select}
            >
              {verbForms.map(form => (
                <option key={form.id} value={form.id}>{form.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label>الفِعْلُ:</label>
            <select
              value={selectedVerbIndex}
              onChange={(e) => setSelectedVerbIndex(parseInt(e.target.value))}
              className={styles.select}
            >
              {verbForms.find(form => form.id === selectedVerbForm)?.verbs.map((verb, index) => (
                <option key={index} value={index}>{verb}</option>
              ))}
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label>الزَّمَنُ:</label>
            <select
              value={selectedTense}
              onChange={(e) => setSelectedTense(e.target.value)}
              className={styles.select}
            >
              {tenses.map(tense => (
                <option key={tense.id} value={tense.id}>{tense.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loading}>جَارٍ التَّحْمِيلُ...</div>
          ) : (
            renderTable()
          )}
        </div>
      </main>
    </div>
  );
}
