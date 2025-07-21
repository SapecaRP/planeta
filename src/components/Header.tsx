import React, { useState } from 'react';
import { Building2, Menu, X } from 'lucide-react';

export function Header() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/empreendimentos', label: 'Empreendimentos' },
    { href: '/contatos', label: 'Contatos' },
    { href: '/manutencoes', label: 'Manutenções' },
    // adicione mais links conforme necessário
  ];

  return (
    <header className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-xl border-b border-green-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6 text-green-700" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold">Construtora Planeta</h1>
              <p className="text-xs text-green-100">Sistema de Gestão</p>
            </div>
          </div>

          {/* Menu Mobile */}
          <div className="sm:hidden">
            <button onClick={() => setOpen(!open)} className="text-white">
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden sm:flex space-x-4">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="hover:bg-green-600 px-3 py-2 rounded">
                {link.label}
              </a>
            ))}
            {/* Avatar */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center ring-2 ring-white/20">
                <span className="text-sm font-medium">A</span>
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Dropdown */}
        {open && (
          <nav className="sm:hidden pt-2 pb-4 space-y-1">
            {navLinks.map(link => (
              <a key={link.href} href={link.href}
                 className="block px-4 py-2 hover:bg-green-600 rounded text-white">
                {link.label}
              </a>
            ))}
            <div className="px-4">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center ring-2 ring-white/20">
                <span className="text-sm font-medium">A</span>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
