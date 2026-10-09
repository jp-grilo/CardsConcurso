import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ChevronDown, Circle } from 'lucide-react';
import { getCategoryWithQuestions } from '@/actions/questions';
import styles from './page.module.css';

export default async function CategoriaQuestoesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId)) notFound();

  const data = await getCategoryWithQuestions(categoryId);
  if (!data) notFound();

  const { category, questions } = data;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/questoes" className={styles.back}>
          <ArrowLeft size={18} /> Voltar para Questões
        </Link>
        <h1 className={styles.title}>{category.name}</h1>
        <p className={styles.subtitle}>
          {questions.length} {questions.length === 1 ? 'questão' : 'questões'} nesta matéria
        </p>
      </header>

      {questions.length === 0 ? (
        <div className={styles.empty}>Nenhuma questão cadastrada nesta matéria.</div>
      ) : (
        <ol className={styles.list}>
          {questions.map((q, index) => (
            <li key={q.id}>
              <details className={styles.question}>
                <summary className={styles.summary}>
                  <span className={styles.number}>{index + 1}</span>
                  <span className={styles.statement}>{q.statement}</span>
                  <span className={styles.difficulty}>Dif. {q.difficulty}/10</span>
                  <ChevronDown size={20} className={styles.chevron} />
                </summary>

                <ul className={styles.options}>
                  {q.options.map((opt, i) => (
                    <li
                      key={opt.id}
                      className={`${styles.option} ${opt.is_correct ? styles.correct : ''}`}
                    >
                      <span className={styles.optIcon}>
                        {opt.is_correct ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                      </span>
                      <div className={styles.optBody}>
                        <p>
                          <strong>{String.fromCharCode(65 + i)})</strong> {opt.text}
                        </p>
                        {opt.justification && (
                          <p className={styles.justification}>{opt.justification}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
