/*
  # Corrigir políticas RLS da tabela usuarios

  1. Políticas Atualizadas
    - Permitir INSERT para usuários autenticados
    - Permitir SELECT para usuários autenticados
    - Permitir UPDATE para usuários autenticados
    - Permitir DELETE para usuários autenticados

  2. Segurança
    - Manter RLS habilitado
    - Políticas baseadas em autenticação
*/

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar usuários" ON usuarios;
DROP POLICY IF EXISTS "Users can read own data" ON usuarios;
DROP POLICY IF EXISTS "Users can insert own data" ON usuarios;
DROP POLICY IF EXISTS "Users can update own data" ON usuarios;
DROP POLICY IF EXISTS "Users can delete own data" ON usuarios;

-- Criar políticas mais específicas para cada operação
CREATE POLICY "Usuários autenticados podem inserir usuários"
  ON usuarios
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem ler usuários"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem atualizar usuários"
  ON usuarios
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem excluir usuários"
  ON usuarios
  FOR DELETE
  TO authenticated
  USING (true);