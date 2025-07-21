import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Calendar } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { VisitaCard } from '../components/VisitaCard';
import { useVisitas } from '../hooks/useVisitas';
import { useAuth } from '../contexts/AuthContext';
import { useAtribuicoes } from '../hooks/useAtribuicoes';
import { Visita } from '../types';

export const VisitasPage = () => {
  const { user } = useAuth();
  const { visitas, loading, marcarComoRealizada, excluirVisita, carregarVisitas } = useVisitas();
  const { atribuicoes, loading: loadingAtribuicoes } = useAtribuicoes();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEmpreendimento, setFiltroEmpreendimento] = useState('');
  const [filtroCorretor, setFiltroCorretor] = useState('');
  const [filtroData, setFiltroData] = useState('');

  const isAdmin = user?.cargo === 'Administrador';

  useEffect(() => {
    carregarVisitas();
  }, []);

  const visitasPermitidas = useMemo(() => {
    if (isAdmin) return visitas;
    if (loadingAtribuicoes) return [];
    const minhaAtribuicao = atribuicoes.find(a => a.gerenteId === user?.id);
    if (!minhaAtribuicao) return [];
    const nomesEmpreendimentosAtribuidos = minhaAtribuicao.empreendimentos.map(e => e.nome);
    return visitas.filter(v => nomesEmpreendimentosAtribuidos.includes(v.empreendimento));
  }, [visitas, atribuicoes, user?.id, isAdmin, loadingAtribuicoes]);

  const visitasFiltradas = useMemo(() => {
    return visitasPermitidas.filter(visita => {
      const matchesSearch = visita.corretor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            visita.empreendimento.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEmpreendimento = !filtroEmpreendimento || visita.empreendimento === filtroEmpreendimento;
      const matchesCorretor = !filtroCorretor || visita.corretor === filtroCorretor;
      const matchesData = !filtroData || visita.data === filtroData;
      return matchesSearch && matchesEmpreendimento && matchesCorretor && matchesData;
    });
  }, [visitasPermitidas, searchTerm, filtroEmpreendimento, filtroCorretor, filtroData]);

  const empreendimentos = [...new Set(visitasPermitidas.map(v => v.empreendimento))];
  const corretores = [...new Set(visitasPermitidas.map(v => v.corretor))];

  const handleEdit = (visita: Visita) => {
    console.log('Editar visita:', visita);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta visita?')) {
      excluirVisita(id);
    }
  };

  const handleMarkAsCompleted = (id: string) => {
    if (window.confirm('Marcar esta visita como realizada?')) {
      marcarComoRealizada(id);
    }
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
            {isAdmin ? 'Visitas Agendadas' : 'Minhas Visitas'}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar gerente ou empreendimento..."
              />
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
                  value={filtroCorretor}
                  onChange={(e) => setFiltroCorretor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Todos os Gerentes</option>
                  {corretores.map(corretor => (
                    <option key={corretor} value={corretor}>{corretor}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <input
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="dd/mm/aaaa"
              />
            </div>
          </div>
        </div>
      </div>

      {visitasFiltradas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm || filtroEmpreendimento || filtroCorretor || filtroData 
              ? 'Nenhuma visita encontrada com os filtros aplicados' 
              : 'Nenhuma visita agendada'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visitasFiltradas.map((visita) => (
            <VisitaCard
              key={visita.id}
              visita={visita}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarkAsCompleted={handleMarkAsCompleted}
            />
          ))}
        </div>
      )}
    </main>
  );
};
