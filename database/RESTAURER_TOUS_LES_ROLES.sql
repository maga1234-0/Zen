-- ============================================
-- RESTAURATION COMPLÈTE DE TOUS LES RÔLES
-- Ce script restaure les 10 rôles (6 originaux + 4 restaurant)
-- ============================================

SELECT '====== DIAGNOSTIC INITIAL ======' as etape;
SELECT name, description, is_active FROM roles WHERE is_active = true ORDER BY name;

-- ============================================
-- ÉTAPE 1: RESTAURER LES 6 RÔLES ORIGINAUX
-- ============================================

SELECT '====== RESTAURATION DES RÔLES ORIGINAUX ======' as etape;

-- 1. ADMIN - Accès complet à tout le système
INSERT INTO roles (name, description, permissions, is_active) VALUES
('admin', 'Admin', '{
  "users": {
    "staff": ["create", "read", "update", "delete"]
  },
  "bookings": {
    "rooms": ["create", "read", "update", "delete"],
    "checkin": ["execute"],
    "checkout": ["execute"],
    "payments": ["create", "read", "refund"]
  },
  "rooms": {
    "manage": ["create", "read", "update", "delete"],
    "status": ["update"]
  },
  "guests": {
    "manage": ["create", "read", "update", "delete"]
  },
  "housekeeping": {
    "tasks": ["create", "read", "update", "delete", "assign"],
    "status": ["update"]
  },
  "maintenance": {
    "requests": ["create", "read", "update", "delete"],
    "assign": ["execute"]
  },
  "settings": {
    "hotel": ["read", "update"],
    "system": ["read", "update"]
  },
  "reports": {
    "view": ["all"],
    "export": ["all"]
  },
  "spa": {
    "bookings": ["create", "read", "update", "delete"],
    "services": ["create", "read", "update", "delete"],
    "therapists": ["create", "read", "update", "delete"],
    "payments": ["create", "read", "refund"],
    "stats": ["read"]
  },
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
}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    is_active = true,
    updated_at = CURRENT_TIMESTAMP;

-- 2. MANAGER - Gestion opérationnelle complète
INSERT INTO roles (name, description, permissions, is_active) VALUES
('manager', 'Manager', '{
  "users": {
    "staff": ["read"]
  },
  "bookings": {
    "rooms": ["create", "read", "update"],
    "checkin": ["execute"],
    "checkout": ["execute"],
    "payments": ["create", "read"]
  },
  "rooms": {
    "manage": ["read", "update"],
    "status": ["update"]
  },
  "guests": {
    "manage": ["create", "read", "update"]
  },
  "housekeeping": {
    "tasks": ["create", "read", "update", "assign"],
    "status": ["update"]
  },
  "maintenance": {
    "requests": ["create", "read", "update"],
    "assign": ["execute"]
  },
  "settings": {
    "hotel": ["read"]
  },
  "reports": {
    "view": ["all"],
    "export": ["all"]
  },
  "spa": {
    "bookings": ["create", "read", "update", "delete"],
    "services": ["create", "read", "update", "delete"],
    "therapists": ["create", "read", "update", "delete"],
    "payments": ["create", "read", "refund"],
    "stats": ["read"]
  },
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
}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    is_active = true,
    updated_at = CURRENT_TIMESTAMP;

-- 3. RECEPTIONIST - Réception et front desk
INSERT INTO roles (name, description, permissions, is_active) VALUES
('receptionist', 'Receptionist', '{
  "bookings": {
    "rooms": ["create", "read", "update"],
    "checkin": ["execute"],
    "checkout": ["execute"],
    "payments": ["create", "read"]
  },
  "rooms": {
    "manage": ["read"],
    "status": ["read"]
  },
  "guests": {
    "manage": ["create", "read", "update"]
  },
  "reports": {
    "view": ["basic"]
  },
  "restaurant": {
    "orders": ["read"],
    "payments": ["create"],
    "reports": ["read_guest"]
  }
}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    is_active = true,
    updated_at = CURRENT_TIMESTAMP;

-- 4. HOUSEKEEPING - Entretien des chambres
INSERT INTO roles (name, description, permissions, is_active) VALUES
('housekeeping', 'Housekeeping', '{
  "rooms": {
    "manage": ["read"],
    "status": ["update"]
  },
  "housekeeping": {
    "tasks": ["read", "update"],
    "status": ["update"]
  }
}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    is_active = true,
    updated_at = CURRENT_TIMESTAMP;

-- 5. MAINTENANCE - Maintenance technique
INSERT INTO roles (name, description, permissions, is_active) VALUES
('maintenance', 'Maintenance', '{
  "rooms": {
    "manage": ["read"],
    "status": ["read"]
  },
  "maintenance": {
    "requests": ["read", "update"]
  }
}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    is_active = true,
    updated_at = CURRENT_TIMESTAMP;

-- 6. ACCOUNTANT - Comptabilité
INSERT INTO roles (name, description, permissions, is_active) VALUES
('accountant', 'Accountant', '{
  "bookings": {
    "payments": ["read"]
  },
  "reports": {
    "view": ["financial"],
    "export": ["financial"]
  }
}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    is_active = true,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- ÉTAPE 2: RESTAURER LES 4 RÔLES RESTAURANT
-- ============================================

SELECT '====== RESTAURATION DES RÔLES RESTAURANT ======' as etape;

-- 7. SERVEUR RESTAURANT
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

-- 8. CAISSIER RESTAURANT
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

-- 9. RESPONSABLE RESTAURANT
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

-- 10. CHEF DE CUISINE
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

-- ============================================
-- ÉTAPE 3: VÉRIFICATION COMPLÈTE
-- ============================================

SELECT '====== VÉRIFICATION FINALE ======' as etape;

-- Compter les rôles actifs
SELECT 
    COUNT(*) as total_roles_actifs,
    COUNT(*) FILTER (WHERE name IN ('admin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'accountant')) as roles_originaux,
    COUNT(*) FILTER (WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef')) as roles_restaurant
FROM roles 
WHERE is_active = true;

-- Afficher tous les rôles actifs
SELECT 
    name,
    description,
    is_active,
    CASE 
        WHEN name IN ('admin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'accountant') THEN '✅ Rôle Original'
        WHEN name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef') THEN '🍽️ Rôle Restaurant'
        ELSE '❓ Autre'
    END as type_role,
    created_at
FROM roles
WHERE is_active = true
ORDER BY 
    CASE 
        WHEN name = 'admin' THEN 1
        WHEN name = 'manager' THEN 2
        WHEN name = 'receptionist' THEN 3
        WHEN name = 'housekeeping' THEN 4
        WHEN name = 'maintenance' THEN 5
        WHEN name = 'accountant' THEN 6
        WHEN name = 'restaurant_manager' THEN 7
        WHEN name = 'restaurant_chef' THEN 8
        WHEN name = 'restaurant_server' THEN 9
        WHEN name = 'restaurant_cashier' THEN 10
        ELSE 99
    END;

-- ============================================
-- MESSAGE FINAL
-- ============================================
DO $$ 
DECLARE
    total_roles INTEGER;
    roles_originaux INTEGER;
    roles_restaurant INTEGER;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE name IN ('admin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'accountant')),
        COUNT(*) FILTER (WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef'))
    INTO total_roles, roles_originaux, roles_restaurant
    FROM roles 
    WHERE is_active = true;
    
    RAISE NOTICE '============================================';
    RAISE NOTICE '          RESTAURATION TERMINÉE';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'TOTAL RÔLES ACTIFS: %', total_roles;
    RAISE NOTICE '';
    RAISE NOTICE '✅ RÔLES ORIGINAUX: % / 6', roles_originaux;
    RAISE NOTICE '   - admin';
    RAISE NOTICE '   - manager';
    RAISE NOTICE '   - receptionist';
    RAISE NOTICE '   - housekeeping';
    RAISE NOTICE '   - maintenance';
    RAISE NOTICE '   - accountant';
    RAISE NOTICE '';
    RAISE NOTICE '🍽️ RÔLES RESTAURANT: % / 4', roles_restaurant;
    RAISE NOTICE '   - restaurant_server (Serveur)';
    RAISE NOTICE '   - restaurant_cashier (Caissier)';
    RAISE NOTICE '   - restaurant_manager (Responsable)';
    RAISE NOTICE '   - restaurant_chef (Chef)';
    RAISE NOTICE '';
    
    IF total_roles = 10 THEN
        RAISE NOTICE '✅ SUCCÈS COMPLET! Tous les 10 rôles sont restaurés!';
        RAISE NOTICE '';
        RAISE NOTICE 'PROCHAINES ÉTAPES:';
        RAISE NOTICE '1. Rafraîchir l''application (Ctrl+Shift+R)';
        RAISE NOTICE '2. Aller sur Staff → Add New Staff';
        RAISE NOTICE '3. Vérifier que les 10 rôles apparaissent dans la liste';
    ELSE
        RAISE NOTICE '⚠️ ATTENTION: Seulement % rôles sur 10 restaurés', total_roles;
        RAISE NOTICE 'Vérifiez les messages d''erreur ci-dessus';
    END IF;
    RAISE NOTICE '============================================';
END $$;
