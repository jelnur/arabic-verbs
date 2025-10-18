'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface VerbForm {
  person: string;
  gender: string;
  number: string;
  form: string;
}

const verbForms = [
  { id: 'salim', name: 'سالم', verb: 'كَتَبَ' },
  { id: 'mudaaf', name: 'مضاعف', verb: 'مَدَّ' },
  { id: 'muz', name: 'معتل', verb: 'رَمَى' },
];

const tenses = [
  { id: 'mazi', name: 'الماضي' },
  { id: 'muzari', name: 'المضارع' },
  { id: 'amr', name: 'الأمر' },
];

export default function Home() {
  const [selectedVerbForm, setSelectedVerbForm] = useState(verbForms[0].id);
  const [selectedTense, setSelectedTense] = useState(tenses[0].id);
  const [verbData, setVerbData] = useState<VerbForm[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVerbData();
  }, [selectedVerbForm, selectedTense]);

  const loadVerbData = async () => {
    setLoading(true);
    try {
      const basePath = process.env.NODE_ENV === 'production' ? '/arabic-verbs' : '';
      const response = await fetch(`${basePath}/verbs/${selectedVerbForm}-${selectedTense}.csv`);
      const text = await response.text();
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',');

      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
          person: values[0] || '',
          gender: values[1] || '',
          number: values[2] || '',
          form: values[3] || '',
        };
      });

      setVerbData(data);
    } catch (error) {
      console.error('Error loading verb data:', error);
      setVerbData([]);
    }
    setLoading(false);
  };

  const getSelectedVerb = () => {
    return verbForms.find(v => v.id === selectedVerbForm)?.verb || '';
  };

  const renderTable = () => {
    const groupedData: { [key: string]: VerbForm[] } = {};

    verbData.forEach(item => {
      const personKey = item.person;
      if (!groupedData[personKey]) {
        groupedData[personKey] = [];
      }
      groupedData[personKey].push(item);
    });

    const personOrder = ['أنا', 'أنتَ', 'هو'];
    const numberOrder = ['ferd', 'tesniye', 'cem'];

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
            const personData = groupedData[person] || [];
            const muzekkerData = personData.filter(d => d.gender === 'muzekker' || !d.gender);
            const moennesData = personData.filter(d => d.gender === 'muennes');

            const rows = [];

            if (muzekkerData.length > 0 || person === 'أنا') {
              const rowData = person === 'أنا' || person === 'نحن' ? personData : muzekkerData;
              rows.push(
                <tr key={`${person}-m`}>
                  <td className={styles.personLabel}>
                    {person === 'أنا' && 'المتكلم'}
                    {person === 'أنتَ' && 'المخاطب المذكر'}
                    {person === 'هو' && 'الغائب المذكر'}
                  </td>
                  {numberOrder.map(num => {
                    const cell = rowData.find(d => d.number === num);
                    return <td key={num}>{cell?.form || '-'}</td>;
                  })}
                </tr>
              );
            }

            if (moennesData.length > 0) {
              rows.push(
                <tr key={`${person}-f`}>
                  <td className={styles.personLabel}>
                    {person === 'أنتَ' && 'المخاطب المؤنث'}
                    {person === 'هو' && 'الغائب المؤنث'}
                  </td>
                  {numberOrder.map(num => {
                    const cell = moennesData.find(d => d.number === num);
                    return <td key={num}>{cell?.form || '-'}</td>;
                  })}
                </tr>
              );
            }

            return rows;
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>تعلم تصريف الأفعال العربية</h1>

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
            <div className={styles.verbDisplay}>{getSelectedVerb()}</div>
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
