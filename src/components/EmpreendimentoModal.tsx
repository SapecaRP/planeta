import React, { useState, useEffect } from 'react';
import { X, Upload, Camera } from 'lucide-react';
import { Empreendimento, EmpreendimentoFormData } from '../types';

interface EmpreendimentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dados: EmpreendimentoFormData) => void;
  empreendimento?: Empreendimento;
}

export function EmpreendimentoModal({ isOpen, onClose, onSubmit, empreendimento }: EmpreendimentoModalProps) {
  const [formData, setFormData] = useState<EmpreendimentoFormData>({
    nome: '',
    endereco: '',
    status: 'Estoque',
    foto: '',
    informacoes: ''
  });

  useEffect(() => {
    if (empreendimento) {
      setFormData({
        nome: empreendimento.nome,
        endereco: empreendimento.endereco,
        status: empreendimento.status,
        foto: empreendimento.foto || '',
        informacoes: empreendimento.informacoes
      });
    } else {
      setFormData({
        nome: '',
        endereco: '',
        status: 'Estoque',
        foto: '',
        informacoes: ''
      });
    }
  }, [empreendimento, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data no submit:', formData); // Debug
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar se o arquivo é uma imagem
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      // Verificar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setFormData(prev => ({ ...prev, foto: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, foto: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-wrap items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex flex-wrap items-center justify-between p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {empreendimento ? 'Editar Empreendimento' : 'Criar Novo Empreendimento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nome" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Nome do Empreendimento
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Digite o nome do empreendimento"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="Estoque">Estoque</option>
                <option value="STAND">STAND</option>
                <option value="PDV">PDV</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="endereco" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Endereço
            </label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Digite o endereço completo"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Foto do Empreendimento
            </label>
            {formData.foto ? (
              <div className="relative">
                <img 
                  src={formData.foto} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <label className="absolute bottom-2 right-2 bg-green-600 text-white rounded-lg p-2 hover:bg-green-700 transition-colors cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer block">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <span className="text-green-600 hover:text-green-700 font-medium">
                  Adicionar Foto
                </span>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Clique para fazer upload de uma imagem
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div>
            <label htmlFor="informacoes" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Informações Básicas do Empreendimento
            </label>
            <textarea
              id="informacoes"
              name="informacoes"
              value={formData.informacoes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Ex: A Construtora Planeta é uma das principais desenvolvedoras imobiliárias de Sorocaba..."
            />
          </div>

          <div className="flex flex-wrap justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-6 lg:px-8 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {empreendimento ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}