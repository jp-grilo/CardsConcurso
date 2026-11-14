# Plano de Estudos Estratégico — TCE-GO 2026 (TI / Código B02)

- **Período:** 13/11/2026 a 16/01/2027 (**65 dias / ~9 semanas** até a prova de **17/01/2027**)
- **Carga Horária:** 1h30 a 2h00/dia (~100 a 125 horas líquidas) + **Simulados nos fins de semana**
- **Perfil Base:** Ciência da Computação — UFG (ingresso em 2019)
- **Banca:** FCC | **Objetiva:** 25 Gerais (Peso 1) + 45 Específicas TI (Peso 2) | **Discursiva:** Estudo de Caso em TI (100 pts)
- **Prompts de Geração:** [modelos-solicitacao-api.md](file:///d:/Documentos/Projetos/CardsConcurso/scripts/prompts/modelos-solicitacao-api.md) *(Lote padrão de 8 questões: `1×5, 1×6, 2×7, 2×8, 1×9, 1×10`)*

---

## 1. Diagnóstico do Seu Perfil (CC UFG 2019 × Edital FCC)

Com ~110 horas até a prova, **não há tempo hábil para ler teoria extensa do zero**. A estratégia vencedora é **Estudo Reverso por Questões + Foco nos Conceitos Indispensáveis**:

1. **Onde sua graduação já resolve 70%–80% (calibração rápida por questões):**
   - `Banco de Dados - Modelagem Relacional, SQL e Transacoes`
   - `Infraestrutura - Redes de Computadores e Protocolos` & `Sistemas Operacionais (Linux e Windows)`
   - `Desenvolvimento de Sistemas - Logica e Linguagens de Programacao`
   - `Engenharia de Software` clássica (Ciclo de Vida, Requisitos, UML/BPMN, SOLID/GoF, Testes)
   - `Matematica e Raciocinio Logico` & `Lingua Inglesa`
   > **Conduta:** vá direto para as questões no CardsConcurso (dificuldades 6–9) para aprender as **pegadinhas literais da FCC**, sem perder semanas relendo teoria básica que você já viu na UFG.

2. **Onde moram os pontos decisivos e suas maiores lacunas (prioridade máxima):**
   - **Governança & Contratações de TI (Peso 2 + Discursiva):** `COBIT 2019`, `ITIL v4`, `ISO 38500`, `IN SGD/ME 94/2022`, `Lei 14.133/2021` aplicada a TI.
   - **Segurança Normativa (Peso 2 + Discursiva):** `ISO/IEC 27001 e 27002`, `Gestão de Riscos (27005/31000)`, `Continuidade (22301)`, `DevSecOps / OWASP`.
   - **Stack Moderna Pós-2019 (Peso 2 — 9 questões só ligadas a IA):** `Engenharia de Prompts e RAG`, `Sistemas Agentivos e Protocolo MCP`, `Bancos Vetoriais`, `Containers/Kubernetes`, `CI/CD`, `IaC e Observabilidade`.
   - **Legislação Seca (Peso 2 em TI + Peso 1 Institucional):** `LGPD`, `Marco Civil`, `Normativos Internos TCE-GO`, `CF/88 arts. 37 e 70–75`, `Lei Orgânica 16.168/2007` e `Regimento Interno TCE-GO`.
   - **Português FCC (10 questões Peso 1):** `Crase`, `Pontuação`, `Concordância/Regência`, `Reescrita` e `Redação Oficial`.

---

## 2. Rotina Diária (1h30 – 2h00) & Fins de Semana

### Segunda a Sexta (90 a 120 min/dia)
1. **Bloco A — Prática no CardsConcurso (50 min):**
   - Abra o **Modo Estudo** no tópico do dia e resolva **15 a 20 questões** (já existem 1.055 no banco).
2. **Bloco B — Fechamento de Lacunas e Conceitos Indispensáveis (40 a 60 min):**
   - Leia com atenção as justificativas das questões que errou ou acertou na dúvida.
   - Anote os **conceitos indispensáveis** que falharam e peça aqui no chat um **lote de 8 questões (`1×5, 1×6, 2×7, 2×8, 1×9, 1×10`)** usando a **Seção 0.1** (ou **0.3**) de [modelos-solicitacao-api.md](file:///d:/Documentos/Projetos/CardsConcurso/scripts/prompts/modelos-solicitacao-api.md).

### Sábado e Domingo (1h30 – 2h00/dia)
- **Sábado — Modo Simulado (Peso Real):** Monte um simulado no CardsConcurso configurando **Peso 1** para Conhecimentos Gerais e **Peso 2** para Específicas (35 a 70 questões cronometradas, aumentando até 70 nas semanas finais).
- **Domingo — Auditoria de Erros + Estudo de Caso (Discursiva):**
  - Revise os erros do simulado no relatório pós-sessão;
  - Gere ou resolva 1 bateria usando o prompt da **Seção 0.2 (Tópicos Relacionados & Estudo de Caso)** e rascunhe 1 resposta discursiva estruturada (30 min) sobre Governança, Segurança ou Arquitetura/IA.

---

## 3. Mapa de Relações entre Tópicos (4 Trilhas Integradas)

Estudar os tópicos abaixo **em conjunto** multiplica a retenção e prepara direto para o **Estudo de Caso da Discursiva**:

- **Trilha 1 — Controle Externo, Governança e Riscos:**
  `Controle Constitucional e CF/88` ↔ `Constituicao Estadual e Normativos do TCE-GO` ↔ `Contratacoes de TI e Governo Digital` ↔ `Frameworks (COBIT 2019, ITIL v4 e ISO 38500)` ↔ `Gestao de Riscos, Continuidade e Normas`
- **Trilha 2 — IA Aplicada, Dados Modernos e Privacidade:**
  `Fundamentos, Machine Learning e NLP` ↔ `Engenharia de Prompts e RAG` ↔ `NoSQL, Bancos Vetoriais e Operacao` ↔ `Sistemas Agentivos e Protocolo MCP` ↔ `Governanca, Etica e Seguranca em IA` ↔ `LGPD e Marco Civil da Internet`
- **Trilha 3 — Engenharia, Entrega e Segurança de Aplicações:**
  `Engenharia de Requisitos` + `Metodologias Ageis` ↔ `Arquitetura, Padroes GoF e SOLID` + `Arquitetura de APIs e Integracao` ↔ `DevSecOps e Seguranca de Aplicacoes` ↔ `Controle de Versao e CI/CD` ↔ `Containers e Orquestracao` ↔ `IaC e Observabilidade`
- **Trilha 4 — Infraestrutura, Dados Clássicos e Base Geral:**
  `Modelagem Relacional, SQL e Transacoes` ↔ `Redes de Computadores e Protocolos` ↔ `Sistemas Operacionais` ↔ `Computacao em Nuvem` ↔ `Principios, Criptografia e IAM`

---

## 4. Cronograma de 9 Semanas (13/11/2026 → 16/01/2027)

### Semana 1 (13/11 a 19/11) — Trilha 1: Segurança Normativa & Governança Core
- **Seg/Ter:** `Seguranca da Informacao - Principios, Criptografia e IAM` + `Gestao de Riscos, Continuidade e Normas`
- **Qua/Qui:** `Governanca de TI - Frameworks (COBIT 2019, ITIL v4 e ISO 38500)`
- **Sex:** `Lingua Portuguesa - Compreensao e Redacao Oficial` *(calibração inicial FCC)*
- **Sáb/Dom:** Simulado 35 questões (Segurança + Governança + Português) + 1 Estudo de Caso (ISO 27001 + COBIT).

### Semana 2 (20/11 a 26/11) — Trilha 1: Contratações de TI & Controle Institucional
- **Seg/Ter:** `Governanca de TI - Contratacoes de TI e Governo Digital`
- **Qua:** `Legislacao Institucional - Controle Constitucional e CF/88`
- **Qui:** `Legislacao Institucional - Constituicao Estadual e Normativos do TCE-GO`
- **Sex:** `Lingua Portuguesa - Gramatica, Sintaxe e Crase`
- **Sáb/Dom:** Simulado 45 questões (Trilha 1 completa + Português) + 1 Estudo de Caso (Contratação de TI fiscalizada pelo TCE-GO).

### Semana 3 (27/11 a 03/12) — Trilha 2: IA Moderna, RAG e Bancos Vetoriais
- **Seg/Ter:** `Inteligencia Artificial - Engenharia de Prompts e RAG` ↔ `Banco de Dados - NoSQL, Bancos Vetoriais e Operacao`
- **Qua/Qui:** `Inteligencia Artificial - Sistemas Agentivos e Protocolo MCP`
- **Sex:** `Inteligencia Artificial - Fundamentos, Machine Learning e NLP`
- **Sáb/Dom:** Simulado 50 questões (IA + Bancos + revisão Trilha 1) + 1 Estudo de Caso (Arquitetura RAG com MCP no setor público).

### Semana 4 (04/12 a 10/12) — Trilha 2: Ética em IA, LGPD & Legislação TI
- **Seg/Ter:** `Inteligencia Artificial - Governanca, Etica e Seguranca em IA` ↔ `Legislacao de TI - LGPD e Marco Civil da Internet`
- **Qua:** `Legislacao de TI - Normativos Internos de TI do TCE-GO`
- **Qui:** `Legislacao Institucional - Regime dos Servidores de Goias e Resolucoes`
- **Sex:** `Lingua Portuguesa - Concordancia, Regencia e Conectivos`
- **Sáb/Dom:** Simulado 55 questões (Trilha 2 + Legislação + Português) + 1 Estudo de Caso (IA + LGPD + Riscos).

### Semana 5 (11/12 a 17/12) — Trilha 3: APIs, Arquitetura & DevSecOps
- **Seg/Ter:** `Desenvolvimento de Sistemas - Arquitetura de APIs e Integracao` ↔ `Engenharia de Software - Arquitetura, Padroes GoF e SOLID`
- **Qua/Qui:** `Seguranca da Informacao - DevSecOps e Seguranca de Aplicacoes`
- **Sex:** `Engenharia de Software - Metodologias Ageis e Ciclo de Vida` + `Qualidade, Testes e Metricas`
- **Sáb/Dom:** Simulado 60 questões (Trilha 3 + revisões) + 1 Estudo de Caso (APIs seguras + OWASP + CI/CD).

### Semana 6 (18/12 a 24/12) — Trilha 3: DevOps, Containers, IaC & Requisitos
- **Seg/Ter:** `DevOps e Plataformas - Containers e Orquestracao` ↔ `Controle de Versao e CI/CD`
- **Qua/Qui:** `DevOps e Plataformas - Infraestrutura como Codigo e Observabilidade`
- **Sex:** `Engenharia de Software - Engenharia de Requisitos` + `Modelagem com UML e BPMN`
- **Sáb/Dom:** Simulado 60 questões (Trilha 3 completa + Português) + revisão de erros da semana.

### Semana 7 (25/12 a 31/12) — Trilha 4: Calibração FCC do Núcleo Clássico (Base UFG)
- **Seg/Ter:** `Banco de Dados - Modelagem Relacional, SQL e Transacoes` *(nível 7–10)*
- **Qua:** `Infraestrutura - Redes de Computadores e Protocolos`
- **Qui:** `Infraestrutura - Computacao em Nuvem` + `Sistemas Operacionais (Linux e Windows)`
- **Sex:** `Desenvolvimento de Sistemas - Logica e Linguagens de Programacao` + `Front-end Web Moderno`
- **Sáb/Dom:** **Simulado Completo 70 questões** (espelho oficial do Edital B02) + 1 Estudo de Caso (Infra/Nuvem + Segurança).

### Semana 8 (01/01 a 07/01) — Conhecimentos Gerais + Reforço de Pontos Fracos
- **Seg/Ter:** `Matematica e Raciocinio Logico - Logica Proposicional e Argumentacao` + `Matematica Basica e Proporcoes` + `Estruturas Logicas e Deducao`
- **Qua:** `Lingua Portuguesa - Significacao e Estilistica` + bateria mista de Português FCC
- **Qui:** `Lingua Inglesa - Leitura Tecnica de TI` + Revisão de `Normativos TCE-GO` e `LGPD`
- **Sex:** Reforço dirigido (Seção 0.3) nos **3 piores tópicos** do Dashboard do CardsConcurso
- **Sáb/Dom:** **Simulado Completo 70 questões** cronometrado + 1 Estudo de Caso (tempo de prova real).

### Semana 9 (08/01 a 16/01) — Reta Final Cirúrgica (Sem Matéria Nova)
- **08/01 a 11/01:** Sessões diárias de 30–40 questões no CardsConcurso filtrando dificuldades **7–9** nos tópicos de **Nível 1 e 2** (o algoritmo de retenção prioriza seus erros antigos).
- **12/01 a 14/01:** Revisão seca de lei/norma: `CF/88 arts. 37 e 70–75`, `LGPD`, `COBIT 2019 (domínios)`, `ITIL v4 (práticas)`, `ISO 27001/27002`, `Crase/Pontuação FCC`.
- **15/01:** Último simulado curto (35 questões de confiança, dificuldade 5–7) + leitura de 2 modelos de resposta de Estudo de Caso.
- **16/01 (Véspera):** Revisão leve (45–60 min) apenas de flashcards de erros e fórmulas/prazos de lei. Descanso para a prova em **17/01/2027**.

---

## 5. Guia de Conceitos Indispensáveis por Tópico (O Que Pedir nas Questões)

Copie a lista do tópico desejado para `{CONCEITOS_INDISPENSAVEIS}` no prompt da **Seção 0.1** de [modelos-solicitacao-api.md](file:///d:/Documentos/Projetos/CardsConcurso/scripts/prompts/modelos-solicitacao-api.md):

### Nível 1 — Prioridade Máxima
1. **`Seguranca da Informacao - Principios, Criptografia e IAM`:** CID+AL (Confidencialidade, Integridade, Disponibilidade, Autenticidade, Legalidade/Não Repúdio); criptografia simétrica (AES) vs assimétrica (RSA/ECC); funções hash (SHA-256), assinatura digital e ICP-Brasil; autenticação multifator (MFA), OAuth 2.0, OpenID Connect, SAML, RBAC/ABAC e Zero Trust.
2. **`Seguranca da Informacao - Gestao de Riscos, Continuidade e Normas`:** ISO/IEC 27001 (SGSI, PDCA, controles) e 27002 (categorias de controles); ISO 27005 / ISO 31000 (ameaça, vulnerabilidade, impacto, probabilidade, tratamento: mitigar/aceitar/evitar/transferir); PCN/ISO 22301 (BIA, RTO, RPO, backups 3-2-1); Política de Segurança da Informação (PSI) e classificação da informação.
3. **`Governanca de TI - Frameworks (COBIT 2019, ITIL v4 e ISO 38500)`:** ISO/IEC 38500 (Avaliar, Dirigir, Monitorar - EDM; 6 princípios); COBIT 2019 (Governança EDM vs Gestão APO/BAI/DSS/MEA, 40 objetivos, fatores de desenho, componentes); ITIL v4 (Sistema de Valor de Serviço - SVS, 4 dimensões, cadeia de valor, práticas: Incidentes vs Problemas, Mudanças/Enablement, Central de Serviços, SLA).
4. **`Banco de Dados - Modelagem Relacional, SQL e Transacoes`:** MER/DER (entidades fortes/fracas, cardinalidade, generalização); Normalização (1FN, 2FN, 3FN, BCNF); SQL avançado (JOINs, GROUP BY/HAVING, subconsultas, CTE, Window Functions, DDL/DML/DCL); Índices (B-Tree, Hash); Propriedades ACID, níveis de isolamento (Dirty Read, Non-Repeatable, Phantom) e controle de concorrência (locks/MVCC).
5. **`Infraestrutura - Redes de Computadores e Protocolos`:** Modelo OSI vs TCP/IP; endereçamento IPv4 (CIDR, sub-redes, NAT) e IPv6; TCP (three-way handshake, controle de fluxo/congestionamento) vs UDP; DNS, DHCP, HTTP/HTTPS (métodos, status codes, TLS), SMTP/IMAP, SNMP; VLANs (802.1Q), roteamento, firewall, IDS/IPS, VPN e Proxy.
6. **`Desenvolvimento de Sistemas - Arquitetura de APIs e Integracao`:** REST (verbos, idempotência, HATEOAS, versionamento, códigos HTTP); OpenAPI/Swagger; GraphQL e gRPC (diferenças e casos de uso); mensageria/eventos (RabbitMQ, Kafka, pub/sub, dead-letter queue); resiliência (Circuit Breaker, Retry com backoff, Rate Limiting, API Gateway).
7. **`Desenvolvimento de Sistemas - Logica e Linguagens de Programacao`:** Estruturas de dados (listas, pilhas, filas, árvores, grafos, tabelas hash) e complexidade Big-O; POO (encapsulamento, herança, polimorfismo, abstração, composição vs herança); programação funcional (imutabilidade, funções puras, map/filter/reduce); tratamento de exceções e concorrência/assincronismo (threads, race condition, async/await).

### Nível 2 — Prioridade Alta
8. **`Inteligencia Artificial - Engenharia de Prompts e RAG`:** Técnicas de prompting (Zero-shot, Few-shot, Chain-of-Thought, ReAct, System/Developer Prompts); controle de alucinações e grounding; arquitetura RAG (chunking, embeddings, busca densa/esparsa/híbrida, re-ranking, janela de contexto) e métricas de avaliação (fidelidade, relevância de contexto).
9. **`Inteligencia Artificial - Sistemas Agentivos e Protocolo MCP`:** Arquitetura de agentes (planejamento, memória curto/longo prazo, tool use / function calling, reflexão); padrões multiagentes (roteamento, orquestrador-worker, handoff); Protocolo MCP (Model Context Protocol: Host, Client, Server; primitivas Resources, Tools, Prompts; transporte stdio vs HTTP/SSE e riscos de segurança como prompt injection indireto).
10. **`Inteligencia Artificial - Fundamentos, Machine Learning e NLP`:** Aprendizado supervisionado, não supervisionado e por reforço; overfitting/underfitting, validação cruzada, métricas (acurácia, precisão, recall, F1, ROC-AUC, RMSE); redes neurais e Transformers (atenção/self-attention, tokenização); NLP (análise léxica/semântica, embeddings, LLMs).
11. **`Infraestrutura - Computacao em Nuvem`:** Modelos de serviço (IaaS, PaaS, SaaS, FaaS/Serverless) e implantação (pública, privada, híbrida, multicloud); responsabilidade compartilhada; elasticidade, escalabilidade horizontal vs vertical, balanceamento de carga, CDN, alta disponibilidade (multi-AZ/multi-região) e FinOps.
12. **`Infraestrutura - Sistemas Operacionais (Linux e Windows)`:** Processos vs threads, escalonamento de CPU, deadlock (condições de Coffman); gerência de memória (paginação, segmentação, memória virtual, thrashing); sistemas de arquivos (ext4, NTFS, inodes, permissões rwx/chmod/chown, ACLs); administração Linux (systemd, logs, processos, rede) e Windows Server (Active Directory, GPO).
13. **`Engenharia de Software - Metodologias Ageis e Ciclo de Vida`:** Manifesto Ágil (valores e princípios); Scrum (papéis: PO, SM, Developers; eventos: Sprint, Planning, Daily, Review, Retro; artefatos e compromissos: Product Goal, Sprint Goal, DoD); Kanban (WIP limits, lead time, cycle time, fluxo cumulativo); modelos Cascata, Espiral e Incremental.
14. **`Engenharia de Software - Arquitetura, Padroes GoF e SOLID`:** Princípios SOLID (SRP, OCP, LSP, ISP, DIP); Padrões GoF (Criacionais: Singleton, Factory Method, Builder; Estruturais: Adapter, Decorator, Facade, Proxy; Comportamentais: Strategy, Observer, Command, Template Method); Monolito modular, Microsserviços, Arquitetura Hexagonal / Clean Architecture e DDD básico.
15. **`DevOps e Plataformas - Containers e Orquestracao`:** Containers vs VMs (namespaces, cgroups, union filesystem); Docker (Dockerfile multi-stage, imagens, volumes, redes); Kubernetes (arquitetura Control Plane vs Worker Nodes; Pods, Deployments, ReplicaSets, Services, Ingress, ConfigMaps, Secrets, HPA e probes liveness/readiness).
16. **`DevOps e Plataformas - Controle de Versao e CI/CD`:** Git (branching, merge vs rebase, cherry-pick, gitflow vs trunk-based development); pipelines de CI/CD (build, testes automatizados, artefatos, deploy Blue-Green, Canary, Rolling Update e rollback).
17. **`Legislacao de TI - LGPD e Marco Civil da Internet`:** LGPD (Lei 13.709/2018: princípios art. 6º; dados pessoais vs sensíveis vs anonimizados; bases legais arts. 7º e 11; direitos do titular; agentes de tratamento — controlador, operador, encarregado/DPO; tratamento pelo Poder Público; incidentes e sanções da ANPD); Marco Civil (Lei 12.965/2014: neutralidade de rede, guarda de registros de conexão vs acesso a aplicações, responsabilidade de provedores).
18. **`Governanca de TI - Contratacoes de TI e Governo Digital`:** IN SGD/ME nº 94/2022 (planejamento: DFD, ETP, Mapa de Riscos, TR/PB; papéis: Integrante Requisitante, Técnico e Administrativo; fases da contratação e gestão contratual); Lei nº 14.133/2021 aplicada a TI (modalidades, critérios de julgamento, fiscalização); Estratégia de Governo Digital (Lei nº 14.129/2021) e acórdãos/jurisprudência do TCU/TCE sobre contratações de TI.

### Nível 3 — Prioridade Média-Alta
19. **`Lingua Portuguesa - Compreensao e Redacao Oficial`:** Tese central, inferência e pressupostos/subentendidos; tipologia e gênero textual; Manual de Redação da Presidência da República (impessoalidade, clareza, concisão, padrão ofício, fechos "Atenciosamente"/"Respeitosamente", pronomes de tratamento).
20. **`Lingua Portuguesa - Gramatica, Sintaxe e Crase`:** Crase (casos proibidos, obrigatórios e facultativos — destaque para pronomes e locuções); pontuação (vírgula em orações adverbiais, aposto, vocativo e orações adjetivas restritivas vs explicativas); colocação pronominal (fatores de próclise, ênclise e mesóclise).
21. **`Lingua Portuguesa - Concordancia, Regencia e Conectivos`:** Concordância verbal (sujeito composto, verbos impessoais haver/fazer, partícula "se" apassivadora vs indeterminação do sujeito); regência verbal (assistir, visar, obedecer, preferir, implicar); conjunções/conectivos e reescrita mantendo sentido e correção (clássico FCC).
22. **`Seguranca da Informacao - DevSecOps e Seguranca de Aplicacoes`:** OWASP Top 10 (Broken Access Control, Injection/SQLi, XSS, CSRF, SSRF, Cryptographic Failures); SAST, DAST, SCA e gestão de dependências/SBOM; threat modeling (STRIDE), gestão de segredos e segurança em pipelines CI/CD.
23. **`Engenharia de Software - Qualidade, Testes e Metricas`:** Pirâmide de testes (unitário, integração, sistema/E2E, aceitação); caixa branca vs caixa preta (partição de equivalência, valor limite, cobertura de ramos); TDD/BDD; métricas de qualidade (complexidade ciclomática, acoplamento/coesão, dívida técnica, DORA metrics).
24. **`Engenharia de Software - Engenharia de Requisitos`:** Requisitos funcionais vs não funcionais; técnicas de elicitação (entrevistas, workshops, observação, prototipação); especificação (histórias de usuário, critérios de aceitação, casos de uso); priorização (MoSCoW) e matriz de rastreabilidade.
25. **`Banco de Dados - NoSQL, Bancos Vetoriais e Operacao`:** Teorema CAP e BASE vs ACID; tipos NoSQL (chave-valor, documento, colunar, grafo) e casos de uso; Bancos Vetoriais (indexação ANN: HNSW, IVF, distância de cosseno/euclidiana/produto escalar para RAG); replicação, sharding e particionamento.
26. **`Inteligencia Artificial - Governanca, Etica e Seguranca em IA`:** Viés algorítmico, explicabilidade (XAI), transparência e accountability; riscos em LLMs (OWASP Top 10 for LLM: Prompt Injection, Data Poisoning, Sensitive Information Disclosure, Excessive Agency); privacidade em treinamento/inferência e diretrizes de IA responsável no setor público.
27. **`DevOps e Plataformas - Infraestrutura como Codigo e Observabilidade`:** IaC declarativa vs imperativa (Terraform, Ansible, idempotência, state management, drift); Os 3 pilares da Observabilidade (Logs estruturados, Métricas/Prometheus, Traces distribuídos/OpenTelemetry); SLIs, SLOs e Error Budgets.
28. **`Desenvolvimento de Sistemas - Front-end Web Moderno`:** HTML5 semântico e acessibilidade (WCAG/ARIA); CSS moderno; JavaScript/TypeScript (DOM, event loop, Fetch API, Web Storage); arquiteturas SPA, SSR, SSG e Core Web Vitals (LCP, INP, CLS).
29. **`Engenharia de Software - Modelagem com UML e BPMN`:** UML 2.5 (diagramas estruturais: classes, componentes, implantação; comportamentais: casos de uso, sequência, atividades, estados); BPMN 2.0 (eventos início/intermediário/fim, gateways exclusivo/paralelo/inclusivo, pools e lanes).
30. **`Legislacao de TI - Normativos Internos de TI do TCE-GO`:** Governança e Política de Segurança da Informação no TCE-GO; comitês de TI/segurança, normas internas de uso de recursos, gestão de acessos, tratamento de incidentes e alinhamento às resoluções do Tribunal.

### Nível 4 — Prioridade Complementar
31. **`Matematica e Raciocinio Logico - Logica Proposicional e Argumentacao`:** Tabela-verdade dos conectivos (especialmente condicional `p → q` e bicondicional); negações (Leis de De Morgan e negação do `se... então`); equivalências (`p → q ≡ ¬q → ¬p ≡ ¬p ∨ q`); tautologia/contradição e validade de argumentos.
32. **`Matematica e Raciocinio Logico - Matematica Basica e Proporcoes`:** Razão, proporção, divisão proporcional; regra de três simples e composta; porcentagem, aumentos/descontos sucessivos; frações e problemas aritméticos típicos da FCC.
33. **`Matematica e Raciocinio Logico - Estruturas Logicas e Deducao`:** Associação lógica (tabelas de correlação), verdades e mentiras, sequências numéricas/alfanuméricas/figuras e orientação espacial/temporal.
34. **`Legislacao Institucional - Controle Constitucional e CF/88`:** Art. 37 da CF/88 (LIMPE, acumulação de cargos, improbidade); Arts. 70 a 75 da CF/88 (fiscalização contábil, financeira, orçamentária, operacional e patrimonial; competências do TCU aplicadas por simetria aos TCEs; eficácia de título executivo das decisões).
35. **`Legislacao Institucional - Constituicao Estadual e Normativos do TCE-GO`:** Disposições da Constituição de Goiás sobre o TCE-GO; Lei Orgânica do TCE-GO (Lei Estadual nº 16.168/2007: competências, composição, tomada e prestação de contas, sanções); Regimento Interno (Resolução nº 22/2008: órgãos colegiados, prazos, auditorias/inspeções) e Código de Ética.
36. **`Legislacao Institucional - Regime dos Servidores de Goias e Resolucoes`:** Estatuto dos Servidores Públicos Civis do Estado de Goiás (Lei Estadual nº 20.756/2020: provimento, vacância, direitos, deveres, proibições, processo administrativo disciplinar e penalidades).
37. **`Lingua Portuguesa - Significacao e Estilistica`:** Sinonímia/antonímia contextual, paronímia/homonímia, denotação/conotação e figuras de linguagem mais cobradas pela FCC (metáfora, metonímia, antítese, ironia, eufemismo).
38. **`Lingua Inglesa - Leitura Tecnica de TI`:** Estratégias de leitura (*skimming*, *scanning*), cognatos e falsos cognatos, conectivos discursivos em textos técnicos/documentações de TI (segurança, IA, cloud, engenharia de software).
