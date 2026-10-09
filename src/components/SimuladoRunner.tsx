'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Check } from 'lucide-react';
import { saveSessionProgress, finishSession } from '@/actions/runner';
import styles from './SimuladoRunner.module.css';

interface SessionData {
  id: number;
  mode: string;
  currentQuestionIndex: number;
  timeElapsedSeconds: number;
  totalQuestions: number;
}

interface QuestionData {
  id: number;
  category: string;
  statement: string;
  options: { id: number; text: string }[];
}

export function SimuladoRunner({ session, questions }: { session: SessionData; questions: QuestionData[] }) {
  const [currentIndex, setCurrentIndex] = useState(session.currentQuestionIndex);
  const [timeElapsed, setTimeElapsed] = useState(session.timeElapsedSeconds);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinishing, setIsFinishing] = useState(false);

  // Load answers from localStorage to keep state simple and robust against reloads
  useEffect(() => {
    const saved = localStorage.getItem(`simulado_${session.id}_answers`);
    if (saved) setAnswers(JSON.parse(saved));
  }, [session.id]);

  useEffect(() => {
    localStorage.setItem(`simulado_${session.id}_answers`, JSON.stringify(answers));
  }, [answers, session.id]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save progress periodically (e.g. every 30s) or on navigation
  const saveProgress = (newIndex: number) => {
    saveSessionProgress(session.id, newIndex, timeElapsed, answers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(curr => curr + 1);
      saveProgress(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
      saveProgress(currentIndex - 1);
    }
  };

  const selectOption = (optId: number) => {
    setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: optId }));
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    if (!confirm('Deseja realmente finalizar o simulado?')) return;
    setIsFinishing(true);
    await saveSessionProgress(session.id, currentIndex, timeElapsed, answers);
    await finishSession(session.id, timeElapsed, answers);
    localStorage.removeItem(`simulado_${session.id}_answers`);
  };

  const q = questions[currentIndex];

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <div className={styles.mainArea}>
        <header className={styles.header}>
          <div className={styles.categoryBadge}>{q.category}</div>
          <div className={styles.timer}>
            <Clock size={18} />
            {formatTime(timeElapsed)}
          </div>
        </header>

        <div className={styles.questionCard}>
          <div className={styles.qNumber}>Questão {currentIndex + 1} de {questions.length}</div>
          <h2 className={styles.statement}>{q.statement}</h2>

          <div className={styles.optionsGrid}>
            {q.options.map(opt => {
              const isSelected = answers[q.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => selectOption(opt.id)}
                  className={`${styles.optionBtn} ${isSelected ? styles.selected : ''}`}
                >
                  <div className={styles.radioIndicator}>
                    {isSelected && <div className={styles.radioDot} />}
                  </div>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.navigation}>
          <button 
            className={styles.navBtn} 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} /> Anterior
          </button>
          
          {currentIndex === questions.length - 1 ? (
            <button 
              className={styles.finishBtn} 
              onClick={handleFinish}
              disabled={isFinishing}
            >
              <CheckCircle2 size={20} /> Finalizar Simulado
            </button>
          ) : (
            <button 
              className={styles.navBtn} 
              onClick={handleNext}
            >
              Próxima <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Side Matrix */}
      <div className={styles.matrixArea}>
        <h3 className={styles.matrixTitle}>Mapa da Prova</h3>
        <div className={styles.matrixGrid}>
          {questions.map((mq, idx) => {
            const hasAnswer = !!answers[mq.id];
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={mq.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  saveProgress(idx);
                }}
                className={`${styles.matrixCell} ${hasAnswer ? styles.answered : ''} ${isCurrent ? styles.current : ''}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        
        <div className={styles.matrixLegend}>
          <div className={styles.legendItem}>
            <div className={`${styles.matrixCell} ${styles.legendDemo}`} /> Em branco
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.matrixCell} ${styles.answered} ${styles.legendDemo}`} /> Respondida
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.matrixCell} ${styles.current} ${styles.legendDemo}`} /> Atual
          </div>
        </div>
      </div>
    </div>
  );
}
