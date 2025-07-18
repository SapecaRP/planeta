/*
  # Limpar todos os usuários

  1. Operações
    - Remove todos os usuários existentes da tabela
    - Permite criação do primeiro usuário como admin master

  2. Segurança
    - Limpa dados para recomeçar
    - Primeiro usuário será automaticamente admin
*/

DELETE FROM usuarios;