## Planejamento Financeiro - Instruções do Projeto

Este projeto é um aplicativo de controle financeiro pessoal construído com React, TypeScript e Tailwind CSS.

### Arquitetura do Projeto

**Stack Tecnológico:**
- Frontend: React 18 + TypeScript
- Build Tool: Vite
- Styling: Tailwind CSS + PostCSS
- Persistência: localStorage (sem backend necessário)

**Estrutura de Pastas:**
```
src/
├── components/           # Componentes React reutilizáveis
│   ├── BudgetSetup.tsx       # Componente para configurar orçamento mensal
│   ├── DailyExpenseTracker.tsx # Componente para rastrear despesas diárias
│   ├── DatePicker.tsx        # Componente para seleção de datas
│   └── MonthReport.tsx       # Componente para relatório mensal
├── services/
│   └── FinancialService.ts   # Serviço com lógica de negócio e persistência
├── types/
│   └── index.ts              # Interfaces TypeScript
├── App.tsx                   # Componente raiz da aplicação
├── App.css                   # Estilos da aplicação
├── index.css                 # Estilos globais + Tailwind
└── main.tsx                  # Ponto de entrada
```

### Funcionalidades Principais

1. **Setup Inicial**
   - Usuário insere orçamento mensal total
   - Sistema calcula limite diário (orçamento / 30)
   - Dados persistem no localStorage

2. **Rastreamento Diário**
   - Seleção de data com navegação
   - Adição de despesas com valor e descrição
   - Cálculo em tempo real de:
     - Gasto do dia
     - Restante disponível
     - Crédito (se não gastou tudo)
   - Listagem e remoção de despesas

3. **Relatório Mensal**
   - Orçamento total vs. gasto total
   - Média de gasto por dia
   - Progresso em percentual
   - Total de créditos acumulados
   - Indicador visual de status

### Tipos de Dados Principais

```typescript
MonthlyBudget {
  id, monthYear, totalBudget, dailyBudget,
  createdAt, updatedAt
}

DailyExpense {
  id, budgetId, date, amount, description,
  createdAt, updatedAt
}

DayStatus {
  date, dailyBudget, spent, remaining, status,
  credit
}

MonthReport {
  monthYear, totalBudget, dailyBudget,
  daysInMonth, totalSpent, averageSpentPerDay,
  totalCredit, daysWithCredit, status
}
```

### Como Executar

```bash
# Instalar dependências
npm install

# Iniciar dev server
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Melhorias Futuras Possíveis

- Integração com backend (API)
- Autenticação de usuários
- Múltiplos usuários com dados sincronizados
- Categorias de despesas
- Gráficos e visualizações avançadas
- Exportar relatórios em PDF/Excel
- Mobile app com React Native
- Notificações de limite de orçamento

### Convenções do Código

- Componentes: PascalCase (ex: BudgetSetup.tsx)
- Funções/variáveis: camelCase
- Tipos/Interfaces: PascalCase
- Props com type annotations
- Comentários em português
- Tailwind para styling (sem CSS-in-JS)

### Deployment

Para fazer deploy:

1. Build da produção: `npm run build`
2. Arquivos gerados em `dist/`
3. Pode ser hospedado em: Vercel, Netlify, GitHub Pages, etc.

### Notas

- O projeto usa localStorage, então os dados são específicos de cada navegador/dispositivo
- Não há sincronização em nuvem por padrão
- A data é formatada em formato ISO (YYYY-MM-DD) internamente
- Todos os cálculos monetários usam arredondamento para 2 casas decimais
