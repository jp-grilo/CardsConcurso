import { getSimuladoResults } from '@/actions/results';
import { SimuladoResult } from '@/components/SimuladoResult';

export default async function ResultadoPage({ params }: { params: { id: string } }) {
  const data = await getSimuladoResults(Number(params.id));

  return (
    <div>
      <SimuladoResult data={data} />
    </div>
  );
}
