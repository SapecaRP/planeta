import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  foto?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, nome: string, cargo: string) => Promise<void>;
  registerManager: (userId: string, nome: string, email: string) => Promise<void>;
  checkIfFirstUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error(error);
      if (data?.session) {
        await fetchUserProfile(data.session.user.id);
      }
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase.from('usuarios').select('*').eq('id', userId).single();
    if (error) {
      console.error('Erro ao buscar perfil:', error);
    } else {
      setUser(data);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) await fetchUserProfile(data.user.id);
    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const signup = async (email: string, password: string, nome: string, cargo: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      await supabase.from('usuarios').insert({
        id: data.user.id,
        nome,
        email,
        cargo,
      });
      await fetchUserProfile(data.user.id);
    }
    setLoading(false);
  };

  const registerManager = async (userId: string, nome: string, email: string) => {
    const { error } = await supabase.from('usuarios').insert({
      id: userId,
      nome,
      email,
      cargo: 'Gerente de Produto',
    });
    if (error) throw error;
  };

  const checkIfFirstUser = async () => {
    const { data, error, count } = await supabase
      .from('usuarios')
      .select('id', { count: 'exact', head: true });

    if (error) {
      console.error('Erro ao verificar usuários:', error);
      return false;
    }

    return count === 0;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
        registerManager,
        checkIfFirstUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
