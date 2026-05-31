-- ============================================
-- VÉRIFIER SI LES TABLES SPA EXISTENT
-- ============================================
-- Exécutez ce script dans Supabase SQL Editor
-- pour vérifier si les tables spa sont déjà créées
-- ============================================

-- Compter les tables spa
SELECT COUNT(*) as "Nombre de tables spa"
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'spa_%';

-- Lister toutes les tables spa
SELECT table_name as "Tables spa existantes"
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'spa_%'
ORDER BY table_name;

-- Vérifier les triggers spa
SELECT trigger_name as "Triggers spa existants"
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name LIKE '%spa%'
ORDER BY trigger_name;

-- Message d'interprétation
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE 'spa_%';
    
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'RÉSULTAT DE LA VÉRIFICATION';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
    
    IF table_count = 0 THEN
        RAISE NOTICE '❌ Aucune table spa trouvée';
        RAISE NOTICE '   Action: Vous devez créer les tables spa';
        RAISE NOTICE '   Solution: Exécuter le script de création sans triggers';
    ELSIF table_count < 13 THEN
        RAISE NOTICE '⚠️  Tables spa partiellement créées: % sur 13', table_count;
        RAISE NOTICE '   Action: Compléter la création des tables manquantes';
    ELSE
        RAISE NOTICE '✅ Toutes les tables spa existent: % tables', table_count;
        RAISE NOTICE '   Les triggers existent déjà (normal)';
        RAISE NOTICE '   Votre module spa devrait fonctionner!';
        RAISE NOTICE '';
        RAISE NOTICE '🧪 TESTEZ MAINTENANT:';
        RAISE NOTICE '   1. Rafraîchir la page spa (F5)';
        RAISE NOTICE '   2. Vérifier qu''il n''y a plus d''erreur 500';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
END $$;
