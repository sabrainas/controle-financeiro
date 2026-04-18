import type { MonthlyBudget, DailyExpense, DayStatus, MonthReport } from '../types';

const STORAGE_KEY_BUDGETS = 'financial_budgets';
const STORAGE_KEY_EXPENSES = 'financial_expenses';

export class FinancialService {
  // Budget Management
  static getBudgets(): MonthlyBudget[] {
    const data = localStorage.getItem(STORAGE_KEY_BUDGETS);
    return data ? JSON.parse(data) : [];
  }

  static getBudgetByMonth(monthYear: string): MonthlyBudget | undefined {
    const budgets = this.getBudgets();
    return budgets.find(b => b.monthYear === monthYear);
  }

  static createBudget(totalBudget: number, monthYear: string): MonthlyBudget {
    const budgets = this.getBudgets();
    const dailyBudget = Math.round((totalBudget / 30) * 100) / 100;
    
    const newBudget: MonthlyBudget = {
      id: `budget_${Date.now()}`,
      monthYear,
      totalBudget,
      dailyBudget,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    budgets.push(newBudget);
    localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(budgets));
    return newBudget;
  }

  static updateBudget(budgetId: string, totalBudget: number): MonthlyBudget | undefined {
    const budgets = this.getBudgets();
    const budget = budgets.find(b => b.id === budgetId);
    
    if (budget) {
      budget.totalBudget = totalBudget;
      budget.dailyBudget = Math.round((totalBudget / 30) * 100) / 100;
      budget.updatedAt = new Date();
      localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(budgets));
    }
    
    return budget;
  }

  // Expense Management
  static getExpenses(): DailyExpense[] {
    const data = localStorage.getItem(STORAGE_KEY_EXPENSES);
    return data ? JSON.parse(data) : [];
  }

  static getExpensesByBudget(budgetId: string): DailyExpense[] {
    const expenses = this.getExpenses();
    return expenses.filter(e => e.budgetId === budgetId);
  }

  static getExpensesByDate(budgetId: string, date: string): DailyExpense[] {
    const expenses = this.getExpensesByBudget(budgetId);
    return expenses.filter(e => e.date === date);
  }

  static addExpense(budgetId: string, amount: number, date: string, description?: string): DailyExpense {
    const expenses = this.getExpenses();
    
    const newExpense: DailyExpense = {
      id: `expense_${Date.now()}`,
      budgetId,
      date,
      amount,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expenses.push(newExpense);
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
    return newExpense;
  }

  static deleteExpense(expenseId: string): boolean {
    const expenses = this.getExpenses();
    const index = expenses.findIndex(e => e.id === expenseId);
    
    if (index !== -1) {
      expenses.splice(index, 1);
      localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
      return true;
    }
    
    return false;
  }

  static updateExpense(expenseId: string, amount: number, description?: string): DailyExpense | undefined {
    const expenses = this.getExpenses();
    const expense = expenses.find(e => e.id === expenseId);
    
    if (expense) {
      expense.amount = amount;
      if (description !== undefined) expense.description = description;
      expense.updatedAt = new Date();
      localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
    }
    
    return expense;
  }

  // Calculations
  static getDayStatus(budgetId: string, date: string): DayStatus | undefined {
    const budget = this.getBudgets().find(b => b.id === budgetId);
    if (!budget) return undefined;

    const expenses = this.getExpensesByDate(budgetId, date);
    const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Calcular crédito/débito acumulado de dias anteriores
    const allDates = this.getDatesInMonth(budget.monthYear);
    const currentDateIndex = allDates.indexOf(date);
    let accumulatedBalance = 0; // Pode ser positivo (crédito) ou negativo (débito)

    // Somar o saldo (crédito ou débito) de todos os dias anteriores
    for (let i = 0; i < currentDateIndex; i++) {
      const prevDayExpenses = this.getExpensesByDate(budgetId, allDates[i]);
      const prevDaySpent = prevDayExpenses.reduce((sum, e) => sum + e.amount, 0);
      const prevDayBalance = budget.dailyBudget - prevDaySpent; // Pode ser positivo ou negativo
      accumulatedBalance += prevDayBalance;
    }

    // O orçamento do dia é o limite diário + saldo acumulado
    const budgetForDay = budget.dailyBudget + accumulatedBalance;
    const remaining = budgetForDay - spent;

    let status: 'under' | 'over' | 'on-track' = 'on-track';
    let credit = 0;

    if (remaining > 0) {
      status = 'under';
      credit = remaining;
    } else if (remaining < 0) {
      status = 'over';
    }

    return {
      date,
      standardDailyBudget: budget.dailyBudget,
      accumulatedBalance,
      budgetForDay,
      spent,
      remaining: Math.max(remaining, 0),
      status,
      credit,
    };
  }

  static getMonthReport(budgetId: string): MonthReport | undefined {
    const budget = this.getBudgets().find(b => b.id === budgetId);
    if (!budget) return undefined;

    const expenses = this.getExpensesByBudget(budgetId);
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Get days in month
    const daysInMonth = new Date(Number.parseInt(budget.monthYear.split('-')[0]), Number.parseInt(budget.monthYear.split('-')[1]), 0).getDate();
    
    // Calculate total credits (days without expenses or under budget)
    const allDates = this.getDatesInMonth(budget.monthYear);
    let daysWithCredit = 0;

    allDates.forEach(date => {
      const dayStatus = this.getDayStatus(budgetId, date);
      if (dayStatus && dayStatus.credit > 0) {
        daysWithCredit += 1;
      }
    });

    // Crédito total é o saldo final: orçamento total - gasto total
    const totalCredit = Math.max(budget.totalBudget - totalSpent, 0);

    const averageSpentPerDay = daysInMonth > 0 ? Math.round((totalSpent / daysInMonth) * 100) / 100 : 0;
    
    let status: 'under' | 'over' | 'on-track' = 'on-track';
    if (totalSpent < budget.totalBudget) {
      status = 'under';
    } else if (totalSpent > budget.totalBudget) {
      status = 'over';
    }

    return {
      monthYear: budget.monthYear,
      totalBudget: budget.totalBudget,
      dailyBudget: budget.dailyBudget,
      daysInMonth,
      totalSpent,
      averageSpentPerDay,
      totalCredit,
      daysWithCredit,
      status,
    };
  }

  static getDatesInMonth(monthYear: string): string[] {
    const [year, month] = monthYear.split('-');
    const daysInMonth = new Date(Number.parseInt(year), Number.parseInt(month), 0).getDate();
    const dates: string[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${monthYear}-${String(day).padStart(2, '0')}`;
      dates.push(dateStr);
    }
    
    return dates;
  }

  static getCurrentMonthYear(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
}
