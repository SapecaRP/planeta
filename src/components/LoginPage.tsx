import React, { useState } from 'react';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [creci, setCreci] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [isManagerSignup, setIsManagerSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { login, signup, checkIfFirstUser, registerManager } = useAuth();

  React.useEffect(() => {
    // Verificar se é o primeiro usuário
    checkIfFirstUser().then(isFirst => {
      setIsSignup(isFirst);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isSignup) {
       await signup({ nome, email, telefone, senha });
      } else if (isManagerSignup) {
       await registerManager({ nome, email, telefone, creci, senha });
       setSuccessMessage('Solicitação enviada! Aguarde a aprovação do administrador.');
       setIsManagerSignup(false);
       // Limpar formulário
       setNome('');
       setEmail('');
       setTelefone('');
       setCreci('');
       setSenha('');
      } else {
        const success = await login(email, senha);
        if (!success) {
          setError('Email ou senha incorretos, ou conta ainda não aprovada.');
        }
      }
    } catch (error) {
     if (error instanceof Error && error.message) {
       setError(error.message);
     } else {
      if (isSignup) {
        setError('Erro ao criar usuário. Tente novamente.');
      } else if (isManagerSignup) {
        setError('Erro ao enviar solicitação. Tente novamente.');
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
     }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleManagerSignup = () => {
    setIsManagerSignup(!isManagerSignup);
    setError('');
    setSuccessMessage('');
    // Limpar campos
    setNome('');
    setEmail('');
    setTelefone('');
    setCreci('');
    setSenha('');
  };
  return (
    <div className="min-h-screen flex flex-wrap items-center justify-center p-4" style={{ backgroundColor: 'rgba(22,117,58,255)' }}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="flex flex-wrap items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-xl flex flex-wrap items-center justify-center shadow-lg p-2">
              <img 
                src="/OLC.jpeg" 
                alt="Construtora Planeta Logo" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Construtora Planeta</h1>
          <p className="text-gray-600 mt-2">
            {isSignup ? 'Criar Admin Master' : 
             isManagerSignup ? 'Solicitar Acesso - Gerente' : 'Gestão de Produtos'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {(isSignup || isManagerSignup) && (
            <>
              <div>
                <label htmlFor="nome" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="telefone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="(11) 99999-9999"
                />
              </div>

              {isManagerSignup && (
                <div>
                  <label htmlFor="creci" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    CRECI (Opcional)
                  </label>
                  <input
                    type="text"
                    id="creci"
                    value={creci}
                    onChange={(e) => setCreci(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="CRECI 123456"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex flex-wrap items-center"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-xs sm:text-sm text-green-600">{successMessage}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-xs sm:text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 sm:px-6 lg:px-8 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 
              (isSignup ? 'Criando...' : isManagerSignup ? 'Enviando...' : 'Entrando...') : 
              (isSignup ? 'Criar Admin Master' : isManagerSignup ? 'Solicitar Acesso' : 'Entrar')
            }
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
          {!isSignup && (
            <div className="text-center">
              <button
                onClick={handleToggleManagerSignup}
                className="text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium"
              >
                {isManagerSignup ? 'Voltar ao Login' : 'Sou Gerente - Solicitar Acesso'}
              </button>
            </div>
          )}
          
          <p className="text-xs text-gray-500 text-center">
            {isSignup 
              ? 'Você será o primeiro usuário e terá privilégios de administrador.' 
              : isManagerSignup
              ? 'Sua solicitação será analisada pelo administrador.'
              : 'Para acessar o sistema, use suas credenciais ou solicite acesso como gerente.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}