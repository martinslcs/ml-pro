
import React from 'react';
import { ProdutoAnalise } from '../types';
import { formatCurrency } from '../utils/calculations';
import { TrendingUp, ShoppingCart, AlertTriangle, CheckCircle, Target, ExternalLink } from 'lucide-react';

interface DashboardProps {
  analyses: ProdutoAnalise[];
}

const Dashboard: React.FC<DashboardProps> = ({ analyses }) => {
  const totalItems = analyses.length;
  const profitableItems = analyses.filter(a => a.lucro_unitario > 0).length;
  const riskyItems = analyses.filter(a => a.lucro_unitario <= 0).length;
  const totalEstimatedProfit = analyses.reduce((acc, curr) => acc + (curr.lucro_mensal || 0), 0);
  
  const avgUnitProfit = totalItems > 0 
    ? analyses.reduce((acc, curr) => acc + (curr.lucro_unitario || 0), 0) / totalItems 
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Resumo da Operação</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Visão geral das suas análises de viabilidade.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-widest">Total Análises</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{totalItems}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-widest">Viáveis</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{profitableItems}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Target size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-widest">Lucro Unit. Médio</p>
            <p className={`text-2xl font-black ${avgUnitProfit >= 0 ? 'text-slate-800 dark:text-slate-100' : 'text-red-500'}`}>
              {formatCurrency(avgUnitProfit)}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-widest">Em Risco</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{riskyItems}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-widest">Lucro Projetado</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{formatCurrency(totalEstimatedProfit)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6 uppercase tracking-tighter italic">Últimas Atividades</h3>
        {analyses.length === 0 ? (
          <p className="text-slate-400 dark:text-slate-600 text-center py-12 italic font-medium">Nenhuma análise cadastrada ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-4 font-black text-[10px] text-slate-500 uppercase tracking-widest">Produto</th>
                  <th className="pb-4 font-black text-[10px] text-slate-500 uppercase tracking-widest">Custo</th>
                  <th className="pb-4 font-black text-[10px] text-slate-500 uppercase tracking-widest">P. Venda</th>
                  <th className="pb-4 font-black text-[10px] text-slate-500 uppercase tracking-widest">L. Unitário</th>
                  <th className="pb-4 font-black text-[10px] text-slate-500 uppercase tracking-widest">Margem</th>
                  <th className="pb-4 font-black text-[10px] text-slate-500 uppercase tracking-widest text-right">Lucro Mensal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {analyses.slice(0, 5).map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 dark:text-slate-200 font-bold uppercase text-xs">{item.produto}</span>
                        {item.link_concorrente && (
                          <a href={item.link_concorrente} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-yellow-500">
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-slate-500 dark:text-slate-400 font-medium text-sm">{formatCurrency(item.custo_produto)}</td>
                    <td className="py-4 text-slate-800 dark:text-slate-200 font-black">{formatCurrency(item.preco_venda)}</td>
                    <td className={`py-4 font-black text-xs ${item.lucro_unitario > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {formatCurrency(item.lucro_unitario)}
                    </td>
                    <td className={`py-4 font-black text-xs ${item.percentual_lucro >= 15 ? 'text-green-600' : item.percentual_lucro > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {item.percentual_lucro.toFixed(2)}%
                    </td>
                    <td className="py-4 text-slate-800 dark:text-slate-100 font-black text-right">{formatCurrency(item.lucro_mensal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
