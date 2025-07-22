import { useState, useEffect } from 'react';
import { Visita, VisitaFormData } from '../types';
import { supabase } from "./supabaseClient";

export function useVisitas() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarVisitas();
  }, []);

  const carregarVisitas = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error("Usuário não autenticado");

      const { data: atribuicoes, error: atribuicoesError } = await supabase
        .from("atribuicoes")
        .select("empreendimento_id")
        .eq("gerente_id", user.id);

      if (atribuicoesError) throw atribuicoesError;

      const empreendimentoIds = atribuicoes.map(a => a.empreendimento_id);

      if (!empreendimentoIds || empreendimentoIds.length === 0) {
        setVisitas([]);
        return;
      }

      const { data, error } = await supabase
        .from('visitas')
        .select('*')
        .in('empreendimento_id', empreendimentoIds)
        .order('data', { ascending: true });

      if (error) throw error;

      setVisitas(data || []);
    } catch (error) {
      console.error('Erro ao carregar visitas:', error);
      setError('Erro ao carregar visitas');
      setVisitas([]);
    } finally {
      setLoading(false);
    }
  };

  const criarVisita = async (dados: VisitaFormData) => {
    const novaVisita = {
      ...dados,
      status: 'agendada',
      criadoEm: new Date().toISOString().split('T')[0]
    };

    const { data, error } = await supabase
      .from('visitas')
      .insert([novaVisita])
      .select();

    if (error) throw error;

    setVisitas(prev => [...prev, ...data]);
    return data[0];
  };

  const atualizarVisita = async (id: string, dados: Partial<Visita>) => {
    const { data, error } = await supabase
      .from('visitas')
      .update(dados)
      .eq('id', id)
      .select();

    if (error) throw error;

    setVisitas(prev =>
      prev.map(visita => visita.id === id ? { ...visita, ...dados } : visita)
    );
  };

  const marcarComoRealizada = async (id: string) => {
    await atualizarVisita(id, { status: 'realizada' });
  };

  const excluirVisita = async (id: string) => {
    const { error } = await supabase
      .from('visitas')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setVisitas(prev => prev.filter(visita => visita.id !== id));
  };

  const estatisticas = {
    total: visitas.length,
    agendadas: visitas.filter(v => v.status === 'agendada').length,
    realizadas: visitas.filter(v => v.status === 'realizada').length,
    canceladas: visitas.filter(v => v.status === 'cancelada').length
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
    carregarVisitas
  };
}
