import { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface CreateTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TableFormData) => void;
  editingTable?: TableData | null;
}

export interface TableFormData {
  table_number: string;
  capacity: number;
  location: 'indoor' | 'outdoor' | 'terrace' | 'bar';
  notes?: string;
}

export interface TableData extends TableFormData {
  id: string;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
}

export const CreateTableModal = ({ isOpen, onClose, onSubmit, editingTable }: CreateTableModalProps) => {
  const [formData, setFormData] = useState<TableFormData>({
    table_number: editingTable?.table_number || '',
    capacity: editingTable?.capacity || 2,
    location: editingTable?.location || 'indoor',
    notes: editingTable?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border dark:border-slate-700 max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {editingTable ? 'Modifier la Table' : 'Ajouter une Table'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-slate-300" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Numéro de table */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                Numéro de Table <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.table_number}
                onChange={(e) => setFormData({ ...formData, table_number: e.target.value })}
                className="w-full px-4 py-2.5 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-400 dark:bg-slate-700 dark:text-white"
                placeholder="Ex: T1, T2, BAR-1..."
              />
            </div>

            {/* Capacité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                Capacité (nombre de personnes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="20"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-400 dark:bg-slate-700 dark:text-white"
              />
            </div>

            {/* Emplacement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-3">
                Emplacement <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'indoor', label: 'Intérieur', icon: '🏠' },
                  { value: 'outdoor', label: 'Extérieur', icon: '🌳' },
                  { value: 'terrace', label: 'Terrasse', icon: '☀️' },
                  { value: 'bar', label: 'Bar', icon: '🍸' },
                ].map((location) => (
                  <button
                    key={location.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, location: location.value as any })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.location === location.value
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-slate-600 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{location.icon}</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-slate-200">
                      {location.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                Notes (optionnel)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-400 dark:bg-slate-700 dark:text-white resize-none"
                placeholder="Ex: Près de la fenêtre, accessible PMR..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border dark:border-slate-600 dark:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                Annuler
              </button>
              <Button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                {editingTable ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};
