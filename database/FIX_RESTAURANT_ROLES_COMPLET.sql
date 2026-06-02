-- ============================================
-- DIAGNOSTIC ET FIX COMPLET - RÔLES RESTAURANT
-- Date: 2 juin 2026
-- ============================================

-- ÉTAPE 1: DIAGNOSTIC
-- Voir les rôles actuels
SELECT '====== RÔLES ACTUELS ======' as diagnostic;
SELECT name, description, is_active 
FROM roles 
ORDER BY name;

-- Voir les permissions admin
SELECT '====== PERMISSIONS ADMIN ======' as diagnostic;
SELECT name, permissions->'restaurant' as restaurant_permissions
FROM roles 
WHERE name = 'admin';

-- Voir les permissions manager
SELECT '====== PERMISSIONS MANAGER ======' as diagnostic;
SELECT name, permissions->'restaurant' as restaurant_permissions
FROM roles 
WHERE name = 'manager';

-- Voir si les 4 nouveaux rôles existent
SELECT '====== NOUVEAUX RÔLES RESTAURANT ======' as diagnostic;
SELECT name, description, is_active
FROM roles 
WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef');

-- ÉTAPE 2: AJOUT/MISE À JOUR DES RÔLES
-- ============================================

-- 1. SERVEUR RESTAURANT
INSERT INTO roles (name, description, permissions, is_active) VALUES
('restaurant_server', 'Serveur Restaurant', '{
  "restaurant": {
    "orders": ["create", "read", "update_own"],
    "menu": ["read"],
    "tables": ["read", "update_status"],
    "print": ["tickets"]
  },
  "bookings": {
    "rooms": ["read"]
  }
}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    is_active = true,
    updated_at = CURRENT_TIMESTAMP;

-- 2. CAISSIER RESTAURANT
INSERT INTO roles (name, description, permissions, is_active) VALUES
('restaurant_cashier', 'Caissier Restaurant', '{
  "restaurant": {
    "orders": ["read", "update_payment"],
    "payments": ["create", "read", "refund"],
    "print": ["invoices", "receipts"]
  },
  "bookings": {
    "rooms": ["read"],
    "payments": ["create"]
  }
}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    is_active = true,
    updated_at = CURRENT_TIMESTAMP;

-- 3. RESPONSABLE RESTAURANT
INSERT INTO roles (name, description, permissions, is_active) VALUES
('restaurant_manager', 'Responsable Restaurant', '{
  "restaurant": {
    "orders": ["create", "read", "update", "delete"],
    "menu": ["create", "read", "update", "delete"],
    "categories": ["create", "read", "update", "delete"],
    "tables": ["create", "read", "update", "delete", "update_status"],
    "reservations": ["create", "read", "update", "delete"],
    "payments": ["read", "refund"],
    "stats": ["read", "read_production"],
    "reports": ["read", "export"],
    "print": ["all"]
  },
  "bookings": {
    "rooms": ["read"]
  }
}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    is_active = true,
    updated_at = CURRENT_TIMESTAMP;

-- 4. CHEF DE CUISINE
INSERT INTO roles (name, description, permissions, is_active) VALUES
('restaurant_chef', 'Chef de Cuisine', '{
  "restaurant": {
    "orders": ["read", "update_status"],
    "menu": ["read"],
    "stats": ["read_production"]
  }
}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    is_active = true,
    updated_at = CURRENT_TIMESTAMP;

-- ÉTAPE 3: MISE À JOUR ADMIN ET MANAGER
-- ============================================

-- Mettre à jour ADMIN avec toutes les permissions restaurant
UPDATE roles 
SET permissions = jsonb_set(
      COALESCE(permissions, '{}'::jsonb),
      '{restaurant}',
      '{
        "orders": ["create", "read", "update", "delete"],
        "menu": ["create", "read", "update", "delete"],
        "categories": ["create", "read", "update", "delete"],
        "tables": ["create", "read", "update", "delete", "update_status"],
        "reservations": ["create", "read", "update", "delete"],
        "payments": ["create", "read", "refund"],
        "stats": ["read", "read_production"],
        "reports": ["read", "export"],
        "print": ["all"]
      }'::jsonb
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'admin';

-- Mettre à jour MANAGER avec toutes les permissions restaurant
UPDATE roles 
SET permissions = jsonb_set(
      COALESCE(permissions, '{}'::jsonb),
      '{restaurant}',
      '{
        "orders": ["create", "read", "update", "delete"],
        "menu": ["create", "read", "update", "delete"],
        "categories": ["create", "read", "update", "delete"],
        "tables": ["create", "read", "update", "delete", "update_status"],
        "reservations": ["create", "read", "update", "delete"],
        "payments": ["create", "read", "refund"],
        "stats": ["read", "read_production"],
        "reports": ["read", "export"],
        "print": ["all"]
      }'::jsonb
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'manager';

-- ÉTAPE 4: VÉRIFICATION FINALE
-- ============================================

SELECT '====== VÉRIFICATION FINALE - TOUS LES RÔLES ======' as diagnostic;
SELECT 
    name,
    description,
    is_active,
    permissions->'restaurant' as restaurant_permissions,
    created_at
FROM roles
WHERE name IN ('admin', 'manager', 'restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef')
ORDER BY 
    CASE name
        WHEN 'admin' THEN 1
        WHEN 'manager' THEN 2
        WHEN 'restaurant_manager' THEN 3
        WHEN 'restaurant_chef' THEN 4
        WHEN 'restaurant_server' THEN 5
        WHEN 'restaurant_cashier' THEN 6
        ELSE 99
    END;

-- Compter les rôles restaurant actifs
SELECT '====== RÉSUMÉ ======' as diagnostic;
SELECT 
    COUNT(*) as nombre_roles_restaurant,
    COUNT(*) FILTER (WHERE is_active = true) as nombre_actifs
FROM roles 
WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef');

-- ============================================
-- MESSAGE FINAL
-- ============================================
DO $$ 
DECLARE
    role_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO role_count 
    FROM roles 
    WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef')
    AND is_active = true;
    
    RAISE NOTICE '============================================';
    RAISE NOTICE '✅ SCRIPT EXÉCUTÉ AVEC SUCCÈS';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Rôles restaurant actifs: %', role_count;
    RAISE NOTICE '';
    RAISE NOTICE 'RÔLES CRÉÉS/MIS À JOUR:';
    RAISE NOTICE '  ✅ restaurant_server - Serveur Restaurant';
    RAISE NOTICE '  ✅ restaurant_cashier - Caissier Restaurant';
    RAISE NOTICE '  ✅ restaurant_manager - Responsable Restaurant';
    RAISE NOTICE '  ✅ restaurant_chef - Chef de Cuisine';
    RAISE NOTICE '';
    RAISE NOTICE 'RÔLES ÉTENDUS:';
    RAISE NOTICE '  ✅ admin - Toutes permissions restaurant';
    RAISE NOTICE '  ✅ manager - Toutes permissions restaurant';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Ces rôles devraient maintenant apparaître dans';
    RAISE NOTICE 'le dropdown Staff de votre application.';
    RAISE NOTICE '============================================';
END $$;
