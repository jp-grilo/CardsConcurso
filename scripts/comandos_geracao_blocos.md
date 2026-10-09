# Catalogo de Comandos de Geracao por Micro Bloco (TCE-GO 2026)

Este documento contem a relacao completa de comandos CLI para geracao de **20 questoes** para cada um dos **33 Micro Blocos** do edital do TCE-GO 2026.

- Meta configurada: `--target 20` para cada Micro Bloco.
- Total acumulado ao concluir todos os blocos: **660 questoes**.
- Cada comando utiliza o nome exato do Micro Bloco indexado no edital e gravado na tabela `categories` do SQLite.

---

## PARTE 1: CONHECIMENTOS GERAIS (10 Micro Blocos = 200 Questoes)

### Macro Bloco 1: Lingua Portuguesa

1. **Compreensao e Redacao Oficial**
Descricao: Interpretacao textual, tese central, inferencias e Manual de Redacao da Presidencia da Republica (Padrao Oficio, pronomes de tratamento e fechos).
```bash
npm run generate-questions -- --topic "Lingua Portuguesa - Compreensao e Redacao Oficial" --target 20
```

2. **Significacao e Estilistica**
Descricao: Denotacao, conotacao, figuras de linguagem, sinonimia, antonimia, paronimia e homonimia.
```bash
npm run generate-questions -- --topic "Lingua Portuguesa - Significacao e Estilistica" --target 20
```

3. **Gramatica, Sintaxe e Crase**
Descricao: Ortografia, acentuacao grafica, morfossintaxe, crase, colocacao pronominal e pontuacao.
```bash
npm run generate-questions -- --topic "Lingua Portuguesa - Gramatica, Sintaxe e Crase" --target 20
```

4. **Concordancia, Regencia e Conectivos**
Descricao: Concordancia nominal/verbal, regencia, flexao temporal, vozes do verbo, oracoes e coesao com conectivos.
```bash
npm run generate-questions -- --topic "Lingua Portuguesa - Concordancia, Regencia e Conectivos" --target 20
```

---

### Macro Bloco 2: Matematica e Raciocinio Logico

5. **Matematica Basica e Proporcoes**
Descricao: Conjuntos numericos, operacoes, fracoes, razoes, proporcoes, regra de tres e porcentagem (acrescimos e descontos).
```bash
npm run generate-questions -- --topic "Matematica e Raciocinio Logico - Matematica Basica e Proporcoes" --target 20
```

6. **Estruturas Logicas e Deducao**
Descricao: Relacoes arbitrarias entre pessoas e eventos, deducao logica de informacoes, sequencias logicas e orientacao espacial/temporal.
```bash
npm run generate-questions -- --topic "Matematica e Raciocinio Logico - Estruturas Logicas e Deducao" --target 20
```

7. **Logica Proposicional e Argumentacao**
Descricao: Conectivos logicos, tabelas-verdade, tautologias, negacao de proposicoes (condicional), equivalencias e validade de argumentos.
```bash
npm run generate-questions -- --topic "Matematica e Raciocinio Logico - Logica Proposicional e Argumentacao" --target 20
```

---

### Macro Bloco 3: Legislacao Institucional e Normas de Goias

8. **Controle Constitucional e CF/88**
Descricao: Artigos 37 e 70 a 75 da CF/88, fiscalizacao contabil/financeira/orcamentaria, controle interno e externo e limites das cortes de contas.
```bash
npm run generate-questions -- --topic "Legislacao Institucional - Controle Constitucional e CF/88" --target 20
```

9. **Constituicao Estadual e Normativos do TCE-GO**
Descricao: Constituicao de Goias, Lei Organica do TCE-GO (Lei Estadual nº 16.168/2007), Regimento Interno (Resolucao nº 22/2008) e Codigo de Etica.
```bash
npm run generate-questions -- --topic "Legislacao Institucional - Constituicao Estadual e Normativos do TCE-GO" --target 20
```

10. **Regime dos Servidores de Goias e Resolucoes**
Descricao: Estatuto dos Servidores de Goias (Lei nº 20.756/2020), Plano de Cargos (Lei nº 15.122/2005) e Resolucao Administrativa nº 15/2024.
```bash
npm run generate-questions -- --topic "Legislacao Institucional - Regime dos Servidores de Goias e Resolucoes" --target 20
```

---

## PARTE 2: CONHECIMENTOS ESPECIFICOS - TI (23 Micro Blocos = 460 Questoes)

### Macro Bloco 4: Engenharia de Software e Modelagem

11. **Metodologias Ageis e Ciclo de Vida**
Descricao: Scrum (papeis, cerimonias, artefatos), Kanban (limites de WIP, lead time, cycle time), Scrumban, Lean e XP.
```bash
npm run generate-questions -- --topic "Engenharia de Software - Metodologias Ageis e Ciclo de Vida" --target 20
```

12. **Engenharia de Requisitos**
Descricao: Elicitacao, analise, especificacao, validacao, requisitos funcionais e nao funcionais (FURPS+), criterios INVEST e casos de uso.
```bash
npm run generate-questions -- --topic "Engenharia de Software - Engenharia de Requisitos" --target 20
```

13. **Modelagem com UML e BPMN**
Descricao: Diagramas estruturais e comportamentais da UML 2.x e modelagem de processos em BPMN 2.0 (gateways XOR, AND, OR, pools e lanes).
```bash
npm run generate-questions -- --topic "Engenharia de Software - Modelagem com UML e BPMN" --target 20
```

14. **Arquitetura, Padroes GoF e SOLID**
Descricao: Camadas, microsservicos, eventos, resiliencia (Circuit Breaker), principios SOLID e Padroes de Projeto GoF (criacionais, estruturais e comportamentais).
```bash
npm run generate-questions -- --topic "Engenharia de Software - Arquitetura, Padroes GoF e SOLID" --target 20
```

15. **Qualidade, Testes e Metricas**
Descricao: Piramide de testes, caixa-preta, caixa-branca, Analise de Pontos de Funcao (IFPUG/NESMA), Complexidade Ciclomatica e SonarQube.
```bash
npm run generate-questions -- --topic "Engenharia de Software - Qualidade, Testes e Metricas" --target 20
```

---

### Macro Bloco 5: Desenvolvimento de Sistemas e APIs

16. **Logica e Linguagens de Programacao**
Descricao: Algoritmos, estruturas de dados, POO, programacao funcional, Java, JavaScript/Node.js e Python.
```bash
npm run generate-questions -- --topic "Desenvolvimento de Sistemas - Logica e Linguagens de Programacao" --target 20
```

17. **Front-end Web Moderno**
Descricao: HTML5 semantico, CSS3 (Flexbox, Grid), TypeScript (tipagem estatica) e React (hooks, componentes funcionais e renderizacao).
```bash
npm run generate-questions -- --topic "Desenvolvimento de Sistemas - Front-end Web Moderno" --target 20
```

18. **Arquitetura de APIs e Integracao**
Descricao: APIs RESTful (verbos, status HTTP, boas praticas), GraphQL, WebSockets, JSON, XML, OpenAPI/Swagger, OAuth 2.0 e JWT.
```bash
npm run generate-questions -- --topic "Desenvolvimento de Sistemas - Arquitetura de APIs e Integracao" --target 20
```

---

### Macro Bloco 6: Inteligencia Artificial, Ciencia de Dados e Sistemas Agentivos

19. **Fundamentos, Machine Learning e NLP**
Descricao: Ciclo de ciencia de dados, pre-processamento, classificacao, metricas (Precision, Recall, F1), Deep Learning, regularizacao (Dropout) e Embeddings (similaridade de cosseno).
```bash
npm run generate-questions -- --topic "Inteligencia Artificial - Fundamentos, Machine Learning e NLP" --target 20
```

20. **Engenharia de Prompts e RAG**
Descricao: LLMs, programacao baseada em intencao, Zero-Shot, Few-Shot, CoT e pipeline completo de RAG (chunking, busca vetorial, injecao contextual).
```bash
npm run generate-questions -- --topic "Inteligencia Artificial - Engenharia de Prompts e RAG" --target 20
```

21. **Sistemas Agentivos e Protocolo MCP**
Descricao: Agentes autonomos de codificacao em terminal/IDE, ciclo agentivo (planejamento, execucao, inspecao, self-healing) e Model Context Protocol (MCP).
```bash
npm run generate-questions -- --topic "Inteligencia Artificial - Sistemas Agentivos e Protocolo MCP" --target 20
```

22. **Governanca, Etica e Seguranca em IA**
Descricao: Alucinacoes, saidas estruturadas, seguranca OWASP para LLMs (Prompt Injection, Data Poisoning), explicabilidade e Estrategia Brasileira de IA.
```bash
npm run generate-questions -- --topic "Inteligencia Artificial - Governanca, Etica e Seguranca em IA" --target 20
```

---

### Macro Bloco 7: Engenharia de Banco de Dados

23. **Modelagem Relacional, SQL e Transacoes**
Descricao: MER/DER, formas normais (1FN, 2FN, 3FN), SQL (DDL, DML, DCL, DTL), propriedades ACID, indices, EXPLAIN, Procedures e Triggers (PostgreSQL e Oracle).
```bash
npm run generate-questions -- --topic "Banco de Dados - Modelagem Relacional, SQL e Transacoes" --target 20
```

24. **NoSQL, Bancos Vetoriais e Operacao**
Descricao: MongoDB (documentos), Redis (chave-valor/cache), bancos vetoriais para embeddings (KNN/HNSW), backup, replicacao e alta disponibilidade.
```bash
npm run generate-questions -- --topic "Banco de Dados - NoSQL, Bancos Vetoriais e Operacao" --target 20
```

---

### Macro Bloco 8: DevOps, Entrega Continua e Plataformas

25. **Controle de Versao e CI/CD**
Descricao: Git, Git Flow versus Trunk-Based, pipelines de CI/CD (GitHub Actions, GitLab CI/CD, Jenkins), Blue-Green Deployment e Canary.
```bash
npm run generate-questions -- --topic "DevOps e Plataformas - Controle de Versao e CI/CD" --target 20
```

26. **Containers e Orquestracao**
Descricao: Docker, Dockerfile, multi-stage builds, Docker Compose e Kubernetes (Pods, Deployments, Services, ConfigMaps, Ingress, Namespaces).
```bash
npm run generate-questions -- --topic "DevOps e Plataformas - Containers e Orquestracao" --target 20
```

27. **Infraestrutura como Codigo e Observabilidade**
Descricao: IaC, gestao de configuracao e pilares da observabilidade (Metricas, Logs estruturados, Traces distribuidos, telemetria e alertas).
```bash
npm run generate-questions -- --topic "DevOps e Plataformas - Infraestrutura como Codigo e Observabilidade" --target 20
```

---

### Macro Bloco 9: Sistemas Operacionais, Redes e Computacao em Nuvem

28. **Sistemas Operacionais (Linux e Windows)**
Descricao: Linux corporativo (processos, sinais SIGTERM/SIGKILL, permissoes octais, scripts Bash) e Windows Server (PowerShell, Active Directory, OUs, GPOs).
```bash
npm run generate-questions -- --topic "Infraestrutura - Sistemas Operacionais (Linux e Windows)" --target 20
```

29. **Redes de Computadores e Protocolos**
Descricao: TCP/IP, OSI, IPv4 e IPv6, DNS, DHCP, HTTP/1.1, HTTP/2, HTTP/3 (QUIC/UDP), TLS 1.3, firewalls, VPNs e balanceadores de carga.
```bash
npm run generate-questions -- --topic "Infraestrutura - Redes de Computadores e Protocolos" --target 20
```

30. **Computacao em Nuvem**
Descricao: IaaS, PaaS, SaaS, modelo de responsabilidade compartilhada, arquiteturas Serverless, escalabilidade e alta disponibilidade.
```bash
npm run generate-questions -- --topic "Infraestrutura - Computacao em Nuvem" --target 20
```

---

### Macro Bloco 10: Seguranca da Informacao

31. **Principios, Criptografia e IAM**
Descricao: Confidencialidade, Integridade, Disponibilidade, Autenticidade, Nao Repudio, IAM, MFA, modelos DAC/MAC/RBAC/ABAC, criptografia simetrica/assimetrica e ICP-Brasil.
```bash
npm run generate-questions -- --topic "Seguranca da Informacao - Principios, Criptografia e IAM" --target 20
```

32. **DevSecOps e Seguranca de Aplicacoes**
Descricao: Testes SAST/DAST/SCA/IAST/RASP, OWASP Top 10 web, seguranca em APIs e arquitetura Zero Trust (verificacao continua).
```bash
npm run generate-questions -- --topic "Seguranca da Informacao - DevSecOps e Seguranca de Aplicacoes" --target 20
```

33. **Gestao de Riscos, Continuidade e Normas**
Descricao: ISO/IEC 27005 (avaliacao e tratamento de riscos), SGSI ISO 27001/27002, continuidade (RTO, RPO, MTBF, MTTR) e combate a malwares/ransomware.
```bash
npm run generate-questions -- --topic "Seguranca da Informacao - Gestao de Riscos, Continuidade e Normas" --target 20
```

---

### Macro Bloco 11: Governanca de TI e Contratacoes Publicas

34. **Frameworks (COBIT 2019, ITIL v4 e ISO 38500)**
Descricao: COBIT 2019 (Governanca EDM versus Gestao PBRM), ITIL v4 (SVS, Cadeia de Valor, 4 Dimensoes), ISO 38500 (principios corporativos de TI) e PMBOK 8ª ed.
```bash
npm run generate-questions -- --topic "Governanca de TI - Frameworks (COBIT 2019, ITIL v4 e ISO 38500)" --target 20
```

35. **Contratacoes de TI e Governo Digital**
Descricao: Lei nº 14.133/2021 aplicada a Solucoes de TIC (ETP, TR, Matriz de Riscos), Lei do Governo Digital (Lei nº 14.129/2021) e ENGD (Decreto nº 12.069/2024).
```bash
npm run generate-questions -- --topic "Governanca de TI - Contratacoes de TI e Governo Digital" --target 20
```

---

### Macro Bloco 12: Legislacao Aplicada a TI e Normativos TCE-GO

36. **LGPD e Marco Civil da Internet**
Descricao: LGPD (Lei nº 13.709/2018: principios, bases legais, setor publico, DPO, RIPD) e Marco Civil da Internet (Lei nº 12.965/2014: guarda de logs e responsabilidades).
```bash
npm run generate-questions -- --topic "Legislacao de TI - LGPD e Marco Civil da Internet" --target 20
```

37. **Normativos Internos de TI do TCE-GO**
Descricao: Resolucoes do TCE-GO: nº 13/2016 (CETI), Normativa nº 14/2024 (Governanca e PDTI), nº 17/2024 (POSIN), nº 14/2025 (DTI) e PDTI 2025-2026.
```bash
npm run generate-questions -- --topic "Legislacao de TI - Normativos Internos de TI do TCE-GO" --target 20
```

---

### Macro Bloco 13: Lingua Inglesa

38. **Leitura Tecnica de TI**
Descricao: Compreensao de textos tecnicos em ingles, vocabulario de redes, desenvolvimento, IA, seguranca, arquitetura e interpretacao de documentacoes.
```bash
npm run generate-questions -- --topic "Lingua Inglesa - Leitura Tecnica de TI" --target 20
```
