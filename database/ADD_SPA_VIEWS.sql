-- ============================================
-- AJOUTER LES VUES SPA MANQUANTES
-- ============================================
-- Ce script ajoute les vues nécessaires pour le module spa
-- Exécutez ce script dans Supabase SQL Editor
-- ============================================

-- Vue des réservations spa avec détails
CREATE OR REPLACE VIEW v_spa_bookings_details AS
SELECT 
    sb.id,
    sb.booking_reference,
    sb.booking_date,
    sb.start_time,
    sb.end_time,
    sb.duration,
    sb.status,
    sb.payment_status,
    sb.total_amount,
    -- Service
    ss.name as service_name,
    ssc.name as category_name,
    -- Client
    COALESCE(g.first_name || ' ' || g.last_name, sb.guest_name) as guest_name,
    COALESCE(g.email, sb.guest_email) as guest_email,
    COALESCE(g.phone, sb.guest_phone) as guest_phone,
    -- Thérapeute
    st.first_name || ' ' || st.last_name as therapist_name,
    -- Salle
    str.name as room_name,
    sb.created_at
FROM spa_bookings sb
LEFT JOIN spa_services ss ON sb.service_id = ss.id
LEFT JOIN spa_service_categories ssc ON ss.category_id = ssc.id
LEFT JOIN guests g ON sb.guest_id = g.id
LEFT JOIN spa_therapists st ON sb.therapist_id = st.id
LEFT JOIN spa_treatment_rooms str ON sb.treatment_room_id = str.id;

-- Vue des statistiques spa
CREATE OR REPLACE VIEW v_spa_statistics AS
SELECT 
    COUNT(*) FILTER (WHERE status = 'completed') as completed_bookings,
    COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_bookings,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings,
    COALESCE(SUM(total_amount) FILTER (WHERE status IN ('completed', 'in_progress')), 0) as total_revenue,
    COALESCE(AVG(total_amount) FILTER (WHERE status IN ('completed', 'in_progress')), 0) as average_booking_value,
    COUNT(DISTINCT guest_id) as unique_guests
FROM spa_bookings
WHERE booking_date >= CURRENT_DATE - INTERVAL '30 days';

-- Fonction pour obtenir le revenu spa sur une période
CREATE OR REPLACE FUNCTION get_spa_revenue(
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    total_revenue NUMERIC,
    booking_count BIGINT,
    average_value NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COUNT(*) as booking_count,
        COALESCE(AVG(total_amount), 0) as average_value
    FROM spa_bookings
    WHERE booking_date BETWEEN p_start_date AND p_end_date
    AND status IN ('completed', 'in_progress');
END;
$$ LANGUAGE plpgsql;

-- Fonction pour vérifier la disponibilité d'un thérapeute
CREATE OR REPLACE FUNCTION check_therapist_availability(
    p_therapist_id UUID,
    p_date DATE,
    p_start_time TIME,
    p_end_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
    v_conflict_count INTEGER;
    v_day_of_week INTEGER;
    v_has_schedule BOOLEAN;
BEGIN
    -- Vérifier si le thérapeute a un horaire ce jour-là
    v_day_of_week := EXTRACT(DOW FROM p_date);
    
    SELECT EXISTS(
        SELECT 1 FROM spa_therapist_schedules
        WHERE therapist_id = p_therapist_id
        AND day_of_week = v_day_of_week
        AND is_active = true
        AND p_start_time >= start_time
        AND p_end_time <= end_time
    ) INTO v_has_schedule;
    
    IF NOT v_has_schedule THEN
        RETURN FALSE;
    END IF;
    
    -- Vérifier les congés
    IF EXISTS(
        SELECT 1 FROM spa_therapist_time_off
        WHERE therapist_id = p_therapist_id
        AND p_date BETWEEN start_date AND end_date
        AND is_approved = true
    ) THEN
        RETURN FALSE;
    END IF;
    
    -- Vérifier les conflits de réservation
    SELECT COUNT(*) INTO v_conflict_count
    FROM spa_bookings
    WHERE therapist_id = p_therapist_id
    AND booking_date = p_date
    AND status IN ('confirmed', 'in_progress')
    AND (
        (start_time < p_end_time AND end_time > p_start_time)
    );
    
    RETURN v_conflict_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour générer une référence de réservation spa
CREATE OR REPLACE FUNCTION generate_spa_booking_reference()
RETURNS VARCHAR(20) AS $$
DECLARE
    v_reference VARCHAR(20);
    v_count INTEGER;
BEGIN
    LOOP
        v_reference := 'SPA' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        
        SELECT COUNT(*) INTO v_count
        FROM spa_bookings
        WHERE booking_reference = v_reference;
        
        EXIT WHEN v_count = 0;
    END LOOP;
    
    RETURN v_reference;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Vérifier que les vues ont été créées
SELECT 'v_spa_bookings_details' as view_name, COUNT(*) as row_count FROM v_spa_bookings_details
UNION ALL
SELECT 'v_spa_statistics' as view_name, 1 as row_count FROM v_spa_statistics;

-- Afficher un message de succès
DO $$
BEGIN
    RAISE NOTICE '✅ Vues et fonctions spa créées avec succès !';
    RAISE NOTICE '✅ Vous pouvez maintenant redéployer le backend sur Render';
END $$;
