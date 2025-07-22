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
    const carregarUsuario = async () => {
      const { data: sessionData, error } = await supabase.auth.getUser();
      if (error || !sessionData?.user) {
        setLoading(false);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', sessionData.user.id)
        .single();

      if (userData && !userError) {
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
      }

      setLoading(false);
    };

    carregarUsuario();
  }, []);

  const checkIfFirstUser = async (): Promise<boolean> => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id')
      .limit(1);
    return !error && data.length === 0;
  };

  const signup = async (dados: { nome: string; email: string; telefone: string; senha: string }): Promise<boolean> => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: dados.email,
      password: dados.senha
    });

    if (authError || !authData.user) throw new Error('Erro ao criar usuário');

    const { error } = await supabase
      .from('usuarios')
      .insert([{
        auth_user_id: authData.user.id,
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        cargo: 'Administrador',
        senha: dados.senha,
        aprovado: true
      }]);

    if (error) {
      await supabase.auth.signOut();
      throw error;
    }

    return true;
  };

  const registerManager = async (dados: { nome: string; email: string; telefone: string; creci?: string; senha: string }): Promise<boolean> => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: dados.email,
      password: dados.senha
    });

    if (authError || !authData.user) throw new Error('Erro ao registrar gerente');

    const { error } = await supabase
      .from('usuarios')
      .insert([{
        auth_user_id: authData.user.id,
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        cargo: 'Gerente de Produto',
        creci: dados.creci || null,
        senha: dados.senha,
        aprovado: false
      }]);

    if (error) {
      await supabase.auth.signOut();
      throw error;
    }

    return true;
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .eq('senha', senha)
      .eq('aprovado', true)
      .single();

    if (userError || !userData) return false;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    if (authError || !authData.user) return false;

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
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (dados: Partial<Usuario>) => {
    if (!user) return;

    let fotoUrl = dados.foto;

    if (dados.foto && dados.foto.startsWith('data:')) {
      const response = await fetch(dados.foto);
      const blob = await response.blob();
      const file = new File([blob], `${Date.now()}.jpg`, { type: 'image/jpeg' });

      const fileName = `usuarios/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fotos')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('fotos').getPublicUrl(fileName);
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
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      registerManager,
      checkIfFirstUser,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}
