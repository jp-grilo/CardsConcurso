'use client';

import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Clock, CheckCircle2, XCircle, MinusCircle, FileText } from 'lucide-react';
import styles from './SimuladoResult.module.css';

interface ResultData {
  timeElapsedSeconds: number;
  topics: { categoryId: number; weight: number }[];
  detailedAnswers: {
    id: number;
    categoryId: number;
    categoryName: string;
    statement: string;
    isCorrect: boolean;
    isBlank: boolean;
    weight: number;
    options: { text: string; is_correct: number; justification: string }[];
  }[];
}

const COLORS = ['#22c55e', '#ef4444', '#94a3b8']; // Acertos (Verde), Erros (Vermelho), Brancos (Cinza)

export function SimuladoResult({ data }: { data: ResultData }) {
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');

  // Filter logic
  const filteredAnswers = useMemo(() => {
    if (selectedTopic === 'ALL') return data.detailedAnswers;
    return data.detailedAnswers.filter(a => a.categoryId.toString() === selectedTopic);
  }, [data.detailedAnswers, selectedTopic]);

  // Calculations for Simple %
  const total = filteredAnswers.length;
  const correct = filteredAnswers.filter(a => !a.isBlank && a.isCorrect).length;
  const wrong = filteredAnswers.filter(a => !a.isBlank && !a.isCorrect).length;
  const blank = filteredAnswers.filter(a => a.isBlank).length;

  const simplePercentage = total > 0 ? ((correct / total) * 100).toFixed(1) : 0;

  // Calculations for Weighted %
  const maxPossibleWeight = filteredAnswers.reduce((acc, curr) => acc + curr.weight, 0);
  const earnedWeight = filteredAnswers.reduce((acc, curr) => {
    if (!curr.isBlank && curr.isCorrect) return acc + curr.weight;
    return acc;
  }, 0);

  const weightedPercentage = maxPossibleWeight > 0 ? ((earnedWeight / maxPossibleWeight) * 100).toFixed(1) : 0;

  // Pie chart data
  const chartData = [
    { name: 'Acertos', value: correct },
    { name: 'Erros', value: wrong },
    { name: 'Em Branco', value: blank },
  ].filter(d => d.value > 0);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  // Distinct topics for dropdown
  const uniqueTopics = Array.from(new Set(data.detailedAnswers.map(a => a.categoryId))).map(id => {
    return data.detailedAnswers.find(a => a.categoryId === id);
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Relatório do Simulado</h1>
          <p className={styles.subtitle}>Veja seu desempenho e revise o gabarito.</p>
        </div>
        <div className={styles.timeBadge}>
          <Clock size={20} /> Tempo Total: {formatTime(data.timeElapsedSeconds)}
        </div>
      </header>

      <div className={styles.filters}>
        <label className={styles.filterLabel}>Filtrar Estatísticas por Tópico:</label>
        <select 
          className={styles.select} 
          value={selectedTopic} 
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="ALL">Visão Geral (Todos os Tópicos)</option>
          {uniqueTopics.map(t => t && (
            <option key={t.categoryId} value={t.categoryId}>{t.categoryName}</option>
          ))}
        </select>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.chartCard}>
          <h3>Distribuição de Respostas</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Acertos' ? COLORS[0] : entry.name === 'Erros' ? COLORS[1] : COLORS[2]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.numbersCard}>
          <h3>Performance</h3>
          
          <div className={styles.scoreBoard}>
            <div className={styles.scoreItem}>
              <span className={styles.scoreLabel}>Acertos Simples</span>
              <span className={styles.scoreValue}>{simplePercentage}%</span>
              <span className={styles.scoreDetail}>{correct} de {total}</span>
            </div>
            <div className={styles.scoreItem}>
              <span className={styles.scoreLabel}>Nota Ponderada</span>
              <span className={styles.scoreValuePrimary}>{weightedPercentage}%</span>
              <span className={styles.scoreDetail}>Peso ganho: {earnedWeight}/{maxPossibleWeight}</span>
            </div>
          </div>

          <div className={styles.detailsList}>
            <div className={styles.detailRow}>
              <CheckCircle2 size={18} className={styles.iconSuccess} /> Acertos: <strong>{correct}</strong>
            </div>
            <div className={styles.detailRow}>
              <XCircle size={18} className={styles.iconDanger} /> Erros: <strong>{wrong}</strong>
            </div>
            <div className={styles.detailRow}>
              <MinusCircle size={18} className={styles.iconMuted} /> Em Branco: <strong>{blank}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.gabaritoArea}>
        <h2 className={styles.sectionTitle}><FileText size={24} /> Gabarito e Justificativas</h2>
        
        <div className={styles.gabaritoList}>
          {filteredAnswers.map((ans, idx) => (
            <div key={ans.id} className={styles.gabaritoCard}>
              <div className={styles.gabaritoHeader}>
                <span className={styles.qNum}>Questão {idx + 1}</span>
                <span className={styles.catBadge}>{ans.categoryName}</span>
                {ans.isBlank ? (
                  <span className={`${styles.statusBadge} ${styles.statusBlank}`}>Em Branco</span>
                ) : ans.isCorrect ? (
                  <span className={`${styles.statusBadge} ${styles.statusCorrect}`}>Correta</span>
                ) : (
                  <span className={`${styles.statusBadge} ${styles.statusWrong}`}>Incorreta</span>
                )}
              </div>
              <p className={styles.gStatement}>{ans.statement}</p>
              
              <div className={styles.gOptions}>
                {ans.options.map((opt, oIdx) => (
                  <div key={oIdx} className={`${styles.gOptionItem} ${opt.is_correct ? styles.gOptionCorrect : ''}`}>
                    <div className={styles.gOptText}>{opt.text}</div>
                    {opt.justification && (
                      <div className={styles.gOptJustify}>{opt.justification}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
