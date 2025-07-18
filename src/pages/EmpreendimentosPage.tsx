import React, { useState, useMemo } from 'react';
import { Plus, Lock, Building2, MapPin, Package, Eye } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { EmpreendimentoCard } from '../components/EmpreendimentoCard';
import { EmpreendimentoModal } from '../components/EmpreendimentoModal';
import { VisitaModal } from '../components/VisitaModal';
import { ManutencaoModal } from '../components/ManutencaoModal';
import { EmptyState } from '../components/EmptyState';
import { useEmpreendimentos } from '../hooks/useEmpreendimentos';
import { useAtribuicoes } from '../hooks/useAtribuicoes';
import { useVisitas } from '../hooks/useVisitas';
import { useManutencoes } from '../hooks/useManutencoes';
import { useAuth } from '../contexts/AuthContext';
import { Empreendimento, EmpreendimentoFormData } from '../types';

export function EmpreendimentosPage() {
  const { user } = useAuth();
  const { empreendimentos, loading, criarEmpreendimento, atualizarEmpreendimento, excluirEmpreendimento } = useEmpreendimentos();
  const { atribuicoes, loading: loadingAtribuicoes } = useAtribuicoes();
  const { criarVisita } = useVisitas();
  const { criarManutencao } = useManutencoes();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisitaModalOpen, setIsVisitaModalOpen] = useState(false);
  const [isManutencaoModalOpen, setIsManutencaoModalOpen] = useState(false);
  const [selectedEmpreendimento, setSelectedEmpreendimento] = useState('');
  const [editingEmpreendimento, setEditingEmpreendimento] = useState<Empreendimento | undefined>();

  const isAdmin = user?.cargo === 'Administrador';

  // Para gerentes, filtrar apenas empreendimentos atribuídos
  const empreendimentosPermitidos = useMemo(() => {
    if (isAdmin) {
      return empreendimentos;
    }
    
    if (loadingAtribuicoes) {
      return [];
    }
    
    // Encontrar atribuições do gerente logado
    const minhaAtribuicao = atribuicoes.find(a => a.gerenteId === user?.id);
    if (!minhaAtribuicao) {
      return [];
    }
    
    // Filtrar apenas empreendimentos atribuídos
    const idsAtribuidos = minhaAtribuicao.empreendimentos.map(e => e.id);
    return empreendimentos.filter(emp => idsAtribuidos.includes(emp.id));
  }, [empreendimentos, atribuicoes, user?.id, isAdmin, loadingAtribuicoes]);

  const empreendimentosFiltrados = useMemo(() => {
    return empreendimentosPermitidos.filter(empreendimento =>
      empreendimento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empreendimento.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empreendimento.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [empreendimentosPermitidos, searchTerm]);

  const handleCreateNew = () => {
    setEditingEmpreendimento(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (empreendimento: Empreendimento) => {
    setEditingEmpreendimento(empreendimento);
    setIsModalOpen(true);
  };

  const handleSubmit = (dados: EmpreendimentoFormData) => {
    console.log('Dados sendo salvos:', dados); // Debug
    if (editingEmpreendimento) {
      atualizarEmpreendimento(editingEmpreendimento.id, dados);
    } else {
      criarEmpreendimento(dados);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este empreendimento?')) {
      excluirEmpreendimento(id);
    }
  };

  const handleCriarManutencao = (empreendimento: string) => {
    setSelectedEmpreendimento(empreendimento);
    setIsManutencaoModalOpen(true);
  };

  const handleAgendarVisita = (empreendimento: string) => {
    setSelectedEmpreendimento(empreendimento);
    setIsVisitaModalOpen(true);
  };

  const handleSubmitVisita = (dados: any) => {
    criarVisita(dados);
    alert('Visita agendada com sucesso!');
  };

  const handleSubmitManutencao = (dados: any) => {
    criarManutencao({
      ...dados,
      gerente: user?.nome || ''
    });
    alert('Solicitação de manutenção criada com sucesso!');
  };

  if (loading || loadingAtribuicoes) {
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
            {isAdmin ? 'Gestão de Empreendimentos' : 'Meus Empreendimentos'}
          </h1>
          {isAdmin ? (
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Empreendimento
            </button>
          ) : (
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 rounded-md">
              <Lock className="w-4 h-4 mr-2" />
              Somente Visualização
            </div>
          )}
        </div>

        <div className="max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar empreendimentos..."
          />
        </div>
      </div>

      {empreendimentosFiltrados.length === 0 ? (
        searchTerm ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Nenhum empreendimento encontrado para "{searchTerm}"
            </p>
          </div>
        ) : (
          isAdmin ? (
            <EmptyState onCreateNew={handleCreateNew} />
          ) : (
            <div className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum empreendimento atribuído
              </h3>
              <p className="text-gray-500">
                Entre em contato com o administrador para ter empreendimentos atribuídos.
              </p>
            </div>
          )
        )
      ) : (
        isAdmin ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {empreendimentosFiltrados.map((empreendimento) => (
              <EmpreendimentoCard
                key={empreendimento.id}
                empreendimento={empreendimento}
                onEdit={handleEdit}
                onDelete={handleDelete}
                readOnly={false}
              />
            ))}
          </div>
        ) : (
          /* Layout de cards para gerentes */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {empreendimentosFiltrados.map((empreendimento) => (
              <div key={empreendimento.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Área da imagem */}
                <div className="h-48 overflow-hidden bg-gray-200">
                  {empreendimento.foto ? (
                    <img 
                      src={empreendimento.foto} 
                      alt={empreendimento.nome}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gray-200">
                              <div class="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
                                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-500" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Conteúdo do card */}
                <div className="p-4">
                  {/* Status badge */}
                  <div className="flex justify-end mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      empreendimento.status === 'Estoque' ? 'bg-blue-100 text-blue-800' :
                      empreendimento.status === 'STAND' ? 'bg-yellow-100 text-yellow-800' :
                      empreendimento.status === 'PDV' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {empreendimento.status}
                    </span>
                  </div>
                  
                  {/* Nome do empreendimento */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{empreendimento.nome}</h3>
                  
                  {/* Endereço */}
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{empreendimento.endereco}</span>
                  </div>
                  
                  {/* Informações do empreendimento */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">INFORMAÇÕES DO EMPREENDIMENTO</h4>
                    <div className="text-sm text-gray-600">
                      {empreendimento.informacoes ? (
                        <p className="line-clamp-3">{empreendimento.informacoes}</p>
                      ) : (
                        <div className="space-y-1">
                          <p>Apartamentos modernos</p>
                          <p>Localização privilegiada</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCriarManutencao(empreendimento.nome)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
                    >
                      <Package className="w-4 h-4" />
                      <span>Manutenção</span>
                    </button>
                    <button
                      onClick={() => handleAgendarVisita(empreendimento.nome)}
                      className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Visitas</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {isAdmin && (
        <EmpreendimentoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          empreendimento={editingEmpreendimento}
        />
      )}

      <VisitaModal
        isOpen={isVisitaModalOpen}
        onClose={() => setIsVisitaModalOpen(false)}
        onSubmit={handleSubmitVisita}
        empreendimento={selectedEmpreendimento}
      />

      <ManutencaoModal
        isOpen={isManutencaoModalOpen}
        onClose={() => setIsManutencaoModalOpen(false)}
        onSubmit={handleSubmitManutencao}
        empreendimento={selectedEmpreendimento}
      />
    </main>
  );
}