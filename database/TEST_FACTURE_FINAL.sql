-- =====================================================
-- TEST FACTURE CONSOLIDÉE - VERSION FINALE
-- =====================================================
-- Ce script ajoute des charges à une réservation existante

DO $$
DECLARE
  v_booking record;
  v_order_id UUID;
BEGIN
  -- Trouver une réservation 'checked_in' ou 'confirmed' existante
  SELECT 
    b.id as booking_id,
    b.guest_id,
    b.room_id,
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number
  INTO v_booking
  FROM bookings b
  JOIN guests g ON b.guest_id = g.id
  JOIN rooms r ON b.room_id = r.id
  WHERE b.status IN ('checked_in', 'confirmed')
  ORDER BY b.created_at DESC
  LIMIT 1;

  -- Si aucune réservation trouvée
  IF v_booking.booking_id IS NULL THEN
    RAISE NOTICE '==========================================';
    RAISE NOTICE '❌ AUCUNE RÉSERVATION TROUVÉE';
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'Créez d''abord une réservation dans l''application :';
    RAISE NOTICE '1. Ouvrez https://zen-lyart.vercel.app';
    RAISE NOTICE '2. Allez dans Front Desk → Réservations';
    RAISE NOTICE '3. Créez une nouvelle réservation';
    RAISE NOTICE '4. Relancez ce script';
    RAISE NOTICE '==========================================';
    RETURN;
  END IF;

  RAISE NOTICE '✅ Réservation trouvée: %', v_booking.guest_name;
  RAISE NOTICE '   Chambre: %', v_booking.room_number;

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

  RAISE NOTICE '✅ Commande restaurant créée';

  -- Ajouter des items à la commande AVEC subtotal calculé
  INSERT INTO restaurant_order_items (order_id, item_name, quantity, unit_price, subtotal)
  VALUES
    (v_order_id, 'Burger Deluxe', 2, 18.50, 2 * 18.50),
    (v_order_id, 'Salade César', 1, 12.00, 1 * 12.00),
    (v_order_id, 'Coca-Cola', 2, 4.50, 2 * 4.50),
    (v_order_id, 'Tiramisu', 2, 8.00, 2 * 8.00),
    (v_order_id, 'Café Espresso', 2, 3.50, 2 * 3.50);

  RAISE NOTICE '✅ Items ajoutés (5 items, total: 85.50€)';

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

    RAISE NOTICE '✅ Réservation spa créée (120.00€)';
  ELSE
    RAISE NOTICE '⚠️  Pas de services spa disponibles';
  END IF;

  -- Afficher le résumé
  RAISE NOTICE '';
  RAISE NOTICE '==========================================';
  RAISE NOTICE '🎉 TEST CRÉÉ AVEC SUCCÈS !';
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'Client: %', v_booking.guest_name;
  RAISE NOTICE 'Chambre: %', v_booking.room_number;
  RAISE NOTICE 'Booking ID: %', v_booking.booking_id;
  RAISE NOTICE '';
  RAISE NOTICE '💰 Charges ajoutées:';
  RAISE NOTICE '   🍔 Restaurant: 85.50 €';
  RAISE NOTICE '   💆 Spa: 120.00 €';
  RAISE NOTICE '   ──────────────────────';
  RAISE NOTICE '   📊 Total ajouté: 205.50 €';
  RAISE NOTICE '';
  RAISE NOTICE '👉 PROCHAINE ÉTAPE:';
  RAISE NOTICE '   1. Ouvrez https://zen-lyart.vercel.app';
  RAISE NOTICE '   2. Allez dans: Paiements & Factures';
  RAISE NOTICE '   3. Onglet: Factures Consolidées';
  RAISE NOTICE '   4. Cherchez: %', v_booking.guest_name;
  RAISE NOTICE '   5. Cliquez: Voir Détails';
  RAISE NOTICE '==========================================';
END $$;

-- =====================================================
-- VÉRIFICATION : Afficher les factures avec charges
-- =====================================================
SELECT 
  b.id as booking_id,
  g.first_name || ' ' || g.last_name as "Client",
  r.room_number as "Chambre",
  b.status as "Statut",
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
