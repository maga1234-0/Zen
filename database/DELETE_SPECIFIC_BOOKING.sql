-- ================================================================
-- SUPPRIMER UNE RÉSERVATION SPÉCIFIQUE
-- ================================================================
-- Réservation: joe mudibu, 8320480200, 03/06/2026
-- ================================================================

-- MÉTHODE 1: Par guest_id (Recommandée)
-- Trouve le guest puis supprime sa réservation

DO $$
DECLARE
    v_guest_id UUID;
    v_booking_id UUID;
BEGIN
    -- Trouver le guest
    SELECT id INTO v_guest_id
    FROM guests
    WHERE (full_name = 'joe mudibu' OR full_name ILIKE '%mudibu%')
    AND (phone = '8320480200' OR phone LIKE '%8320480200%')
    LIMIT 1;

    IF v_guest_id IS NOT NULL THEN
        -- Trouver la réservation
        SELECT id INTO v_booking_id
        FROM bookings
        WHERE guest_id = v_guest_id
        AND check_in_date = '2026-06-03'
        LIMIT 1;

        IF v_booking_id IS NOT NULL THEN
            -- Supprimer les paiements liés
            DELETE FROM payments WHERE booking_id = v_booking_id;
            
            -- Supprimer les commandes restaurant liées
            DELETE FROM restaurant_orders WHERE booking_id = v_booking_id;
            
            -- Supprimer les réservations spa liées
            DELETE FROM spa_bookings WHERE booking_id = v_booking_id;
            
            -- Supprimer la réservation
            DELETE FROM bookings WHERE id = v_booking_id;
            
            RAISE NOTICE 'Réservation supprimée avec succès: %', v_booking_id;
        ELSE
            RAISE NOTICE 'Aucune réservation trouvée pour ce guest à cette date';
        END IF;
    ELSE
        RAISE NOTICE 'Guest non trouvé';
    END IF;
END $$;


-- ================================================================
-- MÉTHODE 2: Par ID direct (si tu connais l'ID)
-- ================================================================
-- Remplace 'BOOKING_ID_ICI' par l'ID réel de la réservation

/*
DO $$
DECLARE
    v_booking_id UUID := 'BOOKING_ID_ICI'; -- Remplace par l'ID réel
BEGIN
    -- Supprimer les dépendances
    DELETE FROM payments WHERE booking_id = v_booking_id;
    DELETE FROM restaurant_orders WHERE booking_id = v_booking_id;
    DELETE FROM spa_bookings WHERE booking_id = v_booking_id;
    
    -- Supprimer la réservation
    DELETE FROM bookings WHERE id = v_booking_id;
    
    RAISE NOTICE 'Réservation % supprimée', v_booking_id;
END $$;
*/


-- ================================================================
-- MÉTHODE 3: Recherche plus flexible
-- ================================================================
-- Cherche toutes les réservations d'un guest puis supprime

/*
DO $$
DECLARE
    v_guest_id UUID;
    v_booking_record RECORD;
BEGIN
    -- Trouver le guest
    SELECT id INTO v_guest_id
    FROM guests
    WHERE full_name ILIKE '%mudibu%'
    LIMIT 1;

    IF v_guest_id IS NOT NULL THEN
        -- Parcourir toutes ses réservations
        FOR v_booking_record IN 
            SELECT id FROM bookings WHERE guest_id = v_guest_id
        LOOP
            -- Supprimer les dépendances
            DELETE FROM payments WHERE booking_id = v_booking_record.id;
            DELETE FROM restaurant_orders WHERE booking_id = v_booking_record.id;
            DELETE FROM spa_bookings WHERE booking_id = v_booking_record.id;
            
            -- Supprimer la réservation
            DELETE FROM bookings WHERE id = v_booking_record.id;
            
            RAISE NOTICE 'Réservation supprimée: %', v_booking_record.id;
        END LOOP;
    END IF;
END $$;
*/


-- ================================================================
-- VÉRIFICATION
-- ================================================================

-- Voir toutes les réservations du guest
SELECT 
    b.id,
    b.check_in_date,
    b.check_out_date,
    b.status,
    b.total_amount,
    g.full_name,
    g.phone,
    r.room_number
FROM bookings b
JOIN guests g ON b.guest_id = g.id
LEFT JOIN rooms r ON b.room_id = r.id
WHERE g.full_name ILIKE '%mudibu%'
ORDER BY b.check_in_date DESC;

-- Compter les réservations restantes
SELECT 
    COUNT(*) as total_bookings
FROM bookings b
JOIN guests g ON b.guest_id = g.id
WHERE g.full_name ILIKE '%mudibu%';
