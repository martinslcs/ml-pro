
import React, { useState, useEffect } from 'react';
import { ProdutoAnalise } from '../types';
import { calculateAnalysis, formatCurrency } from '../utils/calculations';
import { FlaskConical, RefreshCcw, TrendingUp, AlertTriangle, Target } from 'lucide-react';

const SandboxSimulator: React.FC = () => {
  const [data, setData] = useState<Partial<ProdutoAnalise>>({
    produto: 'Simulação Sandbox',
    custo_produto: 50,
    preco_venda: 120,
    embalagem: 5,
    frete: 25,
    imposto_percentual: 6,
    taxa_marketplace_percentual: 16,
    media_vendas_mes: 100,
    margem_desejada: 15,
    quantidade_anuncios_geral: 100,
    quantidade_anuncios_full: 20,
    avaliacao_media: 4.5,
    menor_preco_full: 110
  });

  const [res, setRes] = useState<Partial<ProdutoAnalise>>({});

  useEffect(() => {
    setRes(calculateAnalysis(data));
  }, [data]);

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4 bg-slate-900 p-8 rounded-[2rem] text-white">
        <div className="p-4 bg-yellow-400 rounded-2xl text-slate-900">
          <FlaskConical size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Modo Sandbox</h2>
          <p className="text-slate-400 text-sm">Simule cenários em tempo real sem afetar seu banco de dados.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel de Controles */}
        <div className="lg:col-span-1 space-y-4 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-slate-100">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4"><RefreshCcw size={18}/> Variáveis do Cenário</h3>
          {[
            { label: 'Custo Produto', name: 'custo_produto' },
            { label: 'Preço Venda', name: 'preco_venda' },
            { label: 'Frete', name: 'frete' },
            { label: 'Embalagem', name: 'embalagem' },
            { label: 'Imposto %', name: 'imposto_percentual' },
            { label: 'Taxa ML %', name: 'taxa_marketplace_percentual' },
            { label: 'Vendas/Mês', name: 'media_vendas_mes' },
            { label: 'Margem Alvo %', name: 'margem_desejada' },
          ].map(field => (
            <div key={field.name}>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">{field.label}</label>
              <input type="number" name={field.name} value={(data as any)[field.name]} onChange={handleUpdate} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-bold text-slate-900 dark:text-slate-100" />
            </div>
          ))}
        </div>

        {/* Painel de Resultados */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-b-4 border-green-500 shadow-sm border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Lucro Mensal</p>
              <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{formatCurrency(res.lucro_mensal || 0)}</p>
              <p className="text-sm font-bold text-green-600 mt-2">Margem: {res.percentual_lucro?.toFixed(1)}%</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-b-4 border-blue-500 shadow-sm border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Lucro Unitário</p>
              <p className={`text-3xl font-black ${res.lucro_unitario! > 0 ? 'text-slate-900 dark:text-slate-100' : 'text-red-500'}`}>
                {formatCurrency(res.lucro_unitario || 0)}
              </p>
              <p className="text-sm font-bold text-blue-600 mt-2 flex items-center gap-1"><Target size={14}/> Por Venda</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-b-4 border-yellow-500 shadow-sm border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Score de Viabilidade</p>
              <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{res.score_viabilidade}/100</p>
              <p className="text-sm font-bold text-yellow-600 mt-2">Status: {res.classificacao_viabilidade}</p>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl text-white">
            <h4 className="font-bold flex items-center gap-2 mb-6 text-yellow-400"><TrendingUp /> Diagnóstico de Simulação</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Preço Mínimo (Zero Lucro)</span>
                  <span className="font-bold">{formatCurrency(res.preco_minimo_viavel || 0)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Preço Ideal p/ Margem Alvo</span>
                  <span className="font-bold text-yellow-400">{formatCurrency(res.preco_ideal || 0)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Impostos + Taxas (Valor)</span>
                  <span className="font-bold">{formatCurrency(res.valor_taxas || 0)}</span>
                </div>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-widest">Alertas de Cenário</p>
                <div className="space-y-3">
                  {res.lucro_unitario! < 0 && <p className="text-red-400 text-sm flex items-center gap-2 font-bold"><AlertTriangle size={16}/> Operação gera prejuízo!</p>}
                  {res.percentual_lucro! < 8 && <p className="text-orange-400 text-sm flex items-center gap-2 font-bold"><AlertTriangle size={16}/> Margem abaixo do ideal (8%)</p>}
                  {res.score_viabilidade! < 40 && <p className="text-red-400 text-sm flex items-center gap-2">Risco extremamente alto.</p>}
                  {res.score_viabilidade! >= 70 && <p className="text-green-400 text-sm flex items-center gap-2 font-bold">Excelente oportunidade detectada.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SandboxSimulator;
