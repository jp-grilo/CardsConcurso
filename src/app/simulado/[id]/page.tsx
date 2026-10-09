import { getSessionData } from '@/actions/runner';
import { SimuladoRunner } from '@/components/SimuladoRunner';

export default async function SimuladoExecutionPage({ params }: { params: { id: string } }) {
  // Passando o ID convertido para Number
  const data = await getSessionData(Number(params.id));

  return (
    <div style={{ height: 'calc(100vh - 64px)' }}>
      <SimuladoRunner 
        session={data.session} 
        questions={data.questions} 
      />
    </div>
  );
}
