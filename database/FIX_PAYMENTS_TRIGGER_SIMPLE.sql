-- ============================================
-- FIX: Corriger le trigger payments (VERSION SIMPLE)
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
  IF NEW.order_type = 'room_service' AND NEW.booking_id IS NOT NULL THEN
    
    SELECT r.room_number, g.first_name || ' ' || g.last_name
    INTO v_room_number, v_guest_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN guests g ON b.guest_id = g.id
    WHERE b.id = NEW.booking_id;
    
    -- CORRECTION: payment_status et notes (au lieu de status et description)
    INSERT INTO payments (
      booking_id,
      amount,
      payment_method,
      payment_status,
      notes
    ) VALUES (
      NEW.booking_id,
      NEW.total_amount,
      'room_charge',
      'completed',
      'Restaurant - Commande #' || NEW.order_number || 
        CASE 
          WHEN v_room_number IS NOT NULL THEN ' (Chambre ' || v_room_number || ')'
          ELSE ''
        END
    );
    
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recréer le trigger
CREATE TRIGGER add_to_room_folio_trigger
  AFTER INSERT ON restaurant_orders
  FOR EACH ROW
  EXECUTE FUNCTION add_restaurant_order_to_room_folio();
