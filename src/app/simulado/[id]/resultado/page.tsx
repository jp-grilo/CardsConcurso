import { getSimuladoResults } from '@/actions/results';
import { SimuladoResult } from '@/components/SimuladoResult';

export default async function ResultadoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getSimuladoResults(Number(id));

  return (
    <div>
      <SimuladoResult data={data} />
    </div>
  );
}
