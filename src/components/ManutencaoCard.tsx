import React, { useState } from 'react';
import { Edit, Trash2, Eye, Calendar, User, CheckCircle, Image } from 'lucide-react';
import { Manutencao } from '../types';

interface ManutencaoCardProps {
  manutencao: Manutencao;
  onEdit: (manutencao: Manutencao) => void;
  onDelete: (id: string) => void;
  onView: (manutencao: Manutencao) => void;
  onComplete?: (id: string) => void;
}

export function ManutencaoCard({ manutencao, onEdit, onDelete, onView, onComplete }: ManutencaoCardProps) {
  const [imagemAberta, setImagemAberta] = useState<string | null>(null);

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-10 min-w-[2.5rem]0 text-yellow-800';
      case 'alta': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-orange-100 text-orange-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border-l-4 border-l-blue-500">
        <div className="flex flex-wrap items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{manutencao.empreendimento}</h3>
              <span className={`inline-flex flex-wrap items-center px-2 py-1 rounded-full text-xs font-medium ${getPrioridadeColor(manutencao.prioridade)}`}>
                {manutencao.prioridade}
              </span>
              <span className={`inline-flex flex-wrap items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(manutencao.status)}`}>
                {manutencao.status}
              </span>
            </div>
            <p className="text-blue-600 text-xs sm:text-sm mb-3 hover:text-blue-800 cursor-pointer" onClick={() => onView(manutencao)}>
              {manutencao.descricao}
            </p>
          </div>
          <div className="flex flex-wrap space-x-1 ml-4">
            <button onClick={() => onView(manutencao)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Visualizar">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={() => onEdit(manutencao)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(manutencao.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          {/* Fotos da manutenção */}
          {manutencao.fotos && manutencao.fotos.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap items-center mb-2">
                <Image className="w-4 h-4 mr-1 text-gray-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Fotos ({manutencao.fotos.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {manutencao.fotos.slice(0, 3).map((foto, index) => (
                  <div key={index} className="relative">
                    <img
                      src={foto}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-16 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setImagemAberta(foto)}
                    />
                    {index === 2 && manutencao.fotos.length > 3 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex flex-wrap items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          +{manutencao.fotos.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-gray-600">
            <div className="flex flex-wrap items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Criado: {formatDate(manutencao.criadoEm)}</span>
            </div>
          </div>

          {manutencao.concluidoEm && (
            <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              <span>Concluído: {formatDate(manutencao.concluidoEm)}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600">
            <User className="w-4 h-4 mr-1" />
            <span>Gerente: {manutencao.gerente}</span>
          </div>

          {manutencao.status === 'pendente' && onComplete && (
            <div className="pt-2">
              <button
                onClick={() => onComplete(manutencao.id)}
                className="w-full bg-green-600 text-white py-2 px-4 sm:px-6 lg:px-8 rounded-md hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium"
              >
                Marcar como Concluída
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de visualização da imagem */}
      {imagemAberta && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-wrap items-center justify-center z-50 p-4" onClick={() => setImagemAberta(null)}>
          <img src={imagemAberta} alt="Imagem ampliada" className="max-w-full max-h-full rounded-lg shadow-lg" />
        </div>
      )}
    </>
  );
}
