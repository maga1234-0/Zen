-- =====================================================
-- TEST : FACTURE CONSOLIDÉE (Chambre + Restaurant + Spa)
-- =====================================================
-- Ce script crée un scénario de test pour voir la facture consolidée

-- 1. Créer une réservation checked-in (client à l'hôtel)
INSERT INTO bookings (
  guest_id,
  room_id,
  check_in_date,
  check_out_date,
  total_amount,
  status,
  created_at
)
SELECT 
  g.id,
  r.id,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '3 days',
  450.00, -- 3 nuits à 150€
  'checked_in',
  NOW()
FROM guests g
CROSS JOIN rooms r
WHERE g.email = 'aubinmaga@gmail.com'  -- Utilisez un guest existant
  AND r.room_number = '101'             -- Utilisez une chambre existante
  AND r.status = 'available'
LIMIT 1;

-- Récupérer l'ID de la réservation qu'on vient de créer
DO $$
DECLARE
  v_booking_id UUID;
  v_guest_id UUID;
BEGIN
  -- Trouver la dernière réservation créée
  SELECT id INTO v_booking_id 
  FROM bookings 
  WHERE status = 'checked_in' 
  ORDER BY created_at DESC 
  LIMIT 1;
  
  -- Trouver le guest_id
  SELECT guest_id INTO v_guest_id
  FROM bookings
  WHERE id = v_booking_id;

  -- 2. Ajouter une commande restaurant (Room Service)
  INSERT INTO restaurant_orders (
    order_number,
    order_type,
    guest_id,
    booking_id,
    total_amount,
    payment_status,
    status,
    created_at
  ) VALUES (
    'RS-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    'room_service',
    v_guest_id,
    v_booking_id,
    85.50,
    'unpaid',
    'completed',
    NOW()
  );

  -- Récupérer l'ID de la commande
  DECLARE v_order_id UUID;
  BEGIN
    SELECT id INTO v_order_id
    FROM restaurant_orders
    WHERE booking_id = v_booking_id
    LIMIT 1;

    -- Ajouter des items à la commande
    INSERT INTO restaurant_order_items (
      order_id,
      item_name,
      quantity,
      unit_price
    ) VALUES
    (v_order_id, 'Burger Deluxe', 2, 18.50),
    (v_order_id, 'Salade César', 1, 12.00),
    (v_order_id, 'Coca-Cola', 2, 4.50),
    (v_order_id, 'Tiramisu', 2, 8.00),
    (v_order_id, 'Café Espresso', 2, 3.50);
  END;

  -- 3. Ajouter une réservation Spa
  INSERT INTO spa_bookings (
    booking_reference,
    guest_id,
    booking_id,
    treatment_id,
    booking_date,
    start_time,
    end_time,
    total_amount,
    payment_status,
    status,
    created_at
  )
  SELECT 
    'SPA-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    v_guest_id,
    v_booking_id,
    ss.id,
    CURRENT_DATE + INTERVAL '1 day',
    '14:00:00',
    '15:30:00',
    120.00,
    'unpaid',
    'confirmed',
    NOW()
  FROM spa_services ss
  WHERE ss.name ILIKE '%massage%'
  LIMIT 1;

  -- 4. Marquer la chambre comme occupée
  UPDATE rooms 
  SET status = 'occupied'
  WHERE id = (SELECT room_id FROM bookings WHERE id = v_booking_id);

  RAISE NOTICE 'Scénario de test créé avec succès !';
  RAISE NOTICE 'Booking ID: %', v_booking_id;
  RAISE NOTICE 'Charges: Chambre 450€ + Restaurant 85.50€ + Spa 120€ = 655.50€';
END $$;

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- Vérifier les factures impayées
SELECT 
  b.id as booking_id,
  g.first_name || ' ' || g.last_name as guest_name,
  r.room_number,
  b.total_amount as room_charges,
  (SELECT COALESCE(SUM(ro.total_amount), 0) 
   FROM restaurant_orders ro 
   WHERE ro.booking_id = b.id) as restaurant_charges,
  (SELECT COALESCE(SUM(sb.total_amount), 0) 
   FROM spa_bookings sb 
   WHERE sb.booking_id = b.id) as spa_charges,
  b.total_amount + 
  (SELECT COALESCE(SUM(ro.total_amount), 0) FROM restaurant_orders ro WHERE ro.booking_id = b.id) +
  (SELECT COALESCE(SUM(sb.total_amount), 0) FROM spa_bookings sb WHERE sb.booking_id = b.id) as total,
  (SELECT COALESCE(SUM(p.amount), 0) 
   FROM payments p 
   WHERE p.booking_id = b.id AND p.payment_status = 'completed') as paid
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
WHERE b.status = 'checked_in'
ORDER BY b.created_at DESC;
