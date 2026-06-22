# 💱 EXÉCUTER LE SCRIPT SQL MULTI-DEVISES

---

## ⚡ ACTION IMMÉDIATE REQUISE

**Temps**: 2 minutes  
**Difficulté**: ⭐ Facile  

---

## 🎯 CE QUE ÇA FAIT

Ce script ajoute le support multi-devises à ZENITH PMS:
- ✅ Ajoute les colonnes de devise dans `user_settings`
- ✅ Crée la table `currencies` avec 6 devises
- ✅ Configure USD comme devise par défaut

---

## 📋 ÉTAPES (2 MINUTES)

### 1️⃣ Ouvre Supabase SQL Editor

Va sur: **https://supabase.com/dashboard/project/vzzznyrlbhftixgkqcca/sql/new**

---

### 2️⃣ Copie-Colle Ce Script

```sql
-- =====================================================
-- SYSTÈME MULTI-DEVISES
-- Ajoute support pour USD, CDF, EUR, GBP, ZAR, XAF
-- =====================================================

-- 1️⃣ Ajouter les colonnes de devise à user_settings
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS currency_symbol VARCHAR(10) DEFAULT '$',
ADD COLUMN IF NOT EXISTS currency_position VARCHAR(10) DEFAULT 'before' 
  CHECK (currency_position IN ('before', 'after'));

-- 2️⃣ Créer la table des devises
CREATE TABLE IF NOT EXISTS currencies (
  code VARCHAR(3) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  decimal_places INT DEFAULT 2,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ Insérer les 6 devises supportées
INSERT INTO currencies (code, name, symbol, decimal_places) VALUES
('USD', 'Dollar Américain', '$', 2),
('CDF', 'Franc Congolais', 'FC', 0),
('EUR', 'Euro', '€', 2),
('GBP', 'Livre Sterling', '£', 2),
('ZAR', 'Rand Sud-Africain', 'R', 2),
('XAF', 'Franc CFA', 'FCFA', 0)
ON CONFLICT (code) DO NOTHING;

-- 4️⃣ Mettre à jour les paramètres existants avec les valeurs par défaut
UPDATE user_settings
SET 
  currency = COALESCE(currency, 'USD'),
  currency_symbol = COALESCE(currency_symbol, '$'),
  currency_position = COALESCE(currency_position, 'before')
WHERE currency IS NULL;

-- 5️⃣ Fonction helper pour formater les montants (bonus)
CREATE OR REPLACE FUNCTION format_currency(
  amount NUMERIC,
  currency_code VARCHAR(3) DEFAULT 'USD'
)
RETURNS TEXT AS $$
DECLARE
  curr_row currencies%ROWTYPE;
  formatted TEXT;
BEGIN
  -- Récupérer les infos de la devise
  SELECT * INTO curr_row FROM currencies WHERE code = currency_code;
  
  IF NOT FOUND THEN
    RETURN amount::TEXT;
  END IF;
  
  -- Formater selon les décimales
  IF curr_row.decimal_places = 0 THEN
    formatted := ROUND(amount)::TEXT;
  ELSE
    formatted := TO_CHAR(amount, 'FM999999999.00');
  END IF;
  
  -- Ajouter le symbole
  IF curr_row.symbol = 'FC' OR curr_row.symbol = 'FCFA' THEN
    -- Symbole après pour CDF et XAF
    RETURN formatted || ' ' || curr_row.symbol;
  ELSE
    -- Symbole avant pour les autres
    RETURN curr_row.symbol || ' ' || formatted;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ✅ TERMINÉ!
SELECT 
  '✅ Script exécuté avec succès!' as status,
  COUNT(*) as devises_ajoutees
FROM currencies;
```

---

### 3️⃣ Clique "RUN"

Tu devrais voir:
```
✅ Script exécuté avec succès!
devises_ajoutees: 6
```

---

## ✅ VÉRIFICATION

Pour vérifier que tout est installé:

```sql
-- Voir les devises disponibles
SELECT code, name, symbol, decimal_places FROM currencies ORDER BY code;
```

Tu devrais voir:
```
code | name                    | symbol | decimal_places
-----|-------------------------|--------|---------------
CDF  | Franc Congolais         | FC     | 0
EUR  | Euro                    | €      | 2
GBP  | Livre Sterling          | £      | 2
USD  | Dollar Américain        | $      | 2
XAF  | Franc CFA               | FCFA   | 0
ZAR  | Rand Sud-Africain       | R      | 2
```

---

## 🧪 TESTER

1. ✅ Attends 2-3 minutes que Vercel déploie le frontend
2. ✅ Va sur: **https://zen-lyart.vercel.app/settings**
3. ✅ Cherche la section **"💱 Devise"**
4. ✅ Change la devise (exemple: CDF - Franc Congolais)
5. ✅ Clique **"Enregistrer les modifications"**
6. ✅ Vérifie que le symbole change en **"FC"** partout dans l'app

---

## 🎉 TERMINÉ!

Le système multi-devises est maintenant actif! Les utilisateurs peuvent choisir leur devise dans les paramètres.

### Devises Disponibles:
- 💵 **USD** - Dollar Américain ($) - 2 décimales
- 🇨🇩 **CDF** - Franc Congolais (FC) - 0 décimales
- 💶 **EUR** - Euro (€) - 2 décimales
- 🇬🇧 **GBP** - Livre Sterling (£) - 2 décimales
- 🇿🇦 **ZAR** - Rand Sud-Africain (R) - 2 décimales
- 🌍 **XAF** - Franc CFA (FCFA) - 0 décimales

---

## 📊 UTILISATION DANS LE CODE

Pour afficher un prix avec la devise choisie:

```typescript
import { useSettingsStore } from '@/store/settingsStore';

const { currency_symbol, currency_position } = useSettingsStore();

const formatPrice = (amount: number) => {
  if (currency_position === 'before') {
    return `${currency_symbol} ${amount.toFixed(2)}`;
  }
  return `${amount.toFixed(2)} ${currency_symbol}`;
};

// Exemple: formatPrice(1250.50) → "FC 1250.50" ou "$ 1250.50"
```

---

## ❓ PROBLÈMES?

### Erreur "column already exists"
→ Normal, le script vérifie si la colonne existe déjà (IF NOT EXISTS)

### Erreur "relation already exists"
→ Normal, la table existe déjà (IF NOT EXISTS)

### Symbole ne change pas dans l'app
→ Vide le cache du navigateur (Ctrl+Shift+R) et recharge la page

---

**Date**: 22 juin 2026  
**Commit Frontend**: `72dcfed` ✅ Déployé sur Vercel  
**Commit Backend**: Déjà déployé sur Render  
**Script SQL**: Prêt à exécuter  
