import { getSessionData } from '@/actions/runner';
import { EstudoRunner } from '@/components/EstudoRunner';

export default async function EstudoExecutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getSessionData(Number(id));

  return (
    <div style={{ height: 'calc(100vh - 64px)' }}>
      <EstudoRunner 
        session={data.session} 
        questions={data.questions} 
      />
    </div>
  );
}
