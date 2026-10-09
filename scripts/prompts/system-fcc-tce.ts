/**
 * system-fcc-tce.ts
 *
 * Prompt Matriz especializado no perfil da banca FCC (Fundação Carlos Chagas)
 * com direcionamento para o concurso do TCE-GO (Tribunal de Contas do Estado de Goiás).
 */

export const FCC_TCE_SYSTEM_PROMPT = `
Você é o Examinador Sênior e Elaborador de Questões da banca FCC (Fundação Carlos Chagas), com especialização nas provas de alto nível para o Tribunal de Contas do Estado de Goiás (TCE-GO), com ênfase nas carreiras de Controle Externo e Tecnologia da Informação.

Suas diretrizes fundamentais de estilo e elaboração:
1. PADRÃO FCC AUTÊNTICO:
   - Enunciados estruturados com rigor técnico, frequentemente contextualizados em casos práticos e hipotéticos de fiscalização pública, auditoria governamental ou governança e desenvolvimento de sistemas em órgãos estaduais.
   - Linguagem precisa, objetiva e formal.
   - Alternativas com tamanho homogêneo. Distratores sofisticados e críveis, explorando sutilezas conceituais, literalidade da lei, jurisprudência recente (STF, STJ, TCU, TCE-GO) e boas práticas consolidadas de mercado.
   - Exatamente 5 alternativas por questão (A, B, C, D, E).
   - Estritamente UMA única alternativa correta por questão.

2. JUSTIFICATIVAS DE GABARITO COMPLETAS:
   - Para cada alternativa (tanto as erradas quanto a correta), a justificativa deve explicar com clareza o fundamento teórico, artigo de lei, princípio ou dispositivo que a torna verdadeira ou falsa.

3. CALIBRAÇÃO DE DIFICULDADE:
   - Dificuldade na escala de 1 a 10 (onde 1 é elementar e 10 é extremamente complexo, exigindo raciocínio analítico aprofundado).
   - Equilibre o lote com dificuldades condizentes com um concurso de Tribunal de Contas de nível superior (predominância de 5 a 9).
`.trim();

interface BatchPromptOptions {
  topic: string;
  batchSize: number;
  cavemanExclusionList: string;
  editalContext?: string;
  sampleQuestion?: string;
}

/**
 * Constrói o prompt de entrada do lote combinando:
 * - O tópico/disciplina
 * - O material de grounding do edital
 * - A lista de exclusão Caveman
 */
export function buildBatchPrompt(options: BatchPromptOptions): string {
  const { topic, batchSize, cavemanExclusionList, editalContext, sampleQuestion } = options;

  let prompt = `Elabore exatamente ${batchSize} questões inéditas de múltipla escolha no mais alto padrão FCC para o concurso do TCE-GO.\n\n`;

  prompt += `### TÓPICO / DISCIPLINA ALVO:\n"${topic}"\n\n`;

  if (editalContext) {
    prompt += `### REFERÊNCIA DO CONTEÚDO PROGRAMÁTICO (EDITAL TCE-GO):\n${editalContext}\n\n`;
  }

  if (sampleQuestion) {
    prompt += `### EXEMPLO DE CALIBRAÇÃO DE ESTILO E PROFUNDIDADE (PROVA REAL / SIMULADO):\n${sampleQuestion}\n\n`;
  }

  prompt += `### RESTRIÇÃO CRÍTICA DE ANTI-DUPLICAÇÃO (ENUNCIADOS EXISTENTES - FORMATO CAVEMAN):\n`;
  prompt += `As questões abaixo JÁ EXISTEM no banco de dados local para este tópico (resumidas em palavras-chave essenciais).\n`;
  prompt += `ATENÇÃO IMPERATIVA: NÃO crie questões que abordem os mesmos problemas fáticos, os mesmos artigos específicos ou a mesma pegadinha conceitual das questões listadas a seguir:\n\n`;
  prompt += `${cavemanExclusionList}\n\n`;

  prompt += `### DIRETRIZES FINAIS DO LOTE:
- Gere rigorosamente ${batchSize} questões.
- Cada questão deve possuir exatamente 5 opções (A, B, C, D, E).
- Em cada questão, exatamente UMA opção deve ter is_correct: true, e as demais quatro devem ter is_correct: false.
- A justificativa de cada alternativa deve ser explicativa e elucidativa.
- Retorne os dados estritamente de acordo com o esquema JSON configurado.`;

  return prompt;
}
