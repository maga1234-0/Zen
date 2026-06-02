-- ============================================
-- FORCE FIX - RÔLES RESTAURANT
-- Ce script SUPPRIME et RECRÉE les rôles restaurant
-- ============================================

-- ÉTAPE 1: Afficher l'état actuel
SELECT '====== ÉTAT ACTUEL ======' as diagnostic;
SELECT name, description, is_active FROM roles ORDER BY name;

-- ÉTAPE 2: SUPPRIMER les anciens rôles restaurant s'ils existent
SELECT '====== SUPPRESSION DES ANCIENS RÔLES ======' as diagnostic;
DELETE FROM roles WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef');

-- ÉTAPE 3: CRÉER les nouveaux rôles (INSERT sans ON CONFLICT)
SELECT '====== CRÉATION DES NOUVEAUX RÔLES ======' as diagnostic;

-- 1. Serveur Restaurant
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
}'::jsonb, true);

-- 2. Caissier Restaurant
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
}'::jsonb, true);

-- 3. Responsable Restaurant
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
}'::jsonb, true);

-- 4. Chef de Cuisine
INSERT INTO roles (name, description, permissions, is_active) VALUES
('restaurant_chef', 'Chef de Cuisine', '{
  "restaurant": {
    "orders": ["read", "update_status"],
    "menu": ["read"],
    "stats": ["read_production"]
  }
}'::jsonb, true);

-- ÉTAPE 4: FORCER la mise à jour d'ADMIN
SELECT '====== MISE À JOUR ADMIN ======' as diagnostic;

-- D'abord, supprimer toutes les permissions restaurant existantes pour admin
UPDATE roles 
SET permissions = permissions - 'restaurant'
WHERE name = 'admin';

-- Ensuite, ajouter les nouvelles permissions restaurant
UPDATE roles 
SET permissions = permissions || '{
  "restaurant": {
    "orders": ["create", "read", "update", "delete"],
    "menu": ["create", "read", "update", "delete"],
    "categories": ["create", "read", "update", "delete"],
    "tables": ["create", "read", "update", "delete", "update_status"],
    "reservations": ["create", "read", "update", "delete"],
    "payments": ["create", "read", "refund"],
    "stats": ["read", "read_production"],
    "reports": ["read", "export"],
    "print": ["all"]
  }
}'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'admin';

-- ÉTAPE 5: FORCER la mise à jour de MANAGER
SELECT '====== MISE À JOUR MANAGER ======' as diagnostic;

-- D'abord, supprimer toutes les permissions restaurant existantes pour manager
UPDATE roles 
SET permissions = permissions - 'restaurant'
WHERE name = 'manager';

-- Ensuite, ajouter les nouvelles permissions restaurant
UPDATE roles 
SET permissions = permissions || '{
  "restaurant": {
    "orders": ["create", "read", "update", "delete"],
    "menu": ["create", "read", "update", "delete"],
    "categories": ["create", "read", "update", "delete"],
    "tables": ["create", "read", "update", "delete", "update_status"],
    "reservations": ["create", "read", "update", "delete"],
    "payments": ["create", "read", "refund"],
    "stats": ["read", "read_production"],
    "reports": ["read", "export"],
    "print": ["all"]
  }
}'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'manager';

-- ÉTAPE 6: VÉRIFICATION FINALE
SELECT '====== VÉRIFICATION FINALE ======' as diagnostic;
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

-- ÉTAPE 7: Compter les rôles
SELECT '====== COMPTAGE FINAL ======' as diagnostic;
SELECT 
    COUNT(*) FILTER (WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef')) as roles_restaurant_crees,
    COUNT(*) FILTER (WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef') AND is_active = true) as roles_restaurant_actifs
FROM roles;

-- MESSAGE FINAL
DO $$ 
DECLARE
    role_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO role_count 
    FROM roles 
    WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef')
    AND is_active = true;
    
    IF role_count = 4 THEN
        RAISE NOTICE '============================================';
        RAISE NOTICE '✅ SUCCÈS! 4 RÔLES RESTAURANT CRÉÉS';
        RAISE NOTICE '============================================';
        RAISE NOTICE 'Les rôles devraient maintenant apparaître dans Staff';
        RAISE NOTICE 'Rafraîchissez votre application (F5 ou Ctrl+Shift+R)';
        RAISE NOTICE '============================================';
    ELSE
        RAISE NOTICE '============================================';
        RAISE NOTICE '⚠️ PROBLÈME: Seulement % rôles créés sur 4', role_count;
        RAISE NOTICE '============================================';
    END IF;
END $$;
