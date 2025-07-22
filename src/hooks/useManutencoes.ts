import { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { Manutencao, ManutencaoFormData } from '../types';

export function useManutencoes() {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarManutencoes();
  }, []);

  const carregarManutencoes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('manutencoes')
        .select('*')
        .order('criadoEm', { ascending: false });

      if (error) throw error;

      setManutencoes(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar manutenções:', err.message);
      setError('Erro ao carregar manutenções');
    } finally {
      setLoading(false);
    }
  };

  const criarManutencao = async (dados: ManutencaoFormData) => {
    const novaManutencao: Omit<Manutencao, 'id'> = {
      ...dados,
      status: 'pendente',
      criadoEm: new Date().toISOString().split('T')[0]
    };

    const { data, error } = await supabase
      .from('manutencoes')
      .insert(novaManutencao)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar manutenção:', error.message);
      return null;
    }

    setManutencoes(prev => [data as Manutencao, ...prev]);
    return data;
  };

  const concluirManutencao = async (id: string) => {
    const { data, error } = await supabase
      .from('manutencoes')
      .update({
        status: 'concluida',
        concluidoEm: new Date().toISOString().split('T')[0]
      })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setManutencoes(prev =>
        prev.map(m => (m.id === id ? data : m))
      );
    }
  };

  const excluirManutencao = async (id: string) => {
    const { error } = await supabase
      .from('manutencoes')
      .delete()
      .eq('id', id);

    if (!error) {
      setManutencoes(prev => prev.filter(m => m.id !== id));
    }
  };

  const estatisticas = {
    total: manutencoes.length,
    pendentes: manutencoes.filter(m => m.status === 'pendente').length,
    concluidas: manutencoes.filter(m => m.status === 'concluida').length
  };

  return {
    manutencoes,
    loading,
    error,
    estatisticas,
    criarManutencao,
    concluirManutencao,
    excluirManutencao,
    carregarManutencoes
  };
}
