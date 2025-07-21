import React from 'react';
import { Edit, Trash2, Phone, MessageCircle } from 'lucide-react';
import { Contato } from '../types';

interface ContatoCardProps {
  contato: Contato;
  onEdit?: (contato: Contato) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

export function ContatoCard({ contato, onEdit, onDelete, readOnly = false }: ContatoCardProps) {
  const getTipoServicoColor = (tipo: string) => {
    switch (tipo) {
      case 'Manutenção':
        return 'bg-blue-100 text-blue-800';
      case 'Limpeza':
        return 'bg-green-100 text-green-800';
      case 'Elétrica':
        return 'bg-yellow-10 min-w-[2.5rem]0 text-yellow-800';
      case 'Hidráulica':
        return 'bg-cyan-100 text-cyan-800';
      case 'Pintura':
        return 'bg-purple-100 text-purple-800';
      case 'Jardinagem':
        return 'bg-emerald-100 text-emerald-800';
      case 'Segurança':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPhoneForWhatsApp = (phone: string) => {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    // Adiciona código do país se não tiver
    return cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  };

  const openWhatsApp = () => {
    const whatsappPhone = formatPhoneForWhatsApp(contato.telefone);
    const message = encodeURIComponent(`Olá ${contato.nome}, entrei em contato através do sistema da Construtora Planeta.`);
    window.open(`https://wa.me/${whatsappPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4">
      <div className="flex flex-wrap items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{contato.nome}</h3>
          <div className="flex flex-wrap items-center text-gray-600 mb-2">
            <Phone className="w-4 h-4 mr-1" />
            <span className="text-xs sm:text-sm">{contato.telefone}</span>
          </div>
          <span className={`inline-flex flex-wrap items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoServicoColor(contato.tipoServico)}`}>
            {contato.tipoServico}
          </span>
        </div>
        {!readOnly && (
          <div className="flex flex-wrap space-x-1 ml-2">
            {onEdit && (
              <button
                onClick={() => onEdit(contato)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(contato.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="border-t pt-3">
        <button
          onClick={openWhatsApp}
          className="w-full bg-green-600 text-white py-2 px-4 sm:px-6 lg:px-8 rounded-md hover:bg-green-700 transition-colors flex flex-wrap items-center justify-center space-x-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
}