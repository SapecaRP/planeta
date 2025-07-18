/*
  # Adicionar campo foto_url à tabela usuarios

  1. Alterações
    - Adiciona coluna `foto_url` à tabela `usuarios`
    - Campo opcional para armazenar URL da foto do perfil
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'foto_url'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN foto_url text;
  END IF;
END $$;