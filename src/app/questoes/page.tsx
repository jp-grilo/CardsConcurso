import { getCategoriesWithCounts } from '@/actions/questions';
import { ImportButton } from '@/components/ImportButton';
import Link from 'next/link';
import { Folder } from 'lucide-react';
import styles from './page.module.css';

export default async function QuestoesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Questões</h1>
          <p className={styles.subtitle}>Gerencie os tópicos e importe novas questões.</p>
        </div>
        
        <ImportButton />
      </header>

      <section className={styles.content}>
        {categories.length === 0 ? (
          <div className={styles.empty}>
            <p>Nenhuma questão importada ainda.</p>
            <span className={styles.emptyTip}>Utilize o botão de importar JSON acima.</span>
          </div>
        ) : (
          <div className={styles.grid}>
            {categories.map(cat => (
              <Link key={cat.id} href={`/questoes/${cat.id}`} className={styles.card}>
                <div className={styles.cardIcon}>
                  <Folder size={24} />
                </div>
                <div className={styles.cardInfo}>
                  <h3>{cat.name}</h3>
                  <span>{cat.question_count} questões</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
