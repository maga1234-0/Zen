-- ============================================
-- DIAGNOSTIC COMPLET - PROBLÈME RÔLES RESTAURANT
-- ============================================

-- ÉTAPE 1: Vérifier que la table roles existe
SELECT '====== 1. VÉRIFICATION TABLE ROLES ======' as etape;
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'roles'
ORDER BY ordinal_position;

-- ÉTAPE 2: Voir TOUS les rôles actuels
SELECT '====== 2. TOUS LES RÔLES ACTUELS ======' as etape;
SELECT 
    id,
    name,
    description,
    is_active,
    created_at,
    updated_at
FROM roles
ORDER BY name;

-- ÉTAPE 3: Compter les rôles
SELECT '====== 3. COMPTAGE DES RÔLES ======' as etape;
SELECT 
    COUNT(*) as total_roles,
    COUNT(*) FILTER (WHERE is_active = true) as roles_actifs,
    COUNT(*) FILTER (WHERE name LIKE 'restaurant%') as roles_restaurant
FROM roles;

-- ÉTAPE 4: Chercher spécifiquement les rôles restaurant
SELECT '====== 4. RECHERCHE RÔLES RESTAURANT ======' as etape;
SELECT 
    name,
    description,
    is_active,
    permissions
FROM roles
WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef');

-- ÉTAPE 5: Voir les permissions admin et manager
SELECT '====== 5. PERMISSIONS ADMIN/MANAGER ======' as etape;
SELECT 
    name,
    permissions->'restaurant' as restaurant_permissions
FROM roles
WHERE name IN ('admin', 'manager');

-- ÉTAPE 6: Vérifier s'il y a des contraintes ou triggers sur la table
SELECT '====== 6. CONTRAINTES ET TRIGGERS ======' as etape;
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'roles';

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- Après avoir exécuté ce script, envoyez-moi:
-- 1. Le résultat de l'ÉTAPE 2 (tous les rôles)
-- 2. Le résultat de l'ÉTAPE 3 (comptage)
-- 3. Le résultat de l'ÉTAPE 4 (recherche restaurant)
-- ============================================
