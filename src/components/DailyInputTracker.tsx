import { useState, useEffect } from 'react';
import { FinancialService } from '../services/FinancialService';

interface DailyInputTrackerProps {
  budgetId: string;
}

export function DailyInputTracker({ budgetId }: DailyInputTrackerProps) {
  const [monthYear, setMonthYear] = useState('');
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [dailyExpenses, setDailyExpenses] = useState<{ [key: string]: number }>({});
  const [dailyInputStrings, setDailyInputStrings] = useState<{ [key: string]: string }>({});
  const [budget, setBudget] = useState<any>(null);

  useEffect(() => {
    const monthYear = FinancialService.getCurrentMonthYear();
    setMonthYear(monthYear);

    const existingBudget = FinancialService.getBudgetByMonth(monthYear);
    if (existingBudget) {
      setBudget(existingBudget);

      // Calcular dias no mês
      const [year, month] = monthYear.split('-');
      const daysInMonth = new Date(Number.parseInt(year), Number.parseInt(month), 0).getDate();
      setDaysInMonth(daysInMonth);

      // Carregar despesas existentes
      const allDates = FinancialService.getDatesInMonth(monthYear);
      const expenses: { [key: string]: number } = {};

      allDates.forEach((date) => {
        const dayExpenses = FinancialService.getExpensesByDate(existingBudget.id, date);
        const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
        const day = Number.parseInt(date.split('-')[2]);
        expenses[day] = total;
      });

      setDailyExpenses(expenses);
      // Inicializar as strings de input a partir dos valores carregados (formato BR)
      const inputStrings: { [key: string]: string } = {};
      Object.keys(expenses).forEach((d) => {
        const n = expenses[Number(d)];
        inputStrings[d] = n > 0 ? n.toFixed(2).replace('.', ',') : '';
      });
      setDailyInputStrings(inputStrings);
    }
  }, [budgetId]);

  // Enquanto usuário digita, atualizamos somente a string — não persistor imediatamente
  const handleDayChange = (day: number, rawValue: string) => {
    setDailyInputStrings((s) => ({ ...s, [day]: rawValue }));
  };

  // Ao sair do campo (blur) ou pressionar Enter, parseamos e persistimos
  const handleDayBlur = (day: number) => {
    const rawValue = dailyInputStrings[day] || '';
    const cleaned = rawValue.replaceAll('.', '').replace(',', '.').replaceAll(/[^0-9.]/g, '');
    const parsed = cleaned === '' ? 0 : Number.parseFloat(cleaned);
    const numValue = Number.isFinite(parsed) ? parsed : 0;

    // Atualizar estado numérico
    setDailyExpenses((prev) => ({ ...prev, [day]: numValue }));

    if (budget) {
      const dateStr = `${monthYear}-${String(day).padStart(2, '0')}`;
      const existingExpenses = FinancialService.getExpensesByDate(budget.id, dateStr);
      // Remover despesas antigas
      existingExpenses.forEach((expense) => FinancialService.deleteExpense(expense.id));
      // Adicionar nova despesa se houver valor
      if (numValue > 0) {
        FinancialService.addExpense(budget.id, numValue, dateStr, `Gasto do dia`);
      }
    }

    // Normalizar exibição do input após salvar: mostra formato BR ou vazio
    setDailyInputStrings((s) => ({ ...s, [day]: numValue > 0 ? numValue.toFixed(2).replace('.', ',') : '' }));
  };

  if (!budget) {
    return (
      <div className="text-center py-16 text-slate-400 text-xl">
        Nenhum orçamento criado. Configure um orçamento primeiro.
      </div>
    );
  }

  const totalSpent = Object.values(dailyExpenses).reduce((sum, val) => sum + val, 0);
  const remaining = budget.totalBudget - totalSpent;
  const averagePerDay = daysInMonth > 0 ? totalSpent / daysInMonth : 0;

  return (
    <div className="space-y-16 lg:space-y-20">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {/* Card: Orçamento Total */}
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 md:p-8 lg:p-12 border border-slate-700 shadow-2xl">
          <p className="text-xs md:text-sm text-slate-400 uppercase tracking-widest font-bold mb-6">Orçamento Total</p>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-50">
            R$ {budget.totalBudget.toFixed(2).replace('.', ',')}
          </p>
        </div>

        {/* Card: Gasto Total */}
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 md:p-8 lg:p-12 border border-slate-700 shadow-2xl">
          <p className="text-xs md:text-sm text-slate-400 uppercase tracking-widest font-bold mb-6">Gasto Total</p>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-50">
            R$ {totalSpent.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-xs md:text-sm text-slate-500 mt-6 font-bold">
            {Math.round((totalSpent / budget.totalBudget) * 100)}% do orçamento
          </p>
        </div>

        {/* Card: Média por Dia */}
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 md:p-8 lg:p-12 border border-slate-700 shadow-2xl">
          <p className="text-xs md:text-sm text-slate-400 uppercase tracking-widest font-bold mb-6">Média por Dia</p>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-50">
            R$ {averagePerDay.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-xs md:text-sm text-slate-500 mt-6 font-bold">
            Limite: R$ {budget.dailyBudget.toFixed(2).replace('.', ',')}
          </p>
        </div>

        {/* Card: Restante */}
        <div className={`backdrop-blur rounded-2xl p-6 md:p-8 lg:p-12 border shadow-2xl ${
          remaining >= 0
            ? 'bg-emerald-900/20 border-emerald-700'
            : 'bg-red-900/20 border-red-700'
        }`}>
          <p className="text-xs md:text-sm text-slate-400 uppercase tracking-widest font-bold mb-6">Restante</p>
          <p className={`text-3xl md:text-4xl lg:text-5xl font-bold ${
            remaining >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            R$ {remaining.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      {/* Daily Input Form */}
      <div className="w-full bg-slate-800/50 backdrop-blur rounded-2xl shadow-2xl p-8 md:p-12 lg:p-16 border border-slate-700">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-50 mb-12 lg:mb-16 text-center">
          Insira o Gasto de Cada Dia - {monthYear}
        </h3>

        <div className="flex justify-center w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 w-full max-w-5xl">
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dateStr = `${monthYear}-${String(day).padStart(2, '0')}`;
            const date = new Date(dateStr + 'T00:00:00');
            const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();
            // Mostrar valor formatado (BR) — esconder zeros para não mostrar "0,00" por padrão
            const rawNumber = dailyExpenses[day] || 0;
            const value = rawNumber > 0 ? rawNumber.toFixed(2).replace('.', ',') : '';

            return (
              <div key={day} className="space-y-6">
                <div className="flex items-center justify-between">
                  <label htmlFor={`day-${day}`} className="text-sm md:text-base lg:text-lg font-bold text-slate-300">
                    Dia {String(day).padStart(2, '0')}
                  </label>
                  <span className="text-xs md:text-sm text-slate-500 font-semibold">{dayName}</span>
                </div>
                <div className="flex items-center bg-slate-700 border-2 border-slate-600 rounded-lg overflow-hidden">
                  <div className="px-3 md:px-4 py-2 bg-slate-800/40 text-slate-300 font-bold text-sm md:text-base">R$</div>
                  <input
                    id={`day-${day}`}
                    type="text"
                    inputMode="decimal"
                    value={dailyInputStrings[day] ?? value}
                    onChange={(e) => handleDayChange(day, e.target.value)}
                    onBlur={() => handleDayBlur(day)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); } }}
                    placeholder="0,00"
                    className="w-full pl-4 pr-4 py-3 md:py-4 bg-transparent text-slate-50 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition text-base md:text-lg font-semibold"
                  />
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}
