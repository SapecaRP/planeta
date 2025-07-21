import React, { useState } from 'react';
import { Building2, Menu } from 'lucide-react';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-xl border-b border-green-600">
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        {/* topo */}
        <div className="flex items-center justify-between h-16">
          {/* logo + nome */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6 text-green-700" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold">Construtora Planeta</h1>
              <p className="text-xs text-green-100">Sistema de Gestão</p>
            </div>
          </div>

          {/* botão menu mobile */}
          <div className="sm:hidden">
            <button onClick={() => setOpen(!open)} className="text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* avatar no desktop */}
          <div className="hidden sm:flex items-center">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center ring-2 ring-white/20">
              <span className="text-sm font-medium">A</span>
            </div>
          </div>
        </div>

        {/* menu mobile */}
        {open && (
          <div className="flex sm:hidden justify-end mt-2">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center ring-2 ring-white/20">
              <span className="text-sm font-medium">A</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
