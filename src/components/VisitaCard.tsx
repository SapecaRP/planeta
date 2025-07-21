import React from 'react';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { Visita } from '../types';

interface VisitaCardProps {
  visita: Visita;
  onEdit?: (visita: Visita) => void;
  onDelete?: (id: string) => void;
  onMarkAsCompleted?: (id: string) => void;
}

export function VisitaCard({ visita, onEdit, onDelete, onMarkAsCompleted }: VisitaCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada':
        return 'text-blue-600';
      case 'realizada':
        return 'text-green-600';
      case 'cancelada':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'agendada':
        return 'agendada';
      case 'realizada':
        return 'realizada';
      case 'cancelada':
        return 'cancelada';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-start justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center space-x-2 mb-2">
            <User className="w-4 h-4 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900">{visita.corretor}</h3>
          </div>
          
          <div className="flex flex-wrap items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-blue-600 font-medium">{visita.empreendimento}</span>
          </div>
          
          <div className="flex flex-wrap items-center space-x-4 text-xs sm:text-sm text-gray-600">
            <div className="flex flex-wrap items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(visita.data)}</span>
            </div>
            <div className="flex flex-wrap items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>às {visita.horario}</span>
            </div>
          </div>
        </div>
        
        <div className="ml-4">
          <span className={`text-xs sm:text-sm font-medium ${getStatusColor(visita.status)}`}>
            {getStatusText(visita.status)}
          </span>
        </div>
      </div>
      
      {visita.status === 'agendada' && onMarkAsCompleted && (
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => onMarkAsCompleted(visita.id)}
            className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Marcar como Realizada
          </button>
        </div>
      )}
    </div>
  );
}