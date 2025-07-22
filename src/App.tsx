import React, { useState, useEffect } from 'react';
import { Building2, Users, FileText, Settings, Eye, Package, Home, User, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { ProfileModal } from './components/ProfileModal';
import { EmpreendimentosPage } from './pages/EmpreendimentosPage';
import { UsuariosPage } from './pages/UsuariosPage';
import { ContatosPage } from './pages/ContatosPage';
import { ManutencoesPage } from './pages/ManutencoesPage';
import { VisitasPage } from './pages/VisitasPage';
import { AtribuirProdutosPage } from './pages/AtribuirProdutosPage';
import { EmpreendimentosViewPage } from './pages/EmpreendimentosViewPage';
import { useEmpreendimentos } from './hooks/useEmpreendimentos';
import { useUsuarios } from './hooks/useUsuarios';
import { useVisitas } from './hooks/useVisitas';
import { useManutencoes } from './hooks/useManutencoes';
import { useAtribuicoes } from './hooks/useAtribuicoes';
import { VisitaModal } from './components/VisitaModal';
import { ManutencaoModal } from './components/ManutencaoModal';
import { Edit, Trash2 } from 'lucide-react';

type PageType = 'dashboard' | 'empreendimentos' | 'empreendimentos-view' | 'usuarios' | 'contatos' | 'manutencoes' | 'visitas' | 'atribuir-produtos';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>(
    user?.cargo === 'Gerente de Produto' ? 'dashboard' : 'dashboard'
  );

  // Atualizar página quando usuário mudar
  React.useEffect(() => {
    if (user?.cargo === 'Gerente de Produto') {
      setCurrentPage('dashboard');
    }
  }, [user]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onPageChange={setCurrentPage} />;
      case 'empreendimentos':
        return <EmpreendimentosPage />;
      case 'empreendimentos-view':
        return <EmpreendimentosViewPage onBack={() => setCurrentPage('dashboard')} onEmpreendimentoClick={() => setCurrentPage('empreendimentos')} />;
      case 'usuarios':
        return <UsuariosPage />;
      case 'contatos':
        return <ContatosPage />;
      case 'manutencoes':
        return <ManutencoesPage />;
      case 'visitas':
        return <VisitasPage />;
      case 'atribuir-produtos':
        return <AtribuirProdutosPage />;
      default:
        return <EmpreendimentosPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

function AdminHeader({ currentPage, onPageChange }: { 
  currentPage: PageType; 
  onPageChange: (page: PageType) => void 
}) {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

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
  
  // Filtrar itens de navegação baseado no cargo do usuário
  const allNavigationItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'empreendimentos', label: 'Empreendimentos', icon: Building2 },
    { key: 'usuarios', label: 'Usuários', icon: Users },
    { key: 'contatos', label: 'Contatos', icon: FileText },
    { key: 'manutencoes', label: 'Manutenções', icon: Package },
    { key: 'visitas', label: 'Visitas', icon: Eye },
    { key: 'atribuir-produtos', label: 'Atribuir Produtos', icon: Settings }
  ];

  const navigationItems = allNavigationItems.filter(item => {
    // Se for gerente, remover usuários e atribuir produtos
    if (user?.cargo === 'Gerente de Produto') {
      return !['usuarios', 'atribuir-produtos'].includes(item.key);
    }
    // Admin vê tudo
    return true;
  });
  
  return (
    <>
      <header className="bg-green-600 text-white shadow-lg">
        <div className="max-w-full mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                  <img 
                    src="/OLC.jpeg" 
                    alt="Construtora Planeta Logo" 
                    className="w-full h-full object-contain rounded"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Construtora Planeta</h1>
                  <p className="text-xs text-green-100">Gestão de Produtos</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => onPageChange(item.key as PageType)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors font-medium text-sm ${
                      currentPage === item.key 
                        ? 'bg-green-700 text-white' 
                        : 'text-green-100 hover:text-white hover:bg-green-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="relative">
              {user?.foto ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20 hover:ring-white/40 transition-all"
                >
                  <img 
                    src={user.foto} 
                    alt={user.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Se a imagem falhar, mostrar iniciais
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="flex items-center justify-center w-10 h-10 ${getAvatarColor(user?.nome || '')} rounded-full text-white font-bold">${getInitials(user?.nome || '')}</div>`;
                      }
                    }}
                  />
                </button>
              ) : (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold hover:opacity-80 transition-all ring-2 ring-white/20 ${getAvatarColor(user?.nome || '')}`}
                >
                  {getInitials(user?.nome || '')}
                </button>
              )}

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  <button
                    onClick={() => {
                      setIsProfileOpen(true);
                      setShowUserMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Meu Perfil
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}

function DashboardPage({ onPageChange }: { onPageChange: (page: PageType) => void }) {
  const { user } = useAuth();
  const { empreendimentos } = useEmpreendimentos();
  const { usuarios } = useUsuarios();
  const { visitas, estatisticas: estatisticasVisitas } = useVisitas();
  const { estatisticas: estatisticasManutencoes } = useManutencoes();

  // Filtrar funcionalidades baseado no cargo do usuário
  const isAdmin = user?.cargo === 'Administrador';
  const isGerente = user?.cargo === 'Gerente de Produto';

  // Se for gerente, mostrar dashboard específico
  if (isGerente) {
    return <ManagerDashboard onPageChange={onPageChange} />;
  }

  const gerentesAtivos = usuarios.filter(u => u.cargo === 'Gerente de Produto').length;
  const visitasDaSemana = visitas.filter(v => {
    const hoje = new Date();
    const inicioSemana = new Date(hoje.setDate(hoje.getDate() - hoje.getDay()));
    const fimSemana = new Date(hoje.setDate(hoje.getDate() - hoje.getDay() + 6));
    const dataVisita = new Date(v.data);
    return dataVisita >= inicioSemana && dataVisita <= fimSemana;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Bem-vindo, {user?.nome}!
              </p>
            </div>
          </div>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-l-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Visitas da Semana</p>
                  <p className="text-3xl font-bold text-gray-900">{visitasDaSemana}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-l-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total de Visitas</p>
                  <p className="text-3xl font-bold text-gray-900">{estatisticasVisitas.total}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Empreendimentos</p>
                  <p className="text-3xl font-bold text-gray-900">{empreendimentos.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            {isAdmin && (
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Gerentes Ativos</p>
                    <p className="text-3xl font-bold text-gray-900">{gerentesAtivos}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Seção Empreendimentos */}
          <div className="bg-green-600 rounded-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Empreendimentos</h2>
                <p className="text-green-100">
                  {isAdmin ? 'Gerencie todos os projetos da construtora' : 'Visualize os empreendimentos disponíveis'}
                </p>
              </div>
              <button 
                onClick={() => onPageChange('empreendimentos-view')}
                className="bg-white text-green-600 px-4 py-2 rounded-md hover:bg-green-50 transition-colors flex items-center space-x-2"
              >
                <Building2 className="w-4 h-4" />
                <span>Ver Empreendimentos</span>
              </button>
            </div>
          </div>
          
          {/* Grid de Funcionalidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isAdmin && (
              <div 
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onPageChange('usuarios')}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Gerenciar Usuários</h3>
                    <p className="text-sm text-gray-600">Criar e editar contas de gerentes</p>
                  </div>
                </div>
              </div>
            )}
            
            {isAdmin && (
              <div 
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onPageChange('empreendimentos')}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Empreendimentos</h3>
                    <p className="text-sm text-gray-600">Cadastrar e gerenciar projetos</p>
                  </div>
                </div>
              </div>
            )}
            
            <div 
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onPageChange('visitas')}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Visitas</h3>
                  <p className="text-sm text-gray-600">
                    {isAdmin ? 'Acompanhar visitas agendadas' : 'Agendar e acompanhar suas visitas'}
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onPageChange('manutencoes')}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manutenções</h3>
                  <p className="text-sm text-gray-600">
                    {isAdmin ? 'Acompanhar solicitações dos gerentes' : 'Solicitar manutenções'}
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onPageChange('contatos')}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Contatos</h3>
                  <p className="text-sm text-gray-600">Gerenciar prestadores de serviço</p>
                </div>
              </div>
            </div>
            
            {isAdmin && (
              <div 
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onPageChange('atribuir-produtos')}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Atribuir Produtos</h3>
                    <p className="text-sm text-gray-600">Gerenciar acesso de gerentes aos produtos</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ManagerDashboard({ onPageChange }: { onPageChange: (page: PageType) => void }) {
  const { user } = useAuth();
  const { visitas, criarVisita, carregarVisitas } = useVisitas();
  const { manutencoes, criarManutencao, concluirManutencao, carregarManutencoes } = useManutencoes();
  const { atribuicoes, loading: loadingAtribuicoes } = useAtribuicoes();
  const [isVisitaModalOpen, setIsVisitaModalOpen] = useState(false);
  const [isManutencaoModalOpen, setIsManutencaoModalOpen] = useState(false);
  const [selectedEmpreendimento, setSelectedEmpreendimento] = useState('');

  // Recarregar dados quando componente montar
  useEffect(() => {
    carregarVisitas();
    carregarManutencoes();
  }, []);

  // Filtrar dados do gerente logado
  const minhasAtribuicoes = loadingAtribuicoes ? null : atribuicoes.find(a => a.gerenteId === user?.id);
  const meusEmpreendimentos = minhasAtribuicoes?.empreendimentos || [];
  const minhasVisitas = visitas.filter(v => 
    meusEmpreendimentos.some(emp => emp.nome === v.empreendimento)
  );
  const minhasManutencoes = manutencoes.filter(m => 
    meusEmpreendimentos.some(emp => emp.nome === m.empreendimento)
  );

  // Visitas agendadas da semana
  const visitasAgendadasSemana = minhasVisitas.filter(v => {
    if (v.status !== 'agendada') return false;
    
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    inicioSemana.setHours(0, 0, 0, 0);
    
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);
    fimSemana.setHours(23, 59, 59, 999);
    
    const dataVisita = new Date(v.data);
    return dataVisita >= inicioSemana && dataVisita <= fimSemana;
  });
  
  const solicitacoesPendentes = minhasManutencoes.filter(m => m.status === 'pendente');
  const melhoriasConcluidas = minhasManutencoes.filter(m => m.status === 'concluida');

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
    // Recarregar dados
    setTimeout(() => {
      carregarVisitas();
    }, 100);
  };

  const handleSubmitManutencao = (dados: any) => {
    criarManutencao({
      ...dados,
      gerente: user?.nome || ''
    });
    alert('Solicitação de manutenção criada com sucesso!');
    // Recarregar dados
    setTimeout(() => {
      carregarManutencoes();
    }, 100);
  };

  const handleConcluirManutencao = (id: string) => {
    if (window.confirm('Marcar esta manutenção como concluída?')) {
      concluirManutencao(id);
      // Recarregar dados
      setTimeout(() => {
        carregarManutencoes();
      }, 100);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Estoque':
        return 'bg-blue-100 text-blue-800';
      case 'STAND':
        return 'bg-yellow-100 text-yellow-800';
      case 'PDV':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baixa':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loadingAtribuicoes) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header do Gerente */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gerente de Produto</h1>
                <p className="text-gray-600">{user?.nome}</p>
              </div>
            </div>
          </div>

          {/* Produtos Ativos */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Produtos Ativos</h2>
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-bold text-gray-900">{meusEmpreendimentos.length}</span>
                <Eye className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Grid de Seções - Visão Geral */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visitas Agendadas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitas Agendadas</h3>
              <p className="text-sm text-gray-600 mb-4">Todas as visitas programadas</p>
              
              <div className="space-y-4">
                {minhasVisitas.filter(v => v.status === 'agendada').slice(0, 3).map((visita) => (
                  <div key={visita.id} className="border-l-4 border-l-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{visita.corretor}</h4>
                        <p className="text-sm text-blue-600 mb-1">{visita.empreendimento}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(visita.data).toLocaleDateString('pt-BR')} às {visita.horario}
                    </p>
                  </div>
                ))}
                {minhasVisitas.filter(v => v.status === 'agendada').length === 0 && (
                  <p className="text-gray-500 text-sm">Nenhuma visita agendada</p>
                )}
              </div>
            </div>

            {/* Solicitações */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Solicitações</h3>
              <p className="text-sm text-gray-600 mb-4">Produtos com melhorias necessárias</p>
              
              <div className="space-y-4">
                {solicitacoesPendentes.slice(0, 3).map((manutencao) => (
                  <div key={manutencao.id} className="border-l-4 border-l-orange-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{manutencao.empreendimento}</h4>
                        <p className="text-sm text-gray-600 mb-2">{manutencao.descricao}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPrioridadeColor(manutencao.prioridade)}`}>
                        {manutencao.prioridade}
                      </span>
                      <button
                        onClick={() => handleConcluirManutencao(manutencao.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        Concluir
                      </button>
                    </div>
                  </div>
                ))}
                {solicitacoesPendentes.length === 0 && (
                  <p className="text-gray-500 text-sm">Nenhuma solicitação pendente</p>
                )}
              </div>
            </div>

            {/* Melhorias Concluídas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Melhorias Concluídas</h3>
              <p className="text-sm text-gray-600 mb-4">Todas as datas</p>
              
              <div className="space-y-4">
                {melhoriasConcluidas.slice(0, 3).map((manutencao) => (
                  <div key={manutencao.id} className="border-l-4 border-l-green-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{manutencao.empreendimento}</h4>
                        <p className="text-sm text-gray-600 mb-1">{manutencao.descricao}</p>
                      </div>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Concluída
                      </span>
                      {manutencao.concluidoEm && (
                        <span className="text-xs text-gray-500">
                          {new Date(manutencao.concluidoEm).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {melhoriasConcluidas.length === 0 && (
                  <p className="text-gray-500 text-sm">Nenhuma melhoria concluída</p>
                )}
              </div>
            </div>
          </div>
        </div>

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
    </div>
  );
}

export default App;
