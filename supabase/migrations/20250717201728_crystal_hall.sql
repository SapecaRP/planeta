/*
  # Desabilitar RLS para tabela usuarios

  1. Segurança
    - Remove RLS da tabela `usuarios` temporariamente
    - Permite operações CRUD sem autenticação
    - Remove todas as políticas existentes

  2. Justificativa
    - Sistema ainda não tem autenticação implementada
    - Permite desenvolvimento e testes sem bloqueios
    - Pode ser reabilitado quando autenticação for implementada
*/

-- Remove todas as políticas existentes da tabela usuarios
DROP POLICY IF EXISTS "Usuários autenticados podem ler usuários" ON usuarios;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir usuários" ON usuarios;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar usuários" ON usuarios;
DROP POLICY IF EXISTS "Usuários autenticados podem excluir usuários" ON usuarios;

-- Desabilita RLS na tabela usuarios
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;