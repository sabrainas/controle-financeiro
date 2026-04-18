import { useState, useEffect } from 'react';
import { FinancialService } from '../services/FinancialService';
import type { DayStatus } from '../types';

interface DailyExpenseTrackerProps {
  budgetId: string;
  selectedDate: string;
}

export function DailyExpenseTracker({ budgetId, selectedDate }: DailyExpenseTrackerProps) {
  const [dayStatus, setDayStatus] = useState<DayStatus | null>(null);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDayData();
  }, [selectedDate, budgetId]);

  const loadDayData = () => {
    const status = FinancialService.getDayStatus(budgetId, selectedDate);
    setDayStatus(status || null);
    
    const dayExpenses = FinancialService.getExpensesByDate(budgetId, selectedDate);
    setExpenses(dayExpenses);
  };

  const handleAddExpense = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!expenseAmount || Number(expenseAmount) <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }

    setIsLoading(true);
    FinancialService.addExpense(budgetId, Number(expenseAmount), selectedDate, expenseDescription);
    setIsLoading(false);
    
    setExpenseAmount('');
    setExpenseDescription('');
    loadDayData();
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm('Deseja remover esta despesa?')) {
      FinancialService.deleteExpense(expenseId);
      loadDayData();
    }
  };

  if (!dayStatus) {
    return <div className="text-center py-12 text-slate-400 text-lg">Carregando...</div>;
  }

  const statusConfig = dayStatus.status === 'under' 
    ? { color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-700' }
    : dayStatus.status === 'over' 
    ? { color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-700' }
    : { color: 'text-amber-400', bg: 'bg-amber-900/20', border: 'border-amber-700' };

  return (
    <div className="space-y-12 lg:space-y-16">
      {/* Status Card */}
      <div className={`${statusConfig.bg} border-2 ${statusConfig.border} rounded-2xl p-10 lg:p-16 shadow-2xl`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 auto-rows-max">
          {/* Limite Diário Padrão */}
          <div className="space-y-4 bg-slate-800/40 rounded-xl p-8 lg:p-10 backdrop-blur border border-slate-700 hover:border-slate-600 transition">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Limite Diário Padrão</p>
            <p className="text-4xl lg:text-5xl font-bold text-slate-50">
              R$ {dayStatus.standardDailyBudget.toFixed(2).replace('.', ',')}
            </p>
          </div>

          {/* Saldo Acumulado */}
          {dayStatus.accumulatedBalance !== 0 && (
            <div className="space-y-4 bg-slate-800/40 rounded-xl p-8 lg:p-10 backdrop-blur border border-slate-700 hover:border-slate-600 transition">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Saldo Anterior</p>
              <p className={`text-4xl lg:text-5xl font-bold ${dayStatus.accumulatedBalance > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {dayStatus.accumulatedBalance > 0 ? '+' : ''} R$ {dayStatus.accumulatedBalance.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {dayStatus.accumulatedBalance > 0 ? 'Crédito de dias anteriores' : 'Débito de dias anteriores'}
              </p>
            </div>
          )}

          {/* Limite Disponível Hoje */}
          <div className="space-y-4 bg-blue-900/20 rounded-xl p-8 lg:p-10 backdrop-blur border-2 border-blue-700 hover:border-blue-600 transition lg:col-span-1">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Disponível Hoje</p>
            <p className="text-4xl lg:text-5xl font-bold text-blue-400">
              R$ {dayStatus.budgetForDay.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-xs text-blue-300 mt-2 font-semibold">Seu limite de hoje</p>
          </div>

          {/* Gasto Hoje */}
          <div className="space-y-4 bg-slate-800/40 rounded-xl p-8 lg:p-10 backdrop-blur border border-slate-700 hover:border-slate-600 transition">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Gasto Hoje</p>
            <p className="text-4xl lg:text-5xl font-bold text-slate-50">
              R$ {dayStatus.spent.toFixed(2).replace('.', ',')}
            </p>
          </div>

          {/* Restante */}
          <div className="space-y-4 bg-slate-800/40 rounded-xl p-8 lg:p-10 backdrop-blur border border-slate-700 hover:border-slate-600 transition">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Restante</p>
            <p className={`text-4xl lg:text-5xl font-bold ${statusConfig.color}`}>
              R$ {dayStatus.remaining.toFixed(2).replace('.', ',')}
            </p>
          </div>

          {/* Crédito */}
          {dayStatus.credit > 0 && (
            <div className="space-y-4 bg-emerald-900/20 rounded-xl p-8 lg:p-10 backdrop-blur border-2 border-emerald-700 hover:border-emerald-600 transition">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Crédito do Dia</p>
              <p className="text-4xl lg:text-5xl font-bold text-emerald-400">
                R$ {dayStatus.credit.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-xs text-emerald-300 mt-2 font-semibold">Você economizou!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense} className="bg-slate-800/50 backdrop-blur rounded-2xl shadow-2xl p-10 lg:p-16 border border-slate-700 space-y-10">
        <h3 className="text-2xl lg:text-3xl font-bold text-slate-50">Adicionar Despesa</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          <div className="space-y-4">
            <label htmlFor="amount" className="block text-sm font-bold text-slate-300 uppercase tracking-widest">
              Valor (R$)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder="0,00"
              className="w-full px-5 py-5 bg-slate-700 border-2 border-slate-600 rounded-lg text-slate-50 placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-lg font-semibold hover:border-slate-500 transition"
            />
          </div>
          
          <div className="space-y-4">
            <label htmlFor="description" className="block text-sm font-bold text-slate-300 uppercase tracking-widest">
              Descrição
            </label>
            <input
              id="description"
              type="text"
              value={expenseDescription}
              onChange={(e) => setExpenseDescription(e.target.value)}
              placeholder="Ex: Almoço, Uber..."
              className="w-full px-5 py-5 bg-slate-700 border-2 border-slate-600 rounded-lg text-slate-50 placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-lg hover:border-slate-500 transition"
            />
          </div>

          <div className="flex items-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:opacity-50 text-white font-bold py-5 px-8 rounded-lg transition text-lg shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Adicionando...' : 'Adicionar'}
            </button>
          </div>
        </div>
      </form>

      {/* Expenses List */}
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        <div className="p-10 lg:p-12 border-b border-slate-700 bg-slate-800/30">
          <h3 className="text-2xl lg:text-3xl font-bold text-slate-50">
            Despesas ({expenses.length})
          </h3>
        </div>
        
        {expenses.length === 0 ? (
          <div className="p-16 lg:p-20 text-center">
            <p className="text-slate-500 text-lg lg:text-xl">Nenhuma despesa registrada para este dia</p>
            <p className="text-slate-600 text-base lg:text-lg mt-4">Controle financeiro simplificado e eficiente</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {expenses.map((expense) => (
              <div key={expense.id} className="p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 hover:bg-slate-700/50 transition">
                <div className="flex-1">
                  <p className="font-semibold text-slate-50 text-xl lg:text-2xl">{expense.description || 'Sem descrição'}</p>
                  <p className="text-sm text-slate-500 mt-3">
                    {new Date(expense.createdAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-10 lg:gap-12">
                  <p className="text-2xl lg:text-3xl font-bold text-slate-200 whitespace-nowrap">
                    R$ {expense.amount.toFixed(2).replace('.', ',')}
                  </p>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="text-red-500 hover:text-red-400 font-bold text-base lg:text-lg transition whitespace-nowrap px-5 py-2 rounded hover:bg-red-500/20"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
