# CardsConcurso

Plataforma local focada em resolução de questões para concursos. O sistema suporta dois modos:
- **Simulado**: Avalia seus conhecimentos com um cronômetro e não revela as respostas até o final. Suporta pesos por disciplina e salvamento de estado.
- **Estudo**: Respostas imediatas e justificativas para aprendizado contínuo.

O sistema baseia a recomendação de questões em algoritmos de dificuldade (1-10), frequência de erros e tempo desde a última revisão.

## Design
O layout foi concebido em formato "Clean" focado apenas no essencial, utilizando ícones da biblioteca *lucide-react* e estruturado inteiramente com *CSS Modules* e navegação por barra lateral.

## Formato JSON de Importação
Para popular o banco de dados, importe suas questões utilizando o formato abaixo. O sistema lerá as categorias e as criará caso não existam.

```json
[
  {
    "category": "Direito Constitucional",
    "statement": "Segundo a Constituição Federal, é livre a manifestação do pensamento, sendo garantido o anonimato.",
    "difficulty": 4,
    "options": [
      {
        "text": "Certo",
        "is_correct": false,
        "justification": "O art. 5º, IV, da CF/88 diz que é livre a manifestação do pensamento, sendo *vedado* o anonimato."
      },
      {
        "text": "Errado",
        "is_correct": true,
        "justification": "O anonimato é vedado pela Constituição."
      }
    ]
  }
]
```

## Como Rodar Localmente
1. Certifique-se de ter o [Node.js](https://nodejs.org) instalado.
2. Execute a instalação de dependências: `npm install`
3. O banco de dados SQLite (`database.sqlite`) e as tabelas já foram iniciadas na raiz do repositório, mas se precisar recriá-las rode: `npx tsx src/lib/run-setup.ts`.
4. Inicie o servidor: `npm run dev`
5. Acesse `http://localhost:3000` no seu navegador.
