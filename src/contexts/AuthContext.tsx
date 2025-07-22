import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Usuario } from '../types';

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  signup: (dados: { nome: string; email: string; telefone: string; senha: string }) => Promise<boolean>;
  registerManager: (dados: { nome: string; email: string; telefone: string; creci?: string; senha: string }) => Promise<boolean>;
  checkIfFirstUser: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (dados: Partial<Usuario>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apenas definir loading como false
    setLoading(false);
  }, []);

  const checkIfFirstUser = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Erro ao verificar usuários:', error);
        return false;
      }

      return data.length === 0;
    } catch (error) {
      console.error('Erro ao verificar primeiro usuário:', error);
      return false;
    }
  };

  const signup = async (dados: { nome: string; email: string; telefone: string; senha: string }): Promise<boolean> => {
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: dados.email,
        password: dados.senha,
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new Error('Este email já está cadastrado no sistema.');
        }
        throw new Error('Erro ao criar usuário. Tente novamente.');
      }

      if (!authData.user) {
        throw new Error('Erro ao criar usuário. Tente novamente.');
      }

      // Inserir dados adicionais na tabela usuarios
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{
          auth_user_id: authData.user.id,
          nome: dados.nome,
          email: dados.email,
          telefone: dados.telefone,
          cargo: 'Administrador', // Primeiro usuário é sempre admin
          senha: dados.senha,
          aprovado: true // Primeiro usuário é aprovado automaticamente
        }])
        .select()
        .single();

      if (error) {
        // Se falhar ao inserir na tabela usuarios, limpar o usuário do Auth
        await supabase.auth.signOut();
        if (error.code === '23505') {
          throw new Error('Este email já está cadastrado no sistema.');
        }
        throw new Error('Erro ao criar usuário. Tente novamente.');
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      console.error('Erro no signup:', error);
      throw new Error('Erro no signup. Tente novamente.');
    }
  };

  const registerManager = async (dados: { nome: string; email: string; telefone: string; creci?: string; senha: string }): Promise<boolean> => {
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: dados.email,
        password: dados.senha,
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new Error('Este email já está cadastrado no sistema.');
        }
        throw new Error('Erro ao registrar gerente. Tente novamente.');
      }

      if (!authData.user) {
        throw new Error('Erro ao registrar gerente. Tente novamente.');
      }

      // Inserir dados adicionais na tabela usuarios
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{
          auth_user_id: authData.user.id,
          nome: dados.nome,
          email: dados.email,
          telefone: dados.telefone,
          cargo: 'Gerente de Produto',
          creci: dados.creci || null,
          senha: dados.senha,
          aprovado: false // Precisa de aprovação
        }])
        .select()
        .single();

      if (error) {
        // Se falhar ao inserir na tabela usuarios, limpar o usuário do Auth
        await supabase.auth.signOut();
        if (error.code === '23505') {
          throw new Error('Este email já está cadastrado no sistema.');
        }
        throw new Error('Erro ao registrar gerente. Tente novamente.');
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      console.error('Erro no registro de gerente:', error);
      throw new Error('Erro no registro de gerente. Tente novamente.');
    }
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      // Verificar credenciais diretamente na tabela usuarios
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('senha', senha)
        .eq('aprovado', true)
        .single();

      if (userError || !userData) {
        return false;
      }

      // Definir usuário manualmente
      const usuario: Usuario = {
        id: userData.id,
        nome: userData.nome,
        email: userData.email,
        telefone: userData.telefone,
        cargo: userData.cargo,
        creci: userData.creci,
        senha: userData.senha,
        foto: userData.foto_url,
        criadoEm: userData.created_at.split('T')[0],
        atualizadoEm: userData.updated_at.split('T')[0],
        aprovado: userData.aprovado,
        dataSolicitacao: userData.data_solicitacao?.split('T')[0] || userData.created_at.split('T')[0],
        aprovadoPor: userData.aprovado_por,
        dataAprovacao: userData.data_aprovacao?.split('T')[0]
      };
      
      setUser(usuario);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (dados: Partial<Usuario>) => {
    if (!user) return;

    try {
      let fotoUrl = dados.foto;

      // Se há uma nova foto em data URL, fazer upload
      if (dados.foto && dados.foto.startsWith('data:')) {
        const response = await fetch(dados.foto);
        const blob = await response.blob();
        const file = new File([blob], `${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        const fileName = `usuarios/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('fotos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('fotos')
          .getPublicUrl(fileName);

        fotoUrl = publicUrl;
      }

      const updateData: any = {
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        cargo: dados.cargo,
        creci: dados.creci,
        foto_url: fotoUrl
      };

      const { data, error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      const usuarioAtualizado: Usuario = {
        ...user,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        cargo: data.cargo,
        creci: data.creci,
        foto: data.foto_url,
        atualizadoEm: data.updated_at.split('T')[0]
      };

      setUser(usuarioAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, registerManager, checkIfFirstUser, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}