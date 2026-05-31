import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';

export default function Spa() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-8 h-8 text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('spa.title', 'Gestion du Spa')}
          </h1>
          <p className="text-gray-600">
            {t('spa.subtitle', 'Services, réservations et bien-être')}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Module Spa</h2>
        <p className="text-gray-600 mb-4">
          Le module spa est en cours de chargement...
        </p>
        <p className="text-sm text-gray-500">
          Si vous voyez ce message, cela signifie que la page Spa se charge correctement.
          Le problème vient probablement du backend qui n'a pas été redéployé.
        </p>
      </div>
    </div>
  );
}
