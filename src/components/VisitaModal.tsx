import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { Visita, VisitaFormData } from '../types';

interface VisitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dados: VisitaFormData) => void;
  empreendimento: string;
  visita?: Visita;
}

export function VisitaModal({ isOpen, onClose, onSubmit, empreendimento, visita }: VisitaModalProps) {
  const [formData, setFormData] = useState<VisitaFormData>({
    corretor: '',
    empreendimento: empreendimento,
    data: '',
    horario: '',
    observacoes: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (visita) {
      setFormData({
        corretor: visita.corretor,
        empreendimento: visita.empreendimento,
        data: visita.data,
        horario: visita.horario,
        observacoes: visita.observacoes || ''
      });
    } else {
      setFormData({
        corretor: '',
        empreendimento: empreendimento,
        data: '',
        horario: '',
        observacoes: ''
      });
    }
    setErrors({});
  }, [visita, empreendimento, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.corretor.trim()) {
      newErrors.corretor = 'Nome do corretor é obrigatório';
    }

    if (!formData.data) {
      newErrors.data = 'Data da visita é obrigatória';
    }

    if (!formData.horario) {
      newErrors.horario = 'Horário da visita é obrigatório';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Agendar Visita - {empreendimento}
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
            <label htmlFor="corretor" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Corretor
            </label>
            <input
              type="text"
              id="corretor"
              name="corretor"
              value={formData.corretor}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.corretor ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nome do corretor"
            />
            {errors.corretor && <p className="mt-1 text-sm text-red-600">{errors.corretor}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                Data da Visita
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="data"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.data ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.data && <p className="mt-1 text-sm text-red-600">{errors.data}</p>}
            </div>

            <div>
              <label htmlFor="horario" className="block text-sm font-medium text-gray-700 mb-1">
                Horário
              </label>
              <div className="relative">
                <input
                  type="time"
                  id="horario"
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.horario ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <Clock className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.horario && <p className="mt-1 text-sm text-red-600">{errors.horario}</p>}
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
              Agendar Visita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}