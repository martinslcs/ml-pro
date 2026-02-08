
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AnalysisList from './components/AnalysisList';
import AnalysisForm from './components/AnalysisForm';
import SandboxSimulator from './components/SandboxSimulator';
import ComparisonPanel from './components/ComparisonPanel';
import ProviderManager from './components/ProviderManager';
import Login from './components/Login';
import { ProdutoAnalise } from './types';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'new' | 'list' | 'sandbox' | 'compare' | 'providers'>('dashboard');
  const [analyses, setAnalyses] = useState<ProdutoAnalise[]>([]);
  const [editingAnalysis, setEditingAnalysis] = useState<ProdutoAnalise | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('session_active') === 'true';
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const loadData = async () => {
    try {
      const data = await storageService.getAll();
      const sortedData = (data || []).sort((a, b) => 
        new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()
      );
      setAnalyses(sortedData);
    } catch (error) {
      console.error("App: Erro ao carregar análises:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (email: string) => {
    localStorage.setItem('session_active', 'true');
    localStorage.setItem('user_email', email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('session_active');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
  };

  const handleTabChange = (tab: any) => {
    if (tab === 'new') {
      setEditingAnalysis(null);
    }
    setActiveTab(tab);
  };

  const handleSave = async (data: ProdutoAnalise) => {
    try {
      await storageService.save(data);
      await loadData();
      setActiveTab('list');
      setEditingAnalysis(null);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar análise.");
    }
  };

  const handleEdit = (item: ProdutoAnalise) => {
    setEditingAnalysis(item);
    setActiveTab('new');
  };

  const handleDelete = async (id: string) => {
    if (!id) return;

    const confirmMessage = "Excluir análise?\n\nEsta ação não pode ser desfeita. A análise será permanentemente removida.";
    
    if (window.confirm(confirmMessage)) {
      try {
        setAnalyses(prev => prev.filter(a => String(a.id) !== String(id)));
        await storageService.delete(id);
      } catch (error) {
        console.error("App: Falha crítica na exclusão:", error);
        alert("Erro ao remover do banco de dados. Restaurando informações...");
        await loadData();
      }
    }
  };

  const handleDuplicate = async (item: ProdutoAnalise) => {
    try {
      const duplicated: ProdutoAnalise = {
        ...item,
        id: crypto.randomUUID(),
        produto: `${item.produto} (Cópia)`,
        data_criacao: new Date().toISOString()
      };
      await storageService.save(duplicated);
      await loadData();
      setActiveTab('list');
    } catch (error) {
      console.error("Erro ao duplicar:", error);
      alert("Erro ao duplicar análise.");
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent shadow-lg"></div>
          <p className="text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest animate-pulse">Sincronizando Banco de Dados...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard analyses={analyses} />;
      case 'list': 
        return (
          <AnalysisList 
            analyses={analyses} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onDuplicate={handleDuplicate} 
          />
        );
      case 'new': 
        return (
          <AnalysisForm 
            key={editingAnalysis?.id || 'new_analysis_form'} 
            initialData={editingAnalysis} 
            onSave={handleSave} 
            onCancel={() => setActiveTab('list')} 
          />
        );
      case 'sandbox': 
        return <SandboxSimulator />;
      case 'compare': 
        return <ComparisonPanel analyses={analyses} />;
      case 'providers': 
        return <ProviderManager />;
      default: 
        return <Dashboard analyses={analyses} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={handleTabChange} 
      isDarkMode={isDarkMode} 
      toggleTheme={toggleTheme}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
