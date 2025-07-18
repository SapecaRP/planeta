/*
  # Sistema de Aprovação de Usuários

  1. Alterações na tabela usuarios
    - Adicionar campo `aprovado` (boolean, default false)
    - Adicionar campo `data_solicitacao` (timestamp)
    - Adicionar campo `aprovado_por` (referência ao admin que aprovou)
    - Adicionar campo `data_aprovacao` (timestamp)

  2. Segurança
    - Usuários não aprovados não podem fazer login
    - Apenas admins podem aprovar usuários
*/

-- Adicionar campos de aprovação na tabela usuarios
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'aprovado'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN aprovado boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'data_solicitacao'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN data_solicitacao timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'aprovado_por'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN aprovado_por uuid REFERENCES usuarios(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'data_aprovacao'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN data_aprovacao timestamptz;
  END IF;
END $$;

-- Aprovar usuários existentes (admins e gerentes já criados)
UPDATE usuarios SET aprovado = true WHERE aprovado IS NULL OR aprovado = false;