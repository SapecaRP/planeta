import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Manutencao, ManutencaoFormData } from '../types';

export function useManutencoes() {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[useManutencoes] useEffect iniciado');
    carregarManutencoes();
  }, []);

  const carregarManutencoes = async () => {
    console.log('[useManutencoes] Carregando manutenções...');
    setLoading(true);
    setError(null);

    try {
      const { data: sessionData, error: userError } = await supabase.auth.getUser();
      const user = sessionData?.user;
      if (userError || !user) throw new Error("Usuário não autenticado");

      console.log('[useManutencoes] Auth user ID:', user.id);

      // Buscar o ID do gerente (usuarios.id) com base no auth_user_id
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (usuarioError || !usuarioData) throw new Error("Usuário não encontrado");

      const gerenteId = usuarioData.id;

      const { data: atribuicoes, error: atribuicoesError } = await supabase
        .from("atribuicoes")
        .select("empreendimento_id")
        .eq("gerente_id", gerenteId);

      if (atribuicoesError) throw atribuicoesError;

      const empreendimentoIds = atribuicoes.map(a => a.empreendimento_id);
      console.log('[useManutencoes] Empreendimentos atribuídos:', empreendimentoIds);

      if (!empreendimentoIds.length) {
        console.warn('[useManutencoes] Nenhuma atribuição encontrada para o gerente.');
        setManutencoes([]);
        return;
      }

      const { data, error } = await supabase
        .from('manutencoes')
        .select('*')
        .in('empreendimento_id', empreendimentoIds)
        .order('criadoEm', { ascending: false });

      if (error) throw error;

      console.log('[useManutencoes] Manutenções recebidas:', data);
      setManutencoes(data || []);
    } catch (err: any) {
      console.error('[useManutencoes] Erro ao carregar manutenções:', err.message);
      setError(err.message);
      setManutencoes([]);
    } finally {
      setLoading(false);
    }
  };

  const criarManutencao = async (dados: ManutencaoFormData) => {
    console.log('[useManutencoes] Criando manutenção com dados:', dados);

    const novaManutencao: Omit<Manutencao, 'id'> = {
      ...dados,
      status: 'pendente',
      criadoEm: new Date().toISOString().split('T')[0],
    };

    try {
      const { data, error } = await supabase
        .from('manutencoes')
        .insert([novaManutencao])
        .select()
        .single();

      console.log('[useManutencoes] Manutenção criada:', data);

      if (error) throw error;

      setManutencoes((prev) => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error('[useManutencoes] Erro ao criar manutenção:', err.message);
      throw err;
    }
  };

  const atualizarManutencao = async (id: string, dados: Partial<Manutencao>) => {
    console.log('[useManutencoes] Atualizando manutenção:', id, dados);

    const { error } = await supabase
      .from('manutencoes')
      .update(dados)
      .eq('id', id);

    if (error) {
      console.error('[useManutencoes] Erro ao atualizar manutenção:', error.message);
      return;
    }

    setManutencoes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...dados } : m))
    );
  };

  const concluirManutencao = async (id: string) => {
    console.log('[useManutencoes] Concluindo manutenção:', id);

    const updateData = {
      status: 'concluida',
      concluidoEm: new Date().toISOString().split('T')[0],
    };

    const { error } = await supabase
      .from('manutencoes')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('[useManutencoes] Erro ao concluir manutenção:', error.message);
      return;
    }

    setManutencoes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updateData } : m))
    );
  };

  const excluirManutencao = async (id: string) => {
    console.log('[useManutencoes] Excluindo manutenção:', id);

    const { error } = await supabase
      .from('manutencoes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[useManutencoes] Erro ao excluir manutenção:', error.message);
      return;
    }

    setManutencoes((prev) => prev.filter((m) => m.id !== id));
  };

  const estatisticas = {
    total: manutencoes.length,
    pendentes: manutencoes.filter((m) => m.status === 'pendente').length,
    concluidas: manutencoes.filter((m) => m.status === 'concluida').length,
  };

  return {
    manutencoes,
    loading,
    error,
    estatisticas,
    criarManutencao,
    atualizarManutencao,
    concluirManutencao,
    excluirManutencao,
    carregarManutencoes,
  };
}
