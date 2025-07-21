import React, { useState } from 'react';
import { Building2, Menu, X, Home, Users, Package, FileText, Eye, Settings } from 'lucide-react';

export function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-xl border-b border-green-600 w-full">
      <div className="max-w-7xl w-full mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo + Nome */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6 text-green-700" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold">Construtora Planeta</h1>
              <p className="text-xs text-green-100">Sistema de Gestão</p>
            </div>
          </div>

          {/* Botão menu mobile */}
          <div className="sm:hidden">
            <button onClick={() => setMenuAberto(!menuAberto)}>
              {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Avatar (Desktop) */}
          <div className="hidden sm:flex">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center ring-2 ring-white/20 ml-auto">
              <span className="text-sm font-medium">A</span>
            </div>
          </div>
        </div>

        {/* Menu navegação - Desktop */}
        <nav className="hidden sm:flex gap-4 mt-4">
          <a href="#" className="flex items-center gap-2 text-white hover:text-green-200">
            <Home className="w-4 h-4" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-2 text-white hover:text-green-200">
            <Package className="w-4 h-4" />
            Empreendimentos
          </a>
          <a href="#" className="flex items-center gap-2 text-white hover:text-green-200">
            <Users className="w-4 h-4" />
            Corretores
          </a>
          <a href="#" className="flex items-center gap-2 text-white hover:text-green-200">
            <FileText className="w-4 h-4" />
            Relatórios
          </a>
        </nav>

        {/* Menu Mobile */}
        {menuAberto && (
          <nav className="flex flex-col gap-4 mt-4 sm:hidden">
            <a href="#" className="flex items-center gap-2 text-white hover:text-green-200">
              <Home className="w-4 h-4" />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-2 text-white hover:text-green-200">
              <Package className="w-4 h-4" />
              Empreendimentos
            </a>
            <a href="#" className="flex items-center gap-2 text-white hover:text-green-200">
              <Users className="w-4 h-4" />
              Corretores
            </a>
            <a href="#" className="flex items-center gap-2 text-white hover:text-green-200">
              <FileText className="w-4 h-4" />
              Relatórios
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
