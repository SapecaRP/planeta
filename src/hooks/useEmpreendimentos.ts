import { useState, useEffect } from 'react';
import { Empreendimento, EmpreendimentoFormData } from '../types';
import { supabase, uploadImage, deleteImage } from '../lib/supabase';

export function useEmpreendimentos() {
  const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar empreendimentos do Supabase
  useEffect(() => {
    carregarEmpreendimentos();
  }, []);

  const carregarEmpreendimentos = async () => {
    try {
      const { data, error } = await supabase
        .from('empreendimentos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar empreendimentos:', error);
        return;
      }

      const empreendimentosFormatados = data.map(emp => ({
        id: emp.id,
        nome: emp.nome,
        endereco: emp.endereco,
        status: emp.status as 'Estoque' | 'STAND' | 'PDV',
        informacoes: emp.informacoes || '',
        foto: emp.foto_url,
        criadoEm: emp.created_at.split('T')[0],
        atualizadoEm: emp.updated_at.split('T')[0]
      }));

      setEmpreendimentos(empreendimentosFormatados);
    } catch (error) {
      console.error('Erro ao carregar empreendimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const criarEmpreendimento = async (dados: EmpreendimentoFormData) => {
    try {
      let fotoUrl = null;

      // Se há uma foto, fazer upload
      if (dados.foto && dados.foto.startsWith('data:')) {
        // Converter data URL para File
        const response = await fetch(dados.foto);
        const blob = await response.blob();
        const file = new File([blob], `${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        const fileName = `empreendimentos/${Date.now()}-${file.name}`;
        fotoUrl = await uploadImage(file, 'fotos', fileName);
      }

      const { data, error } = await supabase
        .from('empreendimentos')
        .insert([{
          nome: dados.nome,
          endereco: dados.endereco,
          status: dados.status,
          informacoes: dados.informacoes,
          foto_url: fotoUrl
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar empreendimento:', error);
        throw error;
      }

      const novoEmpreendimento: Empreendimento = {
        id: data.id,
        nome: data.nome,
        endereco: data.endereco,
        status: data.status,
        informacoes: data.informacoes || '',
        foto: data.foto_url,
        criadoEm: data.created_at.split('T')[0],
        atualizadoEm: data.updated_at.split('T')[0]
      };

      setEmpreendimentos(prev => [novoEmpreendimento, ...prev]);
      return novoEmpreendimento;
    } catch (error) {
      console.error('Erro ao criar empreendimento:', error);
      throw error;
    }
  };

  const atualizarEmpreendimento = async (id: string, dados: Partial<EmpreendimentoFormData>) => {
    try {
      let fotoUrl = dados.foto;

      // Se há uma nova foto em data URL, fazer upload
      if (dados.foto && dados.foto.startsWith('data:')) {
        // Converter data URL para File
        const response = await fetch(dados.foto);
        const blob = await response.blob();
        const file = new File([blob], `${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        const fileName = `empreendimentos/${Date.now()}-${file.name}`;
        fotoUrl = await uploadImage(file, 'fotos', fileName);
      }

      const updateData: any = {
        ...dados,
        foto_url: fotoUrl
      };

      // Remover campo 'foto' pois no banco é 'foto_url'
      delete updateData.foto;

      const { data, error } = await supabase
        .from('empreendimentos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar empreendimento:', error);
        throw error;
      }

      const empreendimentoAtualizado: Empreendimento = {
        id: data.id,
        nome: data.nome,
        endereco: data.endereco,
        status: data.status,
        informacoes: data.informacoes || '',
        foto: data.foto_url,
        criadoEm: data.created_at.split('T')[0],
        atualizadoEm: data.updated_at.split('T')[0]
      };

      setEmpreendimentos(prev => 
        prev.map(emp => emp.id === id ? empreendimentoAtualizado : emp)
      );
    } catch (error) {
      console.error('Erro ao atualizar empreendimento:', error);
      throw error;
    }
  };

  const excluirEmpreendimento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('empreendimentos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir empreendimento:', error);
        throw error;
      }

      setEmpreendimentos(prev => prev.filter(emp => emp.id !== id));
    } catch (error) {
      console.error('Erro ao excluir empreendimento:', error);
      throw error;
    }
  };

  return {
    empreendimentos,
    loading,
    criarEmpreendimento,
    atualizarEmpreendimento,
    excluirEmpreendimento
  };
}