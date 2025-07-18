import { supabase } from '../lib/supabase';
import { Usuario, UsuarioFormData } from '../types';

// Função para formatar usuário do banco para o tipo Usuario
const formatarUsuario = (data: any): Usuario => ({
  id: data.id,
  nome: data.nome,
  email: data.email,
  telefone: data.telefone,
  cargo: data.cargo,
  creci: data.creci,
  senha: data.senha,
  criadoEm: data.created_at.split('T')[0],
  atualizadoEm: data.updated_at.split('T')[0],
  aprovado: data.aprovado,
  dataSolicitacao: data.data_solicitacao?.split('T')[0] || data.created_at.split('T')[0],
  aprovadoPor: data.aprovado_por,
  dataAprovacao: data.data_aprovacao?.split('T')[0]
});

// Função para preparar dados para inserção/atualização
const prepararDadosUsuario = (dados: UsuarioFormData | Partial<UsuarioFormData>) => {
  const dadosPreparados = {
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone,
    cargo: dados.funcao || dados.cargo,
    creci: dados.creci || null
  };
  
  return dadosPreparados;
};

export const usuarioService = {
  // Buscar todos os usuários
  async buscarTodos(): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(formatarUsuario);
  },

  // Buscar usuários pendentes de aprovação
  async buscarPendentes(): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('aprovado', false)
      .order('data_solicitacao', { ascending: true });

    if (error) throw error;
    return data.map(formatarUsuario);
  },

  // Aprovar usuário
  async aprovar(id: string, aprovadoPor: string): Promise<Usuario> {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        aprovado: true,
        aprovado_por: aprovadoPor,
        data_aprovacao: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return formatarUsuario(data);
  },

  // Rejeitar usuário (excluir)
  async rejeitar(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
  // Criar novo usuário
  async criar(dados: UsuarioFormData): Promise<Usuario> {
    const dadosParaInserir = {
      ...prepararDadosUsuario(dados),
      senha: dados.senha,
      aprovado: true // Admin cria usuários já aprovados
    };
    
    const { data, error } = await supabase
      .from('usuarios')
      .insert([dadosParaInserir])
      .select()
      .single();

    if (error) throw error;
    return formatarUsuario(data);
  },

  // Atualizar usuário
  async atualizar(id: string, dados: Partial<UsuarioFormData>): Promise<Usuario> {
    const { data, error } = await supabase
      .from('usuarios')
      .update(prepararDadosUsuario(dados))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return formatarUsuario(data);
  },

  // Excluir usuário
  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};