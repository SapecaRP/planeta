import { useState, useEffect } from 'react';
import { Contato, ContatoFormData } from '../types';

export function useContatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setContatos([]);
      setLoading(false);
    }, 500);
  }, []);

  const criarContato = (dados: ContatoFormData) => {
    const novoContato: Contato = {
      id: Date.now().toString(),
      ...dados,
      criadoEm: new Date().toISOString().split('T')[0],
      atualizadoEm: new Date().toISOString().split('T')[0]
    };

    setContatos(prev => [...prev, novoContato]);
    return novoContato;
  };

  const atualizarContato = (id: string, dados: Partial<ContatoFormData>) => {
    setContatos(prev => 
      prev.map(contato => 
        contato.id === id 
          ? { ...contato, ...dados, atualizadoEm: new Date().toISOString().split('T')[0] }
          : contato
      )
    );
  };

  const excluirContato = (id: string) => {
    setContatos(prev => prev.filter(contato => contato.id !== id));
  };

  return {
    contatos,
    loading,
    criarContato,
    atualizarContato,
    excluirContato
  };
}