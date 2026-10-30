# ⚡ ACTION IMMÉDIATE - EXÉCUTER CE SCRIPT SQL

---

## 🎯 OBJECTIF
Activer le système d'alerte automatique pour les chambres sales > 2 heures

---

## 📋 ÉTAPE 1: OUVRIR SUPABASE

1. Va sur: https://supabase.com/dashboard
2. Connecte-toi
3. Sélectionne ton projet (celui avec la base de données)
4. Clique sur **SQL Editor** dans le menu gauche

---

## 📝 ÉTAPE 2: COPIER CE SCRIPT

Ouvre le fichier: `database/ADD_ROOM_CLEANING_ALERT_SYSTEM.sql`

Ou copie directement ci-dessous:

```sql
-- ============================================
-- SYSTÈME D'ALERTE CHAMBRE SALE > 2 HEURES
-- ============================================

-- Étape 1: Ajouter colonne pour tracker le changement de statut
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMP DEFAULT NOW();

-- Étape 2: Créer trigger pour mise à jour automatique
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

-- Étape 3: Initialiser les timestamps existants
UPDATE rooms 
SET status_changed_at = updated_at 
WHERE status_changed_at IS NULL;

-- Étape 4: Créer vue pour chambres en retard
CREATE OR REPLACE VIEW dirty_rooms_overdue AS
SELECT 
    r.id,
    r.room_number,
    r.room_type,
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
WHERE r.status IN ('dirty', 'cleaning')
    AND EXTRACT(EPOCH FROM (NOW() - r.status_changed_at))/3600 >= 1.5
ORDER BY hours_since_dirty DESC;

-- Étape 5: Fonction pour obtenir chambres en retard
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
        r.room_type,
        r.floor,
        r.status,
        ROUND(CAST(EXTRACT(EPOCH FROM (NOW() - r.status_changed_at))/3600 AS NUMERIC), 2) as hours_overdue,
        CASE 
            WHEN EXTRACT(EPOCH FROM (NOW() - r.status_changed_at))/3600 >= hours_threshold THEN 'URGENT'
            WHEN EXTRACT(EPOCH FROM (NOW() - r.status_changed_at))/3600 >= (hours_threshold - 0.5) THEN 'WARNING'
            ELSE 'NORMAL'
        END::VARCHAR AS alert_level
    FROM rooms r
    WHERE r.status IN ('dirty', 'cleaning')
        AND EXTRACT(EPOCH FROM (NOW() - r.status_changed_at))/3600 >= (hours_threshold - 0.5)
    ORDER BY hours_overdue DESC;
END;
$$ LANGUAGE plpgsql;

-- Étape 6: Fonction pour envoyer alertes automatiques
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
            'La chambre ' || v_room.room_number || ' est sale depuis ' || 
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

-- Étape 7: Créer index pour performance
CREATE INDEX IF NOT EXISTS idx_rooms_status_changed_at 
ON rooms(status, status_changed_at) 
WHERE status IN ('dirty', 'cleaning');

-- VÉRIFICATION
SELECT 'Installation réussie!' as status;
```

---

## ▶️ ÉTAPE 3: EXÉCUTER LE SCRIPT

1. Colle le script dans l'éditeur SQL Supabase
2. Clique sur le bouton **Run** (ou Ctrl+Enter)
3. Attends la confirmation: "Installation réussie!"

---

## ✅ ÉTAPE 4: VÉRIFIER L'INSTALLATION

Exécute cette requête pour vérifier:

```sql
-- Test 1: Voir si la colonne existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rooms' 
AND column_name = 'status_changed_at';

-- Test 2: Voir les chambres avec leur statut
SELECT room_number, status, status_changed_at 
FROM rooms 
LIMIT 5;
```

Tu devrais voir la colonne `status_changed_at` avec des dates.

---

## 🚀 ÉTAPE 5: LE SYSTÈME EST MAINTENANT ACTIF!

### Ce qui va se passer automatiquement:

1. **Toutes les 30 minutes**, le backend vérifie:
   - Quelles chambres sont sales depuis > 2 heures
   
2. **Si une chambre est en retard**, il envoie automatiquement:
   - Une notification à **Housekeeping**
   - Une notification au **Manager**
   - Une notification à l'**Admin**

3. **La notification contient:**
   - 🚨 Titre: "Chambre XXX - Nettoyage en retard"
   - Message: Durée exacte depuis le changement de statut
   - Priorité: medium (2-3h) ou high (>3h)

---

## 🧪 TEST IMMÉDIAT (OPTIONNEL)

Pour tester tout de suite, exécute:

```sql
-- Simuler une chambre sale depuis 3 heures
UPDATE rooms 
SET status = 'dirty', 
    status_changed_at = NOW() - INTERVAL '3 hours'
WHERE room_number = '101';

-- Voir les chambres en retard
SELECT * FROM dirty_rooms_overdue;

-- Envoyer les alertes manuellement (pour tester)
SELECT * FROM send_overdue_room_alerts();
```

Puis vérifie dans l'application:
- Va dans **Notifications**
- Tu devrais voir une alerte pour la chambre 101

---

## 📊 BACKEND DÉJÀ DÉPLOYÉ

✅ Le code backend a déjà été pushé sur GitHub  
✅ Render est en train de redémarrer automatiquement (3-5 min)  
✅ Le job scheduler démarrera automatiquement  
✅ Premières alertes dans maximum 30 minutes

---

## 🔔 RÉSUMÉ

Une fois le script SQL exécuté:
- ✅ Système d'alerte activé
- ✅ Détection automatique toutes les 30 min
- ✅ Notifications automatiques
- ✅ Disponible pour tous les rôles (housekeeping, manager, admin)

---

## ❓ EN CAS DE PROBLÈME

Si le script échoue:
1. Vérifie que tu es connecté à la bonne base de données
2. Vérifie qu'il n'y a pas d'erreur dans les logs SQL
3. Contacte-moi avec le message d'erreur exact

---

**Temps estimé:** 2 minutes ⏱️  
**Difficulté:** Facile 🟢  
**Impact:** Haute - Améliore l'efficacité du housekeeping
