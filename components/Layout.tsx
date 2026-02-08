
import React, { useState } from 'react';
import { 
  Package, 
  LayoutDashboard, 
  List, 
  PlusCircle, 
  FlaskConical, 
  Users, 
  Columns, 
  Sun, 
  Moon, 
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: any) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, isDarkMode, toggleTheme, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userEmail = localStorage.getItem('user_email') || 'Usuário';
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'list', label: 'Minhas Análises', icon: List },
    { id: 'new', label: 'Nova Análise', icon: PlusCircle },
    { id: 'compare', label: 'Comparar', icon: Columns },
    { id: 'sandbox', label: 'Sandbox (Simulador)', icon: FlaskConical },
    { id: 'providers', label: 'Fornecedores', icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">
      <aside className={`${isCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 bg-slate-900 dark:bg-slate-900 text-white flex-shrink-0 shadow-2xl z-10 flex flex-col overflow-hidden`}>
        <div className={`p-6 border-b border-slate-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 animate-in fade-in duration-300">
              <div className="p-2 bg-yellow-400 rounded-lg">
                <Package className="text-slate-900" size={24} />
              </div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic text-yellow-400">ML Analyzer</h1>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                activeTab === item.id 
                ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20 font-bold' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="truncate animate-in fade-in duration-300">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 mt-auto space-y-2">
          {!isCollapsed && (
            <div className="px-4 py-3 bg-slate-800/30 rounded-xl mb-4 animate-in fade-in duration-300">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Acesso Logado</p>
              <p className="text-xs font-bold text-slate-300 truncate">{userEmail}</p>
            </div>
          )}
          
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all text-slate-300 group ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? (isDarkMode ? 'Modo Claro' : 'Modo Escuro') : ''}
          >
            {!isCollapsed && <span className="text-xs font-bold uppercase tracking-widest animate-in fade-in duration-300">{isDarkMode ? 'Escuro' : 'Claro'}</span>}
            {isDarkMode ? <Moon size={18} className="text-yellow-400" /> : <Sun size={18} className="text-yellow-400" />}
          </button>

          <button 
            onClick={() => {
              if(window.confirm('Deseja realmente sair do sistema?')) {
                onLogout();
              }
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Sair' : ''}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300">Sair do Sistema</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto p-4 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
