import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Usuario, UsuarioFormData } from '../types';

interface UsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dados: UsuarioFormData) => void;
  usuario?: Usuario;
}

export function UsuarioModal({ isOpen, onClose, onSubmit, usuario }: UsuarioModalProps) {
  const [formData, setFormData] = useState<UsuarioFormData>({
    nome: '',
    email: '',
    telefone: '',
    funcao: '',
    creci: '',
    senha: '',
    confirmarSenha: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        funcao: usuario.cargo,
        creci: usuario.creci || '',
        senha: '',
        confirmarSenha: ''
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        funcao: '',
        creci: '',
        senha: '',
        confirmarSenha: ''
      });
    }
    setErrors({});
  }, [usuario, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.funcao) {
      newErrors.funcao = 'Função é obrigatória';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const { confirmarSenha, ...dadosUsuario } = formData;
    onSubmit({
      ...dadosUsuario,
      funcao: formData.funcao
    } as any);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-wrap items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[95vh] overflow-y-auto">
        <div className="flex flex-wrap items-center justify-between p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {usuario ? 'Editar Usuário' : 'Criar Novo Usuário'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="nome" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${
                  errors.nome ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nome do usuário"
              />
              {errors.nome && <p className="mt-1 text-xs text-red-600">{errors.nome}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="usuario@construtoraplaneta.com.br"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="telefone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${
                  errors.telefone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="(11) 99999-9999"
              />
              {errors.telefone && <p className="mt-1 text-xs text-red-600">{errors.telefone}</p>}
            </div>

            <div>
              <label htmlFor="creci" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                CRECI (Opcional)
              </label>
              <input
                type="text"
                id="creci"
                name="creci"
                value={formData.creci}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="CRECI 123456"
              />
            </div>
          </div>

          <div>
            <label htmlFor="funcao" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Função
            </label>
            <select
              id="funcao"
              name="funcao"
              value={formData.funcao}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${
                errors.funcao ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione a função</option>
              <option value="Administrador">Administrador</option>
              <option value="Gerente de Produto">Gerente de Produto</option>
            </select>
            {errors.funcao && <p className="mt-1 text-xs text-red-600">{errors.funcao}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="senha" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${
                  errors.senha ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Digite a senha"
              />
              {errors.senha && <p className="mt-1 text-xs text-red-600">{errors.senha}</p>}
            </div>

            <div>
              <label htmlFor="confirmarSenha" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${
                  errors.confirmarSenha ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirme a senha"
              />
              {errors.confirmarSenha && <p className="mt-1 text-xs text-red-600">{errors.confirmarSenha}</p>}
            </div>
          </div>

          <div className="flex flex-wrap justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-6 lg:px-8 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-xs sm:text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-xs sm:text-sm"
            >
              {usuario ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}