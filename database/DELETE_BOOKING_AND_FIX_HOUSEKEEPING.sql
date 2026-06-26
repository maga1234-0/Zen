-- ================================================================
-- SCRIPT 1: Supprimer la réservation spécifique
-- ================================================================
-- Booking: joe mudibu, 8320480200
-- Date: 03/06/2026, Table T1, 2 personnes
-- ================================================================

-- Supprimer la réservation et toutes les données liées
DO $$
DECLARE
    v_booking_id UUID;
BEGIN
    -- Trouver l'ID de la réservation
    SELECT id INTO v_booking_id
    FROM bookings
    WHERE guest_name = 'joe mudibu'
    AND guest_phone = '8320480200'
    AND check_in_date = '2026-06-03'
    LIMIT 1;

    IF v_booking_id IS NOT NULL THEN
        -- Supprimer les paiements liés
        DELETE FROM payments WHERE booking_id = v_booking_id;
        
        -- Supprimer les commandes restaurant liées (si Room Service)
        DELETE FROM restaurant_orders WHERE booking_id = v_booking_id;
        
        -- Supprimer la réservation
        DELETE FROM bookings WHERE id = v_booking_id;
        
        RAISE NOTICE 'Réservation de joe mudibu supprimée avec succès';
    ELSE
        RAISE NOTICE 'Réservation non trouvée';
    END IF;
END $$;

-- ================================================================
-- SCRIPT 2: Créer une vue pour les statistiques Housekeeping
-- ================================================================

-- Vue pour les tâches de nettoyage basées sur les vrais statuts de chambres
CREATE OR REPLACE VIEW housekeeping_tasks_summary AS
SELECT 
    -- Chambres sales (besoin de nettoyage)
    COUNT(*) FILTER (WHERE status = 'dirty') as dirty_rooms,
    
    -- Chambres en cours de nettoyage
    COUNT(*) FILTER (WHERE status = 'cleaning') as cleaning_in_progress,
    
    -- Chambres nettoyées aujourd'hui (clean status)
    COUNT(*) FILTER (WHERE status = 'clean' AND updated_at::date = CURRENT_DATE) as cleaned_today,
    
    -- Total de chambres
    COUNT(*) as total_rooms,
    
    -- Chambres disponibles et propres
    COUNT(*) FILTER (WHERE status = 'available') as available_clean,
    
    -- Chambres en maintenance
    COUNT(*) FILTER (WHERE status = 'maintenance') as maintenance_rooms
FROM rooms
WHERE hotel_id = (SELECT id FROM hotels LIMIT 1);

-- Vue pour les détails des tâches
CREATE OR REPLACE VIEW housekeeping_task_details AS
SELECT 
    r.id,
    r.room_number,
    r.status,
    r.room_type,
    r.updated_at as last_status_change,
    b.guest_name,
    b.check_out_date,
    CASE 
        WHEN r.status = 'dirty' THEN 'Nettoyage nécessaire'
        WHEN r.status = 'cleaning' THEN 'En cours de nettoyage'
        WHEN r.status = 'clean' THEN 'Propre'
        WHEN r.status = 'available' THEN 'Disponible et propre'
        WHEN r.status = 'maintenance' THEN 'Maintenance'
        ELSE 'Statut inconnu'
    END as task_description,
    CASE 
        WHEN r.status = 'dirty' AND b.check_out_date::date = CURRENT_DATE THEN 'urgent'
        WHEN r.status = 'dirty' THEN 'high'
        WHEN r.status = 'maintenance' THEN 'high'
        ELSE 'normal'
    END as priority
FROM rooms r
LEFT JOIN bookings b ON b.room_id = r.id 
    AND b.status = 'checked_out'
    AND b.check_out_date::date = CURRENT_DATE
WHERE r.hotel_id = (SELECT id FROM hotels LIMIT 1)
ORDER BY 
    CASE 
        WHEN r.status = 'dirty' THEN 1
        WHEN r.status = 'cleaning' THEN 2
        WHEN r.status = 'maintenance' THEN 3
        ELSE 4
    END,
    r.room_number;

-- ================================================================
-- SCRIPT 3: Données de test pour Housekeeping (optionnel)
-- ================================================================
-- Crée quelques chambres avec différents statuts si la base est vide

-- Mettre quelques chambres en statut 'dirty' pour tester
UPDATE rooms 
SET status = 'dirty', updated_at = NOW()
WHERE room_number IN ('101', '102', '203')
AND hotel_id = (SELECT id FROM hotels LIMIT 1);

-- Mettre une chambre en 'cleaning'
UPDATE rooms 
SET status = 'cleaning', updated_at = NOW()
WHERE room_number = '104'
AND hotel_id = (SELECT id FROM hotels LIMIT 1);

-- Mettre quelques chambres en 'clean'
UPDATE rooms 
SET status = 'clean', updated_at = NOW()
WHERE room_number IN ('105', '201', '202')
AND hotel_id = (SELECT id FROM hotels LIMIT 1);

-- ================================================================
-- VÉRIFICATION
-- ================================================================

-- Vérifier que la réservation a été supprimée
SELECT 
    'Réservations joe mudibu restantes:' as info,
    COUNT(*) as count
FROM bookings
WHERE guest_name = 'joe mudibu';

-- Vérifier les statistiques Housekeeping
SELECT * FROM housekeeping_tasks_summary;

-- Vérifier les détails des tâches
SELECT 
    room_number,
    status,
    task_description,
    priority,
    guest_name,
    check_out_date
FROM housekeeping_task_details
LIMIT 10;

-- Résumé des statuts de chambres
SELECT 
    status,
    COUNT(*) as count
FROM rooms
WHERE hotel_id = (SELECT id FROM hotels LIMIT 1)
GROUP BY status
ORDER BY status;
