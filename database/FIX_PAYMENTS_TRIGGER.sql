-- ============================================
-- FIX: Corriger le trigger qui utilise 'status' au lieu de 'payment_status'
-- ============================================
-- ERREUR: column "status" of relation "payments" does not exist
-- Le trigger add_to_room_folio_trigger utilise des colonnes incorrectes
-- ============================================

-- ÉTAPE 1: Supprimer l'ancien trigger
DROP TRIGGER IF EXISTS add_to_room_folio_trigger ON restaurant_orders;
DROP FUNCTION IF EXISTS add_restaurant_order_to_room_folio();

-- ÉTAPE 2: Créer la fonction corrigée (avec les bonnes colonnes)
CREATE OR REPLACE FUNCTION add_restaurant_order_to_room_folio()
RETURNS TRIGGER AS $$
DECLARE
  v_room_number VARCHAR(10);
  v_guest_name VARCHAR(255);
BEGIN
  -- Si la commande est de type "room_service" et qu'elle est liée à une réservation
  IF NEW.order_type = 'room_service' AND NEW.booking_id IS NOT NULL THEN
    
    -- Récupérer les infos de la chambre et du client
    SELECT r.room_number, g.first_name || ' ' || g.last_name
    INTO v_room_number, v_guest_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN guests g ON b.guest_id = g.id
    WHERE b.id = NEW.booking_id;
    
    -- Insérer la ligne de paiement dans la facture du client
    -- CORRECTION: Utiliser 'payment_status' au lieu de 'status'
    --             Utiliser 'notes' au lieu de 'description'
    --             Supprimer 'created_at' et 'updated_at' (auto-générés)
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
    
    RAISE NOTICE 'Commande restaurant % (% €) ajoutée à la facture de la chambre % (%)', 
                 NEW.order_number, NEW.total_amount, v_room_number, v_guest_name;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ÉTAPE 3: Recréer le trigger
CREATE TRIGGER add_to_room_folio_trigger
  AFTER INSERT ON restaurant_orders
  FOR EACH ROW
  EXECUTE FUNCTION add_restaurant_order_to_room_folio();

-- ============================================
-- VÉRIFICATION
-- ============================================
-- Vérifier que le trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  tgtype
FROM information_schema.triggers 
WHERE trigger_name = 'add_to_room_folio_trigger';

-- Afficher la définition de la fonction
\sf add_restaurant_order_to_room_folio

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- Le trigger devrait maintenant utiliser:
-- - payment_status (au lieu de status)
-- - notes (au lieu de description)
-- - Pas de created_at/updated_at (auto-générés par la table)
-- ============================================
