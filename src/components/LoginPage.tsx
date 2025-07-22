import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { login, signup, checkIfFirstUser } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [modoCadastro, setModoCadastro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [isFirstUser, setIsFirstUser] = useState(false);

  useEffect(() => {
    const verificarPrimeiroUsuario = async () => {
      const primeiro = await checkIfFirstUser();
      setIsFirstUser(primeiro);
      if (primeiro) setModoCadastro(true);
    };
    verificarPrimeiroUsuario();
  }, [checkIfFirstUser]);

  const handleLogin = async () => {
    setLoading(true);
    setErro('');
    try {
      await login(email, senha);
    } catch (err: any) {
      setErro(err.message || 'Erro ao fazer login');
    }
    setLoading(false);
  };

  const handleCadastro = async () => {
    setLoading(true);
    setErro('');
    try {
      await signup(email, senha, nome, isFirstUser ? 'Administrador' : 'Gerente de Produto');
    } catch (err: any) {
      setErro(err.message || 'Erro ao cadastrar');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-800 to-green-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-green-700">
          {modoCadastro ? 'Criar Conta' : 'Entrar no Sistema'}
        </h2>

        {modoCadastro && (
          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        )}

        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

        <button
          onClick={modoCadastro ? handleCadastro : handleLogin}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition-all"
          disabled={loading}
        >
          {loading
            ? 'Aguarde...'
            : modoCadastro
            ? 'Cadastrar'
            : 'Entrar'}
        </button>

        {!isFirstUser && (
          <p className="text-sm text-center">
            {modoCadastro ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
            <button
              onClick={() => setModoCadastro(!modoCadastro)}
              className="text-green-700 font-semibold hover:underline"
            >
              {modoCadastro ? 'Entrar' : 'Cadastrar'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
