import React, { useState } from 'react';
import { Plus, BarChart3 } from 'lucide-react';
import { AtribuicaoCard } from '../components/AtribuicaoCard';
import { AtribuicaoModal } from '../components/AtribuicaoModal';
import { useAtribuicoes } from '../hooks/useAtribuicoes';
import { AtribuicaoEmpreendimento } from '../types';

export function AtribuirProdutosPage() {
  const {
    atribuicoes,
    loading,
    atualizarAtribuicao,
    atualizarAtribuicaoLocal,
    getEmpreendimentosDisponiveis,
    getGerentesDisponiveis
  } = useAtribuicoes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAtribuicao, setEditingAtribuicao] = useState<AtribuicaoEmpreendimento | undefined>();

  const empreendimentos = getEmpreendimentosDisponiveis();
  const gerentes = getGerentesDisponiveis();

  const handleCreateNew = () => {
    setEditingAtribuicao(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (atribuicao: AtribuicaoEmpreendimento) => {
    setEditingAtribuicao(atribuicao);
    setIsModalOpen(true);
  };

  const handleSave = (gerenteId: string, empreendimentoIds: string[]) => {
    atualizarAtribuicaoLocal(gerenteId, empreendimentoIds);
    atualizarAtribuicao(gerenteId, empreendimentoIds); // ✅ Salvar no Supabase
  };

  const handleSubmit = (gerenteId: string, empreendimentoIds: string[]) => {
    atualizarAtribuicao(gerenteId, empreendimentoIds);
  };

  const totalEmpreendimentos = empreendimentos.length;
  const empreendimentosAtribuidos = new Set(
    atribuicoes.flatMap(a => a.empreendimentos.map(e => e.id))
  ).size;
  const gerentesComAtribuicao = atribuicoes.length;

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
            Atribuir Produtos
          </h1>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Atribuição
          </button>
        </div>

        {/* Resumo da Distribuição */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Resumo da Distribuição</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalEmpreendimentos}</div>
              <div className="text-sm text-gray-600">Total de Empreendimentos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{empreendimentosAtribuidos}</div>
              <div className="text-sm text-gray-600">Empreendimentos Atribuídos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{gerentesComAtribuicao}</div>
              <div className="text-sm text-gray-600">Gerentes com Atribuições</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Atribuições */}
      {atribuicoes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhuma atribuição criada ainda</p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeira Atribuição
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {atribuicoes.map((atribuicao) => (
            <AtribuicaoCard
              key={atribuicao.id}
              atribuicao={atribuicao}
              onEdit={handleEdit}
              onSave={handleSave}
              empreendimentosDisponiveis={empreendimentos}
            />
          ))}
        </div>
      )}

      <AtribuicaoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        atribuicao={editingAtribuicao}
        gerentes={gerentes}
        empreendimentos={empreendimentos}
      />
    </main>
  );
}
