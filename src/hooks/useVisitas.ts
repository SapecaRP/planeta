import { useState, useEffect } from 'react';
import { Visita, VisitaFormData } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useVisitas() {
  const { user, loading: loadingAuth } = useAuth();
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[useVisitas] useEffect iniciado');
    if (!loadingAuth && user) carregarVisitas();
  }, [loadingAuth, user]);

  const carregarVisitas = async () => {
    console.log('[useVisitas] Iniciando carregamento das visitas...');
    setLoading(true);
    setError(null);

    try {
      if (!user?.id) throw new Error('Usuário não autenticado');
      const gerenteId = user.id;

      const { data: atribuicoes, error: atribuicoesError } = await supabase
        .from('atribuicoes')
        .select('empreendimento_id')
        .eq('gerente_id', gerenteId);

      if (atribuicoesError) throw atribuicoesError;

      const empreendimentoIds = atribuicoes.map((a) => a.empreendimento_id);
      console.log('[useVisitas] Empreendimentos atribuídos:', empreendimentoIds);

      if (!empreendimentoIds.length) {
        console.warn('[useVisitas] Nenhuma atribuição encontrada para o gerente.');
        setVisitas([]);
        return;
      }

      const { data, error } = await supabase
        .from('visitas')
        .select('*')
        .in('empreendimento_id', empreendimentoIds)
        .order('data', { ascending: true });

      if (error) throw error;

      console.log('[useVisitas] Visitas recebidas:', data);
      setVisitas(data || []);
    } catch (err: any) {
      console.error('[useVisitas] Erro no try/catch:', err.message || err);
      setError('Erro ao carregar visitas');
      setVisitas([]);
    } finally {
      setLoading(false);
    }
  };

  const criarVisita = async (dados: VisitaFormData) => {
    console.log('[useVisitas] Criando nova visita com dados:', dados);

    const novaVisita = {
      ...dados,
      status: 'agendada',
      criadoEm: new Date().toISOString().split('T')[0],
    };

    try {
      const { data, error } = await supabase
        .from('visitas')
        .insert([novaVisita])
        .select()
        .single();

      if (error) throw error;

      console.log('[useVisitas] Visita criada:', data);
      setVisitas((prev) => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error('[useVisitas] Erro ao criar visita:', err.message || err);
      throw err;
    }
  };

  const atualizarVisita = async (id: string, dados: Partial<Visita>) => {
    console.log('[useVisitas] Atualizando visita:', id, dados);

    const { data, error } = await supabase
      .from('visitas')
      .update(dados)
      .eq('id', id)
      .select();

    if (error) {
      console.error('[useVisitas] Erro ao atualizar visita:', error.message);
      throw error;
    }

    setVisitas((prev) => prev.map((v) => (v.id === id ? { ...v, ...dados } : v)));
  };

  const marcarComoRealizada = async (id: string) => {
    console.log('[useVisitas] Marcando como realizada:', id);
    await atualizarVisita(id, { status: 'realizada' });
  };

  const excluirVisita = async (id: string) => {
    console.log('[useVisitas] Excluindo visita:', id);

    const { error } = await supabase.from('visitas').delete().eq('id', id);

    if (error) {
      console.error('[useVisitas] Erro ao excluir visita:', error.message);
      throw error;
    }

    setVisitas((prev) => prev.filter((v) => v.id !== id));
  };

  const estatisticas = {
    total: visitas.length,
    agendadas: visitas.filter((v) => v.status === 'agendada').length,
    realizadas: visitas.filter((v) => v.status === 'realizada').length,
    canceladas: visitas.filter((v) => v.status === 'cancelada').length,
  };

  return {
    visitas,
    loading,
    error,
    estatisticas,
    criarVisita,
    atualizarVisita,
    marcarComoRealizada,
    excluirVisita,
    carregarVisitas,
  };
}
