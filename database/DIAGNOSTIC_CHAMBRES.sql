-- ============================================
-- DIAGNOSTIC - VÉRIFIER L'ÉTAT DES CHAMBRES
-- ============================================
-- Ce script vérifie si toutes les données nécessaires
-- pour créer des chambres sont présentes
-- ============================================

-- 1. Vérifier les hôtels
SELECT 
    '1. HÔTELS' as verification,
    COUNT(*) as nombre,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ Aucun hôtel - Exécuter SETUP_INITIAL_DATA.sql'
        ELSE '✅ Hôtel(s) présent(s)'
    END as statut
FROM hotels;

-- Afficher les hôtels
SELECT 
    '   Détails hôtels:' as info,
    id,
    name,
    city,
    country
FROM hotels;

-- 2. Vérifier les types de chambres
SELECT 
    '2. TYPES DE CHAMBRES' as verification,
    COUNT(*) as nombre,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ Aucun type - Exécuter SETUP_INITIAL_DATA.sql'
        WHEN COUNT(*) < 24 THEN '⚠️  Seulement ' || COUNT(*) || ' types (24 attendus)'
        ELSE '✅ 24 types présents'
    END as statut
FROM room_types;

-- Afficher les types de chambres
SELECT 
    '   Détails types:' as info,
    id,
    name,
    base_price,
    max_occupancy
FROM room_types
ORDER BY name
LIMIT 10;

-- 3. Vérifier les chambres existantes
SELECT 
    '3. CHAMBRES' as verification,
    COUNT(*) as nombre,
    CASE 
        WHEN COUNT(*) = 0 THEN '⚠️  Aucune chambre créée'
        ELSE '✅ ' || COUNT(*) || ' chambre(s) créée(s)'
    END as statut
FROM rooms;

-- Afficher les chambres
SELECT 
    '   Détails chambres:' as info,
    r.id,
    r.room_number,
    r.floor,
    r.status,
    rt.name as type_name
FROM rooms r
LEFT JOIN room_types rt ON r.room_type_id = rt.id
ORDER BY r.room_number
LIMIT 10;

-- 4. Vérifier les utilisateurs admin
SELECT 
    '4. UTILISATEURS ADMIN' as verification,
    COUNT(*) as nombre,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ Aucun admin - Exécuter SETUP_INITIAL_DATA.sql'
        ELSE '✅ Admin présent'
    END as statut
FROM users
WHERE role = 'admin';

-- Afficher les admins
SELECT 
    '   Détails admin:' as info,
    id,
    email,
    first_name,
    last_name,
    role,
    is_active
FROM users
WHERE role = 'admin';

-- 5. Vérifier les contraintes de clés étrangères
SELECT 
    '5. CONTRAINTES' as verification,
    'Vérification des relations' as info;

-- Vérifier si les room_types ont un hotel_id valide
SELECT 
    '   Types sans hôtel:' as info,
    COUNT(*) as nombre,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Tous les types ont un hôtel'
        ELSE '❌ ' || COUNT(*) || ' types sans hôtel valide'
    END as statut
FROM room_types rt
LEFT JOIN hotels h ON rt.hotel_id = h.id
WHERE h.id IS NULL;

-- Vérifier si les rooms ont un hotel_id et room_type_id valides
SELECT 
    '   Chambres sans hôtel:' as info,
    COUNT(*) as nombre,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Toutes les chambres ont un hôtel'
        ELSE '❌ ' || COUNT(*) || ' chambres sans hôtel valide'
    END as statut
FROM rooms r
LEFT JOIN hotels h ON r.hotel_id = h.id
WHERE h.id IS NULL;

SELECT 
    '   Chambres sans type:' as info,
    COUNT(*) as nombre,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Toutes les chambres ont un type'
        ELSE '❌ ' || COUNT(*) || ' chambres sans type valide'
    END as statut
FROM rooms r
LEFT JOIN room_types rt ON r.room_type_id = rt.id
WHERE rt.id IS NULL;

-- ============================================
-- RÉSUMÉ FINAL
-- ============================================

DO $$
DECLARE
    hotel_count INTEGER;
    type_count INTEGER;
    room_count INTEGER;
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO hotel_count FROM hotels;
    SELECT COUNT(*) INTO type_count FROM room_types;
    SELECT COUNT(*) INTO room_count FROM rooms;
    SELECT COUNT(*) INTO admin_count FROM users WHERE role = 'admin';
    
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'RÉSUMÉ DU DIAGNOSTIC';
    RAISE NOTICE '============================================';
    
    IF hotel_count = 0 THEN
        RAISE NOTICE '❌ PROBLÈME: Aucun hôtel trouvé';
        RAISE NOTICE '   → Exécuter: database/SETUP_INITIAL_DATA.sql';
    ELSE
        RAISE NOTICE '✅ Hôtels: % trouvé(s)', hotel_count;
    END IF;
    
    IF type_count = 0 THEN
        RAISE NOTICE '❌ PROBLÈME: Aucun type de chambre trouvé';
        RAISE NOTICE '   → Exécuter: database/SETUP_INITIAL_DATA.sql';
    ELSIF type_count < 24 THEN
        RAISE NOTICE '⚠️  Types de chambres: % trouvé(s) (24 attendus)', type_count;
        RAISE NOTICE '   → Exécuter: database/SETUP_INITIAL_DATA.sql';
    ELSE
        RAISE NOTICE '✅ Types de chambres: % trouvé(s)', type_count;
    END IF;
    
    IF room_count = 0 THEN
        RAISE NOTICE '⚠️  Chambres: Aucune chambre créée (normal si premier démarrage)';
    ELSE
        RAISE NOTICE '✅ Chambres: % trouvée(s)', room_count;
    END IF;
    
    IF admin_count = 0 THEN
        RAISE NOTICE '❌ PROBLÈME: Aucun utilisateur admin trouvé';
        RAISE NOTICE '   → Exécuter: database/SETUP_INITIAL_DATA.sql';
    ELSE
        RAISE NOTICE '✅ Utilisateurs admin: % trouvé(s)', admin_count;
    END IF;
    
    RAISE NOTICE '';
    
    IF hotel_count > 0 AND type_count >= 24 AND admin_count > 0 THEN
        RAISE NOTICE '🎉 TOUT EST PRÊT POUR CRÉER DES CHAMBRES!';
        RAISE NOTICE '';
        RAISE NOTICE 'Vous pouvez maintenant:';
        RAISE NOTICE '1. Aller sur https://zen-lyart.vercel.app/rooms';
        RAISE NOTICE '2. Cliquer sur "Ajouter une chambre"';
        RAISE NOTICE '3. Remplir le formulaire';
        RAISE NOTICE '4. Cliquer "Enregistrer"';
    ELSE
        RAISE NOTICE '⚠️  CONFIGURATION INCOMPLÈTE';
        RAISE NOTICE '';
        RAISE NOTICE 'Actions requises:';
        RAISE NOTICE '1. Exécuter: database/SETUP_INITIAL_DATA.sql';
        RAISE NOTICE '2. Attendre 30 secondes';
        RAISE NOTICE '3. Réexécuter ce script de diagnostic';
    END IF;
    
    RAISE NOTICE '============================================';
END $$;

