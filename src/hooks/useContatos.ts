import { useState, useEffect } from 'react';
import { Contato, ContatoFormData } from '../types';
import { supabase } from '../lib/supabase';

export function useContatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarContatos();
  }, []);

  const carregarContatos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('contatos').select('*');
    if (error) {
      console.error('Erro ao carregar contatos:', error);
      setContatos([]);
    } else {
      setContatos(data);
    }
    setLoading(false);
  };

  const criarContato = async (dados: ContatoFormData) => {
    const { data, error } = await supabase
      .from('contatos')
      .insert([{
        nome: dados.nome,
        telefone: dados.telefone,
        tipo_servico: dados.tipoServico // conversão aqui
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar contato:', error.message);
      throw error;
    }

    setContatos(prev => [...prev, data]);
    return data;
  };

  const atualizarContato = async (id: string, dados: Partial<ContatoFormData>) => {
    const { data, error } = await supabase
      .from('contatos')
      .update({
        ...('nome' in dados ? { nome: dados.nome } : {}),
        ...('telefone' in dados ? { telefone: dados.telefone } : {}),
        ...('tipoServico' in dados ? { tipo_servico: dados.tipoServico } : {})
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar contato:', error.message);
      throw error;
    }

    setContatos(prev =>
      prev.map(contato => (contato.id === id ? data : contato))
    );
  };

  const excluirContato = async (id: string) => {
    const { error } = await supabase.from('contatos').delete().eq('id', id);

    if (error) {
      console.error('Erro ao excluir contato:', error.message);
      throw error;
    }

    setContatos(prev => prev.filter(contato => contato.id !== id));
  };

  return {
    contatos,
    loading,
    criarContato,
    atualizarContato,
    excluirContato,
    carregarContatos
  };
}
