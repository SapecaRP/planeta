import React, { useState, useMemo } from 'react';
import { Plus, Lock } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { ContatoCard } from '../components/ContatoCard';
import { ContatoModal } from '../components/ContatoModal';
import { useContatos } from '../hooks/useContatos';
import { useAuth } from '../contexts/AuthContext';
import { Contato, ContatoFormData } from '../types';

export function ContatosPage() {
  const { user } = useAuth();
  const { contatos, loading, criarContato, atualizarContato, excluirContato } = useContatos();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContato, setEditingContato] = useState<Contato | undefined>();
  const [filtroTipo, setFiltroTipo] = useState<string>('');

  const isAdmin = user?.cargo === 'Administrador';

  const contatosFiltrados = useMemo(() => {
    return contatos.filter(contato => {
      const matchesSearch = contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contato.telefone.includes(searchTerm);
      const matchesTipo = !filtroTipo || contato.tipoServico === filtroTipo;
      return matchesSearch && matchesTipo;
    });
  }, [contatos, searchTerm, filtroTipo]);

  const tiposServico = ['Manutenção', 'Limpeza', 'Elétrica', 'Hidráulica', 'Pintura', 'Jardinagem', 'Segurança', 'Outros'];

  const handleCreateNew = () => {
    setEditingContato(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (contato: Contato) => {
    setEditingContato(contato);
    setIsModalOpen(true);
  };

  const handleSubmit = (dados: ContatoFormData) => {
    if (editingContato) {
      atualizarContato(editingContato.id, dados);
    } else {
      criarContato(dados);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      excluirContato(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'Contatos' : 'Contatos (Somente Visualização)'}
          </h1>
          {isAdmin ? (
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Contato
            </button>
          ) : (
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 rounded-md">
              <Lock className="w-4 h-4 mr-2" />
              Somente Visualização
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar contatos..."
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Todos os Tipos</option>
              {tiposServico.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {contatosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm || filtroTipo ? 'Nenhum contato encontrado com os filtros aplicados' : 'Nenhum contato cadastrado'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {contatosFiltrados.map((contato) => (
            <ContatoCard
              key={contato.id}
              contato={contato}
              onEdit={isAdmin ? handleEdit : undefined}
              onDelete={isAdmin ? handleDelete : undefined}
              readOnly={!isAdmin}
            />
          ))}
        </div>
      )}

      <ContatoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        contato={editingContato}
      />
    </main>
  );
}