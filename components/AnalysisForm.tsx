
import React, { useState, useEffect } from 'react';
import { ProdutoAnalise, Fornecedor } from '../types';
import { calculateAnalysis, formatCurrency } from '../utils/calculations';
import { storageService } from '../services/storageService';
import { ArrowLeft, ArrowRight, Save, AlertCircle, Info, Target, FileText, DollarSign, Link as LinkIcon, ExternalLink } from 'lucide-react';

interface AnalysisFormProps {
  initialData?: ProdutoAnalise | null;
  onSave: (data: ProdutoAnalise) => void;
  onCancel: () => void;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ initialData, onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [formData, setFormData] = useState<Partial<ProdutoAnalise>>({
    produto: '',
    tipo_logistica: 'full',
    status_decisao: 'em_analise',
    link_concorrente: '',
    quantidade_anuncios_geral: 0,
    quantidade_anuncios_full: 0,
    preco_medio_primeira_pagina: 0,
    menor_preco_full: 0,
    avaliacao_media: 0,
    principais_reclamacoes: '',
    media_vendas_mes: 0,
    custo_produto: 0,
    preco_venda: 0,
    embalagem: 0,
    frete: 0,
    imposto_percentual: 0,
    taxa_marketplace_percentual: 0,
    margem_desejada: 20,
    observacao_estrategica: '',
    ...initialData
  });

  const [calculated, setCalculated] = useState<Partial<ProdutoAnalise>>({});

  useEffect(() => {
    const fetchFornecedores = async () => {
      const data = await storageService.getFornecedores();
      setFornecedores(data);
    };
    fetchFornecedores();
  }, []);

  useEffect(() => {
    setCalculated(calculateAnalysis(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const openCatalog = () => {
    const selectedProvider = fornecedores.find(f => f.id === formData.fornecedorId);
    if (!selectedProvider || !selectedProvider.catalogo) return;
    
    const win = window.open("", "_blank");
    if (win) {
      win.document.title = `Catálogo - ${selectedProvider.nome}`;
      win.document.body.style.margin = "0";
      win.document.body.innerHTML = `
        <iframe src="${selectedProvider.catalogo}" frameborder="0" style="border:0; width:100%; height:100vh;" allowfullscreen></iframe>
      `;
    }
  };

  const selectedProviderHasCatalog = fornecedores.find(f => f.id === formData.fornecedorId)?.catalogo;

  const handleSave = () => {
    if (!formData.produto) { 
      alert('ERRO: O nome do produto é obrigatório.'); 
      return; 
    }
    if (!formData.preco_venda || formData.preco_venda <= 0) { 
      alert('ERRO: Você precisa definir um PREÇO DE VENDA maior que zero na etapa de Precificação.'); 
      setStep(2); 
      return; 
    }

    const finalData: ProdutoAnalise = {
      ...formData as any,
      ...calculated as any,
      id: formData.id || crypto.randomUUID(),
      data_criacao: formData.data_criacao || new Date().toISOString()
    };
    onSave(finalData);
  };

  const renderStep1 = () => (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-3xl border border-yellow-200 dark:border-yellow-900/30">
        <div className="md:col-span-2">
          <label className="block text-xs font-black text-yellow-700 dark:text-yellow-500 uppercase mb-2">1. Identificação do Produto</label>
          <input 
            type="text" 
            name="produto" 
            value={formData.produto} 
            onChange={handleChange} 
            className="w-full px-4 py-4 border-2 border-yellow-200 dark:border-yellow-900/30 rounded-2xl focus:ring-4 focus:ring-yellow-400 outline-none text-slate-900 dark:text-white bg-white dark:bg-slate-900 font-bold text-lg shadow-sm" 
            placeholder="Nome do produto que será analisado" 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-black text-yellow-700 dark:text-yellow-500 uppercase mb-2">2. Custo de Compra (R$ Unitário)</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-600" size={20} />
            <input 
              type="number" 
              name="custo_produto" 
              value={formData.custo_produto} 
              onChange={handleChange} 
              className="w-full pl-12 pr-4 py-4 border-2 border-yellow-200 dark:border-yellow-900/30 rounded-2xl focus:ring-4 focus:ring-yellow-400 outline-none font-black text-xl text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-900 shadow-sm" 
              placeholder="0,00"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Link do Anúncio Concorrente (URL)</label>
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="url" 
              name="link_concorrente" 
              value={formData.link_concorrente} 
              onChange={handleChange} 
              className="w-full pl-12 pr-12 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium" 
              placeholder="https://produto.mercadolivre.com.br/..." 
            />
            {formData.link_concorrente && (
              <a 
                href={formData.link_concorrente} 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-600 hover:text-yellow-500"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Fornecedor</label>
          <div className="flex gap-2">
            <select name="fornecedorId" value={formData.fornecedorId} onChange={handleChange} className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium">
              <option value="">Selecione um fornecedor</option>
              {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>
            {selectedProviderHasCatalog && (
              <button 
                type="button"
                onClick={openCatalog}
                className="bg-yellow-400 text-slate-900 p-3 rounded-xl hover:bg-yellow-500 transition-colors shadow-sm"
                title="Consultar Catálogo"
              >
                <FileText size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Logística ML</label>
          <select name="tipo_logistica" value={formData.tipo_logistica} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-slate-100">
            <option value="full">MERCADO ENVIOS FULL</option>
            <option value="flex">MERCADO ENVIOS FLEX</option>
            <option value="envio_proprio">ENTREGA A COMBINAR</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Vendas Estimadas / Mês</label>
          <input type="number" name="media_vendas_mes" value={formData.media_vendas_mes} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 font-bold" />
        </div>
      </div>
      
      <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-2 uppercase tracking-widest"><Target size={18} className="text-yellow-500" /> Pesquisa de Mercado (Concorrência)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Qtd Anúncios Geral', name: 'quantidade_anuncios_geral' },
            { label: 'Qtd Anúncios FULL', name: 'quantidade_anuncios_full' },
            { label: 'Preço Médio (R$)', name: 'preco_medio_primeira_pagina' },
            { label: 'Menor Preço FULL (R$)', name: 'menor_preco_full' }
          ].map(field => (
            <div key={field.name}>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{field.label}</label>
              <input type="number" name={field.name} value={(formData as any)[field.name]} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Avaliação Média dos Clientes</label>
          <input type="number" step="0.1" name="avaliacao_media" value={formData.avaliacao_media} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900" placeholder="Ex: 4.5" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Status da Análise</label>
          <select name="status_decisao" value={formData.status_decisao} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold">
            <option value="em_analise">🟡 Em Análise</option>
            <option value="aprovado_para_teste">🟢 Aprovado para Teste</option>
            <option value="em_operacao">🚀 Em Operação</option>
            <option value="descartado">🔴 Descartado</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-200 dark:border-yellow-900/30">
              <p className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 uppercase">Score de Viabilidade</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-yellow-700 dark:text-yellow-400">{calculated.score_viabilidade}</span>
                <span className="text-sm font-bold text-yellow-600 dark:text-yellow-500 mb-1">{calculated.classificacao_viabilidade}</span>
              </div>
           </div>
           <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Índice Concorrência</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{calculated.classificacao_concorrencia}</p>
           </div>
           <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-200 dark:border-blue-900/30">
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Break-even (Mínimo)</p>
              <p className="text-xl font-bold text-blue-800 dark:text-blue-100">{formatCurrency(calculated.preco_minimo_viavel || 0)}</p>
           </div>
           <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-200 dark:border-purple-900/30">
              <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">Diferença vs Menor FULL</p>
              <p className={`text-xl font-bold ${calculated.diferenca_para_menor_full! <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(calculated.diferenca_para_menor_full || 0))} 
                <span className="text-xs ml-1">{calculated.diferenca_para_menor_full! <= 0 ? 'ABAIXO' : 'ACIMA'}</span>
              </p>
           </div>
        </div>

        <div className="p-1 bg-slate-900 rounded-3xl flex flex-col shadow-2xl shadow-slate-900/40 transform hover:scale-105 transition-transform">
          <label className="block text-[10px] font-black text-yellow-500 uppercase px-6 pt-4 tracking-widest">Preço de Venda Sugerido (R$)</label>
          <input 
            type="number" 
            name="preco_venda" 
            value={formData.preco_venda} 
            onChange={handleChange} 
            className="w-full px-6 pb-6 pt-2 bg-transparent text-5xl font-black text-white outline-none" 
            placeholder="0.00"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          {[
            { label: 'Custo Embalagem (R$)', name: 'embalagem' },
            { label: 'Custo Frete (R$)', name: 'frete' },
            { label: 'Imposto Simples %', name: 'imposto_percentual' },
            { label: 'Comissão ML %', name: 'taxa_marketplace_percentual' }
          ].map(field => (
            <div key={field.name}>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">{field.label}</label>
              <input type="number" name={field.name} value={(formData as any)[field.name]} onChange={handleChange} className="w-full px-4 py-2 border dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 font-bold" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 dark:bg-slate-900 text-white p-6 rounded-3xl flex flex-col justify-center shadow-lg border-b-4 border-green-500">
          <p className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1">Resultado Projetado</p>
          <div className="flex flex-col gap-1">
            <p className="text-4xl font-black text-green-400">{formatCurrency(calculated.lucro_mensal || 0)}</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Lucro Mensal Total</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
             <div className="flex justify-between items-center">
               <span className="text-[10px] font-black uppercase text-slate-400">Lucro Unitário</span>
               <span className={`font-black ${calculated.lucro_unitario! > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                 {formatCurrency(calculated.lucro_unitario || 0)}
               </span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-[10px] font-black uppercase text-slate-400">Margem Líquida</span>
               <span className="text-green-300 font-bold">{calculated.percentual_lucro?.toFixed(1)}%</span>
             </div>
          </div>
        </div>
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 flex flex-col">
           <h4 className="text-xs font-black text-slate-400 uppercase mb-2">Observações Estratégicas</h4>
           <textarea name="observacao_estrategica" value={formData.observacao_estrategica} onChange={handleChange} className="w-full p-3 border dark:border-slate-800 rounded-xl flex-1 outline-none focus:ring-2 focus:ring-yellow-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 font-medium" placeholder="Ex: Produto com alta sazonalidade..." />
        </div>
      </div>

      <div className="space-y-2">
        {calculated.lucro_unitario! < 0 && (
          <div className="flex items-center gap-3 p-4 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-2xl border-2 border-red-200 dark:border-red-900/30 animate-pulse">
            <AlertCircle size={24} /> <span className="font-black uppercase text-sm">Atenção: A operação está gerando PREJUÍZO de {formatCurrency(Math.abs(calculated.lucro_unitario || 0))} por venda!</span>
          </div>
        )}
        {calculated.preco_ideal! > formData.menor_preco_full! && (
          <div className="flex items-center gap-3 p-4 bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 rounded-2xl border-2 border-orange-200 dark:border-orange-900/30">
            <Info size={24} /> <span className="font-bold">Dica: Seu preço ideal para a margem desejada é {formatCurrency(calculated.preco_ideal || 0)}, o que é maior que a concorrência.</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <header className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${step === 1 ? 'bg-yellow-400 text-slate-900' : 'bg-slate-900 dark:bg-slate-950 text-yellow-400'}`}>
            {step}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-tight">
              {step === 1 ? '1. Análise de Mercado' : '2. Precificação Final'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
              {step === 1 ? 'Identifique o produto, custo e concorrência' : 'Calcule margens, taxas e lucro líquido'}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
           <button onClick={onCancel} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl text-slate-400 hover:text-red-500 transition-colors shadow-sm"><ArrowLeft size={24}/></button>
        </div>
      </header>

      <div className="p-10">
        {step === 1 ? renderStep1() : renderStep2()}
      </div>

      <footer className="px-10 py-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/30">
        <div className="flex gap-4">
          {step === 2 && (
            <button 
              onClick={() => setStep(1)} 
              className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-2xl font-black flex items-center gap-3 transition-all hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <ArrowLeft size={20} /> Voltar à Pesquisa
            </button>
          )}
        </div>
        
        <div className="flex gap-4">
          {step === 1 ? (
            <>
              {formData.preco_venda! > 0 && (
                <button onClick={handleSave} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-2xl font-black flex items-center gap-3 transition-all hover:bg-slate-200 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700">
                  <Save size={20} /> Salvar Direto
                </button>
              )}
              <button 
                onClick={() => {
                  if(!formData.produto) { alert('Digite o nome do produto primeiro.'); return; }
                  setStep(2);
                }} 
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-slate-900/20"
              >
                Prosseguir para Preço <ArrowRight size={20} />
              </button>
            </>
          ) : (
            <button 
              onClick={handleSave} 
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-12 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-yellow-500/30 border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1"
            >
              <Save size={20} /> Finalizar e Salvar Análise
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default AnalysisForm;
