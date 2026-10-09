import Link from 'next/link';
import { LayoutDashboard, Library, PlayCircle, BookOpen } from 'lucide-react';
import styles from './Sidebar.module.css';

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <BookOpen className={styles.logoIcon} size={28} />
          <h2>CardsConcurso</h2>
        </div>
      </div>
      
      <nav className={styles.nav}>
        <Link href="/" className={styles.navItem}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link href="/questoes" className={styles.navItem}>
          <Library size={20} />
          <span>Questões</span>
        </Link>
      </nav>

      <div className={styles.actions}>
        <Link href="/simulado/novo" className={`${styles.actionButton} ${styles.primaryBtn}`}>
          <PlayCircle size={20} />
          <span>Novo Simulado</span>
        </Link>
        <Link href="/estudo/novo" className={`${styles.actionButton} ${styles.secondaryBtn}`}>
          <BookOpen size={20} />
          <span>Novo Estudo</span>
        </Link>
      </div>
    </aside>
  );
}
