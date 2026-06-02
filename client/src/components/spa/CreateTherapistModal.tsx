import { useState } from 'react';
import { X, User, Mail, Phone, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';
import { useToastContext } from '@/App';

interface CreateTherapistModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const specialtyOptions = [
  'Massage suédois',
  'Massage thaï',
  'Massage aux pierres chaudes',
  'Massage aromathérapie',
  'Soins du visage',
  'Soins du corps',
  'Réflexologie',
  'Manucure',
  'Pédicure',
  'Épilation',
  'Hammam',
  'Sauna',
];

export const CreateTherapistModal = ({ onClose, onSuccess }: CreateTherapistModalProps) => {
  const toast = useToastContext();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    specialties: [] as string[],
    certifications: '',
    is_active: true,
  });

  const toggleSpecialty = (specialty: string) => {
    if (formData.specialties.includes(specialty)) {
      setFormData({
        ...formData,
        specialties: formData.specialties.filter(s => s !== specialty),
      });
    } else {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, specialty],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name) {
      toast.error('Veuillez renseigner le prénom et nom');
      return;
    }

    if (formData.specialties.length === 0) {
      toast.error('Veuillez sélectionner au moins une spécialité');
      return;
    }

    setLoading(true);
    try {
      const therapistData = {
        ...formData,
        email: formData.email || null,
        phone: formData.phone || null,
        certifications: formData.certifications || null,
      };

      await api.post('/spa/therapists', therapistData);
      toast.success('Thérapeute ajouté avec succès!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Create therapist error:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout du thérapeute');
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
              <User className="w-6 h-6 text-purple-500" />
              Nouveau Thérapeute
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Prénom *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="Marie"
                    className="w-full pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Dupont"
                  className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Email (optionnel)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marie.dupont@spa.com"
                    className="w-full pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Téléphone (optionnel)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  <Award className="w-4 h-4 inline mr-1" />
                  Spécialités * (sélectionnez au moins une)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-600 max-h-48 overflow-y-auto">
                  {specialtyOptions.map(specialty => (
                    <label key={specialty} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.specialties.includes(specialty)}
                        onChange={() => toggleSpecialty(specialty)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {specialty}
                      </span>
                    </label>
                  ))}
                </div>
                {formData.specialties.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                    {formData.specialties.length} spécialité(s) sélectionnée(s)
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Certifications (optionnel)
                </label>
                <textarea
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  rows={3}
                  placeholder="Liste des certifications, diplômes, formations..."
                  className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
                />
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
                    Thérapeute actif (disponible pour réservations)
                  </span>
                </label>
              </div>
            </div>

            {/* Preview */}
            {formData.first_name && formData.last_name && formData.specialties.length > 0 && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-2">
                  Aperçu de la carte thérapeute
                </h3>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border dark:border-slate-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {formData.first_name} {formData.last_name}
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formData.specialties.slice(0, 3).map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                        {formData.specialties.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-full">
                            +{formData.specialties.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      formData.is_active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {formData.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>
            )}

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
                {loading ? 'Ajout...' : 'Ajouter le Thérapeute'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
