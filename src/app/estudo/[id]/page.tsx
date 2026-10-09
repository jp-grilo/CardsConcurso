import { getSessionData } from '@/actions/runner';
import { EstudoRunner } from '@/components/EstudoRunner';

export default async function EstudoExecutionPage({ params }: { params: { id: string } }) {
  const data = await getSessionData(Number(params.id));

  return (
    <div style={{ height: 'calc(100vh - 64px)' }}>
      <EstudoRunner 
        session={data.session} 
        questions={data.questions} 
      />
    </div>
  );
}
