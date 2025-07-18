import { useState, useEffect } from 'react';
import { Usuario, UsuarioFormData } from '../types';
import { usuarioService } from '../services/usuarioService';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const data = await usuarioService.buscarTodos();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const criarUsuario = async (dados: UsuarioFormData) => {
    try {
      const novoUsuario = await usuarioService.criar(dados);
      setUsuarios(prev => [novoUsuario, ...prev]);
      return novoUsuario;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  };

  const atualizarUsuario = async (id: string, dados: Partial<UsuarioFormData>) => {
    try {
      const usuarioAtualizado = await usuarioService.atualizar(id, dados);
      setUsuarios(prev => 
        prev.map(user => user.id === id ? usuarioAtualizado : user)
      );
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  const excluirUsuario = async (id: string) => {
    try {
      await usuarioService.excluir(id);
      setUsuarios(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      throw error;
    }
  };

  return {
    usuarios,
    loading,
    criarUsuario,
    atualizarUsuario,
    excluirUsuario
  };
}