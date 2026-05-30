-- ============================================
-- MODULE RESTAURANT/BAR - VERSION CORRIGÉE
-- Gestion complète du restaurant et bar de l'hôtel
-- ============================================

-- Table des catégories de menu
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_fr VARCHAR(100),
    name_en VARCHAR(100),
    name_es VARCHAR(100),
    type VARCHAR(20) CHECK (type IN ('food', 'beverage', 'both')) DEFAULT 'both',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des articles du menu
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    name_fr VARCHAR(200),
    name_en VARCHAR(200),
    name_es VARCHAR(200),
    description TEXT,
    description_fr TEXT,
    description_en TEXT,
    description_es TEXT,
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2),
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    is_vegetarian BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT false,
    is_gluten_free BOOLEAN DEFAULT false,
    allergens TEXT[],
    preparation_time INTEGER,
    calories INTEGER,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des tables du restaurant
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_number VARCHAR(20) NOT NULL UNIQUE,
    capacity INTEGER NOT NULL,
    location VARCHAR(50) CHECK (location IN ('indoor', 'outdoor', 'terrace', 'bar')) DEFAULT 'indoor',
    status VARCHAR(20) CHECK (status IN ('available', 'occupied', 'reserved', 'cleaning')) DEFAULT 'available',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table des commandes
CREATE TABLE IF NOT EXISTS restaurant_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    table_id UUID REFERENCES restaurant_tables(id) ON DELETE SET NULL,
    guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    order_type VARCHAR(20) CHECK (order_type IN ('dine_in', 'room_service', 'takeaway', 'bar')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled')) DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
    service_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(20) CHECK (payment_status IN ('unpaid', 'paid', 'charged_to_room')) DEFAULT 'unpaid',
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'card', 'room_charge', 'transfer')),
    special_instructions TEXT,
    server_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Table des articles de commande
CREATE TABLE IF NOT EXISTS restaurant_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES restaurant_orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
    item_name VARCHAR(200) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    special_instructions TEXT,
    status VARCHAR(20) CHECK (status IN ('pending', 'preparing', 'ready', 'served')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des réservations de table
CREATE TABLE IF NOT EXISTS table_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_id UUID REFERENCES restaurant_tables(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
    guest_name VARCHAR(200) NOT NULL,
    guest_phone VARCHAR(20),
    guest_email VARCHAR(255),
    number_of_guests INTEGER NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 120,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show')) DEFAULT 'pending',
    special_requests TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de l'inventaire
CREATE TABLE IF NOT EXISTS restaurant_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    unit VARCHAR(50) NOT NULL,
    current_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
    minimum_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
    unit_cost DECIMAL(10, 2),
    supplier VARCHAR(200),
    last_restocked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
