import { supabase } from './supabaseClient';
import * as bcrypt from 'bcryptjs';

export interface User {
    id: string;
    email: string;
    name: string;
    created_at: string;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    error?: string;
}

class AuthService {
    /**
     * Registrar novo usuário
     */
    async register(email: string, password: string, name: string): Promise<AuthResponse> {
        try {
            // Verificar se email já existe
            const { data: existingUser } = await supabase
                .from('users')
                .select('email')
                .eq('email', email)
                .single();

            if (existingUser) {
                return { success: false, error: 'Este email já está cadastrado' };
            }

            // Hash da senha
            const passwordHash = await bcrypt.hash(password, 10);

            // Criar usuário
            const { data, error } = await supabase
                .from('users')
                .insert([
                    {
                        email,
                        password_hash: passwordHash,
                        name,
                    },
                ])
                .select()
                .single();

            if (error) {
                console.error('Erro ao criar usuário:', error);
                return { success: false, error: 'Erro ao criar conta. Tente novamente.' };
            }

            const user: User = {
                id: data.id,
                email: data.email,
                name: data.name,
                created_at: data.created_at,
            };

            // Salvar sessão
            this.saveSession(user);

            return { success: true, user };
        } catch (error) {
            console.error('Erro no registro:', error);
            return { success: false, error: 'Erro inesperado. Tente novamente.' };
        }
    }

    /**
     * Fazer login
     */
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            // Buscar usuário
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error || !user) {
                return { success: false, error: 'Email ou senha incorretos' };
            }

            // Verificar senha
            const passwordMatch = await bcrypt.compare(password, user.password_hash);

            if (!passwordMatch) {
                return { success: false, error: 'Email ou senha incorretos' };
            }

            const userData: User = {
                id: user.id,
                email: user.email,
                name: user.name,
                created_at: user.created_at,
            };

            // Salvar sessão
            this.saveSession(userData);

            return { success: true, user: userData };
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
        }
    }

    /**
     * Fazer logout
     */
    logout(): void {
        localStorage.removeItem('session_active');
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_email');
    }

    /**
     * Obter usuário atual
     */
    getCurrentUser(): User | null {
        const userData = localStorage.getItem('user_data');
        if (!userData) return null;

        try {
            return JSON.parse(userData);
        } catch {
            return null;
        }
    }

    /**
     * Verificar se está autenticado
     */
    isAuthenticated(): boolean {
        return localStorage.getItem('session_active') === 'true';
    }

    /**
     * Salvar sessão no localStorage
     */
    private saveSession(user: User): void {
        localStorage.setItem('session_active', 'true');
        localStorage.setItem('user_data', JSON.stringify(user));
        localStorage.setItem('user_email', user.email);
    }
}

export const authService = new AuthService();
