import { getCategoriesWithCounts } from '@/actions/questions';
import { EstudoSetup } from '@/components/EstudoSetup';
import styles from './page.module.css';

export default async function NovoEstudoPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Modo Estudo</h1>
          <p className={styles.subtitle}>Gere uma bateria de questões para praticar. A resposta e a justificativa aparecem na hora.</p>
        </div>
      </header>

      <section className={styles.content}>
        <EstudoSetup availableCategories={categories} />
      </section>
    </div>
  );
}
