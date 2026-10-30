-- =====================================================
-- TEST FACTURE CONSOLIDÉE - RESTAURANT SEULEMENT
-- =====================================================
-- Version simplifiée : ajoute seulement une commande restaurant à une réservation

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
    b.total_amount as room_total,
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
    RAISE NOTICE '';
    RAISE NOTICE '📋 Créez d''abord une réservation :';
    RAISE NOTICE '   1. Ouvrez https://zen-lyart.vercel.app';
    RAISE NOTICE '   2. Connectez-vous avec aubinmaga@gmail.com';
    RAISE NOTICE '   3. Allez dans Front Desk → Réservations';
    RAISE NOTICE '   4. Créez une nouvelle réservation';
    RAISE NOTICE '   5. Relancez ce script';
    RAISE NOTICE '';
    RAISE NOTICE '==========================================';
    RETURN;
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '==========================================';
  RAISE NOTICE '🏨 RÉSERVATION TROUVÉE';
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'Client: %', v_booking.guest_name;
  RAISE NOTICE 'Chambre: %', v_booking.room_number;
  RAISE NOTICE 'Montant chambre: % €', v_booking.room_total;
  RAISE NOTICE '';

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

  RAISE NOTICE '✅ 5 items ajoutés à la commande';

  -- Calculer le total
  DECLARE v_total NUMERIC;
  BEGIN
    v_total := v_booking.room_total + 85.50;
    
    RAISE NOTICE '';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '🎉 TEST CRÉÉ AVEC SUCCÈS !';
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'Booking ID: %', v_booking.booking_id;
    RAISE NOTICE '';
    RAISE NOTICE '💰 FACTURATION:';
    RAISE NOTICE '   🏨 Chambre: % €', v_booking.room_total;
    RAISE NOTICE '   🍔 Restaurant: 85.50 €';
    RAISE NOTICE '   ─────────────────────────────';
    RAISE NOTICE '   📊 TOTAL: % €', v_total;
    RAISE NOTICE '';
    RAISE NOTICE '📋 DÉTAIL RESTAURANT:';
    RAISE NOTICE '   • Burger Deluxe × 2 = 37.00 €';
    RAISE NOTICE '   • Salade César × 1 = 12.00 €';
    RAISE NOTICE '   • Coca-Cola × 2 = 9.00 €';
    RAISE NOTICE '   • Tiramisu × 2 = 16.00 €';
    RAISE NOTICE '   • Café Espresso × 2 = 7.00 €';
    RAISE NOTICE '';
    RAISE NOTICE '👉 TESTER MAINTENANT:';
    RAISE NOTICE '   1. Ouvrez https://zen-lyart.vercel.app/payments';
    RAISE NOTICE '   2. Cliquez sur "Factures Consolidées"';
    RAISE NOTICE '   3. Cherchez: %', v_booking.guest_name;
    RAISE NOTICE '   4. Cliquez "Voir Détails"';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '';
  END;
END $$;

-- =====================================================
-- VÉRIFICATION : Afficher les factures
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
  (
    b.total_amount + 
    COALESCE((SELECT SUM(ro.total_amount) FROM restaurant_orders ro WHERE ro.booking_id = b.id), 0)
  )::numeric(10,2) as "TOTAL (€)",
  (
    b.total_amount + 
    COALESCE((SELECT SUM(ro.total_amount) FROM restaurant_orders ro WHERE ro.booking_id = b.id), 0) -
    COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.booking_id = b.id AND p.payment_status = 'completed'), 0)
  )::numeric(10,2) as "Solde (€)"
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
WHERE b.status IN ('checked_in', 'confirmed', 'checked_out')
  AND EXISTS (SELECT 1 FROM restaurant_orders ro WHERE ro.booking_id = b.id)
ORDER BY b.created_at DESC
LIMIT 5;
