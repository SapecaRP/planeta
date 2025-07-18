import React, { useState, useMemo } from 'react';
import { Plus, Clock, Check, X } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { UsuarioCard } from '../components/UsuarioCard';
import { UsuarioModal } from '../components/UsuarioModal';
import { usuarioService } from '../services/usuarioService';
import { useUsuarios } from '../hooks/useUsuarios';
import { useAuth } from '../contexts/AuthContext';
import { Usuario, UsuarioFormData } from '../types';

export function UsuariosPage() {
  const { usuarios, loading, criarUsuario, atualizarUsuario, excluirUsuario } = useUsuarios();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | undefined>();
  const [pendingUsers, setPendingUsers] = useState<Usuario[]>([]);
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
  const [loadingPending, setLoadingPending] = useState(false);

  // Carregar usuários pendentes
  React.useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    try {
      setLoadingPending(true);
      const pending = await usuarioService.buscarPendentes();
      setPendingUsers(pending);
    } catch (error) {
      console.error('Erro ao carregar usuários pendentes:', error);
    } finally {
      setLoadingPending(false);
    }
  };
  const usuariosFiltrados = useMemo(() => {
    const listaUsuarios = activeTab === 'approved' ? usuarios : pendingUsers;
    return listaUsuarios.filter(usuario =>
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.cargo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [usuarios, pendingUsers, searchTerm, activeTab]);

  const handleCreateNew = () => {
    setEditingUsuario(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleSubmit = (dados: UsuarioFormData) => {
    if (editingUsuario) {
      atualizarUsuario(editingUsuario.id, {
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        cargo: dados.funcao,
        creci: dados.creci,
        senha: dados.senha
      });
    } else {
      criarUsuario(dados);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      excluirUsuario(id);
    }
  };

  const handleApprove = async (id: string) => {
    if (!user) return;
    
    try {
      await usuarioService.aprovar(id, user.id);
      await loadPendingUsers();
      // Recarregar usuários aprovados também
      window.location.reload();
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error);
      alert('Erro ao aprovar usuário');
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm('Tem certeza que deseja rejeitar esta solicitação?')) {
      try {
        await usuarioService.rejeitar(id);
        await loadPendingUsers();
      } catch (error) {
        console.error('Erro ao rejeitar usuário:', error);
        alert('Erro ao rejeitar usuário');
      }
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
              Gestão de Usuários
            </h1>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Usuários Aprovados ({usuarios.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-md font-medium transition-colors relative ${
                activeTab === 'pending'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Clock className="w-4 h-4 mr-2 inline" />
              Pendentes de Aprovação ({pendingUsers.length})
              {pendingUsers.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingUsers.length}
                </span>
              )}
            </button>
          </div>
          <div className="max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={activeTab === 'approved' ? "Buscar usuários..." : "Buscar solicitações..."}
            />
          </div>
        </div>

        {usuariosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? 
                `Nenhum ${activeTab === 'approved' ? 'usuário' : 'solicitação'} encontrado para "${searchTerm}"` : 
                activeTab === 'approved' ? 'Nenhum usuário cadastrado' : 'Nenhuma solicitação pendente'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usuariosFiltrados.map((usuario) => (
              activeTab === 'approved' ? (
                <UsuarioCard
                  key={usuario.id}
                  usuario={usuario}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ) : (
                <PendingUserCard
                  key={usuario.id}
                  usuario={usuario}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              )
            ))}
          </div>
        )}

      <UsuarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        usuario={editingUsuario}
      />
    </main>
  );
}

function PendingUserCard({ 
  usuario, 
  onApprove, 
  onReject 
}: { 
  usuario: Usuario; 
  onApprove: (id: string) => void; 
  onReject: (id: string) => void; 
}) {
  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (nome: string) => {
    const colors = [
      'bg-orange-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    const index = nome.length % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border-l-4 border-l-orange-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(usuario.nome)}`}>
            {getInitials(usuario.nome)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{usuario.nome}</h3>
            <p className="text-sm text-gray-600">{usuario.cargo}</p>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1">
              <Clock className="w-3 h-3 mr-1" />
              Pendente
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Email:</span>
          <span className="ml-2">{usuario.email}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Telefone:</span>
          <span className="ml-2">{usuario.telefone}</span>
        </div>

        {usuario.creci && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">CRECI:</span>
            <span className="ml-2">{usuario.creci}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Solicitado em:</span>
          <span className="ml-2">{new Date(usuario.dataSolicitacao).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onApprove(usuario.id)}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Check className="w-4 h-4" />
          <span>Aprovar</span>
        </button>
        <button
          onClick={() => onReject(usuario.id)}
          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Rejeitar</span>
        </button>
      </div>
    </div>
  );
}