/*
  # Corrigir políticas RLS para atribuições - Apenas Administradores

  1. Políticas de Segurança
    - Remove políticas genéricas existentes
    - Cria políticas específicas para administradores
    - Verifica cargo do usuário na tabela usuarios
    
  2. Permissões
    - SELECT: Todos usuários autenticados podem ler
    - INSERT/UPDATE/DELETE: Apenas administradores
*/

-- Remove políticas existentes
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON atribuicoes;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON atribuicoes;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON atribuicoes;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON atribuicoes;
DROP POLICY IF EXISTS "Usuários autenticados podem ler atribuições" ON atribuicoes;
DROP POLICY IF EXISTS "Usuários autenticados podem criar atribuições" ON atribuicoes;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar atribuições" ON atribuicoes;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar atribuições" ON atribuicoes;

-- Política para leitura (todos usuários autenticados)
CREATE POLICY "Usuários autenticados podem ler atribuições"
  ON atribuicoes
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para inserção (apenas administradores)
CREATE POLICY "Apenas administradores podem criar atribuições"
  ON atribuicoes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE auth_user_id = auth.uid() 
      AND cargo = 'Administrador'
      AND aprovado = true
    )
  );

-- Política para atualização (apenas administradores)
CREATE POLICY "Apenas administradores podem atualizar atribuições"
  ON atribuicoes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE auth_user_id = auth.uid() 
      AND cargo = 'Administrador'
      AND aprovado = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE auth_user_id = auth.uid() 
      AND cargo = 'Administrador'
      AND aprovado = true
    )
  );

-- Política para exclusão (apenas administradores)
CREATE POLICY "Apenas administradores podem deletar atribuições"
  ON atribuicoes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios 
      WHERE auth_user_id = auth.uid() 
      AND cargo = 'Administrador'
      AND aprovado = true
    )
  );