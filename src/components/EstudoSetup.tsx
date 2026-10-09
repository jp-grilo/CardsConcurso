'use client';

import { useState, useTransition } from 'react';
import { PlayCircle, Loader2 } from 'lucide-react';
import { createEstudoSession } from '@/actions/sessions';
import styles from './EstudoSetup.module.css';

export function EstudoSetup({ availableCategories }: { availableCategories: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [targetDifficulty, setTargetDifficulty] = useState<number>(5);
  
  const [isPending, startTransition] = useTransition();

  const handleStart = () => {
    startTransition(async () => {
      try {
        await createEstudoSession({
          categoryId: selectedCategory === 'ALL' ? null : parseInt(selectedCategory),
          questionCount,
          targetDifficulty
        });
      } catch (error: any) {
        alert(error.message || 'Erro ao iniciar modo estudo.');
      }
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Tópico / Matéria</label>
        <select 
          className={styles.input} 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="ALL">Surpreenda-me (Todas as Matérias)</option>
          {availableCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name} ({cat.question_count} disponíveis)</option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Quantidade de Questões</label>
          <input 
            type="number" 
            min="1" 
            className={styles.input} 
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Dificuldade Alvo (1-10)</label>
          <input 
            type="number" 
            min="1" 
            max="10" 
            className={styles.input} 
            value={targetDifficulty}
            onChange={(e) => setTargetDifficulty(parseInt(e.target.value) || 1)}
          />
        </div>
      </div>

      <button 
        className={styles.btnStart} 
        onClick={handleStart} 
        disabled={isPending}
      >
        {isPending ? <Loader2 className={styles.spin} size={20} /> : <PlayCircle size={20} />}
        {isPending ? 'Preparando...' : 'Iniciar Bateria de Estudos'}
      </button>
    </div>
  );
}
