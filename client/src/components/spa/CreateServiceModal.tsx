import { useState, useEffect } from 'react';
import { X, Sparkles, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';
import { useToastContext } from '@/App';

interface CreateServiceModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface Category {
  id: string;
  name: string;
}

export const CreateServiceModal = ({ onClose, onSuccess }: CreateServiceModalProps) => {
  const toast = useToastContext();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    name_fr: '',
    description: '',
    category_id: '',
    duration: '',
    price: '',
    is_active: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get('/spa/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Load categories error:', error);
      // Default categories if backend not ready
      setCategories([
        { id: '1', name: 'Massages' },
        { id: '2', name: 'Soins du visage' },
        { id: '3', name: 'Soins du corps' },
        { id: '4', name: 'Manucure & Pédicure' },
        { id: '5', name: 'Épilation' },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category_id || !formData.duration || !formData.price) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const serviceData = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
      };

      await api.post('/spa/services', serviceData);
      toast.success('Service créé avec succès!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Create service error:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la création du service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 border dark:border-slate-700 my-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Nouveau Service Spa
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Nom du service *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Massage suédois"
                  className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Nom en français (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.name_fr}
                  onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                  placeholder="Ex: Massage suédois"
                  className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Décrivez le service..."
                  className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Durée (minutes) *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="60"
                    min="15"
                    step="15"
                    className="w-full pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Prix (€) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="80.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-slate-300">
                    Service actif (disponible pour réservation)
                  </span>
                </label>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-2">
                Aperçu du service
              </h3>
              <div className="space-y-1 text-sm text-purple-700 dark:text-purple-400">
                <p><strong>Nom:</strong> {formData.name || '(non renseigné)'}</p>
                <p><strong>Durée:</strong> {formData.duration || '0'} minutes</p>
                <p><strong>Prix:</strong> {formData.price || '0.00'}€</p>
                <p><strong>Statut:</strong> {formData.is_active ? 'Actif' : 'Inactif'}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-700">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                className="dark:border-slate-600 dark:text-slate-200"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-purple-500 hover:bg-purple-600"
              >
                {loading ? 'Création...' : 'Créer le Service'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
