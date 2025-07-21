import React, { useState, useEffect } from 'react';
import { X, Building2 } from 'lucide-react';
import { AtribuicaoEmpreendimento, Empreendimento, Usuario } from '../types';

interface AtribuicaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (gerenteId: string, empreendimentoIds: string[]) => void;
  atribuicao?: AtribuicaoEmpreendimento;
  gerentes: Usuario[];
  empreendimentos: Empreendimento[];
}

export function AtribuicaoModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  atribuicao, 
  gerentes, 
  empreendimentos 
}: AtribuicaoModalProps) {
  const [gerenteSelecionado, setGerenteSelecionado] = useState('');
  const [empreendimentosSelecionados, setEmpreendimentosSelecionados] = useState<string[]>([]);

  useEffect(() => {
    if (atribuicao) {
      setGerenteSelecionado(atribuicao.gerenteId);
      setEmpreendimentosSelecionados(atribuicao.empreendimentos.map(e => e.id));
    } else {
      setGerenteSelecionado('');
      setEmpreendimentosSelecionados([]);
    }
  }, [atribuicao, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gerenteSelecionado) {
      onSubmit(gerenteSelecionado, empreendimentosSelecionados);
      onClose();
    }
  };

  const toggleEmpreendimento = (empId: string) => {
    setEmpreendimentosSelecionados(prev => 
      prev.includes(empId) 
        ? prev.filter(id => id !== empId)
        : [...prev, empId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Estoque':
        return 'bg-blue-100 text-blue-800';
      case 'STAND':
        return 'bg-yellow-10 min-w-[2.5rem]0 text-yellow-800';
      case 'PDV':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-wrap items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex flex-wrap items-center justify-between p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {atribuicao ? 'Editar Atribuição' : 'Nova Atribuição'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="gerente" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Selecionar Gerente
            </label>
            <select
              id="gerente"
              value={gerenteSelecionado}
              onChange={(e) => setGerenteSelecionado(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Selecione um gerente</option>
              {gerentes.map(gerente => (
                <option key={gerente.id} value={gerente.id}>
                  {gerente.nome} - {gerente.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3">
              Empreendimentos Disponíveis
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {empreendimentos.map(emp => (
                <div
                  key={emp.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    empreendimentosSelecionados.includes(emp.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleEmpreendimento(emp.id)}
                >
                  <div className="flex flex-wrap items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={empreendimentosSelecionados.includes(emp.id)}
                      onChange={() => toggleEmpreendimento(emp.id)}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{emp.nome}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{emp.endereco}</p>
                      <span className={`inline-flex flex-wrap items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(emp.status)}`}>
                        {emp.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-6 lg:px-8 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {atribuicao ? 'Atualizar' : 'Atribuir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}