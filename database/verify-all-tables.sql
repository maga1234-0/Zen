-- ============================================
-- VÉRIFICATION DE TOUTES LES TABLES DU SYSTÈME
-- ============================================
-- Exécutez ce script dans Supabase SQL Editor pour vérifier que toutes les tables existent

-- ============================================
-- LISTE COMPLÈTE DES TABLES
-- ============================================

SELECT 
    'TABLES PRINCIPALES' as category,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'users',
    'room_types',
    'rooms',
    'guests',
    'bookings',
    'payments',
    'housekeeping_tasks',
    'maintenance_requests',
    'notifications',
    'audit_logs'
)

UNION ALL

SELECT 
    'TABLES SPA' as category,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'spa_categories',
    'spa_services',
    'spa_therapists',
    'spa_bookings',
    'spa_packages',
    'spa_package_services',
    'spa_products',
    'spa_inventory',
    'spa_treatments',
    'spa_reviews',
    'spa_promotions',
    'spa_memberships',
    'spa_member_bookings'
)

UNION ALL

SELECT 
    'TABLES RESTAURANT' as category,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'restaurant_categories',
    'restaurant_menu_items',
    'restaurant_tables',
    'restaurant_orders',
    'restaurant_order_items',
    'restaurant_reservations',
    'restaurant_inventory',
    'restaurant_suppliers',
    'restaurant_staff_shifts'
)

UNION ALL

SELECT 
    'TABLES RÉSERVATION EN LIGNE' as category,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'online_bookings',
    'online_booking_guests',
    'online_booking_rooms',
    'online_booking_payments',
    'promo_codes',
    'booking_sources'
);

-- ============================================
-- DÉTAIL DE TOUTES LES TABLES
-- ============================================

SELECT 
    CASE 
        WHEN table_name IN ('users', 'room_types', 'rooms', 'guests', 'bookings', 'payments', 'housekeeping_tasks', 'maintenance_requests', 'notifications', 'audit_logs') 
            THEN '1. PRINCIPALES'
        WHEN table_name LIKE 'spa_%' 
            THEN '2. SPA'
        WHEN table_name LIKE 'restaurant_%' 
            THEN '3. RESTAURANT'
        WHEN table_name IN ('online_bookings', 'online_booking_guests', 'online_booking_rooms', 'online_booking_payments', 'promo_codes', 'booking_sources') 
            THEN '4. RÉSERVATION EN LIGNE'
        ELSE '5. AUTRES'
    END as module,
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND columns.table_name = tables.table_name) as column_count,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name)::regclass)) as size
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY module, table_name;

-- ============================================
-- VÉRIFICATION DES TABLES MANQUANTES
-- ============================================

-- Tables principales attendues
WITH expected_main_tables AS (
    SELECT unnest(ARRAY[
        'users',
        'room_types',
        'rooms',
        'guests',
        'bookings',
        'payments',
        'housekeeping_tasks',
        'maintenance_requests',
        'notifications',
        'audit_logs'
    ]) as table_name
),
-- Tables spa attendues
expected_spa_tables AS (
    SELECT unnest(ARRAY[
        'spa_categories',
        'spa_services',
        'spa_therapists',
        'spa_bookings',
        'spa_packages',
        'spa_package_services',
        'spa_products',
        'spa_inventory',
        'spa_treatments',
        'spa_reviews',
        'spa_promotions',
        'spa_memberships',
        'spa_member_bookings'
    ]) as table_name
),
-- Tables restaurant attendues
expected_restaurant_tables AS (
    SELECT unnest(ARRAY[
        'restaurant_categories',
        'restaurant_menu_items',
        'restaurant_tables',
        'restaurant_orders',
        'restaurant_order_items',
        'restaurant_reservations',
        'restaurant_inventory',
        'restaurant_suppliers',
        'restaurant_staff_shifts'
    ]) as table_name
),
-- Tables réservation en ligne attendues
expected_online_tables AS (
    SELECT unnest(ARRAY[
        'online_bookings',
        'online_booking_guests',
        'online_booking_rooms',
        'online_booking_payments',
        'promo_codes',
        'booking_sources'
    ]) as table_name
),
-- Toutes les tables attendues
all_expected AS (
    SELECT 'PRINCIPALES' as module, table_name FROM expected_main_tables
    UNION ALL
    SELECT 'SPA' as module, table_name FROM expected_spa_tables
    UNION ALL
    SELECT 'RESTAURANT' as module, table_name FROM expected_restaurant_tables
    UNION ALL
    SELECT 'RÉSERVATION EN LIGNE' as module, table_name FROM expected_online_tables
),
-- Tables existantes
existing_tables AS (
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
)
-- Tables manquantes
SELECT 
    module,
    table_name as missing_table,
    '❌ MANQUANTE' as status
FROM all_expected
WHERE table_name NOT IN (SELECT table_name FROM existing_tables)
ORDER BY module, table_name;

-- ============================================
-- RÉSUMÉ FINAL
-- ============================================

SELECT 
    '📊 RÉSUMÉ COMPLET' as info,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') as total_tables,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'room_types', 'rooms', 'guests', 'bookings', 'payments', 'housekeeping_tasks', 'maintenance_requests', 'notifications', 'audit_logs')) as tables_principales,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'spa_%') as tables_spa,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'restaurant_%') as tables_restaurant,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('online_bookings', 'online_booking_guests', 'online_booking_rooms', 'online_booking_payments', 'promo_codes', 'booking_sources')) as tables_online;
