
import React, { useState, useEffect, useRef } from 'react';
import { Fornecedor } from '../types';
import { storageService } from '../services/storageService';
import { Users, Plus, Search, Trash2, Edit2, Phone, Calendar, Package, Save, X, FileText, Upload, Download, Eye, CheckCircle } from 'lucide-react';

const ProviderManager: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Fornecedor | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Fornecedor>>({
    nome: '',
    contato: '',
    prazo_entrega_dias: 0,
    pedido_minimo: 0,
    observacoes: '',
    catalogo: '',
    catalogo_nome: ''
  });

  const loadProviders = async () => {
    const data = await storageService.getFornecedores();
    setFornecedores(data);
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const handleOpenForm = (provider?: Fornecedor) => {
    if (provider) {
      setEditingProvider(provider);
      setFormData(provider);
    } else {
      setEditingProvider(null);
      setFormData({
        nome: '',
        contato: '',
        prazo_entrega_dias: 0,
        pedido_minimo: 0,
        observacoes: '',
        catalogo: '',
        catalogo_nome: ''
      });
    }
    setIsFormOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 80 * 1024 * 1024) {
      alert("O arquivo é muito grande. O limite é de 80MB para catálogos.");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        catalogo: reader.result as string,
        catalogo_nome: file.name
      }));
      setLoading(false);
    };
    reader.onerror = () => {
      alert("Erro ao ler o arquivo.");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome) return;

    setLoading(true);
    const newProvider: Fornecedor = {
      ...formData as Fornecedor,
      id: editingProvider?.id || crypto.randomUUID()
    };

    try {
      await storageService.saveFornecedor(newProvider);
      await loadProviders();
      setIsFormOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar no banco de dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Excluir este fornecedor?')) {
      await storageService.deleteFornecedor(id);
      await loadProviders();
    }
  };

  const openCatalog = (f: Fornecedor) => {
    if (!f.catalogo) return;
    const win = window.open("", "_blank");
    if (win) {
      win.document.title = `Catálogo - ${f.nome}`;
      win.document.body.style.margin = "0";
      win.document.body.style.height = "100vh";
      win.document.body.innerHTML = `
        <iframe src="${f.catalogo}" frameborder="0" style="border:0; width:100%; height:100%;" allowfullscreen></iframe>
      `;
    }
  };

  const downloadCatalog = (f: Fornecedor) => {
    if (!f.catalogo) return;
    const link = document.createElement('a');
    link.href = f.catalogo;
    link.download = f.catalogo_nome || `catalogo_${f.nome}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProviders = fornecedores.filter(f => 
    f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.contato.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">Gestão de Fornecedores</h2>
          <p className="text-slate-500">Organize seus parceiros e consulte catálogos de produtos rapidamente.</p>
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg shadow-yellow-500/20"
        >
          <Plus size={20} /> Novo Fornecedor
        </button>
      </header>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar fornecedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none shadow-sm text-slate-900"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-4 border-dashed border-slate-100">
            <Users size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest">Nenhum fornecedor cadastrado</p>
          </div>
        ) : (
          filteredProviders.map(f => (
            <div key={f.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-900 text-yellow-400 rounded-2xl">
                  <Users size={24} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenForm(f)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(f.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-4 truncate">{f.nome}</h3>
              
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  <span>{f.contato || 'Sem contato'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Calendar size={16} className="text-slate-400" />
                  <span>Entrega: <span className="font-bold text-slate-800">{f.prazo_entrega_dias} dias</span></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Package size={16} className="text-slate-400" />
                  <span>Mínimo: <span className="font-bold text-slate-800">R$ {f.pedido_minimo}</span></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {f.catalogo ? (
                  <>
                    <button 
                      onClick={() => openCatalog(f)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-xs"
                    >
                      <Eye size={16} /> Abrir
                    </button>
                    <button 
                      onClick={() => downloadCatalog(f)}
                      className="bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-xs border border-yellow-200"
                    >
                      <Download size={16} /> Baixar
                    </button>
                  </>
                ) : (
                  <div className="col-span-2 bg-slate-50 text-slate-300 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-dashed border-slate-200 text-[10px] uppercase tracking-wider">
                    Sem Catálogo Anexado
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            <header className="px-8 py-6 bg-slate-50 border-b flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 uppercase italic">
                {editingProvider ? 'Editar Parceiro' : 'Novo Cadastro'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-red-500">
                <X size={24} />
              </button>
            </header>
            
            <form onSubmit={handleSave} className="p-8 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Nome Comercial</label>
                  <input required type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-bold text-slate-900" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">WhatsApp / E-mail</label>
                  <input type="text" value={formData.contato} onChange={e => setFormData({...formData, contato: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-slate-900" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Prazo (Dias)</label>
                    <input type="number" value={formData.prazo_entrega_dias} onChange={e => setFormData({...formData, prazo_entrega_dias: parseInt(e.target.value) || 0})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Pedido Mín (R$)</label>
                    <input type="number" value={formData.pedido_minimo} onChange={e => setFormData({...formData, pedido_minimo: parseFloat(e.target.value) || 0})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <label className="text-[10px] font-black uppercase text-slate-600 mb-3 block flex items-center gap-2">
                  <FileText size={14} /> Arquivo do Catálogo
                </label>
                <div onClick={() => !loading && fileInputRef.current?.click()} className={`cursor-pointer border-2 border-dashed border-slate-300 rounded-xl p-6 transition-all text-center group ${loading ? 'opacity-50' : 'hover:border-yellow-400 hover:bg-yellow-50'}`}>
                  <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf,image/*" onChange={handleFileUpload} />
                  {loading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mb-2"></div>
                      <p className="text-sm font-bold text-slate-600">Processando arquivo...</p>
                    </div>
                  ) : formData.catalogo ? (
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-green-100 text-green-600 rounded-full mb-2"><CheckCircle size={24} /></div>
                      <p className="text-sm font-bold text-slate-800">{formData.catalogo_nome}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-slate-200 text-slate-500 rounded-full mb-2 group-hover:bg-yellow-200 group-hover:text-yellow-600 transition-colors"><Upload size={24} /></div>
                      <p className="text-sm font-bold text-slate-600">Clique para anexar catálogo</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase">Máx: 80MB (PDF/Imagem)</p>
                    </div>
                  )}
                </div>
                {formData.catalogo && !loading && (
                  <div className="mt-4 flex justify-between items-center px-2">
                    <button type="button" onClick={() => openCatalog(formData as Fornecedor)} className="text-xs font-bold text-yellow-600 flex items-center gap-1 hover:underline"><Eye size={14} /> Testar Abertura</button>
                    <button type="button" onClick={() => setFormData({...formData, catalogo: '', catalogo_nome: ''})} className="text-xs font-bold text-red-500 hover:underline">Remover Arquivo</button>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-yellow-400 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                {loading ? 'Processando...' : <><Save size={20} /> Finalizar Cadastro</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderManager;
