-- ============================================
-- LISTE SIMPLE DE TOUTES LES TABLES
-- ============================================

-- Afficher toutes les tables existantes dans la base de données
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('users', 'room_types', 'rooms', 'guests', 'bookings', 'payments', 'housekeeping_tasks', 'maintenance_requests', 'notifications', 'audit_logs') 
            THEN 'PRINCIPALES'
        WHEN table_name LIKE 'spa_%' 
            THEN 'SPA'
        WHEN table_name LIKE 'restaurant_%' 
            THEN 'RESTAURANT'
        WHEN table_name IN ('online_bookings', 'online_booking_guests', 'online_booking_rooms', 'online_booking_payments', 'promo_codes', 'booking_sources') 
            THEN 'RÉSERVATION EN LIGNE'
        ELSE 'AUTRES'
    END as module
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY module, table_name;
