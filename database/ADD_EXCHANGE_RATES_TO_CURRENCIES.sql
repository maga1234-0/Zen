-- ============================================
-- AJOUTER TAUX DE CHANGE AUX DEVISES
-- ============================================
-- Ajoute les taux de change à la table currencies
-- pour supporter la conversion automatique
-- ============================================

-- ÉTAPE 1: Ajouter colonnes pour les taux de change
ALTER TABLE currencies
ADD COLUMN IF NOT EXISTS exchange_rate_to_usd DECIMAL(20, 6) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- ÉTAPE 2: Mettre à jour avec les taux de change actuels
-- NOTE: Ces taux sont indicatifs. L'application utilise une API pour les taux en temps réel.
UPDATE currencies SET 
  exchange_rate_to_usd = 1.0,
  last_updated = CURRENT_TIMESTAMP
WHERE code = 'USD';

UPDATE currencies SET 
  exchange_rate_to_usd = 0.000357,  -- 1 CDF ≈ 0.000357 USD (1 USD ≈ 2800 CDF)
  last_updated = CURRENT_TIMESTAMP
WHERE code = 'CDF';

UPDATE currencies SET 
  exchange_rate_to_usd = 1.087,  -- 1 EUR ≈ 1.087 USD
  last_updated = CURRENT_TIMESTAMP
WHERE code = 'EUR';

UPDATE currencies SET 
  exchange_rate_to_usd = 1.266,  -- 1 GBP ≈ 1.266 USD
  last_updated = CURRENT_TIMESTAMP
WHERE code = 'GBP';

UPDATE currencies SET 
  exchange_rate_to_usd = 0.054,  -- 1 ZAR ≈ 0.054 USD (1 USD ≈ 18.5 ZAR)
  last_updated = CURRENT_TIMESTAMP
WHERE code = 'ZAR';

UPDATE currencies SET 
  exchange_rate_to_usd = 0.001653,  -- 1 XAF ≈ 0.001653 USD (1 USD ≈ 605 XAF)
  last_updated = CURRENT_TIMESTAMP
WHERE code = 'XAF';

-- ÉTAPE 3: Créer une fonction pour convertir un montant d'une devise à une autre
CREATE OR REPLACE FUNCTION convert_currency(
  amount DECIMAL,
  from_currency VARCHAR(3),
  to_currency VARCHAR(3)
)
RETURNS DECIMAL AS $$
DECLARE
  from_rate DECIMAL(20, 6);
  to_rate DECIMAL(20, 6);
  amount_in_usd DECIMAL;
BEGIN
  -- Si même devise, pas de conversion
  IF from_currency = to_currency THEN
    RETURN amount;
  END IF;

  -- Récupérer les taux de change
  SELECT exchange_rate_to_usd INTO from_rate FROM currencies WHERE code = from_currency;
  SELECT exchange_rate_to_usd INTO to_rate FROM currencies WHERE code = to_currency;

  -- Si taux non trouvé, retourner le montant original
  IF from_rate IS NULL OR to_rate IS NULL THEN
    RETURN amount;
  END IF;

  -- Convertir via USD
  -- 1. Convertir de from_currency vers USD
  IF from_currency = 'USD' THEN
    amount_in_usd := amount;
  ELSE
    amount_in_usd := amount * from_rate;
  END IF;

  -- 2. Convertir de USD vers to_currency
  IF to_currency = 'USD' THEN
    RETURN amount_in_usd;
  ELSE
    RETURN amount_in_usd / to_rate;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ÉTAPE 4: Créer une fonction pour formater avec conversion automatique
CREATE OR REPLACE FUNCTION format_currency_converted(
  amount_usd DECIMAL,
  target_currency VARCHAR(3) DEFAULT 'USD'
)
RETURNS TEXT AS $$
DECLARE
  converted_amount DECIMAL;
  currency_rec RECORD;
BEGIN
  -- Convertir de USD vers la devise cible
  converted_amount := convert_currency(amount_usd, 'USD', target_currency);

  -- Récupérer les infos de formatage
  SELECT symbol, decimal_places INTO currency_rec
  FROM currencies
  WHERE code = target_currency;
  
  IF NOT FOUND THEN
    RETURN amount_usd::TEXT;
  END IF;
  
  -- Formater avec le bon nombre de décimales
  RETURN currency_rec.symbol || ' ' || 
         TO_CHAR(converted_amount, 'FM999,999,999,999.' || REPEAT('0', currency_rec.decimal_places));
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Voir les taux de change
SELECT 
  code,
  name,
  symbol,
  exchange_rate_to_usd,
  CASE 
    WHEN code = 'USD' THEN '1 USD = 1 USD'
    ELSE '1 ' || code || ' = ' || exchange_rate_to_usd || ' USD'
  END as rate_explanation,
  last_updated
FROM currencies
WHERE is_active = true
ORDER BY code;

-- ============================================
-- EXEMPLES D'UTILISATION
-- ============================================

-- Convertir 100 USD en CDF
SELECT convert_currency(100, 'USD', 'CDF');  -- Résultat: ~280000

-- Convertir 100 USD en EUR
SELECT convert_currency(100, 'USD', 'EUR');  -- Résultat: ~92

-- Formater 100 USD en différentes devises
SELECT 
  'USD' as currency,
  format_currency_converted(100, 'USD') as formatted
UNION ALL
SELECT 'CDF', format_currency_converted(100, 'CDF')
UNION ALL
SELECT 'EUR', format_currency_converted(100, 'EUR')
UNION ALL
SELECT 'GBP', format_currency_converted(100, 'GBP')
UNION ALL
SELECT 'ZAR', format_currency_converted(100, 'ZAR')
UNION ALL
SELECT 'XAF', format_currency_converted(100, 'XAF');

-- ============================================
-- NOTES IMPORTANTES
-- ============================================
-- 1. TOUS LES PRIX DANS LA BASE DE DONNÉES SONT EN USD
-- 2. La conversion se fait à l'affichage via:
--    - Frontend: API exchangerate-api.com (taux en temps réel)
--    - Backend/SQL: Fonction convert_currency() (taux en base)
-- 3. Les taux en base sont mis à jour manuellement (fallback)
-- 4. L'application utilise les taux de l'API en priorité
-- ============================================

