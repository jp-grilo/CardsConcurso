'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Database, Target, BrainCircuit, Activity } from 'lucide-react';
import styles from './Dashboard.module.css';

const COLORS = ['#22c55e', '#ef4444'];

export function Dashboard({ stats }: { stats: any }) {
  const pieData = [
    { name: 'Acertos', value: stats.globalCorrect },
    { name: 'Erros', value: stats.globalWrong },
  ].filter(d => d.value > 0);

  const barData = stats.topicStats.map((t: any) => ({
    name: t.name,
    Acertos: t.correct,
    Erros: t.total_answered - t.correct,
    accuracy: Math.round((t.correct / t.total_answered) * 100)
  }));

  const globalAccuracy = stats.totalAnswered > 0 
    ? Math.round((stats.globalCorrect / stats.totalAnswered) * 100) 
    : 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Estatísticas Globais</h1>
        <p className={styles.subtitle}>Acompanhe o seu progresso e desempenho geral.</p>
      </header>

      {/* Cards de Métricas Rápidas */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ color: 'var(--primary)', backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
            <Activity size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Taxa de Acerto</span>
            <span className={styles.metricValue}>{globalAccuracy}%</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ color: 'var(--success)', backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
            <Target size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Questões Resolvidas</span>
            <span className={styles.metricValue}>{stats.totalAnswered}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ color: 'var(--warning)', backgroundColor: 'rgba(234, 179, 8, 0.1)' }}>
            <BrainCircuit size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Sessões Concluídas</span>
            <span className={styles.metricValue}>{stats.completedSessions}</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ color: 'var(--muted)', backgroundColor: 'var(--border)' }}>
            <Database size={24} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Questões no Banco</span>
            <span className={styles.metricValue}>{stats.totalQuestionsInBank}</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartBox}>
          <h3 className={styles.chartTitle}>Acertos vs Erros (Global)</h3>
          {stats.totalAnswered === 0 ? (
            <div className={styles.emptyChart}>Nenhuma questão respondida ainda.</div>
          ) : (
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Acertos' ? COLORS[0] : COLORS[1]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className={styles.chartBox}>
          <h3 className={styles.chartTitle}>Desempenho por Tópico</h3>
          {stats.topicStats.length === 0 ? (
            <div className={styles.emptyChart}>Sem dados por tópico.</div>
          ) : (
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{fill: 'var(--muted)'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill: 'var(--muted)'}} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{fill: 'var(--surface-hover)'}} />
                  <Legend />
                  <Bar dataKey="Acertos" stackId="a" fill={COLORS[0]} radius={[0, 0, 4, 4]} />
                  <Bar dataKey="Erros" stackId="a" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
