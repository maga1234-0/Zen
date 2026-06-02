-- ============================================
-- AJOUT DES RÔLES RESTAURANT
-- Date: 2 juin 2026
-- Description: Ajoute les rôles spécifiques au module Restaurant
-- ============================================

-- Vérifier si la table roles existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'roles') THEN
        RAISE NOTICE 'Table roles non trouvée. Création...';
        
        CREATE TABLE IF NOT EXISTS roles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(50) UNIQUE NOT NULL,
            description TEXT,
            permissions JSONB DEFAULT '{}'::jsonb,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- ============================================
-- 1. SERVEUR RESTAURANT
-- ============================================
INSERT INTO roles (name, description, permissions) VALUES
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
}'::jsonb)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 2. CAISSIER RESTAURANT
-- ============================================
INSERT INTO roles (name, description, permissions) VALUES
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
}'::jsonb)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 3. RESPONSABLE RESTAURANT
-- ============================================
INSERT INTO roles (name, description, permissions) VALUES
('restaurant_manager', 'Responsable Restaurant', '{
  "restaurant": {
    "orders": ["create", "read", "update", "delete"],
    "menu": ["create", "read", "update", "delete"],
    "categories": ["create", "read", "update", "delete"],
    "tables": ["create", "read", "update", "delete"],
    "reservations": ["create", "read", "update", "delete"],
    "payments": ["read", "refund"],
    "stats": ["read"],
    "reports": ["read", "export"],
    "print": ["all"]
  },
  "bookings": {
    "rooms": ["read"]
  }
}'::jsonb)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 4. CHEF DE CUISINE
-- ============================================
INSERT INTO roles (name, description, permissions) VALUES
('restaurant_chef', 'Chef de Cuisine', '{
  "restaurant": {
    "orders": ["read", "update_status"],
    "menu": ["read"],
    "stats": ["read_production"]
  }
}'::jsonb)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 5. EXTENSION RÔLE RECEPTIONIST
-- ============================================
-- Ajouter les permissions restaurant au réceptionniste
UPDATE roles 
SET permissions = permissions || '{
  "restaurant": {
    "orders": ["read"],
    "payments": ["create"],
    "reports": ["read_guest"]
  }
}'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'receptionist';

-- ============================================
-- 6. S'ASSURER QUE ADMIN A TOUS LES DROITS
-- ============================================
UPDATE roles 
SET permissions = permissions || '{
  "restaurant": {
    "orders": ["create", "read", "update", "delete"],
    "menu": ["create", "read", "update", "delete"],
    "categories": ["create", "read", "update", "delete"],
    "tables": ["create", "read", "update", "delete"],
    "reservations": ["create", "read", "update", "delete"],
    "payments": ["create", "read", "refund"],
    "stats": ["read"],
    "reports": ["read", "export"],
    "print": ["all"]
  }
}'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'admin';

-- ============================================
-- 7. S'ASSURER QUE MANAGER A ACCÈS RESTAURANT
-- ============================================
UPDATE roles 
SET permissions = permissions || '{
  "restaurant": {
    "orders": ["create", "read", "update", "delete"],
    "menu": ["create", "read", "update", "delete"],
    "categories": ["create", "read", "update", "delete"],
    "tables": ["create", "read", "update", "delete"],
    "reservations": ["create", "read", "update", "delete"],
    "payments": ["create", "read", "refund"],
    "stats": ["read"],
    "reports": ["read", "export"],
    "print": ["all"]
  }
}'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'manager';

-- ============================================
-- VÉRIFICATION
-- ============================================
-- Afficher tous les rôles créés/modifiés
SELECT 
    name,
    description,
    permissions,
    is_active,
    created_at
FROM roles
WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef', 'receptionist', 'admin', 'manager')
ORDER BY 
    CASE name
        WHEN 'admin' THEN 1
        WHEN 'manager' THEN 2
        WHEN 'restaurant_manager' THEN 3
        WHEN 'restaurant_chef' THEN 4
        WHEN 'restaurant_server' THEN 5
        WHEN 'restaurant_cashier' THEN 6
        WHEN 'receptionist' THEN 7
        ELSE 99
    END;

-- ============================================
-- RÉSUMÉ
-- ============================================
DO $$ 
DECLARE
    role_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO role_count 
    FROM roles 
    WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef');
    
    RAISE NOTICE '============================================';
    RAISE NOTICE 'RÔLES RESTAURANT AJOUTÉS: %', role_count;
    RAISE NOTICE '============================================';
    RAISE NOTICE '✅ restaurant_server - Serveur Restaurant';
    RAISE NOTICE '✅ restaurant_cashier - Caissier Restaurant';
    RAISE NOTICE '✅ restaurant_manager - Responsable Restaurant';
    RAISE NOTICE '✅ restaurant_chef - Chef de Cuisine';
    RAISE NOTICE '✅ receptionist - Étendu avec permissions restaurant';
    RAISE NOTICE '✅ admin - Étendu avec permissions restaurant';
    RAISE NOTICE '✅ manager - Étendu avec permissions restaurant';
    RAISE NOTICE '============================================';
END $$;
