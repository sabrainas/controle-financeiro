import { useEffect, useState } from 'react';
import { FinancialService } from '../services/FinancialService';
import type { MonthReport } from '../types';

interface MonthReportProps {
  budgetId: string;
}

export function MonthReport({ budgetId }: MonthReportProps) {
  const [report, setReport] = useState<MonthReport | null>(null);

  useEffect(() => {
    const monthReport = FinancialService.getMonthReport(budgetId);
    setReport(monthReport || null);
  }, [budgetId]);

  if (!report) {
    return <div className="text-center py-16 text-slate-400 text-xl">Carregando...</div>;
  }

  const statusConfig = 
    report.status === 'under' 
      ? { color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-700', textLabel: 'Dentro do orçamento' }
      : report.status === 'over' 
      ? { color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-700', textLabel: 'Acima do orçamento' }
      : { color: 'text-amber-400', bg: 'bg-amber-900/20', border: 'border-amber-700', textLabel: 'No limite' };

  const percentSpent = Math.round((report.totalSpent / report.totalBudget) * 100);
  const progressColor = percentSpent <= 100 ? 'bg-emerald-500' : 'bg-red-500';

  return (
    <div className="w-full flex justify-center">
      <div className="space-y-12 lg:space-y-16 w-full max-w-5xl">
        <div className={`${statusConfig.bg} border-2 ${statusConfig.border} rounded-2xl p-10 lg:p-16 shadow-2xl`}>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-50 mb-12 text-center">Relatório - {report.monthYear}</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 md:p-8 lg:p-10 border border-slate-700">
              <p className="text-xs md:text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Orçamento Total</p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-50">
                R$ {report.totalBudget.toFixed(2).replace('.', ',')}
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 md:p-8 lg:p-10 border border-slate-700">
              <p className="text-xs md:text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Gasto Total</p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-50">
                R$ {report.totalSpent.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-xs md:text-sm text-slate-500 mt-4 font-bold">{percentSpent}% do orçamento</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 md:p-8 lg:p-10 border border-slate-700">
              <p className="text-xs md:text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Média por Dia</p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-50">
                R$ {report.averageSpentPerDay.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-xs md:text-sm text-slate-500 mt-4 font-bold">
                Limite: R$ {report.dailyBudget.toFixed(2).replace('.', ',')}
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 md:p-8 lg:p-10 border border-slate-700">
              <p className="text-xs md:text-sm text-slate-400 uppercase tracking-widest font-bold mb-4">Crédito Total</p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-400">
                R$ {report.totalCredit.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-xs md:text-sm text-slate-500 mt-4 font-bold">{report.daysWithCredit} dia(s) com crédito</p>
            </div>
          </div>

        {/* Progress Bar */}
        <div className="mb-12 bg-slate-800/30 rounded-2xl p-8 lg:p-10 border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <span className="text-base lg:text-lg font-bold text-slate-300">Progresso do Orçamento</span>
            <span className="text-2xl lg:text-3xl font-bold text-slate-300">{percentSpent}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-6 overflow-hidden shadow-lg">
            <div 
              className={`h-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${Math.min(percentSpent, 100)}%` }}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 text-base md:text-lg bg-slate-800/30 rounded-2xl p-8 lg:p-10 border border-slate-700">
          <div className="space-y-5">
            <p className="text-slate-300">
              <span className="font-bold text-slate-200">Dias no mês:</span> {report.daysInMonth}
            </p>
            <p className="text-slate-300">
              <span className="font-bold text-slate-200">Status:</span>{' '}
              <span className={`font-bold ml-3 ${statusConfig.color}`}>
                {statusConfig.textLabel}
              </span>
            </p>
          </div>
          <div>
            {report.status === 'under' && (
              <p className="text-emerald-400 font-bold text-xl">
                ✓ Economizado: R$ {(report.totalBudget - report.totalSpent).toFixed(2).replace('.', ',')}
              </p>
            )}
            {report.status === 'over' && (
              <p className="text-red-400 font-bold text-xl">
                ⚠ Excesso: R$ {(report.totalSpent - report.totalBudget).toFixed(2).replace('.', ',')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
