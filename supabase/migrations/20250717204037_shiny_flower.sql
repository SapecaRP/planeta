/*
  # Adicionar coluna senha à tabela usuarios

  1. Alterações na tabela
    - Adiciona coluna `senha` (text, obrigatória)
    - Permite armazenar senhas dos usuários

  2. Observações
    - Coluna obrigatória para autenticação
    - Tipo TEXT para flexibilidade de tamanho
*/

-- Adicionar coluna senha à tabela usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS senha text NOT NULL DEFAULT '';