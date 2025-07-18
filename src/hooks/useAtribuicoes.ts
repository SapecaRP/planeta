import { useState, useEffect } from 'react';
import { AtribuicaoEmpreendimento } from '../types';
import { useEmpreendimentos } from './useEmpreendimentos';
import { useUsuarios } from './useUsuarios';
import { supabase } from '../lib/supabase';

export function useAtribuicoes() {
  const [atribuicoes, setAtribuicoes] = useState<AtribuicaoEmpreendimento[]>([]);
  const [loading, setLoading] = useState(true);
  const { empreendimentos } = useEmpreendimentos();
  const { usuarios } = useUsuarios();

  // Carregar atribuições do Supabase
  useEffect(() => {
    carregarAtribuicoes();
  }, [usuarios, empreendimentos]);

  const carregarAtribuicoes = async () => {
    try {
      const { data, error } = await supabase
        .from('atribuicoes')
        .select(`
          *,
          usuarios!atribuicoes_gerente_id_fkey(id, nome, email),
          empreendimentos!atribuicoes_empreendimento_id_fkey(id, nome, status)
        `);

      if (error) {
        console.error('Erro ao carregar atribuições:', error);
        setLoading(false);
        return;
      }

      // Agrupar por gerente
      const atribuicoesPorGerente = new Map<string, AtribuicaoEmpreendimento>();

      data.forEach(atribuicao => {
        const gerenteId = atribuicao.gerente_id;
        const gerente = atribuicao.usuarios;
        const empreendimento = atribuicao.empreendimentos;

        if (!atribuicoesPorGerente.has(gerenteId)) {
          atribuicoesPorGerente.set(gerenteId, {
            id: gerenteId,
            gerenteId: gerenteId,
            gerenteNome: gerente.nome,
            gerenteEmail: gerente.email,
            empreendimentos: []
          });
        }

        atribuicoesPorGerente.get(gerenteId)!.empreendimentos.push({
          id: empreendimento.id,
          nome: empreendimento.nome,
          status: empreendimento.status
        });
      });

      setAtribuicoes(Array.from(atribuicoesPorGerente.values()));
    } catch (error) {
      console.error('Erro ao carregar atribuições:', error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarAtribuicao = async (gerenteId: string, empreendimentoIds: string[]) => {
    try {
      // Primeiro, remover todas as atribuições existentes do gerente
      await supabase
        .from('atribuicoes')
        .delete()
        .eq('gerente_id', gerenteId);

      // Depois, inserir as novas atribuições
      if (empreendimentoIds.length > 0) {
        const novasAtribuicoes = empreendimentoIds.map(empId => ({
          gerente_id: gerenteId,
          empreendimento_id: empId
        }));

        await supabase
          .from('atribuicoes')
          .insert(novasAtribuicoes);
      }

      // Recarregar atribuições
      await carregarAtribuicoes();
    } catch (error) {
      console.error('Erro ao atualizar atribuição:', error);
      throw error;
    }
  };

  const atualizarAtribuicaoLocal = (gerenteId: string, empreendimentoIds: string[]) => {
    const gerente = usuarios.find(u => u.id === gerenteId);
    if (!gerente) return;

    const empreendimentosAtribuidos = empreendimentoIds.map(id => {
      const emp = empreendimentos.find(e => e.id === id);
      return emp ? {
        id: emp.id,
        nome: emp.nome,
        status: emp.status
      } : null;
    }).filter(Boolean) as { id: string; nome: string; status: 'Estoque' | 'STAND' | 'PDV' }[];

    setAtribuicoes(prev => {
      const existingIndex = prev.findIndex(a => a.gerenteId === gerenteId);
      
      if (existingIndex >= 0) {
        // Atualizar atribuição existente
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          empreendimentos: empreendimentosAtribuidos
        };
        return updated;
      } else {
        // Criar nova atribuição
        const novaAtribuicao: AtribuicaoEmpreendimento = {
          id: Date.now().toString(),
          gerenteId,
          gerenteNome: gerente.nome,
          gerenteEmail: gerente.email,
          empreendimentos: empreendimentosAtribuidos
        };
        return [...prev, novaAtribuicao];
      }
    });
  };

  const getEmpreendimentosDisponiveis = () => {
    return empreendimentos;
  };

  const getGerentesDisponiveis = () => {
    return usuarios.filter(u => u.cargo === 'Gerente de Produto' && u.aprovado);
  };

  return {
    atribuicoes,
    loading,
    atualizarAtribuicao,
    atualizarAtribuicaoLocal,
    getEmpreendimentosDisponiveis,
    getGerentesDisponiveis
  };
}