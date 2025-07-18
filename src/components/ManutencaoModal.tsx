import React, { useState, useEffect } from 'react';
import { X, Camera, Upload } from 'lucide-react';
import { Manutencao, ManutencaoFormData } from '../types';

interface ManutencaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dados: ManutencaoFormData & { fotos?: string[] }) => void;
  empreendimento: string;
  manutencao?: Manutencao;
}

export function ManutencaoModal({ isOpen, onClose, onSubmit, empreendimento, manutencao }: ManutencaoModalProps) {
  const [formData, setFormData] = useState<ManutencaoFormData & { fotos: string[] }>({
    empreendimento: empreendimento,
    descricao: '',
    prioridade: 'media',
    gerente: '',
    fotos: []
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (manutencao) {
      setFormData({
        empreendimento: manutencao.empreendimento,
        descricao: manutencao.descricao,
        prioridade: manutencao.prioridade,
        gerente: manutencao.gerente,
        fotos: manutencao.fotos || []
      });
    } else {
      setFormData({
        empreendimento: empreendimento,
        descricao: '',
        prioridade: 'media',
        gerente: '',
        fotos: []
      });
    }
    setErrors({});
  }, [manutencao, empreendimento, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição da manutenção é obrigatória';
    }

    if (!formData.prioridade) {
      newErrors.prioridade = 'Prioridade é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
          alert('Por favor, selecione apenas arquivos de imagem.');
          return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
          alert('A imagem deve ter no máximo 5MB.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            setFormData(prev => ({ 
              ...prev, 
              fotos: [...prev.fotos, result] 
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        handleImageUpload({ target } as React.ChangeEvent<HTMLInputElement>);
      }
    };
    input.click();
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Nova Manutenção - {empreendimento}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empreendimento
            </label>
            <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
              {empreendimento}
            </div>
          </div>

          <div>
            <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700 mb-1">
              Prioridade
            </label>
            <select
              id="prioridade"
              name="prioridade"
              value={formData.prioridade}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.prioridade ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione a prioridade</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
            {errors.prioridade && <p className="mt-1 text-sm text-red-600">{errors.prioridade}</p>}
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição da Manutenção
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none ${
                errors.descricao ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Descreva o que precisa ser feito..."
            />
            {errors.descricao && <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotos do Problema
            </label>
            
            {/* Fotos já adicionadas */}
            {formData.fotos.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {formData.fotos.map((foto, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={foto} 
                      alt={`Foto ${index + 1}`} 
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Botões para adicionar fotos */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCameraCapture}
                className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span className="text-sm">Tirar Foto</span>
              </button>
              
              <label className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                <span className="text-sm">Upload Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Registrar Manutenção
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}