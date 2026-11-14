# Prompt Parametrizado para Geração de Questões (Anexar e Preencher)

Anexe este arquivo no chat e informe apenas os **4 parâmetros** abaixo para gerar novas questões focadas nos **conceitos indispensáveis** e nas **lacunas reais do `database.sqlite`**:

```text
{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Governanca de TI - Frameworks (COBIT 2019, ITIL v4 e ISO 38500) {DIFFICULTY_RANGE}=5-10
```

---

## Instruções para o Assistente / Modelo (Execução Automática)

Ao receber este arquivo acompanhado dos valores de `{BATCH_SIZE}`, `{TIPO_QUESTAO}`, `{TOPIC}` e `{DIFFICULTY_RANGE}`:

1. **Anti-duplicação no SQLite:** Consulte as questões já cadastradas em `database.sqlite` para `{TOPIC}` (via `scripts/db-service.ts` / `scripts/caveman-compressor.ts`) e **não** repita casos fáticos, artigos específicos ou pegadinhas conceituais já existentes.
2. **Cobertura de Conceitos Indispensáveis:** Priorize os conceitos listados em [plano_estudos_tce_go_ti.md](file:///d:/Documentos/Projetos/CardsConcurso/scripts/prompts/plano_estudos_tce_go_ti.md#L121-L185) para `{TOPIC}`, garantindo foco no estilo **FCC (TCE-GO Cargo B02 - TI)**.
3. **Distribuição Obrigatória de Dificuldade (`{DIFFICULTY_RANGE}`):**
   - Se `{DIFFICULTY_RANGE}=5-10` e `{BATCH_SIZE}=8`: gere exatamente **1× nível 5, 1× nível 6, 2× nível 7, 2× nível 8, 1× nível 9, 1× nível 10**.
   - Para outros valores de `{BATCH_SIZE}` ou `{DIFFICULTY_RANGE}` (ex.: `5-10` com `BATCH_SIZE=10`, ou `7-10`), distribua os pesos proporcionalmente cobrindo **pelo menos 3–5 níveis distintos** dentro da faixa (ex. para `10` questões em `5-10`: `1×5, 2×6, 2×7, 2×8, 2×9, 1×10`).
4. **Formato `{TIPO_QUESTAO}`:**
   - `Múltipla Escolha`: exatamente 5 alternativas (`A–E`), apenas 1 `is_correct: true`.
   - `Estudo de Caso`: cenário hipotético concreto no enunciado + 5 alternativas (`A–E`), apenas 1 `is_correct: true` (ideal para `7-10`).
   - `Certo ou Errado`: afirmação declarativa + 2 opções (`"Certo"` e `"Errado"`), apenas 1 `is_correct: true` *(importar via `/questoes`)*.
5. **Saída JSON válida:** Retorne JSON válido (aspas internas escapadas com `\"`), `justification` técnica em **todas** as alternativas, e formato pronto para ingestão direta no `database.sqlite` (`category`, `statement`, `difficulty`, `options`).

---

## Tópicos que Precisam de Reforço no Banco (Prontos para Copiar)

Auditoria realizada em `database.sqlite` (1.055 questões):
- Quase **80%–90%** do acervo atual está travado em **nível 7–8** (`0` questões de nível 1–4, e vários tópicos têm `0` ou `1` questão nos níveis `5–6` e `9–10`).
- **9 tópicos** (Português, RLM e Legislação Institucional) têm apenas **20–25 questões**, volume insuficiente para 9 semanas sem repetição.

Use as linhas prontas abaixo (ajuste `{BATCH_SIZE}` e `{TIPO_QUESTAO}` se quiser):

### Grupo A — Tópicos Peso 2 com Déficit de Níveis (5–6 ou 9–10) e Alta Relevância
- **COBIT 2019 / ITIL v4 / ISO 38500** *(atual: 30q | 3 em 5–6, 4 em 9–10)*
  `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Estudo de Caso {TOPIC}=Governanca de TI - Frameworks (COBIT 2019, ITIL v4 e ISO 38500) {DIFFICULTY_RANGE}=5-10`
- **Contratações de TI e Governo Digital** *(atual: 30q | apenas 1 em 5–6)*
  `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Governanca de TI - Contratacoes de TI e Governo Digital {DIFFICULTY_RANGE}=5-10`
- **Gestão de Riscos, Continuidade e ISO 27k** *(atual: 30q | apenas 2 em 9–10)*
  `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Estudo de Caso {TOPIC}=Seguranca da Informacao - Gestao de Riscos, Continuidade e Normas {DIFFICULTY_RANGE}=5-10`
- **Princípios, Criptografia e IAM** *(atual: 30q | reforço em cenários práticos FCC)*
  `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Seguranca da Informacao - Principios, Criptografia e IAM {DIFFICULTY_RANGE}=5-10`
- **Engenharia de Prompts e RAG** *(atual: 30q | **0** em 5–6, 3 em 9–10)*
  `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Inteligencia Artificial - Engenharia de Prompts e RAG {DIFFICULTY_RANGE}=5-10`
- **Sistemas Agentivos e Protocolo MCP** *(atual: 30q | **0** em 5–6)*
  `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Inteligencia Artificial - Sistemas Agentivos e Protocolo MCP {DIFFICULTY_RANGE}=5-10`
- **Fundamentos, ML e NLP** *(atual: 30q | **0** em 5–6)*
  `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Inteligencia Artificial - Fundamentos, Machine Learning e NLP {DIFFICULTY_RANGE}=5-10`
- **Containers e Orquestração (Docker/K8s)** *(atual: 30q | **0** em 9–10)*
  `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Estudo de Caso {TOPIC}=DevOps e Plataformas - Containers e Orquestracao {DIFFICULTY_RANGE}=6-10`
- **Arquitetura de APIs e Integração** *(atual: 30q | apenas 1 em 5–6 e 1 em 9–10)*
  `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Desenvolvimento de Sistemas - Arquitetura de APIs e Integracao {DIFFICULTY_RANGE}=5-10`
- **Computação em Nuvem** *(atual: 30q | apenas 1 em 9–10)*
  `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Estudo de Caso {TOPIC}=Infraestrutura - Computacao em Nuvem {DIFFICULTY_RANGE}=6-10`
- **LGPD e Marco Civil da Internet** *(atual: 30q | apenas 1 em 5–6 e 2 em 9–10)*
  `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Legislacao de TI - LGPD e Marco Civil da Internet {DIFFICULTY_RANGE}=5-10`
- **DevSecOps e Segurança de Aplicações** *(atual: 30q | apenas 1 em 5–6)*
  `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Seguranca da Informacao - DevSecOps e Seguranca de Aplicacoes {DIFFICULTY_RANGE}=5-10`

### Grupo B — Tópicos com Baixo Volume Total no Banco (20–25 questões)
- **Português — Compreensão e Redação Oficial** *(atual: 20q | 1 em 9–10)*
  `{BATCH_SIZE}=10 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Lingua Portuguesa - Compreensao e Redacao Oficial {DIFFICULTY_RANGE}=5-10`
- **Português — Gramática, Sintaxe e Crase** *(atual: 25q | 0 em 5–6, 1 em 9–10)*
  `{BATCH_SIZE}=10 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Lingua Portuguesa - Gramatica, Sintaxe e Crase {DIFFICULTY_RANGE}=5-10`
- **Português — Concordância, Regência e Conectivos** *(atual: 20q | 0 em 5–6)*
  `{BATCH_SIZE}=10 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Lingua Portuguesa - Concordancia, Regencia e Conectivos {DIFFICULTY_RANGE}=5-10`
- **Português — Significação e Estilística** *(atual: 20q | 100% travado em 7–8)*
  `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Lingua Portuguesa - Significacao e Estilistica {DIFFICULTY_RANGE}=5-10`
- **Legislação — Controle Constitucional e CF/88** *(atual: 20q | 0 em 5–6)*
  `{BATCH_SIZE}=10 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Legislacao Institucional - Controle Constitucional e CF/88 {DIFFICULTY_RANGE}=5-10`
- **Legislação — Constituição Estadual e Normativos TCE-GO** *(atual: 20q | 0 em 5–6, 1 em 9–10)*
  `{BATCH_SIZE}=10 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Legislacao Institucional - Constituicao Estadual e Normativos do TCE-GO {DIFFICULTY_RANGE}=5-10`
- **Matemática/RLM — Lógica Proposicional e Argumentação** *(atual: 20q | 0 em 5–6)*
  `{BATCH_SIZE}=10 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Matematica e Raciocinio Logico - Logica Proposicional e Argumentacao {DIFFICULTY_RANGE}=5-10`
- **Matemática/RLM — Matemática Básica e Proporções** *(atual: 20q | 0 em 5–6, 1 em 9–10)*
  `{BATCH_SIZE}=10 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Matematica e Raciocinio Logico - Matematica Basica e Proporcoes {DIFFICULTY_RANGE}=5-10`
- **Matemática/RLM — Estruturas Lógicas e Dedução** *(atual: 20q | 0 em 5–6, 1 em 9–10)*
  `{BATCH_SIZE}=10 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Matematica e Raciocinio Logico - Estruturas Logicas e Deducao {DIFFICULTY_RANGE}=5-10`

### Grupo C — Demais Tópicos (Reforço sob Demanda após Simulados)
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Banco de Dados - Modelagem Relacional, SQL e Transacoes {DIFFICULTY_RANGE}=6-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Banco de Dados - NoSQL, Bancos Vetoriais e Operacao {DIFFICULTY_RANGE}=5-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Infraestrutura - Redes de Computadores e Protocolos {DIFFICULTY_RANGE}=6-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Infraestrutura - Sistemas Operacionais (Linux e Windows) {DIFFICULTY_RANGE}=6-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Desenvolvimento de Sistemas - Logica e Linguagens de Programacao {DIFFICULTY_RANGE}=6-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Desenvolvimento de Sistemas - Front-end Web Moderno {DIFFICULTY_RANGE}=5-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Engenharia de Software - Metodologias Ageis e Ciclo de Vida {DIFFICULTY_RANGE}=5-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Engenharia de Software - Arquitetura, Padroes GoF e SOLID {DIFFICULTY_RANGE}=5-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Engenharia de Software - Qualidade, Testes e Metricas {DIFFICULTY_RANGE}=5-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Engenharia de Software - Engenharia de Requisitos {DIFFICULTY_RANGE}=5-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Engenharia de Software - Modelagem com UML e BPMN {DIFFICULTY_RANGE}=5-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=DevOps e Plataformas - Controle de Versao e CI/CD {DIFFICULTY_RANGE}=5-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=DevOps e Plataformas - Infraestrutura como Codigo e Observabilidade {DIFFICULTY_RANGE}=5-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Inteligencia Artificial - Governanca, Etica e Seguranca em IA {DIFFICULTY_RANGE}=5-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Legislacao de TI - Normativos Internos de TI do TCE-GO {DIFFICULTY_RANGE}=5-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Legislacao Institucional - Regime dos Servidores de Goias e Resolucoes {DIFFICULTY_RANGE}=5-10`
- `{BATCH_SIZE}=8 {TIPO_QUESTAO}=Múltipla Escolha {TOPIC}=Lingua Inglesa - Leitura Tecnica de TI {DIFFICULTY_RANGE}=5-10`
