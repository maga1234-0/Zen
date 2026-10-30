# ✅ SCRIPT SQL CORRIGÉ - EXÉCUTER MAINTENANT

---

## 🎯 LE PROBLÈME A ÉTÉ CORRIGÉ

L'erreur `column r.room_type does not exist` a été résolue!

Ton système utilise `room_type_id` (une référence à la table `room_types`) au lieu d'une colonne texte `room_type`.

Le nouveau script utilise maintenant un `LEFT JOIN` avec la table `room_types`.

---

## ⚡ ACTION IMMÉDIATE

### Étape 1: Ouvre Supabase
1. Va sur: https://supabase.com/dashboard
2. Clique sur **SQL Editor**

### Étape 2: Copie CE SCRIPT (corrigé)

Utilise le fichier: **`database/ADD_ROOM_CLEANING_ALERT_SYSTEM_FIXED.sql`**

Ou copie directement ci-dessous:

```sql
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
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        NEW.status_changed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
    SELECT id INTO v_hotel_id FROM hotels LIMIT 1;
    
    FOR v_room IN 
        SELECT * FROM get_overdue_dirty_rooms(2.0)
    LOOP
        v_room_count := v_room_count + 1;
        
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

-- Vérification finale
SELECT 'Installation réussie! ✅' as status;
```

### Étape 3: Exécute le Script
1. Colle le script dans l'éditeur SQL
2. Clique sur **Run**
3. Vérifie que tu vois: "Installation réussie! ✅"

---

## ✅ BACKEND DÉJÀ MIS À JOUR

- ✅ Commit: `de81744` - Fix room_type_id
- ✅ Push: Réussi
- ✅ Déploiement Render: En cours (3-5 min)

---

## 🧪 TEST RAPIDE

Après avoir exécuté le script, teste avec:

```sql
-- Voir les chambres et leur type
SELECT 
    r.room_number,
    rt.name as room_type,
    r.status,
    r.status_changed_at
FROM rooms r
LEFT JOIN room_types rt ON r.room_type_id = rt.id
LIMIT 5;
```

Si tu vois les noms des types de chambres, c'est bon! 👍

---

## 🎉 RÉSULTAT

Une fois terminé:
- ✅ Système d'alerte actif
- ✅ Détection automatique toutes les 30 min
- ✅ Notifications automatiques
- ✅ Compatible avec ta structure de base de données

---

**Temps:** 2 minutes  
**Difficulté:** Facile  
**Status:** Prêt à exécuter 🚀
