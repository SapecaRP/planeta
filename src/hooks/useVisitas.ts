import { useState, useEffect } from 'react';
import { Visita, VisitaFormData } from '../types';

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
      
      // Por enquanto, carregar do localStorage até integrar com Supabase
      const visitasStorage = localStorage.getItem('visitas');
      if (visitasStorage) {
        const visitasData = JSON.parse(visitasStorage);
        setVisitas(visitasData);
      } else {
        setVisitas([]);
      }
    } catch (error) {
      console.error('Erro ao carregar visitas:', error);
      setError('Erro ao carregar visitas');
      setVisitas([]);
    } finally {
      setLoading(false);
    }
  };

  const criarVisita = (dados: VisitaFormData) => {
    const novaVisita: Visita = {
      id: Date.now().toString(),
      ...dados,
      status: 'agendada',
      criadoEm: new Date().toISOString().split('T')[0]
    };

    setVisitas(prev => [...prev, novaVisita]);
    
    // Salvar no localStorage
    const visitasAtualizadas = [...visitas, novaVisita];
    localStorage.setItem('visitas', JSON.stringify(visitasAtualizadas));
    
    return novaVisita;
  };

  const atualizarVisita = (id: string, dados: Partial<Visita>) => {
    setVisitas(prev => 
      prev.map(visita => 
        visita.id === id 
          ? { ...visita, ...dados }
          : visita
      )
    );
    
    // Atualizar localStorage
    const visitasAtualizadas = visitas.map(visita => 
      visita.id === id 
        ? { ...visita, ...dados }
        : visita
    );
    localStorage.setItem('visitas', JSON.stringify(visitasAtualizadas));
  };

  const marcarComoRealizada = (id: string) => {
    setVisitas(prev => 
      prev.map(visita => 
        visita.id === id 
          ? { ...visita, status: 'realizada' as const }
          : visita
      )
    );
  };

  const excluirVisita = (id: string) => {
    setVisitas(prev => prev.filter(visita => visita.id !== id));
    
    // Atualizar localStorage
    const visitasAtualizadas = visitas.filter(visita => visita.id !== id);
    localStorage.setItem('visitas', JSON.stringify(visitasAtualizadas));
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