-- DIAGNOSTIC DASHBOARD - Vérifier pourquoi le dashboard affiche des zéros

-- 1. Vérifier les hôtels
SELECT 'HOTELS' as table_name, COUNT(*) as count FROM hotels;
SELECT * FROM hotels;

-- 2. Vérifier les chambres
SELECT 'ROOMS' as table_name, COUNT(*) as count FROM rooms;
SELECT id, room_number, hotel_id, status FROM rooms LIMIT 5;

-- 3. Vérifier les réservations
SELECT 'BOOKINGS' as table_name, COUNT(*) as count FROM bookings;
SELECT id, hotel_id, status, total_amount, created_at FROM bookings LIMIT 5;

-- 4. Vérifier les clients
SELECT 'GUESTS' as table_name, COUNT(*) as count FROM guests;
SELECT id, first_name, last_name FROM guests LIMIT 5;

-- 5. Vérifier les paiements
SELECT 'PAYMENTS' as table_name, COUNT(*) as count FROM payments;
SELECT id, amount, payment_date FROM payments LIMIT 5;

-- 6. Vérifier si les hotel_id correspondent
SELECT 
  'HOTEL_ID_MISMATCH' as issue,
  (SELECT id FROM hotels LIMIT 1) as actual_hotel_id,
  '550e8400-e29b-41d4-a716-446655440000' as hardcoded_hotel_id,
  CASE 
    WHEN (SELECT id FROM hotels LIMIT 1) = '550e8400-e29b-41d4-a716-446655440000' 
    THEN '✅ IDs MATCH' 
    ELSE '❌ IDs DO NOT MATCH - THIS IS THE PROBLEM!' 
  END as status;

-- 7. Compter les réservations avec le bon hotel_id
SELECT 
  'BOOKINGS_WITH_CORRECT_HOTEL_ID' as check_name,
  COUNT(*) as count,
  (SELECT id FROM hotels LIMIT 1) as hotel_id_used
FROM bookings 
WHERE hotel_id = (SELECT id FROM hotels LIMIT 1);

-- 8. Compter les réservations avec le mauvais hotel_id (codé en dur)
SELECT 
  'BOOKINGS_WITH_HARDCODED_HOTEL_ID' as check_name,
  COUNT(*) as count,
  '550e8400-e29b-41d4-a716-446655440000' as hotel_id_used
FROM bookings 
WHERE hotel_id = '550e8400-e29b-41d4-a716-446655440000';

-- 9. Vérifier le revenue total
SELECT 
  'TOTAL_REVENUE' as metric,
  COALESCE(SUM(total_amount), 0) as value,
  COUNT(*) as booking_count
FROM bookings;

-- 10. Vérifier le revenue avec le bon hotel_id
SELECT 
  'REVENUE_WITH_CORRECT_HOTEL_ID' as metric,
  COALESCE(SUM(total_amount), 0) as value,
  COUNT(*) as booking_count,
  (SELECT id FROM hotels LIMIT 1) as hotel_id_used
FROM bookings 
WHERE hotel_id = (SELECT id FROM hotels LIMIT 1);
