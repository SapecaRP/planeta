import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Plus } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { ManutencaoCard } from '../components/ManutencaoCard';
import { StatCard } from '../components/StatCard';
import { useManutencoes } from '../hooks/useManutencoes';
import { useAuth } from '../contexts/AuthContext';
import { useAtribuicoes } from '../hooks/useAtribuicoes';
import { Manutencao, ManutencaoFormData } from '../types';
import { ManutencaoModal } from '../components/ManutencaoModal';

export function ManutencoesPage() {
  const { user } = useAuth();
  const {
    manutencoes,
    loading,
    concluirManutencao,
    excluirManutencao,
    carregarManutencoes,
    criarManutencao,
  } = useManutencoes();
  const { atribuicoes, loading: loadingAtribuicoes } = useAtribuicoes();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEmpreendimento, setFiltroEmpreendimento] = useState('');
  const [filtroGerente, setFiltroGerente] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = user?.cargo === 'Administrador';

  useEffect(() => {
    carregarManutencoes();
  }, []);

  const minhaAtribuicao = useMemo(() => atribuicoes.find(a => a.gerenteId === user?.id), [atribuicoes, user?.id]);
  const meusEmpreendimentos = useMemo(() => minhaAtribuicao?.empreendimentos || [], [minhaAtribuicao]);

  const manutencoesPermitidas = useMemo(() => {
    if (isAdmin) return manutencoes;
    if (loadingAtribuicoes) return [];

    const nomesEmpreendimentosAtribuidos = meusEmpreendimentos.map(e => e.nome);
    return manutencoes.filter(m => nomesEmpreendimentosAtribuidos.includes(m.empreendimento));
  }, [manutencoes, meusEmpreendimentos, isAdmin, loadingAtribuicoes]);

  const manutencoesFiltradas = useMemo(() => {
    return manutencoesPermitidas.filter(manutencao => {
      const matchesSearch = manutencao.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manutencao.empreendimento.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEmpreendimento = !filtroEmpreendimento || manutencao.empreendimento === filtroEmpreendimento;
      const matchesGerente = !filtroGerente || manutencao.gerente === filtroGerente;
      const matchesStatus = !filtroStatus || manutencao.status === filtroStatus;
      const matchesData = !filtroData || manutencao.criadoEm === filtroData;

      return matchesSearch && matchesEmpreendimento && matchesGerente && matchesStatus && matchesData;
    });
  }, [manutencoesPermitidas, searchTerm, filtroEmpreendimento, filtroGerente, filtroStatus, filtroData]);

  const empreendimentos = [...new Set(manutencoesPermitidas.map(m => m.empreendimento))];
  const gerentes = [...new Set(manutencoesPermitidas.map(m => m.gerente))];

  const estatisticasPermitidas = {
    total: manutencoesPermitidas.length,
    pendentes: manutencoesPermitidas.filter(m => m.status === 'pendente').length,
    concluidas: manutencoesPermitidas.filter(m => m.status === 'concluida').length
  };

  const handleEdit = (manutencao: Manutencao) => {
    console.log('Editar manutenção:', manutencao);
  };

  const handleView = (manutencao: Manutencao) => {
    console.log('Visualizar manutenção:', manutencao);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta manutenção?')) {
      excluirManutencao(id);
    }
  };

  const handleComplete = (id: string) => {
    if (window.confirm('Marcar esta manutenção como concluída?')) {
      concluirManutencao(id);
    }
  };

  const handleSubmitManutencao = async (data: ManutencaoFormData & { fotos?: string[] }) => {
    await criarManutencao({
      ...data,
      gerente: user?.nome || 'Desconhecido',
    });
    carregarManutencoes();
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
            {isAdmin ? 'Manutenções' : 'Minhas Solicitações de Manutenção'}
          </h1>
          {!isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Solicitação
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total de Manutenções" value={estatisticasPermitidas.total} color="blue" />
          <StatCard title="Pendentes" value={estatisticasPermitidas.pendentes} color="orange" />
          <StatCard title="Concluídas" value={estatisticasPermitidas.concluidas} color="green" />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar..." />
            </div>

            <div>
              <select
                value={filtroEmpreendimento}
                onChange={(e) => setFiltroEmpreendimento(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Todos os Empreendimentos</option>
                {empreendimentos.map(emp => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
            </div>

            {isAdmin && (
              <div>
                <select
                  value={filtroGerente}
                  onChange={(e) => setFiltroGerente(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Todos os Gerentes</option>
                  {gerentes.map(gerente => (
                    <option key={gerente} value={gerente}>{gerente}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>

            <div>
              <input
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      {manutencoesFiltradas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm || filtroEmpreendimento || filtroGerente || filtroStatus || filtroData
              ? 'Nenhuma manutenção encontrada com os filtros aplicados'
              : 'Nenhuma manutenção cadastrada'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {manutencoesFiltradas.map((manutencao) => (
            <ManutencaoCard
              key={manutencao.id}
              manutencao={manutencao}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onComplete={!isAdmin ? handleComplete : undefined}
            />
          ))}
        </div>
      )}

      <ManutencaoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitManutencao}
        empreendimentos={isAdmin ? empreendimentos : meusEmpreendimentos.map(e => e.nome)}
      />
    </main>
  );
}

