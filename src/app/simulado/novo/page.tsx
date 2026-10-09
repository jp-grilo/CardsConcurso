import { getCategoriesWithCounts } from '@/actions/questions';
import { SimuladoSetupTable } from '@/components/SimuladoSetupTable';
import styles from './page.module.css';

export default async function NovoSimuladoPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Novo Simulado</h1>
          <p className={styles.subtitle}>Configure as matérias, pesos e dificuldades para montar sua prova.</p>
        </div>
      </header>

      <section className={styles.content}>
        <SimuladoSetupTable availableCategories={categories} />
      </section>
    </div>
  );
}
