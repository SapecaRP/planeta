import React from 'react';
import { Edit, Trash2, Mail, Phone, CreditCard, Key } from 'lucide-react';
import { Usuario } from '../types';

interface UsuarioCardProps {
  usuario: Usuario;
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: string) => void;
}

export function UsuarioCard({ usuario, onEdit, onDelete }: UsuarioCardProps) {
  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (nome: string) => {
    const colors = [
      'bg-green-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    const index = nome.length % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex flex-wrap items-start justify-between mb-4">
        <div className="flex flex-wrap items-center space-x-3">
          {usuario.foto ? (
            <img 
              src={usuario.foto} 
              alt={usuario.nome}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                // Se a imagem falhar, mostrar iniciais
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallbackDiv = document.createElement('div');
                  fallbackDiv.className = `w-12 h-12 rounded-full flex flex-wrap items-center justify-center text-white font-semibold ${getAvatarColor(usuario.nome)}`;
                  fallbackDiv.textContent = getInitials(usuario.nome);
                  parent.appendChild(fallbackDiv);
                }
              }}
            />
          ) : (
            <div className={`w-12 h-12 rounded-full flex flex-wrap items-center justify-center text-white font-semibold ${getAvatarColor(usuario.nome)}`}>
              {getInitials(usuario.nome)}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{usuario.nome}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{usuario.cargo}</p>
          </div>
        </div>
        <div className="flex flex-wrap space-x-2">
          <button
            onClick={() => onEdit(usuario)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(usuario.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2 text-gray-400" />
          <span>{usuario.email}</span>
        </div>
        
        <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2 text-gray-400" />
          <span>{usuario.telefone}</span>
        </div>

        {usuario.creci && (
          <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600">
            <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
            <span>CRECI: {usuario.creci}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t flex flex-wrap justify-between">
        <button
          onClick={() => onEdit(usuario)}
          className="flex flex-wrap items-center px-3 py-1 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        >
          <Edit className="w-3 h-3 mr-1" />
          Editar
        </button>
        <button
          onClick={() => onDelete(usuario.id)}
          className="flex flex-wrap items-center px-3 py-1 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Excluir
        </button>
      </div>
    </div>
  );
}