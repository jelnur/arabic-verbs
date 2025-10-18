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
  { id: 'salim', name: 'سالم', verbs: ['كَتَبَ'] },
  { id: 'mudaaf', name: 'مضاعف', verbs: ['مَدَّ'] },
  { id: 'muz', name: 'معتل', verbs: ['رَمَى'] },
];

const tenses = [
  { id: 'mazi', name: 'الماضي' },
  { id: 'muzari', name: 'المضارع' },
  { id: 'amr', name: 'الأمر' },
];

const personLabels: { [key: string]: string } = {
  '1': 'المتكلم',
  '2-muzekker': 'المخاطب المذكر',
  '2-muennes': 'المخاطب المؤنث',
  '3-muzekker': 'الغائب المذكر',
  '3-muennes': 'الغائب المؤنث',
};

const personOrder = ['1', '2-muzekker', '2-muennes', '3-muzekker', '3-muennes'];

export default function Home() {
  const [selectedVerbForm, setSelectedVerbForm] = useState(verbForms[0].id);
  const [selectedTense, setSelectedTense] = useState(tenses[0].id);
  const [selectedVerbIndex, setSelectedVerbIndex] = useState(0);
  const [verbData, setVerbData] = useState<VerbRow[]>([]);
  const [loading, setLoading] = useState(false);

  const loadVerbData = useCallback(async () => {
    setLoading(true);
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
    setLoading(false);
  }, [selectedVerbIndex, selectedVerbForm]);

  useEffect(() => {
    loadVerbData();
  }, [loadVerbData]);

  const renderTable = () => {
    // Filter data by selected tense
    const filteredData = verbData.filter(row => row.tense === selectedTense);

    return (
      <table className={styles.verbTable}>
        <thead>
          <tr>
            <th></th>
            <th>مفرد</th>
            <th>تثنية</th>
            <th>جمع</th>
          </tr>
        </thead>
        <tbody>
          {personOrder.map(person => {
            const row = filteredData.find(d => d.person === person);
            if (!row) return null;

            // Skip rows where all verb forms are empty
            if (!row.ferd && !row.tesniye && !row.cem) return null;

            return (
              <tr key={person}>
                <td className={styles.personLabel}>
                  {personLabels[person]}
                </td>
                <td>{row.ferd}</td>
                <td>{row.tesniye}</td>
                <td>{row.cem}</td>
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
            <label>نوع الفعل:</label>
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
            <label>الفعل:</label>
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
            <label>الزمن:</label>
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
            <div className={styles.loading}>جاري التحميل...</div>
          ) : (
            renderTable()
          )}
        </div>
      </main>
    </div>
  );
}
