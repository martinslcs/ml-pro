
import React, { useState } from 'react';
import { ProdutoAnalise } from '../types';
import { formatCurrency } from '../utils/calculations';
import { 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  Package, 
  TrendingDown,
  DollarSign,
  Edit2,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react';

interface AnalysisListProps {
  analyses: ProdutoAnalise[];
  onEdit: (item: ProdutoAnalise) => void;
  onDelete: (id: string) => void;
  onDuplicate: (item: ProdutoAnalise) => void;
}

const AnalysisList: React.FC<AnalysisListProps> = ({ analyses, onEdit, onDelete, onDuplicate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAnalyses = analyses.filter(item => 
    item.produto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400';
    return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'em_analise': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 text-[10px] font-black uppercase"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Em Análise</span>;
      case 'aprovado_para_teste': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 text-[10px] font-black uppercase"><CheckCircle2 size={12} /> Aprovado</span>;
      case 'em_operacao': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800 text-[10px] font-black uppercase"><Package size={12} /> Em Operação</span>;
      case 'descartado': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 text-[10px] font-black uppercase">Descartado</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-yellow-400 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inteligência de Mercado</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter italic uppercase">Análises Salvas</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Consulte seu portfólio de produtos e métricas de lucro.</p>
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome do produto..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 outline-none transition-all shadow-sm text-slate-900 dark:text-slate-100 font-medium"
          />
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Produto & Score</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Custo Operacional</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Preço & Margem</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Lucro Unitário</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Lucro Mensal</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredAnalyses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-200 dark:text-slate-700">
                        <Search size={48} />
                      </div>
                      <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-tight italic">
                        {searchTerm ? 'Nenhum produto encontrado.' : 'Sua lista está vazia.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAnalyses.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center border font-black text-xs shadow-sm transition-transform group-hover:scale-110 ${getScoreColor(item.score_viabilidade)}`}>
                          <span className="text-lg leading-none">{item.score_viabilidade}</span>
                          <span className="text-[7px] opacity-70">SCORE</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight group-hover:text-yellow-600 transition-colors">{item.produto}</div>
                            {item.link_concorrente && (
                              <a 
                                href={item.link_concorrente} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-slate-300 hover:text-yellow-500 transition-colors"
                                title="Abrir Anúncio Concorrente"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </div>
                          <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-tighter">
                            CRIADO EM {new Date(item.data_criacao).toLocaleDateString('pt-BR')} • {item.tipo_logistica.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-600 uppercase mb-1">Custo Total</div>
                      <div className="font-black text-slate-800 dark:text-slate-200">{formatCurrency(item.custo_total)}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">Compra: {formatCurrency(item.custo_produto)}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tighter mb-1">{formatCurrency(item.preco_venda)}</div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${item.percentual_lucro >= 15 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                            style={{ width: `${Math.min(Math.max(item.percentual_lucro, 0), 100)}%` }}
                          />
                        </div>
                        <span className={`text-[11px] font-black ${item.percentual_lucro >= 15 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {item.percentual_lucro.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className={`flex items-center gap-1.5 font-black text-lg ${item.lucro_unitario > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        <DollarSign size={18} />
                        {formatCurrency(item.lucro_unitario)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Por Unidade</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className={`flex items-center gap-1.5 font-black text-lg ${item.lucro_mensal > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.lucro_mensal > 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                        {formatCurrency(item.lucro_mensal)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Projeção Mensal</span>
                    </td>
                    <td className="px-6 py-6">
                      {getStatusBadge(item.status_decisao)}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => onEdit(item)}
                          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-yellow-400 hover:text-slate-900 rounded-xl transition-all shadow-sm"
                          title="Editar Análise"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => onDuplicate(item)}
                          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white rounded-xl transition-all shadow-sm"
                          title="Duplicar Análise"
                        >
                          <Copy size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(item.id)}
                          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                          title="Excluir Análise"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalysisList;
