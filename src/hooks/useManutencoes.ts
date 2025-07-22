import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Manutencao, ManutencaoFormData } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useManutencoes() {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) carregarManutencoes();
  }, [user]);

  const carregarManutencoes = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user) throw new Error("Usuário não autenticado");

      const { data: atribuicoes, error: atribuicoesError } = await supabase
        .from("atribuicoes")
        .select("empreendimento_id")
        .eq("gerente_id", user.id);

      if (atribuicoesError) throw atribuicoesError;

      const empreendimentoIds = atribuicoes.map(a => a.empreendimento_id);
      if (!empreendimentoIds.length) throw new Error("Nenhum empreendimento atribuído a este gerente.");

      const { data, error } = await supabase
        .from('manutencoes')
        .select('*')
        .in('empreendimento_id', empreendimentoIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setManutencoes(data || []);
    } catch (err: any) {
      setError(err.message);
      setManutencoes([]);
    } finally {
      setLoading(false);
    }
  };

  const criarManutencao = async (dados: ManutencaoFormData) => {
    if (!user) throw new Error("Usuário não autenticado");

    const novaManutencao = {
      empreendimento_id: dados.empreendimento_id,
      descricao: dados.descricao,
      prioridade: dados.prioridade,
      fotos: dados.fotos ?? [],
      status: 'pendente',
      gerente_id: user.id,
      // created_at será preenchido automaticamente
    };

    const { data, error } = await supabase
      .from('manutencoes')
      .insert([novaManutencao])
      .select()
      .single();

    if (error) throw error;
    setManutencoes((prev) => [...prev, data]);
    return data;
  };

  const atualizarManutencao = async (id: string, dados: Partial<Manutencao>) => {
    const { error } = await supabase
      .from('manutencoes')
      .update(dados)
      .eq('id', id);

    if (error) throw error;

    setManutencoes((prev) => prev.map((m) => (m.id === id ? { ...m, ...dados } : m)));
  };

  const concluirManutencao = async (id: string) => {
    const updateData = {
      status: 'concluida',
      concluido_em: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('manutencoes')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;

    setManutencoes((prev) => prev.map((m) => (m.id === id ? { ...m, ...updateData } : m)));
  };

  const excluirManutencao = async (id: string) => {
    const { error } = await supabase
      .from('manutencoes')
      .delete()
      .eq('id', id);

    if (error) throw error;
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
