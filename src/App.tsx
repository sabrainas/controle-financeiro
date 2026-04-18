import { useState, useEffect } from 'react';
import { BudgetSetup } from './components/BudgetSetup';
import { DailyInputTracker } from './components/DailyInputTracker';
import { MonthReport } from './components/MonthReport';
import { FinancialService } from './services/FinancialService';
import './App.css';

function App() {
  const [budgetId, setBudgetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tracker' | 'report'>('tracker');

  useEffect(() => {
    // Check if there's an existing budget for this month
    const monthYear = FinancialService.getCurrentMonthYear();
    const existingBudget = FinancialService.getBudgetByMonth(monthYear);
    
    if (existingBudget) {
      setBudgetId(existingBudget.id);
    }
  }, []);

  const handleBudgetCreated = (newBudgetId: string) => {
    setBudgetId(newBudgetId);
    setActiveTab('tracker');
  };

  const handleResetBudget = () => {
    if (confirm('Tem certeza que deseja criar um novo orçamento? Isso irá remover o orçamento atual.')) {
      setBudgetId(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-start">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        {/* Header - Centralizado */}
        <div className="mb-16 lg:mb-24 text-center w-full">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-50 mb-6 lg:mb-8">
            Planejamento Financeiro
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl lg:text-2xl">
            Controle seu dinheiro diariamente com precisão
          </p>
        </div>

        {/* Main Content */}
        {budgetId ? (
          <div className="w-full space-y-12 lg:space-y-16">
            {/* Tabs - Centralizado */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-slate-800/50 backdrop-blur rounded-2xl shadow-2xl p-6 border border-slate-700 w-full">
              <button
                onClick={() => setActiveTab('tracker')}
                className={`flex-1 py-5 px-8 rounded-xl font-bold transition text-base sm:text-lg lg:text-xl ${
                  activeTab === 'tracker'
                    ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                    : 'text-slate-300 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                Rastreador Diário
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`flex-1 py-5 px-8 rounded-xl font-bold transition text-base sm:text-lg lg:text-xl ${
                  activeTab === 'report'
                    ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                    : 'text-slate-300 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                Relatório do Mês
              </button>
              <button
                onClick={handleResetBudget}
                className="py-5 px-8 rounded-xl font-bold text-slate-300 hover:text-slate-200 hover:bg-red-600/20 transition text-base sm:text-lg lg:text-xl"
              >
                Novo Orçamento
              </button>
            </div>

            {/* Tracker Tab */}
            {activeTab === 'tracker' && (
              <DailyInputTracker budgetId={budgetId} />
            )}

            {/* Report Tab */}
            {activeTab === 'report' && (
              <div className="space-y-12 lg:space-y-16">
                <MonthReport budgetId={budgetId} />
              </div>
            )}
          </div>
        ) : (
          <BudgetSetup onBudgetCreated={handleBudgetCreated} />
        )}

        {/* Footer */}
        <div className="mt-16 md:mt-24 pt-10 md:pt-12 border-t border-slate-700 text-center text-slate-500 text-sm md:text-base">
          <p>
            Controle financeiro simplificado e eficiente
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
