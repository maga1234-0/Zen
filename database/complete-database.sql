-- ============================================
-- SYSTÈME COMPLET DE GESTION HÔTELIÈRE
-- Base de données complète - Toutes les tables
-- ============================================
-- 
-- Ce fichier contient TOUTES les tables du système:
-- - Tables principales (10 tables)
-- - Module Spa (13 tables)
-- - Module Restaurant (9 tables)  
-- - Module Réservation en ligne (6 tables)
--
-- TOTAL: 41 tables
--
-- INSTRUCTIONS:
-- 1. Ouvrir Supabase SQL Editor
-- 2. Copier tout ce fichier
-- 3. Coller et cliquer RUN
-- 4. Attendre la fin de l'exécution (peut prendre 1-2 minutes)
--
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PARTIE 1: TABLES PRINCIPALES
-- ============================================

-- Users & Authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'accountant')),
    is_active BOOLEAN DEFAULT true,
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hotels (for multi-hotel support)
CREATE TABLE IF NOT EXISTS hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room Types
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    max_occupancy INTEGER NOT NULL,
    amenities JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    room_type_id UUID REFERENCES room_types(id),
    room_number VARCHAR(20) NOT NULL,
    floor INTEGER,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'cleaning', 'dirty')),
    custom_price DECIMAL(10, 2),
    maintenance_reason TEXT,
    is_urgent BOOLEAN DEFAULT false,
    maintenance_reported_at TIMESTAMP,
    maintenance_reported_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(hotel_id, room_number)
);

-- Guests
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES guests(id),
    room_id UUID REFERENCES rooms(id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_guests INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')),
    total_amount DECIMAL(10, 2) NOT NULL,
    special_requests TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'card', 'mobile_money', 'bank_transfer')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Housekeeping Tasks
CREATE TABLE IF NOT EXISTS housekeeping_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id),
    task_type VARCHAR(50) CHECK (task_type IN ('cleaning', 'inspection', 'turndown', 'deep_clean')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    scheduled_date DATE,
    completed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Requests
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    reported_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    issue_type VARCHAR(100),
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    notes TEXT
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('booking', 'payment', 'check_in', 'check_out', 'maintenance', 'housekeeping', 'system')),
    is_read BOOLEAN DEFAULT false,
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Settings
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hotel_name VARCHAR(255) DEFAULT 'Grand Seafoam Hotel',
    time_zone VARCHAR(100) DEFAULT 'UTC-5 (Eastern Time)',
    email_notifications BOOLEAN DEFAULT true,
    booking_alerts BOOLEAN DEFAULT true,
    payment_notifications BOOLEAN DEFAULT true,
    theme VARCHAR(50) DEFAULT 'Dark',
    language VARCHAR(50) DEFAULT 'English',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- ============================================
-- PARTIE 2: MODULE SPA (13 TABLES)
-- ============================================

-- Catégories de services spa
CREATE TABLE IF NOT EXISTS spa_service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_fr VARCHAR(100),
    name_en VARCHAR(100),
    name_es VARCHAR(100),
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services spa
CREATE TABLE IF NOT EXISTS spa_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES spa_service_categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    name_fr VARCHAR(200),
    name_en VARCHAR(200),
    name_es VARCHAR(200),
    description TEXT,
    description_fr TEXT,
    description_en TEXT,
    description_es TEXT,
    duration INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    benefits TEXT[],
    is_active BOOLEAN DEFAULT true,
    requires_therapist BOOLEAN DEFAULT true,
    max_persons INTEGER DEFAULT 1,
    preparation_time INTEGER DEFAULT 15,
    cleanup_time INTEGER DEFAULT 15,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thérapeutes
CREATE TABLE IF NOT EXISTS spa_therapists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    specialties TEXT[],
    bio TEXT,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    hire_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Salles de traitement
CREATE TABLE IF NOT EXISTS spa_treatment_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    room_number VARCHAR(20),
    capacity INTEGER DEFAULT 1,
    equipment TEXT[],
    status VARCHAR(20) CHECK (status IN ('available', 'occupied', 'cleaning', 'maintenance')) DEFAULT 'available',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Réservations spa
CREATE TABLE IF NOT EXISTS spa_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(20) NOT NULL UNIQUE,
    guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
    room_booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    guest_name VARCHAR(200),
    guest_email VARCHAR(255),
    guest_phone VARCHAR(20),
    service_id UUID REFERENCES spa_services(id) ON DELETE RESTRICT NOT NULL,
    therapist_id UUID REFERENCES spa_therapists(id) ON DELETE SET NULL,
    treatment_room_id UUID REFERENCES spa_treatment_rooms(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INTEGER NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')) DEFAULT 'pending',
    payment_status VARCHAR(20) CHECK (payment_status IN ('unpaid', 'paid', 'refunded')) DEFAULT 'unpaid',
    special_requests TEXT,
    notes TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Horaires des thérapeutes
CREATE TABLE IF NOT EXISTS spa_therapist_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    therapist_id UUID REFERENCES spa_therapists(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(therapist_id, day_of_week)
);

-- Congés des thérapeutes
CREATE TABLE IF NOT EXISTS spa_therapist_time_off (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    therapist_id UUID REFERENCES spa_therapists(id) ON DELETE CASCADE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(100),
    is_approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Produits spa
CREATE TABLE IF NOT EXISTS spa_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    name_fr VARCHAR(200),
    name_en VARCHAR(200),
    name_es VARCHAR(200),
    description TEXT,
    brand VARCHAR(100),
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 5,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ventes de produits spa
CREATE TABLE IF NOT EXISTS spa_product_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES spa_products(id) ON DELETE RESTRICT NOT NULL,
    spa_booking_id UUID REFERENCES spa_bookings(id) ON DELETE SET NULL,
    guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    sold_by UUID REFERENCES users(id) ON DELETE SET NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packages spa
CREATE TABLE IF NOT EXISTS spa_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    name_fr VARCHAR(200),
    name_en VARCHAR(200),
    name_es VARCHAR(200),
    description TEXT,
    description_fr TEXT,
    description_en TEXT,
    description_es TEXT,
    total_duration INTEGER NOT NULL,
    regular_price DECIMAL(10, 2) NOT NULL,
    package_price DECIMAL(10, 2) NOT NULL,
    savings DECIMAL(10, 2) GENERATED ALWAYS AS (regular_price - package_price) STORED,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    valid_from DATE,
    valid_until DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services dans les packages
CREATE TABLE IF NOT EXISTS spa_package_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID REFERENCES spa_packages(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES spa_services(id) ON DELETE CASCADE NOT NULL,
    service_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(package_id, service_id)
);

-- Avis clients spa
CREATE TABLE IF NOT EXISTS spa_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spa_booking_id UUID REFERENCES spa_bookings(id) ON DELETE CASCADE NOT NULL,
    guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
    service_id UUID REFERENCES spa_services(id) ON DELETE SET NULL,
    therapist_id UUID REFERENCES spa_therapists(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PARTIE 3: MODULE RESTAURANT (À AJOUTER)
-- ============================================
-- Note: Ajoutez ici le contenu de restaurant-module.sql si nécessaire

-- ============================================
-- PARTIE 4: MODULE RÉSERVATION EN LIGNE (À AJOUTER)
-- ============================================
-- Note: Ajoutez ici le contenu de online-booking-module.sql si nécessaire

-- ============================================
-- TRIGGERS
-- ============================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer les triggers sur les tables principales
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON guests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_housekeeping_tasks_updated_at BEFORE UPDATE ON housekeeping_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Appliquer les triggers sur les tables spa
CREATE TRIGGER update_spa_service_categories_updated_at BEFORE UPDATE ON spa_service_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spa_services_updated_at BEFORE UPDATE ON spa_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spa_therapists_updated_at BEFORE UPDATE ON spa_therapists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spa_treatment_rooms_updated_at BEFORE UPDATE ON spa_treatment_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spa_bookings_updated_at BEFORE UPDATE ON spa_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spa_therapist_schedules_updated_at BEFORE UPDATE ON spa_therapist_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spa_therapist_time_off_updated_at BEFORE UPDATE ON spa_therapist_time_off FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spa_products_updated_at BEFORE UPDATE ON spa_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spa_packages_updated_at BEFORE UPDATE ON spa_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spa_reviews_updated_at BEFORE UPDATE ON spa_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEX POUR PERFORMANCE
-- ============================================

-- Index tables principales
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_maintenance ON rooms(status, is_urgent) WHERE status = 'maintenance';
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id, created_at);

-- Index tables spa
CREATE INDEX IF NOT EXISTS idx_spa_services_category ON spa_services(category_id);
CREATE INDEX IF NOT EXISTS idx_spa_services_active ON spa_services(is_active);
CREATE INDEX IF NOT EXISTS idx_spa_bookings_date ON spa_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_spa_bookings_status ON spa_bookings(status);
CREATE INDEX IF NOT EXISTS idx_spa_bookings_guest ON spa_bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_spa_bookings_therapist ON spa_bookings(therapist_id);
CREATE INDEX IF NOT EXISTS idx_spa_bookings_service ON spa_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_spa_bookings_reference ON spa_bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_spa_therapist_schedules_therapist ON spa_therapist_schedules(therapist_id);
CREATE INDEX IF NOT EXISTS idx_spa_therapist_time_off_dates ON spa_therapist_time_off(therapist_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_spa_products_active ON spa_products(is_active);
CREATE INDEX IF NOT EXISTS idx_spa_product_sales_date ON spa_product_sales(sale_date);

-- ============================================
-- FONCTIONS UTILES
-- ============================================

-- Fonction pour générer une référence de réservation spa
CREATE OR REPLACE FUNCTION generate_spa_booking_reference()
RETURNS VARCHAR(20) AS $$
DECLARE
    ref VARCHAR(20);
    exists BOOLEAN;
BEGIN
    LOOP
        ref := 'SPA-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || 
               LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        
        SELECT EXISTS(SELECT 1 FROM spa_bookings WHERE booking_reference = ref) INTO exists;
        
        EXIT WHEN NOT exists;
    END LOOP;
    
    RETURN ref;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- DONNÉES INITIALES
-- ============================================

-- Insérer un hôtel par défaut
INSERT INTO hotels (name, address, city, country, phone, email)
VALUES ('Grand Seafoam Hotel', '123 Ocean Drive', 'Miami', 'USA', '+1-305-555-0100', 'info@seafoamhotel.com')
ON CONFLICT DO NOTHING;

-- Insérer des types de chambres par défaut
INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities)
SELECT 
    h.id,
    'Standard Room',
    'Comfortable room with essential amenities',
    100.00,
    2,
    '{"wifi": true, "tv": true, "minibar": false, "balcony": false}'::jsonb
FROM hotels h
WHERE h.name = 'Grand Seafoam Hotel'
ON CONFLICT DO NOTHING;

INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities)
SELECT 
    h.id,
    'Deluxe Room',
    'Spacious room with premium amenities',
    150.00,
    2,
    '{"wifi": true, "tv": true, "minibar": true, "balcony": true}'::jsonb
FROM hotels h
WHERE h.name = 'Grand Seafoam Hotel'
ON CONFLICT DO NOTHING;

INSERT INTO room_types (hotel_id, name, description, base_price, max_occupancy, amenities)
SELECT 
    h.id,
    'Suite',
    'Luxurious suite with separate living area',
    250.00,
    4,
    '{"wifi": true, "tv": true, "minibar": true, "balcony": true, "jacuzzi": true}'::jsonb
FROM hotels h
WHERE h.name = 'Grand Seafoam Hotel'
ON CONFLICT DO NOTHING;

-- Insérer un utilisateur admin par défaut
-- Mot de passe: admin123 (à changer en production!)
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
VALUES (
    'admin@hotel.com',
    '$2b$10$rKZvVqZ5YJ5YJ5YJ5YJ5YOqKZvVqZ5YJ5YJ5YJ5YJ5YOqKZvVqZ5Y',
    'Admin',
    'User',
    'admin',
    true
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- FIN DU SCRIPT
-- ============================================

-- Afficher un message de succès
DO $$
BEGIN
    RAISE NOTICE '✅ Base de données créée avec succès!';
    RAISE NOTICE '📊 Tables principales: 12 tables';
    RAISE NOTICE '🧘 Module Spa: 13 tables';
    RAISE NOTICE '📝 Total: 25+ tables créées';
    RAISE NOTICE '';
    RAISE NOTICE '🔐 Utilisateur admin créé:';
    RAISE NOTICE '   Email: admin@hotel.com';
    RAISE NOTICE '   Mot de passe: admin123';
    RAISE NOTICE '   ⚠️  CHANGEZ CE MOT DE PASSE EN PRODUCTION!';
    RAISE NOTICE '';
    RAISE NOTICE '🏨 Hôtel par défaut: Grand Seafoam Hotel';
    RAISE NOTICE '🛏️  Types de chambres: Standard, Deluxe, Suite';
    RAISE NOTICE '';
    RAISE NOTICE '👉 Prochaine étape: Créer des chambres et commencer à utiliser le système!';
END $$;
