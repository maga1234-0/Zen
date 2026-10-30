-- ============================================
-- SYSTÈME D'ALERTE CHAMBRE SALE > 2 HEURES
-- VERSION CORRIGÉE - Compatible avec room_type_id
-- ============================================

-- Étape 1: Ajouter une colonne pour tracker quand la chambre devient sale
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMP DEFAULT NOW();

-- Étape 2: Créer un trigger pour mettre à jour status_changed_at automatiquement
CREATE OR REPLACE FUNCTION update_room_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- Si le statut change, mettre à jour le timestamp
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        NEW.status_changed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
DROP TRIGGER IF EXISTS trigger_update_room_status_timestamp ON rooms;
CREATE TRIGGER trigger_update_room_status_timestamp
    BEFORE UPDATE ON rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_room_status_timestamp();

-- Étape 3: Mettre à jour le timestamp pour toutes les chambres existantes
UPDATE rooms 
SET status_changed_at = updated_at 
WHERE status_changed_at IS NULL;

-- Étape 4: Créer une vue pour identifier les chambres en alerte
CREATE OR REPLACE VIEW dirty_rooms_overdue AS
SELECT 
    r.id,
    r.room_number,
    rt.name as room_type,
    r.floor,
    r.status,
    r.status_changed_at,
    EXTRACT(EPOCH FROM (NOW() - r.status_changed_at))/3600 AS hours_since_dirty,
    CASE 
        WHEN EXTRACT(EPOCH FROM (NOW() - r.status_changed_at))/3600 >= 2 THEN 'URGENT'
        WHEN EXTRACT(EPOCH FROM (NOW() - r.status_changed_at))/3600 >= 1.5 THEN 'WARNING'
        ELSE 'NORMAL'
    END AS alert_level
FROM rooms r
LEFT JOIN room_types rt ON r.room_type_id = rt.id
WHERE r.status IN ('dirty', 'cleaning')
    AND r.status_changed_at IS NOT NULL
    AND EXTRACT(EPOCH FROM (NOW() - r.status_changed_at))/3600 >= 1.5
ORDER BY hours_since_dirty DESC;

-- Étape 5: Créer une fonction pour obtenir les chambres en retard
CREATE OR REPLACE FUNCTION get_overdue_dirty_rooms(hours_threshold NUMERIC DEFAULT 2.0)
RETURNS TABLE (
    room_id UUID,
    room_number VARCHAR,
    room_type VARCHAR,
    floor INTEGER,
    status VARCHAR,
    hours_overdue NUMERIC,
    alert_level VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.room_number,
        COALESCE(rt.name, 'N/A')::VARCHAR as room_type,
        r.floor,
        r.status,
        ROUND(CAST(EXTRACT(EPOCH FROM (NOW() - r.status_changed_at))/3600 AS NUMERIC), 2) as hours_overdue,
        CASE 
            WHEN EXTRACT(EPOCH FROM (NOW() - r.status_changed_at))/3600 >= hours_threshold THEN 'URGENT'
            WHEN EXTRACT(EPOCH FROM (NOW() - r.status_changed_at))/3600 >= (hours_threshold - 0.5) THEN 'WARNING'
            ELSE 'NORMAL'
        END::VARCHAR AS alert_level
    FROM rooms r
    LEFT JOIN room_types rt ON r.room_type_id = rt.id
    WHERE r.status IN ('dirty', 'cleaning')
        AND r.status_changed_at IS NOT NULL
        AND EXTRACT(EPOCH FROM (NOW() - r.status_changed_at))/3600 >= (hours_threshold - 0.5)
    ORDER BY hours_overdue DESC;
END;
$$ LANGUAGE plpgsql;

-- Étape 6: Créer une fonction pour envoyer les alertes automatiques
CREATE OR REPLACE FUNCTION send_overdue_room_alerts()
RETURNS TABLE (
    notifications_sent INTEGER,
    rooms_alerted INTEGER
) AS $$
DECLARE
    v_room RECORD;
    v_notification_count INTEGER := 0;
    v_room_count INTEGER := 0;
    v_hotel_id UUID;
BEGIN
    -- Obtenir le premier hotel_id (adapter selon votre logique)
    SELECT id INTO v_hotel_id FROM hotels LIMIT 1;
    
    -- Pour chaque chambre en retard
    FOR v_room IN 
        SELECT * FROM get_overdue_dirty_rooms(2.0)
    LOOP
        v_room_count := v_room_count + 1;
        
        -- Envoyer notification au housekeeping
        INSERT INTO notifications (
            hotel_id,
            user_id,
            type,
            title,
            message,
            priority,
            is_read,
            created_at
        )
        SELECT 
            v_hotel_id,
            u.id,
            'room_alert',
            '🚨 Chambre ' || v_room.room_number || ' - Nettoyage en retard',
            'La chambre ' || v_room.room_number || ' (' || v_room.room_type || ') est sale depuis ' || 
                v_room.hours_overdue || ' heures. Veuillez la nettoyer immédiatement.',
            CASE 
                WHEN v_room.alert_level = 'URGENT' THEN 'high'
                ELSE 'medium'
            END,
            FALSE,
            NOW()
        FROM users u
        WHERE u.role IN ('housekeeping', 'manager', 'admin')
            AND u.hotel_id = v_hotel_id;
        
        GET DIAGNOSTICS v_notification_count = ROW_COUNT;
    END LOOP;
    
    RETURN QUERY SELECT v_notification_count, v_room_count;
END;
$$ LANGUAGE plpgsql;

-- Étape 7: Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_rooms_status_changed_at 
ON rooms(status, status_changed_at) 
WHERE status IN ('dirty', 'cleaning');

-- ============================================
-- TESTS
-- ============================================

-- Test 1: Voir toutes les chambres sales avec leur durée
SELECT 
    r.room_number,
    rt.name as room_type,
    r.status,
    r.status_changed_at,
    ROUND(CAST(EXTRACT(EPOCH FROM (NOW() - r.status_changed_at))/3600 AS NUMERIC), 2) as hours_since_status_change
FROM rooms r
LEFT JOIN room_types rt ON r.room_type_id = rt.id
WHERE r.status IN ('dirty', 'cleaning')
ORDER BY r.status_changed_at ASC;

-- Test 2: Voir les chambres en retard (> 1.5 heures)
SELECT * FROM dirty_rooms_overdue;

-- Test 3: Obtenir les chambres en retard avec fonction
SELECT * FROM get_overdue_dirty_rooms(2.0);

-- Test 4: Simuler une chambre sale depuis 3 heures (pour tester)
-- Décommenter pour tester:
-- UPDATE rooms 
-- SET status = 'dirty', 
--     status_changed_at = NOW() - INTERVAL '3 hours'
-- WHERE room_number = '101';

-- Test 5: Envoyer les alertes (à exécuter manuellement ou via cron)
-- SELECT * FROM send_overdue_room_alerts();

-- Vérification finale
SELECT 'Installation réussie! ✅' as status;

COMMENT ON COLUMN rooms.status_changed_at IS 'Timestamp de la dernière modification du statut de la chambre';
COMMENT ON VIEW dirty_rooms_overdue IS 'Vue des chambres sales en retard (> 1.5 heures)';
COMMENT ON FUNCTION get_overdue_dirty_rooms IS 'Fonction pour obtenir les chambres sales en retard avec niveau d''alerte';
COMMENT ON FUNCTION send_overdue_room_alerts IS 'Fonction pour envoyer automatiquement des notifications pour les chambres en retard';
