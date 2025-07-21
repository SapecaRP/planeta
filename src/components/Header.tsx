import React, { useState } from 'react';
import { Building2, Menu } from 'lucide-react';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-xl border-b border-green-600 w-full">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* topo */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-2 w-full">
          {/* logo + nome */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6 text-green-700" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-base font-bold truncate">Construtora Planeta</h1>
              <p className="text-xs text-green-100 truncate">Sistema de Gestão</p>
            </div>
          </div>

          {/* avatar + menu mobile */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex sm:hidden">
              <button onClick={() => setOpen(!open)} className="text-white">
                <Menu className="w-6 h-6" />
              </button>
            </div>

            <div className="hidden sm:flex">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center ring-2 ring-white/20 ml-auto">
                <span className="text-sm font-medium">A</span>
              </div>
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
