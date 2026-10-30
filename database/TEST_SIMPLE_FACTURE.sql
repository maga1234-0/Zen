-- =====================================================
-- TEST SIMPLE : FACTURE CONSOLIDÉE
-- =====================================================
-- Script simplifié pour créer un scénario de test

-- ÉTAPE 1 : Créer une réservation checked-in
DO $$
DECLARE
  v_booking_id UUID;
  v_guest_id UUID;
  v_room_id UUID;
  v_order_id UUID;
BEGIN
  -- Trouver un guest et une chambre disponible
  SELECT g.id, r.id INTO v_guest_id, v_room_id
  FROM guests g
  CROSS JOIN rooms r
  WHERE g.email = 'aubinmaga@gmail.com'
    AND r.status = 'available'
  LIMIT 1;

  IF v_guest_id IS NULL THEN
    RAISE EXCEPTION 'Aucun guest trouvé avec cet email';
  END IF;

  IF v_room_id IS NULL THEN
    RAISE EXCEPTION 'Aucune chambre disponible';
  END IF;

  -- Créer la réservation
  INSERT INTO bookings (
    guest_id,
    room_id,
    check_in_date,
    check_out_date,
    number_of_guests,
    total_amount,
    status,
    created_at
  ) VALUES (
    v_guest_id,
    v_room_id,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '3 days',
    2,
    450.00,
    'checked_in',
    NOW()
  ) RETURNING id INTO v_booking_id;

  RAISE NOTICE 'Réservation créée: %', v_booking_id;

  -- Marquer la chambre comme occupée
  UPDATE rooms SET status = 'occupied' WHERE id = v_room_id;

  -- Créer une commande restaurant (Room Service)
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
    'RS-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 4, '0'),
    'room_service',
    v_guest_id,
    v_booking_id,
    85.50,
    'unpaid',
    'completed',
    NOW()
  ) RETURNING id INTO v_order_id;

  RAISE NOTICE 'Commande restaurant créée: %', v_order_id;

  -- Ajouter des items à la commande
  INSERT INTO restaurant_order_items (order_id, item_name, quantity, unit_price)
  VALUES
    (v_order_id, 'Burger Deluxe', 2, 18.50),
    (v_order_id, 'Salade César', 1, 12.00),
    (v_order_id, 'Coca-Cola', 2, 4.50),
    (v_order_id, 'Tiramisu', 2, 8.00),
    (v_order_id, 'Café', 2, 3.50);

  -- Créer une réservation Spa (si des services existent)
  IF EXISTS (SELECT 1 FROM spa_services LIMIT 1) THEN
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
      'SPA-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 4, '0'),
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
    LIMIT 1;

    RAISE NOTICE 'Réservation spa créée';
  ELSE
    RAISE NOTICE 'Pas de services spa disponibles - ignoré';
  END IF;

  -- Afficher le résumé
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'RÉSUMÉ DU TEST';
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'Booking ID: %', v_booking_id;
  RAISE NOTICE 'Chambre: 450.00 €';
  RAISE NOTICE 'Restaurant: 85.50 €';
  RAISE NOTICE 'Spa: 120.00 €';
  RAISE NOTICE 'TOTAL: 655.50 €';
  RAISE NOTICE '==========================================';
  RAISE NOTICE '✅ Allez dans l''application → Paiements & Factures → Factures Consolidées';
END $$;

-- Vérification : Afficher les factures impayées
SELECT 
  b.id as booking_id,
  g.first_name || ' ' || g.last_name as client,
  r.room_number as chambre,
  b.total_amount::numeric(10,2) as "Chambre (€)",
  COALESCE(
    (SELECT SUM(ro.total_amount) FROM restaurant_orders ro WHERE ro.booking_id = b.id),
    0
  )::numeric(10,2) as "Restaurant (€)",
  COALESCE(
    (SELECT SUM(sb.total_amount) FROM spa_bookings sb WHERE sb.booking_id = b.id),
    0
  )::numeric(10,2) as "Spa (€)",
  (
    b.total_amount + 
    COALESCE((SELECT SUM(ro.total_amount) FROM restaurant_orders ro WHERE ro.booking_id = b.id), 0) +
    COALESCE((SELECT SUM(sb.total_amount) FROM spa_bookings sb WHERE sb.booking_id = b.id), 0)
  )::numeric(10,2) as "TOTAL (€)",
  COALESCE(
    (SELECT SUM(p.amount) FROM payments p WHERE p.booking_id = b.id AND p.payment_status = 'completed'),
    0
  )::numeric(10,2) as "Payé (€)",
  (
    b.total_amount + 
    COALESCE((SELECT SUM(ro.total_amount) FROM restaurant_orders ro WHERE ro.booking_id = b.id), 0) +
    COALESCE((SELECT SUM(sb.total_amount) FROM spa_bookings sb WHERE sb.booking_id = b.id), 0) -
    COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.booking_id = b.id AND p.payment_status = 'completed'), 0)
  )::numeric(10,2) as "Solde (€)"
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
WHERE b.status = 'checked_in'
ORDER BY b.created_at DESC
LIMIT 5;
