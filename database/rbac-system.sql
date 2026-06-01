-- ============================================
-- SYSTÈME RBAC COMPLET - PMS HÔTELIER
-- ============================================
-- Role-Based Access Control (RBAC)
-- Version: 1.0
-- Date: 2026-05-31
-- ============================================

-- ============================================
-- 1. TABLE DES RÔLES
-- ============================================

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    level INTEGER NOT NULL DEFAULT 0, -- Niveau hiérarchique (0 = plus élevé)
    is_system_role BOOLEAN DEFAULT false, -- Rôle système non modifiable
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. TABLE DES PERMISSIONS
-- ============================================

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL, -- Ex: reservation.create
    module VARCHAR(50) NOT NULL, -- Ex: reservation, room, spa
    action VARCHAR(50) NOT NULL, -- Ex: create, read, update, delete
    description TEXT,
    is_system_permission BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. TABLE DE LIAISON RÔLES-PERMISSIONS
-- ============================================

CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID REFERENCES users(id),
    UNIQUE(role_id, permission_id)
);

-- ============================================
-- 4. TABLE DE LIAISON UTILISATEURS-RÔLES
-- ============================================

CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    expires_at TIMESTAMP, -- Pour rôles temporaires
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, role_id)
);

-- ============================================
-- 5. TABLE DES LOGS D'ACCÈS
-- ============================================

CREATE TABLE IF NOT EXISTS access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    permission_code VARCHAR(100),
    action VARCHAR(50),
    resource_type VARCHAR(50),
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(20), -- success, denied, error
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. INDEX POUR PERFORMANCES
-- ============================================

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);
CREATE INDEX idx_permissions_code ON permissions(code);
CREATE INDEX idx_permissions_module ON permissions(module);
CREATE INDEX idx_access_logs_user ON access_logs(user_id);
CREATE INDEX idx_access_logs_created ON access_logs(created_at);

-- ============================================
-- 7. TRIGGERS POUR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON permissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. INSERTION DES RÔLES
-- ============================================

INSERT INTO roles (name, code, description, level, is_system_role) VALUES
('Super Administrateur', 'super_admin', 'Accès complet à tous les modules et paramètres système', 0, true),
('Directeur Hôtel', 'hotel_manager', 'Gestion complète de l''hôtel, accès à tous les rapports', 1, true),
('Responsable Réception', 'front_desk_manager', 'Gestion de la réception et des réservations', 2, true),
('Réceptionniste', 'receptionist', 'Opérations quotidiennes de réception', 3, true),
('Responsable Restaurant', 'restaurant_manager', 'Gestion du restaurant et du personnel', 2, true),
('Serveur Restaurant', 'waiter', 'Service en salle et prise de commandes', 3, true),
('Caissier Restaurant', 'restaurant_cashier', 'Gestion des paiements restaurant', 3, true),
('Responsable Spa', 'spa_manager', 'Gestion du spa et des thérapeutes', 2, true),
('Réception Spa', 'spa_receptionist', 'Réservations et accueil spa', 3, true),
('Thérapeute / Praticien', 'therapist', 'Prestations de soins spa', 3, true),
('Responsable Boutique', 'shop_manager', 'Gestion de la boutique et des stocks', 2, true),
('Caissier Boutique', 'shop_cashier', 'Ventes et encaissements boutique', 3, true),
('Responsable Housekeeping', 'housekeeping_manager', 'Gestion du service d''étage', 2, true),
('Agent Housekeeping', 'housekeeper', 'Nettoyage et entretien des chambres', 3, true),
('Comptable', 'accountant', 'Gestion financière et comptabilité', 2, true),
('Client Hôtel', 'guest', 'Accès au portail client', 10, true);
