import React from 'react';
import { Edit, Trash2, MapPin, Calendar } from 'lucide-react';
import { Empreendimento } from '../types';

interface EmpreendimentoCardProps {
  empreendimento: Empreendimento;
  onEdit?: (empreendimento: Empreendimento) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

export function EmpreendimentoCard({ empreendimento, onEdit, onDelete, readOnly = false }: EmpreendimentoCardProps) {
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

  console.log('Empreendimento foto:', empreendimento.foto); // Debug
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {empreendimento.foto && (
        <div className="h-48 overflow-hidden">
          <img 
            src={empreendimento.foto} 
            alt={empreendimento.nome}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Erro ao carregar imagem:', empreendimento.foto);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{empreendimento.nome}</h3>
            <div className="flex flex-wrap items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-xs sm:text-sm">{empreendimento.endereco}</span>
            </div>
            <span className={`inline-flex flex-wrap items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(empreendimento.status)}`}>
              {empreendimento.status}
            </span>
          </div>
          {!readOnly && (
            <div className="flex flex-wrap space-x-2 ml-4">
              {onEdit && (
                <button
                  onClick={() => onEdit(empreendimento)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(empreendimento.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">INFORMAÇÕES:</h4>
          <div className="text-xs sm:text-sm text-gray-600 whitespace-pre-line">
            {empreendimento.informacoes}
          </div>
          <div className="flex flex-wrap items-center text-xs text-gray-500 mt-3">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Criado em {new Date(empreendimento.criadoEm).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}