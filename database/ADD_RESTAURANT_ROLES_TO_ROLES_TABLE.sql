-- ============================================
-- AJOUTER LES 4 RÔLES RESTAURANT À LA TABLE ROLES
-- ============================================
-- Ce script ajoute les 4 nouveaux rôles restaurant avec leurs permissions JSONB
-- À exécuter dans Supabase SQL Editor

-- 1. Restaurant Server (Serveur)
INSERT INTO roles (name, description, permissions)
VALUES (
  'restaurant_server',
  'Serveur de restaurant - Gère les commandes et les tables',
  '{
    "restaurant": {
      "orders": ["read", "create"],
      "menu": ["read"],
      "tables": ["read"],
      "print": ["tickets"]
    }
  }'::jsonb
)
ON CONFLICT (name) DO UPDATE
SET 
  description = EXCLUDED.description,
  permissions = EXCLUDED.permissions;

-- 2. Restaurant Cashier (Caissier)
INSERT INTO roles (name, description, permissions)
VALUES (
  'restaurant_cashier',
  'Caissier de restaurant - Gère les paiements restaurant',
  '{
    "restaurant": {
      "orders": ["read", "update_payment"],
      "menu": ["read"],
      "payments": ["create", "refund"],
      "print": ["invoices"]
    }
  }'::jsonb
)
ON CONFLICT (name) DO UPDATE
SET 
  description = EXCLUDED.description,
  permissions = EXCLUDED.permissions;

-- 3. Restaurant Manager (Manager Restaurant)
INSERT INTO roles (name, description, permissions)
VALUES (
  'restaurant_manager',
  'Manager de restaurant - Gestion complète du restaurant',
  '{
    "restaurant": {
      "orders": ["read", "create", "update", "update_status", "update_payment"],
      "menu": ["read", "create", "update", "delete"],
      "tables": ["read", "create", "update", "delete", "update_status"],
      "reservations": ["read", "create", "update", "delete"],
      "payments": ["create", "refund"],
      "stats": ["read"],
      "print": ["tickets", "invoices"]
    }
  }'::jsonb
)
ON CONFLICT (name) DO UPDATE
SET 
  description = EXCLUDED.description,
  permissions = EXCLUDED.permissions;

-- 4. Restaurant Chef (Chef de Cuisine)
INSERT INTO roles (name, description, permissions)
VALUES (
  'restaurant_chef',
  'Chef de cuisine - Gère la production en cuisine',
  '{
    "restaurant": {
      "orders": ["read", "update_status"],
      "menu": ["read"],
      "stats": ["read_production"],
      "print": ["tickets"]
    }
  }'::jsonb
)
ON CONFLICT (name) DO UPDATE
SET 
  description = EXCLUDED.description,
  permissions = EXCLUDED.permissions;

-- 5. Vérifier que les rôles ont bien été créés
SELECT 
  id,
  name,
  description,
  permissions,
  created_at
FROM roles
WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef')
ORDER BY name;

-- 6. Compter combien d'utilisateurs ont chaque rôle
SELECT 
  r.name as role_name,
  COUNT(u.id) as user_count
FROM roles r
LEFT JOIN users u ON u.role_id = r.id
WHERE r.name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef')
GROUP BY r.name
ORDER BY r.name;

