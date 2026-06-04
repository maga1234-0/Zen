-- ============================================
-- DIAGNOSTIC COMPLET DES RÔLES
-- ============================================

-- 1. COMPTER LES RÔLES ACTIFS
SELECT '====== COMPTAGE DES RÔLES ======' as diagnostic;
SELECT 
    COUNT(*) as total_roles_actifs,
    COUNT(*) FILTER (WHERE name IN ('admin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'accountant')) as roles_originaux,
    COUNT(*) FILTER (WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef')) as roles_restaurant
FROM roles 
WHERE is_active = true;

-- 2. LISTER TOUS LES RÔLES ACTIFS
SELECT '====== LISTE DES RÔLES ACTIFS ======' as diagnostic;
SELECT 
    name,
    description,
    is_active,
    created_at,
    updated_at
FROM roles
WHERE is_active = true
ORDER BY 
    CASE name
        WHEN 'admin' THEN 1
        WHEN 'manager' THEN 2
        WHEN 'receptionist' THEN 3
        WHEN 'housekeeping' THEN 4
        WHEN 'maintenance' THEN 5
        WHEN 'accountant' THEN 6
        WHEN 'restaurant_manager' THEN 7
        WHEN 'restaurant_chef' THEN 8
        WHEN 'restaurant_server' THEN 9
        WHEN 'restaurant_cashier' THEN 10
        ELSE 99
    END;

-- 3. VÉRIFIER LES PERMISSIONS ADMIN
SELECT '====== PERMISSIONS ADMIN ======' as diagnostic;
SELECT 
    name,
    permissions->'restaurant' as restaurant_permissions,
    permissions->'spa' as spa_permissions
FROM roles
WHERE name = 'admin';

-- 4. VÉRIFIER LES PERMISSIONS MANAGER
SELECT '====== PERMISSIONS MANAGER ======' as diagnostic;
SELECT 
    name,
    permissions->'restaurant' as restaurant_permissions,
    permissions->'spa' as spa_permissions
FROM roles
WHERE name = 'manager';

-- 5. VÉRIFIER LES RÔLES MANQUANTS
SELECT '====== RÔLES MANQUANTS ======' as diagnostic;

WITH expected_roles AS (
    SELECT unnest(ARRAY[
        'admin', 'manager', 'receptionist', 
        'housekeeping', 'maintenance', 'accountant',
        'restaurant_server', 'restaurant_cashier', 
        'restaurant_manager', 'restaurant_chef'
    ]) as role_name
)
SELECT 
    role_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM roles WHERE name = role_name AND is_active = true) 
        THEN '✅ Présent'
        ELSE '❌ MANQUANT'
    END as status
FROM expected_roles
ORDER BY role_name;

-- 6. VÉRIFIER LES RÔLES INACTIFS
SELECT '====== RÔLES INACTIFS ======' as diagnostic;
SELECT 
    name,
    description,
    is_active,
    updated_at
FROM roles
WHERE is_active = false;

-- 7. SIMULER LA REQUÊTE BACKEND
SELECT '====== SIMULATION REQUÊTE BACKEND /auth/roles ======' as diagnostic;
SELECT 
    id, 
    name, 
    description, 
    is_active 
FROM roles 
WHERE is_active = true 
ORDER BY 
    CASE name
        WHEN 'admin' THEN 1
        WHEN 'manager' THEN 2
        WHEN 'receptionist' THEN 3
        WHEN 'housekeeping' THEN 4
        WHEN 'maintenance' THEN 5
        WHEN 'accountant' THEN 6
        ELSE 99
    END,
    name;

-- 8. RAPPORT FINAL
DO $$ 
DECLARE
    total_roles INTEGER;
    roles_originaux INTEGER;
    roles_restaurant INTEGER;
    missing_roles TEXT[];
BEGIN
    -- Compter
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE name IN ('admin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'accountant')),
        COUNT(*) FILTER (WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef'))
    INTO total_roles, roles_originaux, roles_restaurant
    FROM roles 
    WHERE is_active = true;
    
    -- Trouver les rôles manquants
    SELECT ARRAY_AGG(role_name)
    INTO missing_roles
    FROM (
        SELECT unnest(ARRAY[
            'admin', 'manager', 'receptionist', 
            'housekeeping', 'maintenance', 'accountant',
            'restaurant_server', 'restaurant_cashier', 
            'restaurant_manager', 'restaurant_chef'
        ]) as role_name
    ) expected
    WHERE NOT EXISTS (
        SELECT 1 FROM roles 
        WHERE name = role_name AND is_active = true
    );
    
    -- Afficher le rapport
    RAISE NOTICE '============================================';
    RAISE NOTICE '        RAPPORT DE DIAGNOSTIC';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
    RAISE NOTICE 'TOTAL RÔLES ACTIFS: % / 10', total_roles;
    RAISE NOTICE 'Rôles originaux: % / 6', roles_originaux;
    RAISE NOTICE 'Rôles restaurant: % / 4', roles_restaurant;
    RAISE NOTICE '';
    
    IF total_roles = 10 THEN
        RAISE NOTICE '✅ SUCCÈS! Tous les 10 rôles sont présents!';
        RAISE NOTICE '';
        RAISE NOTICE 'Si les rôles n''apparaissent pas dans l''app:';
        RAISE NOTICE '1. Vider le cache du navigateur (Ctrl+Shift+R)';
        RAISE NOTICE '2. Tester l''API: https://zen-backend-jzjh.onrender.com/auth/roles';
        RAISE NOTICE '3. Vérifier la console DevTools (F12)';
    ELSE
        RAISE NOTICE '❌ PROBLÈME: Seulement % rôles sur 10', total_roles;
        RAISE NOTICE '';
        IF missing_roles IS NOT NULL THEN
            RAISE NOTICE 'RÔLES MANQUANTS:';
            RAISE NOTICE '%', array_to_string(missing_roles, ', ');
            RAISE NOTICE '';
        END IF;
        RAISE NOTICE 'ACTION REQUISE:';
        RAISE NOTICE 'Exécuter le script: database/RESTAURER_TOUS_LES_ROLES.sql';
    END IF;
    
    RAISE NOTICE '============================================';
END $$;
