import { useState } from 'react';
import { FinancialService } from '../services/FinancialService';

interface BudgetSetupProps {
  onBudgetCreated: (budgetId: string) => void;
}

export function BudgetSetup({ onBudgetCreated }: BudgetSetupProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!amount || Number(amount) <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }

    setIsLoading(true);
    const monthYear = FinancialService.getCurrentMonthYear();
    const budget = FinancialService.createBudget(Number(amount), monthYear);
    setIsLoading(false);
    
    setAmount('');
    onBudgetCreated(budget.id);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl shadow-2xl p-12 lg:p-16 border border-slate-700 max-w-md w-full">
        <h2 className="text-4xl lg:text-5xl font-bold text-slate-50 mb-4 text-center">Configurar Orçamento</h2>
        <p className="text-slate-400 text-center text-lg lg:text-xl mb-12">Defina seu orçamento mensal para começar</p>
        
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-5">
            <label htmlFor="amount" className="block text-base lg:text-lg font-bold text-slate-300">
              Quanto você tem para gastar este mês?
            </label>
            <div className="relative">
              <span className="absolute left-5 top-5 text-2xl text-slate-400 font-bold">R$</span>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full pl-14 pr-5 py-6 bg-slate-700 border-2 border-slate-600 rounded-xl text-slate-50 placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition text-2xl font-bold hover:border-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:opacity-50 text-white font-bold py-6 px-8 rounded-xl transition duration-200 text-xl lg:text-2xl shadow-lg hover:shadow-xl"
          >
            {isLoading ? 'Criando...' : 'Criar Orçamento'}
          </button>

          <p className="text-xs lg:text-sm text-slate-500 text-center mt-8">
            O orçamento será dividido em limite diário de R$ <span className="font-bold text-slate-400">{(Number(amount) || 0).toFixed(2).replace('.', ',')}</span> ÷ 30 dias
          </p>
        </form>
      </div>
    </div>
  );
}
