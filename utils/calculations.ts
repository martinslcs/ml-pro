
import { ProdutoAnalise } from '../types';

export const calculateAnalysis = (data: Partial<ProdutoAnalise>): Partial<ProdutoAnalise> => {
  const custo_produto = Number(data.custo_produto || 0);
  const preco_venda = Number(data.preco_venda || 0);
  const embalagem = Number(data.embalagem || 0);
  const frete = Number(data.frete || 0);
  const imposto_percentual = Number(data.imposto_percentual || 0) / 100;
  const taxa_marketplace_percentual = Number(data.taxa_marketplace_percentual || 0) / 100;
  const media_vendas_mes = Number(data.media_vendas_mes || 0);
  const margem_desejada = Number(data.margem_desejada || 0) / 100;
  const menor_preco_full = Number(data.menor_preco_full || 0);
  const preco_medio = Number(data.preco_medio_primeira_pagina || 0);
  const qty_geral = Number(data.quantidade_anuncios_geral || 0);
  const qty_full = Number(data.quantidade_anuncios_full || 0);
  const avaliacao = Number(data.avaliacao_media || 0);

  const total_taxas_percentual = imposto_percentual + taxa_marketplace_percentual;
  const valor_taxas = preco_venda * total_taxas_percentual;
  const custo_total = custo_produto + embalagem + frete + valor_taxas;
  const lucro_unitario = preco_venda - custo_total;
  
  const percentual_lucro = preco_venda > 0 ? (lucro_unitario / preco_venda) * 100 : 0;
  const lucro_mensal = lucro_unitario * media_vendas_mes;

  // Preço Mínimo Viável (Break-even)
  const custo_fixo = custo_produto + embalagem + frete;
  const preco_minimo_viavel = total_taxas_percentual < 1 ? custo_fixo / (1 - total_taxas_percentual) : 0;

  // Índice de Concorrência
  const indice_concorrencia = qty_geral + (qty_full * 1.5);
  let classificacao_concorrencia: any = 'Baixa';
  if (indice_concorrencia > 300) classificacao_concorrencia = 'Saturada';
  else if (indice_concorrencia > 150) classificacao_concorrencia = 'Alta';
  else if (indice_concorrencia > 50) classificacao_concorrencia = 'Média';

  // Score de Viabilidade (0-100)
  let score = 0;
  // Margem (40 pts)
  score += Math.min(Math.max(percentual_lucro * 1.33, 0), 40);
  // Concorrência (20 pts)
  score += Math.max(20 - (indice_concorrencia / 20), 0);
  // Avaliação (20 pts)
  score += (avaliacao / 5) * 20;
  // Competitividade de preço (20 pts)
  if (preco_venda > 0 && menor_preco_full > 0) {
    const ratio = menor_preco_full / preco_venda;
    score += Math.min(ratio * 20, 20);
  }

  let classificacao_viabilidade: any = 'Não recomendado';
  if (score > 80) classificacao_viabilidade = 'Excelente';
  else if (score > 60) classificacao_viabilidade = 'Viável';
  else if (score > 40) classificacao_viabilidade = 'Arriscado';

  // Diferenças de mercado
  const diferenca_para_menor_full = preco_venda - menor_preco_full;
  const diferenca_para_preco_medio = preco_venda - preco_medio;

  // Simulação preço ideal
  const denominador_ideal = 1 - total_taxas_percentual - margem_desejada;
  const preco_ideal = denominador_ideal > 0 ? custo_fixo / denominador_ideal : 0;

  return {
    ...data,
    total_taxas_percentual: total_taxas_percentual * 100,
    valor_taxas,
    custo_total,
    lucro_unitario,
    percentual_lucro,
    lucro_mensal,
    preco_ideal,
    score_viabilidade: Math.round(score),
    classificacao_viabilidade,
    indice_concorrencia,
    classificacao_concorrencia,
    preco_minimo_viavel,
    diferenca_para_menor_full,
    diferenca_para_preco_medio
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};
