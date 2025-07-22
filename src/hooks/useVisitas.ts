
import { useState, useEffect } from 'react';
import { Visita, VisitaFormData } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useVisitas() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) carregarVisitas();
  }, [user]);

  const carregarVisitas = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user) throw new Error("Usuário não autenticado");

      const { data: atribuicoes, error: atribuicoesError } = await supabase
        .from('atribuicoes')
        .select('empreendimento_id')
        .eq('gerente_id', user.id);

      if (atribuicoesError) throw atribuicoesError;

      const empreendimentoIds = atribuicoes.map((a) => a.empreendimento_id);
      if (!empreendimentoIds.length) throw new Error('Nenhum empreendimento atribuído a este gerente.');

      const { data, error } = await supabase
        .from('visitas')
        .select('*')
        .in('empreendimento_id', empreendimentoIds)
        .order('data', { ascending: true });

      if (error) throw error;

      setVisitas(data || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar visitas');
      setVisitas([]);
    } finally {
      setLoading(false);
    }
  };

  const criarVisita = async (dados: VisitaFormData) => {
    const novaVisita = {
      ...dados,
      status: 'agendada',
    };

    const { data, error } = await supabase
      .from('visitas')
      .insert([novaVisita])
      .select()
      .single();

    if (error) throw error;
    setVisitas((prev) => [...prev, data]);
    return data;
  };

  const atualizarVisita = async (id: string, dados: Partial<Visita>) => {
    const { data, error } = await supabase
      .from('visitas')
      .update(dados)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setVisitas((prev) => prev.map((v) => (v.id === id ? { ...v, ...dados } : v)));
  };

  const marcarComoRealizada = async (id: string) => {
    await atualizarVisita(id, { status: 'realizada' });
  };

  const excluirVisita = async (id: string) => {
    const { error } = await supabase.from('visitas').delete().eq('id', id);
    if (error) throw error;
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
