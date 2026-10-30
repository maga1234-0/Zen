-- =====================================================
-- TEST FACTURE AVEC RÉSERVATION EXISTANTE
-- =====================================================
-- Ce script utilise une réservation existante pour créer un scénario de test

DO $$
DECLARE
  v_booking record;
  v_order_id UUID;
BEGIN
  -- Trouver une réservation 'checked_in' ou 'confirmed' existante
  SELECT 
    b.id as booking_id,
    b.guest_id,
    b.room_id
  INTO v_booking
  FROM bookings b
  WHERE b.status IN ('checked_in', 'confirmed')
  ORDER BY b.created_at DESC
  LIMIT 1;

  -- Si aucune réservation trouvée, afficher un message
  IF v_booking.booking_id IS NULL THEN
    RAISE NOTICE '❌ Aucune réservation existante trouvée';
    RAISE NOTICE '💡 Créez d''abord une réservation dans l''application (Front Desk → Nouvelle Réservation)';
    RETURN;
  END IF;

  RAISE NOTICE '✅ Réservation trouvée: %', v_booking.booking_id;

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
    v_booking.guest_id,
    v_booking.booking_id,
    85.50,
    'unpaid',
    'completed',
    NOW()
  ) RETURNING id INTO v_order_id;

  RAISE NOTICE '✅ Commande restaurant créée: %', v_order_id;

  -- Ajouter des items à la commande
  INSERT INTO restaurant_order_items (order_id, item_name, quantity, unit_price)
  VALUES
    (v_order_id, 'Burger Deluxe', 2, 18.50),
    (v_order_id, 'Salade César', 1, 12.00),
    (v_order_id, 'Coca-Cola', 2, 4.50),
    (v_order_id, 'Tiramisu', 2, 8.00),
    (v_order_id, 'Café Espresso', 2, 3.50);

  RAISE NOTICE '✅ Items ajoutés à la commande';

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
      v_booking.guest_id,
      v_booking.booking_id,
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

    RAISE NOTICE '✅ Réservation spa créée';
  ELSE
    RAISE NOTICE '⚠️  Pas de services spa - ignoré';
  END IF;

  -- Afficher le résumé
  RAISE NOTICE '==========================================';
  RAISE NOTICE '✅ TEST CRÉÉ AVEC SUCCÈS !';
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'Booking ID: %', v_booking.booking_id;
  RAISE NOTICE 'Restaurant ajouté: 85.50 €';
  RAISE NOTICE 'Spa ajouté: 120.00 €';
  RAISE NOTICE '';
  RAISE NOTICE '👉 Allez dans l''application:';
  RAISE NOTICE '   Paiements & Factures → Factures Consolidées';
  RAISE NOTICE '==========================================';
END $$;

-- Vérification : Afficher les dernières factures
SELECT 
  b.id as booking_id,
  g.first_name || ' ' || g.last_name as client,
  r.room_number,
  b.total_amount::numeric(10,2) as "Chambre (€)",
  COALESCE((SELECT SUM(ro.total_amount) FROM restaurant_orders ro WHERE ro.booking_id = b.id), 0)::numeric(10,2) as "Restaurant (€)",
  COALESCE((SELECT SUM(sb.total_amount) FROM spa_bookings sb WHERE sb.booking_id = b.id), 0)::numeric(10,2) as "Spa (€)",
  (
    b.total_amount + 
    COALESCE((SELECT SUM(ro.total_amount) FROM restaurant_orders ro WHERE ro.booking_id = b.id), 0) +
    COALESCE((SELECT SUM(sb.total_amount) FROM spa_bookings sb WHERE sb.booking_id = b.id), 0)
  )::numeric(10,2) as "TOTAL (€)",
  (
    b.total_amount + 
    COALESCE((SELECT SUM(ro.total_amount) FROM restaurant_orders ro WHERE ro.booking_id = b.id), 0) +
    COALESCE((SELECT SUM(sb.total_amount) FROM spa_bookings sb WHERE sb.booking_id = b.id), 0) -
    COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.booking_id = b.id AND p.payment_status = 'completed'), 0)
  )::numeric(10,2) as "Solde (€)"
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
WHERE b.status IN ('checked_in', 'confirmed', 'checked_out')
  AND (
    EXISTS (SELECT 1 FROM restaurant_orders ro WHERE ro.booking_id = b.id)
    OR EXISTS (SELECT 1 FROM spa_bookings sb WHERE sb.booking_id = b.id)
  )
ORDER BY b.created_at DESC
LIMIT 5;
