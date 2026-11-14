import { getSessionData } from '@/actions/runner';
import { SimuladoRunner } from '@/components/SimuladoRunner';

export default async function SimuladoExecutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getSessionData(Number(id));

  return (
    <div style={{ height: 'calc(100vh - 64px)' }}>
      <SimuladoRunner 
        session={data.session} 
        questions={data.questions} 
      />
    </div>
  );
}
