-- =====================================================
-- RENDRE LES CHAMPS PHONE ET EMAIL OPTIONNELS
-- =====================================================
-- Ce script modifie la table guests pour permettre
-- des valeurs NULL dans les colonnes phone et email
-- =====================================================

-- Étape 1 : Supprimer la contrainte NOT NULL sur phone
ALTER TABLE guests 
ALTER COLUMN phone DROP NOT NULL;

-- Étape 2 : Supprimer la contrainte NOT NULL sur email
ALTER TABLE guests 
ALTER COLUMN email DROP NOT NULL;

-- Vérification
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'guests'
AND column_name IN ('phone', 'email')
ORDER BY ordinal_position;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Les colonnes phone et email sont maintenant optionnelles dans la table guests';
END $$;
