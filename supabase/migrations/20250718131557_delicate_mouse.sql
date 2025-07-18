/*
  # Remover RLS de todas as tabelas

  Remove Row Level Security de todas as tabelas do sistema para simplificar
  o acesso, já que é um sistema interno apenas para funcionários.

  1. Tabelas afetadas:
    - empreendimentos
    - usuarios  
    - contatos
    - manutencoes
    - visitas
    - atribuicoes

  2. Ações:
    - Desabilitar RLS
    - Remover todas as políticas
*/

-- Remover RLS da tabela empreendimentos
ALTER TABLE empreendimentos DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON empreendimentos;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON empreendimentos;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON empreendimentos;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON empreendimentos;

-- Remover RLS da tabela usuarios
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON usuarios;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON usuarios;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON usuarios;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON usuarios;

-- Remover RLS da tabela contatos
ALTER TABLE contatos DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar contatos" ON contatos;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON contatos;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON contatos;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON contatos;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON contatos;

-- Remover RLS da tabela manutencoes
ALTER TABLE manutencoes DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar manutenções" ON manutencoes;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON manutencoes;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON manutencoes;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON manutencoes;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON manutencoes;

-- Remover RLS da tabela visitas
ALTER TABLE visitas DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar visitas" ON visitas;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON visitas;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON visitas;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON visitas;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON visitas;

-- Remover RLS da tabela atribuicoes
ALTER TABLE atribuicoes DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON atribuicoes;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON atribuicoes;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON atribuicoes;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON atribuicoes;
DROP POLICY IF EXISTS "Admins can manage atribuicoes" ON atribuicoes;
DROP POLICY IF EXISTS "Admins can insert atribuicoes" ON atribuicoes;
DROP POLICY IF EXISTS "Admins can update atribuicoes" ON atribuicoes;
DROP POLICY IF EXISTS "Admins can delete atribuicoes" ON atribuicoes;