/*
  # Desabilitar RLS para empreendimentos e storage

  1. Tabela empreendimentos
    - Remove todas as políticas RLS existentes
    - Desabilita RLS temporariamente

  2. Storage bucket fotos
    - Remove políticas de storage existentes
    - Cria políticas permissivas para operações básicas
*/

-- Remover políticas RLS existentes da tabela empreendimentos
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar empreendimentos" ON empreendimentos;

-- Desabilitar RLS na tabela empreendimentos
ALTER TABLE empreendimentos DISABLE ROW LEVEL SECURITY;

-- Remover políticas de storage existentes
DROP POLICY IF EXISTS "Usuários podem fazer upload de fotos" ON storage.objects;
DROP POLICY IF EXISTS "Fotos são publicamente acessíveis" ON storage.objects;

-- Criar políticas permissivas para o bucket fotos
CREATE POLICY "Allow public uploads to fotos bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'fotos');

CREATE POLICY "Allow public access to fotos bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'fotos');

CREATE POLICY "Allow public updates to fotos bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'fotos')
WITH CHECK (bucket_id = 'fotos');

CREATE POLICY "Allow public deletes from fotos bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'fotos');