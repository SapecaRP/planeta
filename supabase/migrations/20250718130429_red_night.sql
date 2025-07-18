/*
  # Corrigir políticas RLS para tabela atribuições

  1. Políticas de Segurança
    - Permitir que usuários autenticados leiam todas as atribuições
    - Permitir que usuários autenticados insiram novas atribuições
    - Permitir que usuários autenticados atualizem atribuições
    - Permitir que usuários autenticados deletem atribuições

  2. Observações
    - As políticas são permissivas para permitir que administradores gerenciem atribuições
    - Em produção, considere políticas mais restritivas baseadas em roles
*/

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar atribuições" ON atribuicoes;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON atribuicoes;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON atribuicoes;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON atribuicoes;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON atribuicoes;

-- Garantir que RLS está habilitado
ALTER TABLE atribuicoes ENABLE ROW LEVEL SECURITY;

-- Criar políticas específicas para cada operação
CREATE POLICY "Enable read access for authenticated users"
  ON atribuicoes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON atribuicoes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON atribuicoes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON atribuicoes
  FOR DELETE
  TO authenticated
  USING (true);