# 💱 SYSTÈME MULTI-DEVISES (USD, CDF, EUR)

---

## 🎯 OBJECTIF

Ajouter un sélecteur de devise dans les paramètres de l'hôtel pour permettre de choisir entre:
- 💵 **USD** - Dollar Américain ($)
- 🇨🇩 **CDF** - Franc Congolais (FC)
- 💶 **EUR** - Euro (€)
- 🇬🇧 **GBP** - Livre Sterling (£)
- 🇿🇦 **ZAR** - Rand Sud-Africain (R)
- 🌍 **XAF** - Franc CFA (FCFA)

---

## ✅ CE QUI A ÉTÉ FAIT

### 1. Backend (TERMINÉ) ✅

#### Base de données:
- ✅ Ajout des colonnes `currency`, `currency_symbol`, `currency_position` à `user_settings`
- ✅ Création de la table `currencies` avec les devises supportées
- ✅ Fonction SQL `format_currency()` pour formater les montants

#### API:
- ✅ Endpoint GET `/api/users/currencies` - Liste des devises disponibles
- ✅ Endpoint GET `/api/users/settings` - Inclut les paramètres de devise
- ✅ Endpoint PUT `/api/users/settings` - Sauvegarde les paramètres de devise

**Fichiers modifiés**:
- `zen_backend/src/routes/userRoutes.ts` ✅

---

## 🚀 CE QU'IL RESTE À FAIRE

### 1. Exécuter le script SQL (2 MINUTES)

#### Va sur Supabase SQL Editor:
```
https://supabase.com/dashboard/project/vzzznyrlbhftixgkqcca/sql/new
```

#### Copie-colle ce script:
```sql
-- Ajouter les colonnes de devise
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS currency_symbol VARCHAR(10) DEFAULT '$',
ADD COLUMN IF NOT EXISTS currency_position VARCHAR(10) DEFAULT 'before' 
  CHECK (currency_position IN ('before', 'after'));

-- Créer la table des devises
CREATE TABLE IF NOT EXISTS currencies (
  code VARCHAR(3) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  decimal_places INT DEFAULT 2,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer les devises
INSERT INTO currencies (code, name, symbol, decimal_places) VALUES
('USD', 'Dollar Américain', '$', 2),
('CDF', 'Franc Congolais', 'FC', 0),
('EUR', 'Euro', '€', 2),
('GBP', 'Livre Sterling', '£', 2),
('ZAR', 'Rand Sud-Africain', 'R', 2),
('XAF', 'Franc CFA', 'FCFA', 0)
ON CONFLICT (code) DO NOTHING;

-- Mettre à jour les paramètres existants
UPDATE user_settings
SET 
  currency = COALESCE(currency, 'USD'),
  currency_symbol = COALESCE(currency_symbol, '$'),
  currency_position = COALESCE(currency_position, 'before')
WHERE currency IS NULL;
```

#### Clique "RUN"

---

### 2. Déployer le Backend (5 MINUTES)

Le code backend est déjà modifié dans `zen_backend/src/routes/userRoutes.ts`.

#### Commit et push:
```bash
cd zen_backend
git add .
git commit -m "feat: Add multi-currency support (USD, CDF, EUR, etc.)"
git push
```

Render va automatiquement déployer (attends 3-5 minutes).

---

### 3. Ajouter le Sélecteur de Devise au Frontend

#### Ouvre `client/src/pages/Settings.tsx`

**Cherche** la section où se trouve le sélecteur de `Theme` (ligne ~430):

```tsx
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
    {t('settings.theme')}
  </label>
  <select 
    value={settings.theme}
    onChange={(e) => handleChange('theme', e.target.value)}
    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg..."
  >
    <option value="Dark">Mode Sombre</option>
    <option value="Light">Mode Clair</option>
  </select>
</div>
```

**Ajoute APRÈS** ce bloc:

```tsx
{/* Sélecteur de Devise */}
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
    💱 Devise
  </label>
  <select 
    value={settings.currency || 'USD'}
    onChange={(e) => {
      const selectedCurrency = currencies?.find(c => c.code === e.target.value);
      handleChange('currency', e.target.value);
      handleChange('currency_symbol', selectedCurrency?.symbol || '$');
    }}
    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-seafoam-400 dark:bg-slate-700 dark:text-white"
  >
    <option value="USD">💵 USD - Dollar Américain ($)</option>
    <option value="CDF">🇨🇩 CDF - Franc Congolais (FC)</option>
    <option value="EUR">💶 EUR - Euro (€)</option>
    <option value="GBP">🇬🇧 GBP - Livre Sterling (£)</option>
    <option value="ZAR">🇿🇦 ZAR - Rand Sud-Africain (R)</option>
    <option value="XAF">🌍 XAF - Franc CFA (FCFA)</option>
  </select>
  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
    Symbole: {settings.currency_symbol || '$'}
  </p>
</div>
```

---

### 4. Ajouter les Champs dans le Type TypeScript

**Cherche** l'interface `SettingsData` (ligne ~9):

```tsx
interface SettingsData {
  hotelName: string;
  hotelAddress: string;
  // ... autres champs
  theme: string;
  signature: string;
}
```

**Ajoute** ces 3 lignes à la fin:

```tsx
interface SettingsData {
  hotelName: string;
  hotelAddress: string;
  // ... autres champs
  theme: string;
  signature: string;
  currency?: string;           // ← AJOUTER
  currency_symbol?: string;    // ← AJOUTER
  currency_position?: string;  // ← AJOUTER
}
```

---

### 5. Mettre à Jour l'État Initial

**Cherche** `useState<SettingsData>` (ligne ~40):

```tsx
const [settings, setSettings] = useState<SettingsData>({
  hotelName: settingsStore.hotelName,
  // ... autres champs
  theme: settingsStore.theme,
  signature: settingsStore.signature || '',
});
```

**Ajoute** à la fin:

```tsx
const [settings, setSettings] = useState<SettingsData>({
  hotelName: settingsStore.hotelName,
  // ... autres champs
  theme: settingsStore.theme,
  signature: settingsStore.signature || '',
  currency: settingsStore.currency || 'USD',           // ← AJOUTER
  currency_symbol: settingsStore.currency_symbol || '$', // ← AJOUTER
  currency_position: settingsStore.currency_position || 'before', // ← AJOUTER
});
```

---

### 6. Mettre à Jour le Store (settingsStore.ts)

**Ouvre** `client/src/store/settingsStore.ts`

**Cherche** l'interface `SettingsState`:

```tsx
interface SettingsState {
  hotelName: string;
  // ... autres champs
  theme: 'Light' | 'Dark';
  signature: string;
}
```

**Ajoute** à la fin:

```tsx
interface SettingsState {
  hotelName: string;
  // ... autres champs
  theme: 'Light' | 'Dark';
  signature: string;
  currency: string;        // ← AJOUTER
  currency_symbol: string; // ← AJOUTER
  currency_position: 'before' | 'after'; // ← AJOUTER
}
```

**Cherche** les valeurs par défaut:

```tsx
const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set, get) => ({
      hotelName: 'Grand Seafoam Hotel',
      // ... autres valeurs
      theme: 'Dark',
      signature: '',
```

**Ajoute**:

```tsx
      theme: 'Dark',
      signature: '',
      currency: 'USD',           // ← AJOUTER
      currency_symbol: '$',      // ← AJOUTER
      currency_position: 'before', // ← AJOUTER
```

---

### 7. Déployer le Frontend

```bash
cd client
git add .
git commit -m "feat: Add currency selector in settings (USD, CDF, EUR)"
git push
```

Vercel va auto-déployer (2-3 minutes).

---

## 🧪 TESTER

1. Va sur: https://zen-lyart.vercel.app/settings
2. Cherche la section **"💱 Devise"**
3. Change la devise (ex: CDF)
4. Clique **"Enregistrer les modifications"**
5. Vérifie que tous les prix dans l'app utilisent maintenant le symbole "FC" au lieu de "$"

---

## 📊 UTILISATION DANS L'APP

### Afficher un prix avec la devise configurée:

```tsx
import { useSettingsStore } from '@/store/settingsStore';

const MyComponent = () => {
  const { currency_symbol, currency_position } = useSettingsStore();
  const price = 1250.50;

  const formatPrice = (amount: number) => {
    if (currency_position === 'before') {
      return `${currency_symbol} ${amount.toFixed(2)}`;
    }
    return `${amount.toFixed(2)} ${currency_symbol}`;
  };

  return <div>{formatPrice(price)}</div>; 
  // Affiche: "FC 1250.50" ou "$ 1250.50" selon la config
};
```

---

## 📁 FICHIERS CRÉÉS/MODIFIÉS

### Backend:
- ✅ `zen_backend/src/routes/userRoutes.ts` - Endpoints devises
- ✅ `database/ADD_MULTI_CURRENCY_SYSTEM.sql` - Script SQL

### Frontend (À faire):
- ⏳ `client/src/pages/Settings.tsx` - Ajouter sélecteur
- ⏳ `client/src/store/settingsStore.ts` - Ajouter champs devise

### Documentation:
- ✅ `AJOUTER_SYSTEME_DEVISES.md` - Ce document

---

## ⚡ RÉSUMÉ ULTRA-RAPIDE

1. ✅ Exécute le script SQL dans Supabase
2. ✅ Push le backend (déjà modifié)
3. ⏳ Modifie `Settings.tsx` (ajoute sélecteur)
4. ⏳ Modifie `settingsStore.ts` (ajoute champs)
5. ✅ Push le frontend
6. ✅ Teste!

---

**Temps total**: 15-20 minutes
**Difficulté**: ⭐⭐ Moyen
**Impact**: ✅ Système multi-devises fonctionnel

