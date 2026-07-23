-- ============================================
-- FIX COMPLET: Restaurant Room Service
-- ============================================
-- Corrige 2 problèmes:
-- 1. Trigger utilise mauvais noms de colonnes (status → payment_status)
-- 2. Trigger utilise 'room_charge' qui n'est pas dans la contrainte
-- ============================================

-- ÉTAPE 1: Ajouter 'room_charge' à la contrainte payment_method
-- ============================================

-- Supprimer l'ancienne contrainte
ALTER TABLE payments 
DROP CONSTRAINT IF EXISTS payments_payment_method_check;

-- Ajouter la nouvelle contrainte avec 'room_charge'
ALTER TABLE payments 
ADD CONSTRAINT payments_payment_method_check 
CHECK (payment_method IN ('cash', 'card', 'mobile_money', 'bank_transfer', 'room_charge'));

-- ÉTAPE 2: Recréer le trigger avec les bons noms de colonnes
-- ============================================

-- Supprimer l'ancien trigger
DROP TRIGGER IF EXISTS add_to_room_folio_trigger ON restaurant_orders;
DROP FUNCTION IF EXISTS add_restaurant_order_to_room_folio();

-- Créer la fonction corrigée
CREATE OR REPLACE FUNCTION add_restaurant_order_to_room_folio()
RETURNS TRIGGER AS $$
DECLARE
  v_room_number VARCHAR(10);
  v_guest_name VARCHAR(255);
BEGIN
  -- Seulement pour Room Service avec booking_id
  IF NEW.order_type = 'room_service' AND NEW.booking_id IS NOT NULL THEN
    
    -- Récupérer infos chambre et guest
    SELECT r.room_number, g.first_name || ' ' || g.last_name
    INTO v_room_number, v_guest_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN guests g ON b.guest_id = g.id
    WHERE b.id = NEW.booking_id;
    
    -- Insérer le paiement dans la folio de la chambre
    -- CORRECTION: Utiliser payment_status et notes (pas status et description)
    -- CORRECTION: Utiliser 'room_charge' comme payment_method
    INSERT INTO payments (
      booking_id,
      amount,
      payment_method,
      payment_status,
      notes,
      payment_date
    ) VALUES (
      NEW.booking_id,
      NEW.total_amount,
      'room_charge',          -- ✅ Maintenant valide
      'pending',              -- ✅ Sera payé au checkout
      'Restaurant - Commande #' || NEW.order_number || 
        CASE 
          WHEN v_room_number IS NOT NULL THEN ' (Chambre ' || v_room_number || ')'
          ELSE ''
        END ||
        CASE
          WHEN v_guest_name IS NOT NULL THEN ' - ' || v_guest_name
          ELSE ''
        END,
      NOW()
    );
    
    RAISE NOTICE 'Paiement ajouté à la folio pour commande % (Chambre %)', NEW.order_number, v_room_number;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recréer le trigger
CREATE TRIGGER add_to_room_folio_trigger
  AFTER INSERT ON restaurant_orders
  FOR EACH ROW
  EXECUTE FUNCTION add_restaurant_order_to_room_folio();

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Vérifier la nouvelle contrainte
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname = 'payments_payment_method_check';

-- Tester que 'room_charge' est maintenant accepté
-- (Cette requête devrait réussir sans erreur)
DO $$
BEGIN
  -- Test d'insertion
  INSERT INTO payments (
    amount,
    payment_method,
    payment_status,
    notes
  ) VALUES (
    1.00,
    'room_charge',
    'pending',
    'Test - À supprimer'
  );
  
  -- Supprimer immédiatement le test
  DELETE FROM payments WHERE notes = 'Test - À supprimer';
  
  RAISE NOTICE '✅ Test réussi: room_charge est maintenant valide';
EXCEPTION
  WHEN check_violation THEN
    RAISE NOTICE '❌ Erreur: room_charge n''est toujours pas valide';
END $$;

-- Afficher les payment_methods valides
SELECT 
    'Les méthodes de paiement valides sont maintenant:' AS info,
    string_agg(DISTINCT payment_method, ', ') AS methods
FROM (
    VALUES 
        ('cash'),
        ('card'),
        ('mobile_money'),
        ('bank_transfer'),
        ('room_charge')
) AS t(payment_method);
