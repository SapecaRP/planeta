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
      const contatosConvertidos = data.map((c: any) => ({
        ...c,
        tipoServico: c.tipo_servico // conversão aqui
      }));
      setContatos(contatosConvertidos);
    }
    setLoading(false);
  };

  const criarContato = async (dados: ContatoFormData) => {
    const { data, error } = await supabase
      .from('contatos')
      .insert([{
        nome: dados.nome,
        telefone: dados.telefone,
        tipo_servico: dados.tipoServico
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar contato:', error.message);
      throw error;
    }

    const contatoFormatado = {
      ...data,
      tipoServico: data.tipo_servico
    };

    setContatos(prev => [...prev, contatoFormatado]);
    return contatoFormatado;
  };

  const atualizarContato = async (id: string, dados: Partial<ContatoFormData>) => {
    const payload: any = {};
    if (dados.nome) payload.nome = dados.nome;
    if (dados.telefone) payload.telefone = dados.telefone;
    if (dados.tipoServico) payload.tipo_servico = dados.tipoServico;

    const { data, error } = await supabase
      .from('contatos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar contato:', error.message);
      throw error;
    }

    const contatoAtualizado = {
      ...data,
      tipoServico: data.tipo_servico
    };

    setContatos(prev =>
      prev.map(contato => (contato.id === id ? contatoAtualizado : contato))
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
