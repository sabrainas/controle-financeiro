export interface MonthlyBudget {
  id: string;
  monthYear: string; // YYYY-MM format
  totalBudget: number;
  dailyBudget: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyExpense {
  id: string;
  budgetId: string;
  date: string; // YYYY-MM-DD format
  amount: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DayStatus {
  date: string;
  standardDailyBudget: number; // Limite diário padrão (orçamento/30)
  accumulatedBalance: number; // Saldo acumulado de dias anteriores (pode ser negativo)
  budgetForDay: number; // Limite disponível para hoje (padrão + acumulado)
  spent: number;
  remaining: number;
  status: 'under' | 'over' | 'on-track';
  credit: number;
}

export interface MonthReport {
  monthYear: string;
  totalBudget: number;
  dailyBudget: number;
  daysInMonth: number;
  totalSpent: number;
  averageSpentPerDay: number;
  totalCredit: number;
  daysWithCredit: number;
  status: 'under' | 'over' | 'on-track';
}
