import React from 'react';
import { Building2, Home, Users, FileText, Settings, Eye, Package } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-xl border-b border-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between min-h-[4rem]">
          <div className="flex flex-wrap items-center space-x-6">
            <div className="flex flex-wrap items-center space-x-3 bg-white/10 rounded-lg px-4 sm:px-6 lg:px-8 py-2 backdrop-blur-sm">
              <div className="w-10 min-w-[2.5rem] h-10 bg-white rounded-lg flex flex-wrap items-center justify-center shadow-md">
                <Building2 className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Construtora Planeta</h1>
                <p className="text-xs text-green-100">Sistema de Gestão</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center space-x-3">
            <div className="w-10 min-w-[2.5rem] h-10 bg-green-600 rounded-full flex flex-wrap items-center justify-center ring-2 ring-white/20">
              <span className="text-xs sm:text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}