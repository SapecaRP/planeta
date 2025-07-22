import { useState, useEffect } from 'react';
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
      
      // Por enquanto, carregar do localStorage até integrar com Supabase
      const manutencoesStorage = localStorage.getItem('manutencoes');
      if (manutencoesStorage) {
        const manutencoesData = JSON.parse(manutencoesStorage);
        setManutencoes(manutencoesData);
      } else {
        setManutencoes([]);
      }
    } catch (error) {
      console.error('Erro ao carregar manutenções:', error);
      setError('Erro ao carregar manutenções');
      setManutencoes([]);
    } finally {
      setLoading(false);
    }
  };

  const criarManutencao = (dados: ManutencaoFormData) => {
    const novaManutencao: Manutencao = {
      id: Date.now().toString(),
      ...dados,
      status: 'pendente',
      criadoEm: new Date().toISOString().split('T')[0]
    };

    setManutencoes(prev => [...prev, novaManutencao]);
    
    // Salvar no localStorage
    const manutencoesAtualizadas = [...manutencoes, novaManutencao];
    localStorage.setItem('manutencoes', JSON.stringify(manutencoesAtualizadas));
    
    return novaManutencao;
  };

  const atualizarManutencao = (id: string, dados: Partial<Manutencao>) => {
    setManutencoes(prev => 
      prev.map(manutencao => 
        manutencao.id === id 
          ? { ...manutencao, ...dados }
          : manutencao
      )
    );
    
    // Atualizar localStorage
    const manutencoesAtualizadas = manutencoes.map(manutencao => 
      manutencao.id === id 
        ? { ...manutencao, ...dados }
        : manutencao
    );
    localStorage.setItem('manutencoes', JSON.stringify(manutencoesAtualizadas));
  };

  const concluirManutencao = (id: string) => {
    setManutencoes(prev => 
      prev.map(manutencao => 
        manutencao.id === id 
          ? { 
              ...manutencao, 
              status: 'concluida' as const,
              concluidoEm: new Date().toISOString().split('T')[0]
            }
          : manutencao
      )
    );
    
    // Atualizar localStorage
    const manutencoesAtualizadas = manutencoes.map(manutencao => 
      manutencao.id === id 
        ? { ...manutencao, status: 'concluida' as const, concluidoEm: new Date().toISOString().split('T')[0] }
        : manutencao
    );
    localStorage.setItem('manutencoes', JSON.stringify(manutencoesAtualizadas));
  };

  const excluirManutencao = (id: string) => {
    setManutencoes(prev => prev.filter(manutencao => manutencao.id !== id));
    
    // Atualizar localStorage
    const manutencoesAtualizadas = manutencoes.filter(manutencao => manutencao.id !== id);
    localStorage.setItem('manutencoes', JSON.stringify(manutencoesAtualizadas));
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
    atualizarManutencao,
    concluirManutencao,
    excluirManutencao,
    carregarManutencoes
  };
}