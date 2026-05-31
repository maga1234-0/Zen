-- ============================================
-- DIAGNOSTIC RAPIDE - QU'EST-CE QUI MANQUE?
-- ============================================
-- Exécutez ce script dans Supabase SQL Editor
-- pour voir exactement ce qui manque
-- ============================================

-- 1. Vérifier les tables principales
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hotels') 
        THEN '✅ hotels existe'
        ELSE '❌ hotels MANQUE'
    END as "Table hotels",
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'room_types') 
        THEN '✅ room_types existe'
        ELSE '❌ room_types MANQUE'
    END as "Table room_types",
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') 
        THEN '✅ users existe'
        ELSE '❌ users MANQUE'
    END as "Table users";

-- 2. Compter les tables spa
SELECT 
    COUNT(*) as "Nombre de tables spa (attendu: 13)",
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ AUCUNE table spa - EXÉCUTER SETUP_INITIAL_DATA.sql'
        WHEN COUNT(*) < 13 THEN '⚠️ Tables spa INCOMPLÈTES - EXÉCUTER SETUP_INITIAL_DATA.sql'
        ELSE '✅ Toutes les tables spa existent'
    END as "Statut"
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'spa_%';

-- 3. Lister les tables spa existantes
SELECT 
    table_name as "Tables spa existantes"
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'spa_%'
ORDER BY table_name;

-- 4. Vérifier les données
DO $$
DECLARE
    hotel_count INTEGER := 0;
    room_type_count INTEGER := 0;
    user_count INTEGER := 0;
    spa_table_count INTEGER := 0;
BEGIN
    -- Compter les hôtels
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hotels') THEN
        SELECT COUNT(*) INTO hotel_count FROM hotels;
    END IF;
    
    -- Compter les types de chambres
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'room_types') THEN
        SELECT COUNT(*) INTO room_type_count FROM room_types;
    END IF;
    
    -- Compter les utilisateurs
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        SELECT COUNT(*) INTO user_count FROM users;
    END IF;
    
    -- Compter les tables spa
    SELECT COUNT(*) INTO spa_table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE 'spa_%';
    
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'DIAGNOSTIC COMPLET';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 TABLES:';
    RAISE NOTICE '   Hotels: %', CASE WHEN hotel_count > 0 THEN '✅ ' || hotel_count || ' ligne(s)' ELSE '❌ Table vide ou inexistante' END;
    RAISE NOTICE '   Types de chambres: %', CASE WHEN room_type_count > 0 THEN '✅ ' || room_type_count || ' ligne(s)' ELSE '❌ Table vide ou inexistante' END;
    RAISE NOTICE '   Utilisateurs: %', CASE WHEN user_count > 0 THEN '✅ ' || user_count || ' ligne(s)' ELSE '❌ Table vide ou inexistante' END;
    RAISE NOTICE '   Tables spa: %', CASE WHEN spa_table_count = 13 THEN '✅ ' || spa_table_count || ' tables' ELSE '❌ ' || spa_table_count || ' tables (attendu: 13)' END;
    RAISE NOTICE '';
    
    IF spa_table_count = 0 THEN
        RAISE NOTICE '🚨 PROBLÈME IDENTIFIÉ:';
        RAISE NOTICE '   Les tables spa n''existent PAS dans votre base de données!';
        RAISE NOTICE '';
        RAISE NOTICE '✅ SOLUTION:';
        RAISE NOTICE '   1. Ouvrir le fichier: database/SETUP_INITIAL_DATA.sql';
        RAISE NOTICE '   2. Copier TOUT le contenu';
        RAISE NOTICE '   3. Coller dans Supabase SQL Editor';
        RAISE NOTICE '   4. Cliquer RUN';
        RAISE NOTICE '   5. Attendre 10-15 secondes';
        RAISE NOTICE '';
        RAISE NOTICE '   Ce script créera:';
        RAISE NOTICE '   - 1 hôtel';
        RAISE NOTICE '   - 24 types de chambres';
        RAISE NOTICE '   - 1 utilisateur admin';
        RAISE NOTICE '   - 13 tables spa';
    ELSIF spa_table_count < 13 THEN
        RAISE NOTICE '⚠️ PROBLÈME IDENTIFIÉ:';
        RAISE NOTICE '   Seulement % tables spa sur 13 existent!', spa_table_count;
        RAISE NOTICE '';
        RAISE NOTICE '✅ SOLUTION:';
        RAISE NOTICE '   Exécuter database/SETUP_INITIAL_DATA.sql';
    ELSE
        RAISE NOTICE '✅ TOUTES LES TABLES EXISTENT!';
        RAISE NOTICE '';
        RAISE NOTICE '🔍 SI L''ERREUR 500 PERSISTE:';
        RAISE NOTICE '   1. Vérifier que Render utilise le bon DATABASE_URL';
        RAISE NOTICE '   2. Redéployer le backend sur Render';
        RAISE NOTICE '   3. Attendre 3-5 minutes';
        RAISE NOTICE '   4. Tester à nouveau';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
END $$;
