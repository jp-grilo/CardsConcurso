'use client';

import { useState } from 'react';
import { ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { confirmEstudoAnswer } from '@/actions/runner';
import styles from './EstudoRunner.module.css';
import { useRouter } from 'next/navigation';

export function EstudoRunner({ session, questions }: { session: any; questions: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0); // Em estudo sempre começamos do começo
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [revealedData, setRevealedData] = useState<any>(null);
  
  const router = useRouter();
  const q = questions[currentIndex];

  const handleConfirm = async () => {
    if (selectedOption === null) return;
    setIsConfirming(true);
    
    try {
      const result = await confirmEstudoAnswer(session.id, q.id, selectedOption);
      setRevealedData(result);
    } catch (err) {
      alert('Erro ao confirmar resposta.');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(curr => curr + 1);
      setSelectedOption(null);
      setRevealedData(null);
    } else {
      router.push('/'); // Ao terminar bateria de estudos, volta pra home.
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainArea}>
        <header className={styles.header}>
          <div className={styles.categoryBadge}>{q.category}</div>
          <div className={styles.progress}>
            Questão {currentIndex + 1} de {questions.length}
          </div>
        </header>

        <div className={styles.questionCard}>
          <h2 className={styles.statement}>{q.statement}</h2>

          <div className={styles.optionsGrid}>
            {q.options.map((opt: any) => {
              const isSelected = selectedOption === opt.id;
              
              let optionClass = styles.optionBtn;
              if (isSelected) optionClass += ` ${styles.selected}`;
              
              // Se já revelou
              if (revealedData) {
                const optData = revealedData.optionsData.find((o: any) => o.id === opt.id);
                if (optData?.isCorrect) {
                  optionClass += ` ${styles.correct}`;
                } else if (isSelected && !optData?.isCorrect) {
                  optionClass += ` ${styles.wrong}`;
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => !revealedData && setSelectedOption(opt.id)}
                  className={optionClass}
                  disabled={!!revealedData}
                >
                  <div className={styles.radioIndicator}>
                    {isSelected && <div className={styles.radioDot} />}
                  </div>
                  <div className={styles.optContent}>
                    <span>{opt.text}</span>
                    
                    {revealedData && (
                      <div className={styles.justification}>
                        {revealedData.optionsData.find((o: any) => o.id === opt.id)?.justification}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.navigation}>
          {!revealedData ? (
            <button 
              className={styles.btnConfirm} 
              onClick={handleConfirm}
              disabled={selectedOption === null || isConfirming}
            >
              {isConfirming ? 'Confirmando...' : <><CheckCircle2 size={20} /> Confirmar Resposta</>}
            </button>
          ) : (
            <div className={styles.revealedBar}>
              <div className={`${styles.resultMsg} ${revealedData.isCorrect ? styles.resCorrect : styles.resWrong}`}>
                {revealedData.isCorrect ? 'Você acertou!' : 'Você errou.'}
              </div>
              <button className={styles.btnNext} onClick={handleNext}>
                {currentIndex === questions.length - 1 ? 'Finalizar Bateria' : 'Próxima Questão'} <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
