import React, { useState } from 'react';
import { Edit, User, Building2, X, Plus } from 'lucide-react';
import { AtribuicaoEmpreendimento, Empreendimento } from '../types';

interface AtribuicaoCardProps {
  atribuicao: AtribuicaoEmpreendimento;
  onEdit: (atribuicao: AtribuicaoEmpreendimento) => void;
  onSave: (gerenteId: string, empreendimentoIds: string[]) => void;
  empreendimentosDisponiveis: Empreendimento[];
}

export function AtribuicaoCard({ atribuicao, onEdit, onSave, empreendimentosDisponiveis }: AtribuicaoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [empreendimentosSelecionados, setEmpreendimentosSelecionados] = useState<string[]>(
    atribuicao.empreendimentos.map(e => e.id)
  );
  const [novoEmpreendimento, setNovoEmpreendimento] = useState('');

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

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEmpreendimentosSelecionados(atribuicao.empreendimentos.map(e => e.id));
  };

  const handleSave = () => {
    onSave(atribuicao.gerenteId, empreendimentosSelecionados);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEmpreendimentosSelecionados(atribuicao.empreendimentos.map(e => e.id));
    setNovoEmpreendimento('');
  };

  const removeEmpreendimento = (empId: string) => {
    setEmpreendimentosSelecionados(prev => prev.filter(id => id !== empId));
  };

  const addEmpreendimento = () => {
    if (novoEmpreendimento && !empreendimentosSelecionados.includes(novoEmpreendimento)) {
      setEmpreendimentosSelecionados(prev => [...prev, novoEmpreendimento]);
      setNovoEmpreendimento('');
    }
  };

  const empreendimentosAtribuidos = empreendimentosDisponiveis.filter(emp => 
    empreendimentosSelecionados.includes(emp.id)
  );

  const empreendimentosNaoAtribuidos = empreendimentosDisponiveis.filter(emp => 
    !empreendimentosSelecionados.includes(emp.id)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-wrap items-start justify-between mb-4">
        <div className="flex flex-wrap items-center space-x-3">
          <div className="w-10 min-w-[2.5rem] h-10 bg-green-500 rounded-full flex flex-wrap items-center justify-center text-white font-semibold">
            {getInitials(atribuicao.gerenteNome)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{atribuicao.gerenteNome}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{atribuicao.gerenteEmail}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex flex-wrap items-center px-3 py-1 text-xs sm:text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="flex flex-wrap items-center px-3 py-1 text-xs sm:text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="flex flex-wrap items-center px-3 py-1 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </button>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex flex-wrap items-center mb-3">
          <Building2 className="w-4 h-4 text-gray-500 mr-2" />
          <h4 className="text-xs sm:text-sm font-medium text-gray-900">
            Empreendimentos Atribuídos ({empreendimentosAtribuidos.length})
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {empreendimentosAtribuidos.map((emp) => (
            <div key={emp.id} className="bg-gray-50 rounded-lg p-3 relative">
              {isEditing && (
                <button
                  onClick={() => removeEmpreendimento(emp.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <h5 className="font-medium text-gray-900 mb-1 pr-6">{emp.nome}</h5>
              <span className={`inline-flex flex-wrap items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emp.status)}`}>
                {emp.status}
              </span>
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="border-t pt-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Adicionar Empreendimento
            </label>
            <div className="flex flex-wrap space-x-2">
              <select
                value={novoEmpreendimento}
                onChange={(e) => setNovoEmpreendimento(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Selecione um empreendimento</option>
                {empreendimentosNaoAtribuidos.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nome} - {emp.status}
                  </option>
                ))}
              </select>
              <button
                onClick={addEmpreendimento}
                disabled={!novoEmpreendimento}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {empreendimentosNaoAtribuidos.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-2">Empreendimentos disponíveis:</div>
                <div className="flex flex-wrap flex-wrap gap-1">
                  {empreendimentosNaoAtribuidos.slice(0, 3).map(emp => (
                    <button
                      key={emp.id}
                      onClick={() => setNovoEmpreendimento(emp.id)}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                    >
                      {emp.nome}
                    </button>
                  ))}
                  {empreendimentosNaoAtribuidos.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{empreendimentosNaoAtribuidos.length - 3} mais
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {empreendimentosAtribuidos.length === 0 && (
          <p className="text-gray-500 text-xs sm:text-sm">Nenhum empreendimento atribuído</p>
        )}
      </div>
    </div>
  );
}