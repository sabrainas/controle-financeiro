# 💰 Planejamento Financeiro

Um aplicativo web moderno e responsivo para controle financeiro pessoal, construído com **React**, **TypeScript** e **Tailwind CSS**.

## 🎯 Funcionalidades

- **Orçamento Mensal**: Configure seu orçamento mensal e o sistema calcula automaticamente seu limite diário
- **Rastreamento Diário**: Registre suas despesas diariamente e acompanhe em tempo real
- **Cálculo Automático**: O sistema calcula automaticamente:
  - Quanto você pode gastar por dia
  - Quanto você já gastou
  - Se está dentro ou acima do orçamento
  - Créditos (economias) de dias sem gastos
- **Relatório Mensal**: Veja um relatório completo com:
  - Gasto total do mês
  - Média de gasto por dia
  - Progresso em relação ao orçamento
  - Total de créditos acumulados
- **Interface Intuitiva**: Design responsivo e amigável para desktop e mobile
- **Persistência Local**: Todos os dados são salvos no localStorage do navegador

## 🛠️ Tecnologias

- **React 18** - Biblioteca JavaScript para construir interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool moderno e rápido
- **Tailwind CSS** - Framework de CSS utilitário
- **localStorage** - Persistência de dados no navegador

## 📦 Instalação

1. Clonar o repositório ou navegar até a pasta do projeto
2. Instalar as dependências:

```bash
npm install
```

3. Iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abrir no navegador: `http://localhost:5173`

## 🚀 Como Usar

### 1. Configurar Orçamento
- Insira o valor total que você tem para gastar no mês
- O sistema automaticamente calcula seu limite diário (orçamento / 30 dias)

### 2. Rastrear Despesas
- Navegue para o dia desejado usando o seletor de data
- Adicione suas despesas com valor e descrição opcional
- O sistema mostra em tempo real:
  - Limite diário
  - Gasto do dia
  - Restante para gastar
  - Créditos (se não gastou nada ou gastou menos)

### 3. Visualizar Relatório
- Clique em "Relatório do Mês" para ver:
  - Orçamento total vs. gasto total
  - Média de gasto por dia
  - Crédito total acumulado
  - Barra de progresso visual

### 4. Gerenciar Despesas
- **Remover despesa**: Clique em "Remover" ao lado de cada gasto
- **Novo orçamento**: Use o botão "🔄 Novo Orçamento" para recomeçar

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── BudgetSetup.tsx     # Configuração inicial do orçamento
│   ├── DailyExpenseTracker.tsx # Rastreador de despesas diárias
│   ├── DatePicker.tsx      # Seletor de datas
│   └── MonthReport.tsx     # Relatório mensal
├── services/
│   └── FinancialService.ts # Lógica de negócio e persistência
├── types/
│   └── index.ts           # Tipos TypeScript
├── App.tsx              # Componente principal
├── App.css              # Estilos da aplicação
├── index.css            # Estilos globais
└── main.tsx             # Ponto de entrada
```

## 🔒 Privacidade

Todos os dados são armazenados **localmente** no seu navegador usando `localStorage`. Nenhuma informação é enviada para servidores externos.

## 🎨 Recursos de Design

- Dark mode automático baseado em preferências do sistema
- Interface responsiva (mobile, tablet, desktop)
- Cores intuitivas para status:
  - 🟢 Verde: Dentro do orçamento
  - 🔴 Vermelho: Acima do orçamento
  - 🟡 Amarelo: No limite

## 📝 Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas!

## 📄 Licença

Este projeto é de código aberto e livre para uso pessoal.

---

Desenvolvido com ❤️ para ajudar você a controlar suas finanças
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
