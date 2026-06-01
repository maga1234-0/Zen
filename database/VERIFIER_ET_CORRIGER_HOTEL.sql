-- ============================================
-- VÉRIFIER ET CORRIGER LE PROBLÈME D'HÔTEL
-- ============================================
-- Ce script vérifie si l'hôtel existe et affiche son ID
-- ============================================

-- 1. Vérifier si l'hôtel existe
SELECT 
    '1. VÉRIFICATION HÔTEL' as etape,
    COUNT(*) as nombre_hotels,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ Aucun hôtel trouvé'
        ELSE '✅ Hôtel(s) trouvé(s)'
    END as statut
FROM hotels;

-- 2. Afficher les détails de l'hôtel
SELECT 
    '2. DÉTAILS HÔTEL' as etape,
    id as hotel_id,
    name as nom,
    city as ville,
    created_at as date_creation
FROM hotels
ORDER BY created_at DESC
LIMIT 1;

-- 3. Vérifier les types de chambres
SELECT 
    '3. TYPES DE CHAMBRES' as etape,
    COUNT(*) as nombre_types,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ Aucun type trouvé'
        WHEN COUNT(*) < 24 THEN '⚠️  Seulement ' || COUNT(*) || ' types'
        ELSE '✅ 24 types trouvés'
    END as statut
FROM room_types;

-- 4. Afficher quelques types de chambres avec leur hotel_id
SELECT 
    '4. EXEMPLES DE TYPES' as etape,
    id as type_id,
    name as nom_type,
    hotel_id,
    base_price as prix
FROM room_types
ORDER BY name
LIMIT 5;

-- 5. Vérifier si les hotel_id correspondent
SELECT 
    '5. CORRESPONDANCE HOTEL_ID' as etape,
    CASE 
        WHEN COUNT(DISTINCT rt.hotel_id) = 1 AND 
             EXISTS(SELECT 1 FROM hotels h WHERE h.id = rt.hotel_id)
        THEN '✅ Tous les types ont le même hotel_id valide'
        WHEN COUNT(DISTINCT rt.hotel_id) > 1
        THEN '❌ Plusieurs hotel_id différents trouvés'
        ELSE '❌ Les hotel_id ne correspondent pas'
    END as statut
FROM room_types rt;

-- ============================================
-- SOLUTION : COPIER L'ID DE L'HÔTEL
-- ============================================

DO $$
DECLARE
    v_hotel_id UUID;
    v_hotel_name TEXT;
    v_type_count INTEGER;
BEGIN
    -- Récupérer l'ID de l'hôtel
    SELECT id, name INTO v_hotel_id, v_hotel_name
    FROM hotels
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- Compter les types
    SELECT COUNT(*) INTO v_type_count FROM room_types;
    
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'RÉSUMÉ ET SOLUTION';
    RAISE NOTICE '============================================';
    
    IF v_hotel_id IS NULL THEN
        RAISE NOTICE '❌ PROBLÈME: Aucun hôtel trouvé dans la base de données';
        RAISE NOTICE '';
        RAISE NOTICE 'SOLUTION:';
        RAISE NOTICE '1. Réexécuter le script: database/SETUP_INITIAL_DATA.sql';
        RAISE NOTICE '2. Attendre 30 secondes';
        RAISE NOTICE '3. Réexécuter ce script de vérification';
    ELSE
        RAISE NOTICE '✅ Hôtel trouvé: %', v_hotel_name;
        RAISE NOTICE '✅ ID de l''hôtel: %', v_hotel_id;
        RAISE NOTICE '✅ Types de chambres: %', v_type_count;
        RAISE NOTICE '';
        RAISE NOTICE '📋 COPIEZ CET ID:';
        RAISE NOTICE '%', v_hotel_id;
        RAISE NOTICE '';
        RAISE NOTICE 'PROCHAINES ÉTAPES:';
        RAISE NOTICE '1. Copier l''ID ci-dessus';
        RAISE NOTICE '2. Le problème vient du frontend qui envoie un mauvais hotel_id';
        RAISE NOTICE '3. Vérifier le code frontend dans client/src/pages/Rooms.tsx';
        RAISE NOTICE '';
        RAISE NOTICE 'OU SOLUTION RAPIDE:';
        RAISE NOTICE '1. Aller dans Supabase → Table Editor → Table "rooms"';
        RAISE NOTICE '2. Cliquer "Insert" → "Insert row"';
        RAISE NOTICE '3. Remplir manuellement:';
        RAISE NOTICE '   - hotel_id: %', v_hotel_id;
        RAISE NOTICE '   - room_type_id: (copier depuis table room_types)';
        RAISE NOTICE '   - room_number: 101';
        RAISE NOTICE '   - floor: 1';
        RAISE NOTICE '   - status: available';
    END IF;
    
    RAISE NOTICE '============================================';
END $$;
