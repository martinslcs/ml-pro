
import React, { useState } from 'react';
import { ProdutoAnalise } from '../types';
import { formatCurrency } from '../utils/calculations';
// Added CheckCircle to the imports from lucide-react
import { Columns, Trophy, TrendingDown, TrendingUp, Target, ShoppingCart, Percent, AlertCircle, X, ChevronRight, CheckCircle } from 'lucide-react';

interface ComparisonPanelProps {
  analyses: ProdutoAnalise[];
}

const ComparisonPanel: React.FC<ComparisonPanelProps> = ({ analyses }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedAnalyses = analyses.filter(a => selectedIds.includes(a.id));

  // Funções para encontrar o "vencedor" de cada métrica
  const getWinner = (metric: keyof ProdutoAnalise, mode: 'max' | 'min' = 'max') => {
    if (selectedAnalyses.length < 2) return null;
    return selectedAnalyses.reduce((prev, curr) => {
      const valPrev = Number(prev[metric] || 0);
      const valCurr = Number(curr[metric] || 0);
      if (mode === 'max') return valCurr > valPrev ? curr : prev;
      return valCurr < valPrev ? curr : prev;
    });
  };

  const winners = {
    lucro_mensal: getWinner('lucro_mensal', 'max'),
    percentual_lucro: getWinner('percentual_lucro', 'max'),
    indice_concorrencia: getWinner('indice_concorrencia', 'min'),
    score_viabilidade: getWinner('score_viabilidade', 'max'),
  };

  const ComparisonRow = ({ label, icon: Icon, metric, isCurrency = false, isPercent = false, mode = 'max' as 'max' | 'min' }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
      <div className="p-4 md:p-6 bg-slate-50/50 flex items-center gap-3 border-r border-slate-100">
        <Icon size={18} className="text-slate-400" />
        <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      {selectedAnalyses.map(a => {
        const isWinner = winners[metric as keyof typeof winners]?.id === a.id;
        const value = a[metric as keyof ProdutoAnalise] as number;
        
        return (
          <div key={a.id} className={`p-4 md:p-6 text-center flex flex-col items-center justify-center relative ${isWinner ? 'bg-yellow-50/30' : ''}`}>
            {isWinner && (
              <div className="absolute top-2 right-2 text-yellow-500" title="Melhor nesta categoria">
                <Trophy size={14} />
              </div>
            )}
            <span className={`text-lg font-black ${isWinner ? 'text-slate-900 scale-110 transform transition-transform' : 'text-slate-600'}`}>
              {isCurrency ? formatCurrency(value) : isPercent ? `${value.toFixed(2)}%` : value}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-slate-900 text-yellow-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Módulo Battle</span>
          </div>
          <h2 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">Comparativo de Viabilidade</h2>
          <p className="text-slate-500">Coloque seus produtos lado a lado e descubra qual é o campeão de lucro.</p>
        </div>
        
        {selectedIds.length > 0 && (
          <button 
            onClick={() => setSelectedIds([])}
            className="flex items-center gap-2 text-xs font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
          >
            <X size={16} /> Limpar Seleção
          </button>
        )}
      </header>

      {/* Grid de Seleção Aprimorado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {analyses.length === 0 ? (
          <div className="col-span-full p-10 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase text-sm">Nenhuma análise disponível para comparar.</p>
          </div>
        ) : (
          analyses.map(a => (
            <button
              key={a.id}
              onClick={() => toggleSelect(a.id)}
              className={`group p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden ${
                selectedIds.includes(a.id) 
                ? 'border-yellow-500 bg-white shadow-xl ring-4 ring-yellow-400/10 scale-[1.02]' 
                : 'border-slate-200 bg-white hover:border-slate-400'
              }`}
            >
              {selectedIds.includes(a.id) && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-slate-900 p-1 rounded-bl-xl">
                  <CheckCircle size={16} />
                </div>
              )}
              <h4 className="text-sm font-black text-slate-800 line-clamp-1 mb-2 group-hover:text-yellow-600 transition-colors uppercase">{a.produto}</h4>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Venda</p>
                  <p className="text-sm font-black text-slate-700">{formatCurrency(a.preco_venda)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Margem</p>
                  <p className={`text-sm font-black ${a.percentual_lucro > 15 ? 'text-green-600' : 'text-yellow-600'}`}>{a.percentual_lucro.toFixed(1)}%</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Área de Comparação */}
      {selectedAnalyses.length > 0 ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
            {/* Cabeçalho do Comparativo */}
            <div className="grid grid-cols-1 md:grid-cols-4 bg-slate-900 text-white divide-x divide-slate-800">
              <div className="p-8 flex flex-col justify-center bg-slate-800/50">
                <p className="text-yellow-400 font-black text-2xl italic tracking-tighter">BATTLE</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Métricas de Performance</p>
              </div>
              {selectedAnalyses.map(a => (
                <div key={a.id} className="p-8 text-center group">
                  <span className="inline-block px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-[9px] font-black uppercase mb-3 group-hover:text-yellow-400 transition-colors">
                    {a.tipo_logistica}
                  </span>
                  <h3 className="font-black text-lg leading-tight line-clamp-2 uppercase tracking-tight">{a.produto}</h3>
                </div>
              ))}
            </div>

            {/* Seção: Financeiro */}
            <div className="bg-slate-50 px-8 py-3 border-b border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <ShoppingCart size={12}/> Pilar 01: Análise Financeira
              </h4>
            </div>
            <ComparisonRow label="Preço de Venda" icon={ShoppingCart} metric="preco_venda" isCurrency />
            <ComparisonRow label="Lucro Unitário" icon={TrendingUp} metric="lucro_unitario" isCurrency />
            <ComparisonRow label="Margem Líquida" icon={Percent} metric="percentual_lucro" isPercent />
            <ComparisonRow label="Lucro Estimado/Mês" icon={TrendingUp} metric="lucro_mensal" isCurrency />

            {/* Seção: Mercado */}
            <div className="bg-slate-50 px-8 py-3 border-b border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Target size={12}/> Pilar 02: Contexto de Mercado
              </h4>
            </div>
            <ComparisonRow label="Menor Preço FULL" icon={TrendingDown} metric="menor_preco_full" isCurrency mode="min" />
            <ComparisonRow label="Diferença vs Concorrência" icon={AlertCircle} metric="diferenca_para_menor_full" isCurrency mode="min" />
            <ComparisonRow label="Índice Concorrência" icon={Columns} metric="indice_concorrencia" mode="min" />

            {/* Seção: Viabilidade Final */}
            <div className="bg-slate-50 px-8 py-3 border-b border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Trophy size={12}/> Pilar 03: Score de Viabilidade
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-slate-100">
               <div className="p-6 bg-slate-50/50 flex items-center gap-3">
                 <Trophy size={18} className="text-yellow-500" />
                 <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Score Geral</span>
               </div>
               {selectedAnalyses.map(a => (
                 <div key={a.id} className="p-8 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-2 shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                      <span className="text-2xl font-black text-yellow-400">{a.score_viabilidade}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400">{a.classificacao_viabilidade}</span>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-[2rem] border border-yellow-200 flex items-center gap-6">
            <div className="p-4 bg-yellow-400 text-slate-900 rounded-2xl shadow-lg">
              <Trophy size={32} />
            </div>
            <div>
              <p className="text-xs font-black text-yellow-700 uppercase tracking-widest">Recomendação PRO</p>
              <p className="text-slate-800 font-medium">
                O produto <span className="font-black text-slate-900 uppercase">"{winners.score_viabilidade?.produto}"</span> apresenta o melhor equilíbrio entre 
                custo, concorrência e retorno financeiro with a score of <span className="font-black text-yellow-600">{winners.score_viabilidade?.score_viabilidade} pontos</span>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-24 rounded-[3rem] border-4 border-dashed border-slate-100 text-center flex flex-col items-center justify-center shadow-inner">
          <div className="p-8 bg-slate-50 rounded-full mb-6">
            <Columns size={64} className="text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter italic">Selecione até 3 produtos para a batalha</h3>
          <p className="text-slate-300 max-w-sm mt-2 font-medium">Clique nos cards acima para carregar as métricas e comparar o desempenho financeiro.</p>
        </div>
      )}
    </div>
  );
};

export default ComparisonPanel;
