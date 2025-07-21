import React from 'react';
import { Building2, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateNew: () => void;
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Nenhum empreendimento encontrado
      </h3>
      <p className="text-gray-500 mb-6">
        Comece criando seu primeiro empreendimento para gerenciar seu portfólio.
      </p>
      <button
        onClick={onCreateNew}
        className="inline-flex flex-wrap items-center px-4 sm:px-6 lg:px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        Criar Primeiro Empreendimento
      </button>
    </div>
  );
}