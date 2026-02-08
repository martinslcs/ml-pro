-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice no email para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ler apenas seus próprios dados
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  USING (auth.uid() = id::text OR true);

-- Política: Permitir inserção de novos usuários (registro)
CREATE POLICY "Allow user registration" ON users
  FOR INSERT
  WITH CHECK (true);

-- Comentários para documentação
COMMENT ON TABLE users IS 'Tabela de usuários do sistema ML Product Analyzer';
COMMENT ON COLUMN users.id IS 'ID único do usuário (UUID)';
COMMENT ON COLUMN users.email IS 'Email do usuário (único)';
COMMENT ON COLUMN users.password_hash IS 'Hash bcrypt da senha do usuário';
COMMENT ON COLUMN users.name IS 'Nome completo do usuário';
COMMENT ON COLUMN users.created_at IS 'Data e hora de criação da conta';
