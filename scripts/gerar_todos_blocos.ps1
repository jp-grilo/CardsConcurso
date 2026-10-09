# Script de automacao para geracao em lote de todos os 33 Micro Blocos (TCE-GO 2026)
# Cada bloco possui meta definida de 20 questoes.
# Execucao sequencial com respeito automatico aos rate limits.

$ErrorActionPreference = "Continue"

$microBlocos = @(
    # PARTE 1: CONHECIMENTOS GERAIS
    "Lingua Portuguesa - Compreensao e Redacao Oficial",
    "Lingua Portuguesa - Significacao e Estilistica",
    "Lingua Portuguesa - Gramatica, Sintaxe e Crase",
    "Lingua Portuguesa - Concordancia, Regencia e Conectivos",
    "Matematica e Raciocinio Logico - Matematica Basica e Proporcoes",
    "Matematica e Raciocinio Logico - Estruturas Logicas e Deducao",
    "Matematica e Raciocinio Logico - Logica Proposicional e Argumentacao",
    "Legislacao Institucional - Controle Constitucional e CF/88",
    "Legislacao Institucional - Constituicao Estadual e Normativos do TCE-GO",
    "Legislacao Institucional - Regime dos Servidores de Goias e Resolucoes",

    # PARTE 2: CONHECIMENTOS ESPECIFICOS - TI
    "Engenharia de Software - Metodologias Ageis e Ciclo de Vida",
    "Engenharia de Software - Engenharia de Requisitos",
    "Engenharia de Software - Modelagem com UML e BPMN",
    "Engenharia de Software - Arquitetura, Padroes GoF e SOLID",
    "Engenharia de Software - Qualidade, Testes e Metricas",
    "Desenvolvimento de Sistemas - Logica e Linguagens de Programacao",
    "Desenvolvimento de Sistemas - Front-end Web Moderno",
    "Desenvolvimento de Sistemas - Arquitetura de APIs e Integracao",
    "Inteligencia Artificial - Fundamentos, Machine Learning e NLP",
    "Inteligencia Artificial - Engenharia de Prompts e RAG",
    "Inteligencia Artificial - Sistemas Agentivos e Protocolo MCP",
    "Inteligencia Artificial - Governanca, Etica e Seguranca em IA",
    "Banco de Dados - Modelagem Relacional, SQL e Transacoes",
    "Banco de Dados - NoSQL, Bancos Vetoriais e Operacao",
    "DevOps e Plataformas - Controle de Versao e CI/CD",
    "DevOps e Plataformas - Containers e Orquestracao",
    "DevOps e Plataformas - Infraestrutura como Codigo e Observabilidade",
    "Infraestrutura - Sistemas Operacionais (Linux e Windows)",
    "Infraestrutura - Redes de Computadores e Protocolos",
    "Infraestrutura - Computacao em Nuvem",
    "Seguranca da Informacao - Principios, Criptografia e IAM",
    "Seguranca da Informacao - DevSecOps e Seguranca de Aplicacoes",
    "Seguranca da Informacao - Gestao de Riscos, Continuidade e Normas",
    "Governanca de TI - Frameworks (COBIT 2019, ITIL v4 e ISO 38500)",
    "Governanca de TI - Contratacoes de TI e Governo Digital",
    "Legislacao de TI - LGPD e Marco Civil da Internet",
    "Legislacao de TI - Normativos Internos de TI do TCE-GO",
    "Lingua Inglesa - Leitura Tecnica de TI"
)

Write-Host "======================================================"
Write-Host "Iniciando esteira de geracao sequencial para o TCE-GO"
Write-Host "Total de Micro Blocos: $($microBlocos.Count)"
Write-Host "Meta por bloco: 20 questoes"
Write-Host "======================================================"
Write-Host ""

$index = 0
foreach ($bloco in $microBlocos) {
    $index++
    Write-Host "[$index/$($microBlocos.Count)] Executando bloco: $bloco"
    npm run generate-questions -- --topic "$bloco" --target 20
    Write-Host ""
}

Write-Host "======================================================"
Write-Host "Todos os blocos foram processados com sucesso."
Write-Host "======================================================"
