-- ============================================
-- SYSTÈME MULTI-DEVISES
-- ============================================
-- Ajoute la possibilité de choisir la devise (USD, CDF, EUR, etc.)
-- dans les paramètres de l'hôtel
-- ============================================

-- ÉTAPE 1: Ajouter les colonnes de devise à user_settings
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS currency_symbol VARCHAR(10) DEFAULT '$',
ADD COLUMN IF NOT EXISTS currency_position VARCHAR(10) DEFAULT 'before' CHECK (currency_position IN ('before', 'after'));

-- ÉTAPE 2: Créer une table des devises supportées (optionnel mais utile)
CREATE TABLE IF NOT EXISTS currencies (
  code VARCHAR(3) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  decimal_places INT DEFAULT 2,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ÉTAPE 3: Insérer les devises principales
INSERT INTO currencies (code, name, symbol, decimal_places) VALUES
('USD', 'Dollar Américain', '$', 2),
('CDF', 'Franc Congolais', 'FC', 0),
('EUR', 'Euro', '€', 2),
('GBP', 'Livre Sterling', '£', 2),
('ZAR', 'Rand Sud-Africain', 'R', 2),
('XAF', 'Franc CFA', 'FCFA', 0)
ON CONFLICT (code) DO NOTHING;

-- ÉTAPE 4: Mettre à jour les paramètres existants avec la devise par défaut
UPDATE user_settings
SET 
  currency = COALESCE(currency, 'USD'),
  currency_symbol = COALESCE(currency_symbol, '$'),
  currency_position = COALESCE(currency_position, 'before')
WHERE currency IS NULL OR currency_symbol IS NULL;

-- ÉTAPE 5: Créer une fonction helper pour formater les montants
CREATE OR REPLACE FUNCTION format_currency(amount DECIMAL, currency_code VARCHAR DEFAULT 'USD')
RETURNS TEXT AS $$
DECLARE
  currency_rec RECORD;
BEGIN
  SELECT symbol, decimal_places INTO currency_rec
  FROM currencies
  WHERE code = currency_code;
  
  IF NOT FOUND THEN
    RETURN amount::TEXT;
  END IF;
  
  RETURN currency_rec.symbol || ' ' || 
         TO_CHAR(amount, 'FM999,999,999,999.' || REPEAT('0', currency_rec.decimal_places));
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Voir les colonnes ajoutées à user_settings
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'user_settings'
  AND column_name IN ('currency', 'currency_symbol', 'currency_position')
ORDER BY ordinal_position;

-- Voir les devises disponibles
SELECT * FROM currencies WHERE is_active = true ORDER BY code;

-- Voir les paramètres de devise actuels
SELECT 
  u.email,
  us.hotel_name,
  us.currency,
  us.currency_symbol,
  us.currency_position
FROM user_settings us
JOIN users u ON us.user_id = u.id
LIMIT 5;

-- ============================================
-- EXEMPLE D'UTILISATION
-- ============================================

-- Formater un montant en USD
SELECT format_currency(1250.50, 'USD');  -- Résultat: $ 1,250.50

-- Formater un montant en CDF
SELECT format_currency(25000, 'CDF');    -- Résultat: FC 25,000

-- Formater un montant en EUR
SELECT format_currency(999.99, 'EUR');   -- Résultat: € 999.99

-- ============================================
-- NOTES
-- ============================================
-- 1. CDF (Franc Congolais) utilise 0 décimales par défaut
-- 2. USD, EUR, GBP utilisent 2 décimales
-- 3. Le symbole peut être positionné avant ou après le montant
-- 4. La fonction format_currency peut être utilisée dans les requêtes
-- ============================================
