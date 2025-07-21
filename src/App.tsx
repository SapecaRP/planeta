import React, { useState, useEffect } from 'react';
import { Building2, Users, FileText, Settings, Eye, Package, Home, User, LogOut, Menu } from 'lucide-react';
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

function AdminHeader({ currentPage, onPageChange }: { 
  currentPage: string; 
  onPageChange: (page: string) => void 
}) {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const getInitials = (nome: string) => nome.split(' ').map(n => n[0]).join('').toUpperCase();

  const getAvatarColor = (nome: string) => {
    const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
    return colors[nome.length % colors.length];
  };

  const allNavigationItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'empreendimentos', label: 'Empreendimentos', icon: Building2 },
    { key: 'usuarios', label: 'Usuários', icon: Users },
    { key: 'contatos', label: 'Contatos', icon: FileText },
    { key: 'manutencoes', label: 'Manutenções', icon: Package },
    { key: 'visitas', label: 'Visitas', icon: Eye },
    { key: 'atribuir-produtos', label: 'Atribuir Produtos', icon: Settings },
  ];

  const navigationItems = allNavigationItems.filter(item => {
    if (user?.cargo === 'Gerente de Produto') {
      return !['usuarios', 'atribuir-produtos'].includes(item.key);
    }
    return true;
  });

  return (
    <>
      <header className="bg-green-600 text-white shadow-lg">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                <img src="/OLC.jpeg" alt="Logo" className="w-full h-full object-contain rounded" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Construtora Planeta</h1>
                <p className="text-xs text-green-100">Gestão de Produtos</p>
              </div>
            </div>
            <div className="sm:hidden">
              <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
                <Menu className="w-6 h-6 text-white" />
              </button>
            </div>
            <nav className="hidden sm:flex items-center space-x-1">
              {navigationItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => onPageChange(key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors font-medium text-sm ${
                    currentPage === key ? 'bg-green-700 text-white' : 'text-green-100 hover:text-white hover:bg-green-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
            <div className="relative hidden sm:block">
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
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class='flex items-center justify-center w-10 h-10 ${getAvatarColor(user?.nome || '')} rounded-full text-white font-bold'>${getInitials(user?.nome || '')}</div>`;
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
          {showMobileMenu && (
            <nav className="flex flex-col sm:hidden space-y-2 mt-2 pb-4">
              {navigationItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    onPageChange(key);
                    setShowMobileMenu(false);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-left font-medium text-sm ${
                    currentPage === key ? 'bg-green-700 text-white' : 'text-green-100 hover:text-white hover:bg-green-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}

export default AdminHeader;
