import fs from 'fs';
import path from 'path';
// @ts-ignore
import { PDFParse } from 'pdf-parse';

async function extractPdfText(pdfPath: string): Promise<string> {
  const data = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data });
  await (parser as any).load();
  const res = await (parser as any).getText();
  await (parser as any).destroy();
  return res.text || '';
}

async function run() {
  console.log('--- Iniciando conversão de PDFs de knowledge_raw/ para Markdown ---');

  // 1. Extração de Matérias e Conteúdo Programático
  console.log('Processando editais e programas de matérias...');
  const materiasText = await extractPdfText(path.join('knowledge_raw', 'Matérias.pdf'));
  const programaText = await extractPdfText(path.join('knowledge_raw', 'Conteúdo progamático - TCE-GO 2026.md.pdf'));

  // Salvar edital consolidado de TI
  const editalTIPath = path.join('scripts', 'knowledge', 'edital', 'conteudo_programatico_tce_go.md');
  const editalTIContent = `# Conteúdo Programático - Concurso TCE-GO (Tecnologia da Informação)

## Visão Geral das Matérias e Estrutura dos Blocos
${materiasText.trim()}

---

## Detalhamento Completo do Edital (Conhecimentos Gerais e Específicos)
${programaText.trim()}
`;
  fs.writeFileSync(editalTIPath, editalTIContent, 'utf-8');
  console.log(`[OK] Criado: ${editalTIPath}`);

  // 2. Extração do Simulado 1 com Gabarito
  console.log('Processando Simulado 1 Corrigido...');
  const simuladoText = await extractPdfText(path.join('knowledge_raw', 'Simulado 1 - Concurso TCE-GO (Corrigido com Gabarito).pdf.pdf'));
  const simuladoPath = path.join('scripts', 'knowledge', 'provas', 'simulado_1_tce_go_questoes.md');
  fs.writeFileSync(simuladoPath, `# Simulado 1 - TCE-GO (Analista de Controle Externo - TI)\n\n${simuladoText.trim()}`, 'utf-8');
  console.log(`[OK] Criado: ${simuladoPath}`);

  // 3. Extração da Prova Real FCC H08 (TI) e Gabarito
  console.log('Processando Prova Real FCC H08 e Gabaritos...');
  const provaH08Text = await extractPdfText(path.join('knowledge_raw', 'analista_cont_ext_tec_inf_h08_tipo_001.pdf.pdf'));
  const gabaritoH08Text = await extractPdfText(path.join('knowledge_raw', 'gabaritos analista_cont_ext_tec_inf_h08_tipo_001.pdf.pdf'));

  const provaH08Path = path.join('scripts', 'knowledge', 'provas', 'prova_fcc_tce_go_h08_ti.md');
  fs.writeFileSync(provaH08Path, `# Prova Oficial FCC - TCE-GO (Analista de Controle Externo - TI - H08 Tipo 001)\n\n${provaH08Text.trim()}`, 'utf-8');
  console.log(`[OK] Criado: ${provaH08Path}`);

  const gabaritoPath = path.join('scripts', 'knowledge', 'provas', 'gabaritos_fcc_tce_go.md');
  fs.writeFileSync(gabaritoPath, `# Gabaritos Oficiais FCC - TCE-GO\n\n${gabaritoH08Text.trim()}`, 'utf-8');
  console.log(`[OK] Criado: ${gabaritoPath}`);

  console.log('--- Conversão concluída com sucesso! ---');
}

run().catch(err => {
  console.error('Erro na conversão:', err);
  process.exit(1);
});
