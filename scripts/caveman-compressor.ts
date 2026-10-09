/**
 * caveman-compressor.ts
 *
 * Compactador telegráfico ("Caveman style") para enunciados de questões existentes.
 * Reduz em até 75% o número de tokens consumidos na lista de exclusão do prompt,
 * preservando o núcleo temático, jurídico e fático de cada questão.
 */

// Stopwords e termos burocráticos/introdutórios frequentes em concursos
const STOPWORDS = new Set([
  'a', 'o', 'os', 'as', 'um', 'uma', 'uns', 'umas',
  'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
  'por', 'pelo', 'pela', 'pelos', 'pelas', 'para', 'pra', 'com', 'sem', 'sob', 'sobre',
  'e', 'ou', 'mas', 'porem', 'contudo', 'todavia', 'entretanto', 'portanto',
  'que', 'qual', 'quais', 'cujo', 'cuja', 'cujos', 'cujas', 'onde', 'quando', 'como',
  'se', 'caso', 'embora', 'conquanto', 'porque', 'porquanto', 'pois',
  'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas', 'aquele', 'aquela',
  'isto', 'isso', 'aquilo', 'seu', 'sua', 'seus', 'suas', 'dele', 'dela',
  'acerca', 'respeito', 'tocante', 'quanto', 'considere', 'considerando',
  'assinale', 'afirmativa', 'alternativa', 'opcao', 'correta', 'incorreta',
  'analise', 'seguinte', 'situacao', 'hipotese', 'pergunta', 'questao',
  'texto', 'abaixo', 'acima', 'diante', 'disposto', 'termos', 'conformidade',
  'conforme', 'segundo', 'acordo'
]);

/**
 * Remove acentos e normaliza para minúsculas
 */
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Comprime um enunciado para sua forma Caveman telegráfica:
 * - Remove pontuações desnecessárias
 * - Remove stopwords e comandos de prova
 * - Mantém palavras de alta densidade semântica (leis, números, termos técnicos, conceitos)
 * - Limita a um número máximo de palavras-chave
 */
export function toCavemanSummary(statement: string, maxWords: number = 14): string {
  if (!statement || typeof statement !== 'string') return '';

  // Preservar menções a artigos, leis e normas antes de limpar
  const clean = normalizeText(statement)
    .replace(/[^\w\s\d.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = clean.split(' ');
  const keywords: string[] = [];

  for (const word of words) {
    if (word.length <= 2 && !/\d/.test(word)) continue;
    if (STOPWORDS.has(word)) continue;
    keywords.push(word);
    if (keywords.length >= maxWords) break;
  }

  return keywords.join(' ');
}

/**
 * Converte um array de enunciados para uma lista numerada compacta em formato Caveman
 */
export function buildCavemanExclusionList(statements: string[]): string {
  if (!statements || statements.length === 0) {
    return 'Nenhuma questão prévia cadastrada para este tópico.';
  }

  return statements
    .map((stmt, idx) => {
      const summary = toCavemanSummary(stmt);
      return `${idx + 1}. [${summary}]`;
    })
    .join('\n');
}
