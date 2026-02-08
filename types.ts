
export type TipoLogistica = 'full' | 'flex' | 'envio_proprio';
export type StatusDecisao = 'em_analise' | 'aprovado_para_teste' | 'descartado' | 'em_operacao';

export interface Fornecedor {
  id: string;
  nome: string;
  contato: string;
  prazo_entrega_dias: number;
  pedido_minimo: number;
  observacoes: string;
  catalogo?: string; // Base64 do arquivo
  catalogo_nome?: string;
}

export interface ProdutoAnalise {
  id: string;
  produto: string;
  produtoBaseId?: string; 
  fornecedorId?: string;
  link_concorrente?: string; // Novo campo
  tipo_logistica: TipoLogistica;
  status_decisao: StatusDecisao;
  observacao_estrategica: string;
  
  // Pesquisa de Mercado
  quantidade_anuncios_geral: number;
  quantidade_anuncios_full: number;
  preco_medio_primeira_pagina: number;
  menor_preco_full: number;
  avaliacao_media: number;
  principais_reclamacoes: string;
  media_vendas_mes: number;
  custo_produto: number;

  // Precificação
  preco_venda: number;
  embalagem: number;
  frete: number;
  imposto_percentual: number;
  taxa_marketplace_percentual: number;

  // Campos Calculados
  total_taxas_percentual: number;
  valor_taxas: number;
  custo_total: number;
  lucro_unitario: number;
  percentual_lucro: number;
  lucro_mensal: number;
  
  // Novos Calculados
  score_viabilidade: number;
  classificacao_viabilidade: 'Excelente' | 'Viável' | 'Arriscado' | 'Não recomendado';
  indice_concorrencia: number;
  classificacao_concorrencia: 'Baixa' | 'Média' | 'Alta' | 'Saturada';
  preco_minimo_viavel: number;
  diferenca_para_menor_full: number;
  diferenca_para_preco_medio: number;

  // Simulação
  margem_desejada: number;
  preco_ideal: number;

  data_criacao: string;
}
