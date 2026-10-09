import { getGlobalStats } from '@/actions/dashboard';
import { Dashboard } from '@/components/Dashboard';

export default async function HomePage() {
  const stats = await getGlobalStats();

  return (
    <Dashboard stats={stats} />
  );
}
