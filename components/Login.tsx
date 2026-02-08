
import React, { useState } from 'react';
import { Package, Lock, Mail, ArrowRight, Sun, Moon } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
  onNavigateToRegister: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister, isDarkMode, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      const { authService } = await import('../services/authService');
      const result = await authService.login(email, password);

      if (result.success) {
        onLogin(email);
      } else {
        setError(result.error || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro ao fazer login. Verifique se o Supabase está configurado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-slate-950 p-4 transition-colors duration-300">
      <div className="absolute top-8 right-8">
        <button
          onClick={toggleTheme}
          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-slate-500 hover:text-yellow-500 transition-all"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-yellow-400 rounded-[2rem] shadow-xl shadow-yellow-500/20 mb-6 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <Package size={40} className="text-slate-900" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 italic uppercase tracking-tighter mb-2">
            ML <span className="text-yellow-500">Analyzer</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Inteligência Estratégica para o Mercado Livre</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-red-600 dark:text-red-400 text-sm font-semibold text-center">{error}</p>
              </div>
            )}

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-2 block">Seu E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 outline-none transition-all text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-2 block">Sua Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors" size={20} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 outline-none transition-all text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 dark:bg-yellow-400 text-white dark:text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-yellow-500 transition-all shadow-xl shadow-slate-900/20 dark:shadow-yellow-500/10 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>Acessar Sistema <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-400 font-medium">
              Não tem uma conta?{' '}
              <button
                onClick={onNavigateToRegister}
                className="text-yellow-600 dark:text-yellow-500 font-bold hover:underline"
              >
                Criar conta
              </button>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} ML PRODUCT ANALYZER • V2.5
        </p>
      </div>
    </div>
  );
};

export default Login;
