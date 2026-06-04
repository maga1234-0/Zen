-- ============================================
-- AUTOMATION RESTAURANT - TRIGGERS ET FONCTIONS
-- ============================================
-- Ce script ajoute l'automatisation pour :
-- 1. Changement automatique du statut des tables lors des réservations
-- 2. Ajout automatique des commandes room_service à la facture du client
-- ============================================

-- 1. AJOUTER COLONNE arrived_at POUR HEURE D'ARRIVÉE RÉELLE
ALTER TABLE table_reservations 
ADD COLUMN IF NOT EXISTS arrived_at TIMESTAMP;

COMMENT ON COLUMN table_reservations.arrived_at IS 'Heure réelle d''arrivée du client (quand status passe à seated)';

-- ============================================
-- 2. TRIGGER : CHANGEMENT AUTOMATIQUE STATUT TABLE
-- ============================================

-- Fonction pour mettre à jour le statut de la table selon la réservation
CREATE OR REPLACE FUNCTION update_table_status_on_reservation()
RETURNS TRIGGER AS $$
BEGIN
  -- Quand une réservation est créée ou modifiée
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    
    -- Si réservation confirmée ou en attente → table devient RÉSERVÉE
    IF NEW.status IN ('confirmed', 'pending') AND NEW.table_id IS NOT NULL THEN
      UPDATE restaurant_tables 
      SET status = 'reserved', 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = NEW.table_id;
      
      RAISE NOTICE 'Table % marquée comme RÉSERVÉE (réservation %)', NEW.table_id, NEW.id;
    
    -- Si client assis (seated) → table devient OCCUPÉE
    ELSIF NEW.status = 'seated' AND NEW.table_id IS NOT NULL THEN
      UPDATE restaurant_tables 
      SET status = 'occupied', 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = NEW.table_id;
      
      -- Si arrived_at n'est pas déjà défini, le définir maintenant
      IF NEW.arrived_at IS NULL THEN
        NEW.arrived_at := CURRENT_TIMESTAMP;
      END IF;
      
      RAISE NOTICE 'Table % marquée comme OCCUPÉE (client arrivé à %)', NEW.table_id, NEW.arrived_at;
    
    -- Si terminée, annulée, ou no-show → table devient DISPONIBLE
    ELSIF NEW.status IN ('completed', 'cancelled', 'no_show') AND NEW.table_id IS NOT NULL THEN
      UPDATE restaurant_tables 
      SET status = 'available', 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = NEW.table_id;
      
      RAISE NOTICE 'Table % marquée comme DISPONIBLE (réservation terminée)', NEW.table_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS table_status_update_trigger ON table_reservations;

-- Créer le nouveau trigger
CREATE TRIGGER table_status_update_trigger
BEFORE INSERT OR UPDATE ON table_reservations
FOR EACH ROW
EXECUTE FUNCTION update_table_status_on_reservation();

COMMENT ON TRIGGER table_status_update_trigger ON table_reservations IS 
'Met à jour automatiquement le statut de la table quand une réservation change';

-- ============================================
-- 3. TRIGGER : AJOUT AUTOMATIQUE COMMANDE À LA FACTURE
-- ============================================

-- Fonction pour ajouter automatiquement une commande room_service à la facture du client
CREATE OR REPLACE FUNCTION add_restaurant_order_to_room_folio()
RETURNS TRIGGER AS $$
DECLARE
  v_room_number VARCHAR(20);
  v_guest_name VARCHAR(200);
BEGIN
  -- Vérifier si c'est une commande room_service facturée à la chambre
  IF NEW.order_type = 'room_service' 
     AND NEW.payment_status = 'charged_to_room' 
     AND NEW.booking_id IS NOT NULL 
     AND NEW.total_amount > 0 THEN
    
    -- Récupérer le numéro de chambre et le nom du client pour la description
    SELECT r.room_number, g.first_name || ' ' || g.last_name
    INTO v_room_number, v_guest_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN guests g ON b.guest_id = g.id
    WHERE b.id = NEW.booking_id;
    
    -- Insérer la ligne de paiement dans la facture du client
    INSERT INTO payments (
      booking_id,
      amount,
      payment_method,
      payment_date,
      description,
      status,
      created_at,
      updated_at
    ) VALUES (
      NEW.booking_id,
      NEW.total_amount,
      'room_charge',
      CURRENT_TIMESTAMP,
      'Restaurant - Commande #' || NEW.order_number || 
        CASE 
          WHEN v_room_number IS NOT NULL THEN ' (Chambre ' || v_room_number || ')'
          ELSE ''
        END,
      'completed',
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    );
    
    RAISE NOTICE 'Commande restaurant % (% €) ajoutée à la facture de la chambre % (%)', 
                 NEW.order_number, NEW.total_amount, v_room_number, v_guest_name;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS add_to_room_folio_trigger ON restaurant_orders;

-- Créer le nouveau trigger
CREATE TRIGGER add_to_room_folio_trigger
AFTER INSERT OR UPDATE OF payment_status ON restaurant_orders
FOR EACH ROW
EXECUTE FUNCTION add_restaurant_order_to_room_folio();

COMMENT ON TRIGGER add_to_room_folio_trigger ON restaurant_orders IS 
'Ajoute automatiquement les commandes room_service à la facture du client';

-- ============================================
-- 4. VÉRIFICATIONS
-- ============================================

-- Vérifier que les triggers sont bien créés
SELECT 
  tgname as trigger_name,
  tgenabled as is_enabled,
  pg_get_triggerdef(oid) as trigger_definition
FROM pg_trigger
WHERE tgrelid IN ('table_reservations'::regclass, 'restaurant_orders'::regclass)
  AND tgname IN ('table_status_update_trigger', 'add_to_room_folio_trigger')
ORDER BY tgname;

-- Vérifier que la colonne arrived_at existe
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'table_reservations'
  AND column_name = 'arrived_at';

-- ============================================
-- 5. TESTS RAPIDES
-- ============================================

-- Test 1 : Vérifier les statuts actuels des tables
SELECT 
  id,
  table_number,
  status,
  capacity,
  location
FROM restaurant_tables
ORDER BY table_number;

-- Test 2 : Vérifier les réservations actives
SELECT 
  tr.id,
  tr.guest_name,
  rt.table_number,
  tr.reservation_date,
  tr.reservation_time,
  tr.status,
  tr.arrived_at,
  rt.status as table_status
FROM table_reservations tr
JOIN restaurant_tables rt ON tr.table_id = rt.id
WHERE tr.status NOT IN ('completed', 'cancelled', 'no_show')
ORDER BY tr.reservation_date, tr.reservation_time;

-- Test 3 : Vérifier les commandes room_service récentes
SELECT 
  ro.id,
  ro.order_number,
  ro.order_type,
  ro.total_amount,
  ro.payment_status,
  ro.booking_id,
  r.room_number,
  g.first_name || ' ' || g.last_name as guest_name
FROM restaurant_orders ro
LEFT JOIN bookings b ON ro.booking_id = b.id
LEFT JOIN rooms r ON b.room_id = r.id
LEFT JOIN guests g ON b.guest_id = g.id
WHERE ro.order_type = 'room_service'
ORDER BY ro.created_at DESC
LIMIT 10;

