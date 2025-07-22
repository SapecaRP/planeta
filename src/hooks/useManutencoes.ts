import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Manutencao, ManutencaoFormData } from '../types';

export function useManutencoes() {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarManutencoes();
  }, []);

  const carregarManutencoes = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('manutencoes')
        .select('*')
        .order('criadoEm', { ascending: false });

      if (error) throw error;

      setManutencoes(data as Manutencao[]);
    } catch (err: any) {
      console.error('Erro ao carregar manutenções:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const criarManutencao = async (dados: ManutencaoFormData) => {
    const novaManutencao: Omit<Manutencao, 'id'> = {
      ...dados,
      status: 'pendente',
      criadoEm: new Date().toISOString().split('T')[0],
    };

    const { data, error } = await supabase
      .from('manutencoes')
      .insert([novaManutencao])
      .select();

    if (error) {
      console.error('Erro ao criar manutenção:', error.message);
      return;
    }

    if (data) {
      setManutencoes((prev) => [...prev, data[0]]);
    }
  };

  const atualizarManutencao = async (id: string, dados: Partial<Manutencao>) => {
    const { error } = await supabase
      .from('manutencoes')
      .update(dados)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar manutenção:', error.message);
      return;
    }

    setManutencoes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...dados } : m))
    );
  };

  const concluirManutencao = async (id: string) => {
    const updateData = {
      status: 'concluida',
      concluidoEm: new Date().toISOString().split('T')[0],
    };

    const { error } = await supabase
      .from('manutencoes')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Erro ao concluir manutenção:', error.message);
      return;
    }

    setManutencoes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updateData } : m))
    );
  };

  const excluirManutencao = async (id: string) => {
    const { error } = await supabase.from('manutencoes').delete().eq('id', id);

    if (error) {
      console.error('Erro ao excluir manutenção:', error.message);
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
