# 🚀 Exécuter l'Automation Restaurant dans Supabase

## 🎯 Ce Que Ce Script Va Faire

### 1. ✅ Changement Automatique Statut des Tables
- Réservation créée/confirmée → Table devient `reserved`
- Client arrive (status = `seated`) → Table devient `occupied`
- Service terminé → Table devient `available`
- Réservation annulée → Table devient `available`

### 2. ✅ Ajout Automatique Commandes à la Facture
- Commande room_service facturée à la chambre → Ligne ajoutée automatiquement dans `payments`
- Description : "Restaurant - Commande #XXX (Chambre 101)"
- Montant : Total de la commande
- Méthode : `room_charge`

### 3. ✅ Colonne `arrived_at`
- Nouvelle colonne pour stocker l'heure réelle d'arrivée du client
- Se remplit automatiquement quand le statut passe à `seated`

## 📋 ÉTAPES D'EXÉCUTION

### 1️⃣ Ouvrir Supabase
1. Aller sur https://supabase.com
2. Se connecter
3. Ouvrir votre projet
4. Cliquer sur **SQL Editor** dans le menu

### 2️⃣ Créer une Nouvelle Query
1. Cliquer sur **"New Query"**
2. Donner un nom : "Restaurant Automation Triggers"

### 3️⃣ Copier le Script SQL
Ouvrir le fichier :
```
database/RESTAURANT_AUTOMATION_TRIGGERS.sql
```

Ou copier directement depuis ce fichier et coller dans l'éditeur SQL.

### 4️⃣ Exécuter le Script
1. Cliquer sur **"Run"** (ou Ctrl+Enter)
2. Attendre quelques secondes
3. Vérifier les résultats

## ✅ Résultats Attendus

Vous devriez voir dans les résultats :

### 1. Ajout Colonne `arrived_at`
```
ALTER TABLE
```

### 2. Création des Fonctions
```
CREATE FUNCTION
CREATE FUNCTION
```

### 3. Création des Triggers
```
CREATE TRIGGER
CREATE TRIGGER
```

### 4. Vérifications
Une table montrant les 2 triggers créés :
- `table_status_update_trigger`
- `add_to_room_folio_trigger`

Une ligne confirmant que la colonne `arrived_at` existe.

## 🧪 Tests Immédiats

### Test 1 : Créer une Réservation et Vérifier le Statut de la Table

Dans Supabase SQL Editor :

```sql
-- 1. Trouver une table disponible
SELECT id, table_number, status FROM restaurant_tables WHERE status = 'available' LIMIT 1;

-- 2. Créer une réservation test (remplacer <table_id> par l'ID trouvé)
INSERT INTO table_reservations (
  table_id,
  guest_name,
  guest_phone,
  number_of_guests,
  reservation_date,
  reservation_time,
  status
) VALUES (
  '<table_id>',
  'Test Client',
  '0612345678',
  4,
  CURRENT_DATE,
  '19:00:00',
  'confirmed'
) RETURNING id;

-- 3. Vérifier que le statut de la table a changé
SELECT id, table_number, status FROM restaurant_tables WHERE id = '<table_id>';
-- Devrait montrer status = 'reserved'
```

### Test 2 : Marquer Client Arrivé

```sql
-- 1. Trouver l'ID de la réservation test
SELECT id FROM table_reservations WHERE guest_name = 'Test Client';

-- 2. Marquer comme arrivé (remplacer <reservation_id>)
UPDATE table_reservations 
SET status = 'seated'
WHERE id = '<reservation_id>';

-- 3. Vérifier la table et l'heure d'arrivée
SELECT 
  tr.guest_name,
  tr.status as reservation_status,
  tr.arrived_at,
  rt.table_number,
  rt.status as table_status
FROM table_reservations tr
JOIN restaurant_tables rt ON tr.table_id = rt.id
WHERE tr.id = '<reservation_id>';

-- Devrait montrer :
-- - reservation_status = 'seated'
-- - arrived_at = heure actuelle
-- - table_status = 'occupied'
```

### Test 3 : Terminer et Libérer la Table

```sql
-- 1. Marquer comme terminé
UPDATE table_reservations 
SET status = 'completed'
WHERE id = '<reservation_id>';

-- 2. Vérifier que la table est libre
SELECT id, table_number, status FROM restaurant_tables WHERE id = '<table_id>';
-- Devrait montrer status = 'available'

-- 3. Nettoyer (optionnel)
DELETE FROM table_reservations WHERE guest_name = 'Test Client';
```

### Test 4 : Room Service Ajouté à la Facture

```sql
-- 1. Trouver une réservation active (client dans l'hôtel)
SELECT 
  b.id as booking_id,
  r.room_number,
  g.first_name || ' ' || g.last_name as guest_name
FROM bookings b
JOIN rooms r ON b.room_id = r.id
JOIN guests g ON b.guest_id = g.id
WHERE b.status = 'checked_in'
LIMIT 1;

-- 2. Créer une commande room_service test (remplacer <booking_id>)
INSERT INTO restaurant_orders (
  order_number,
  booking_id,
  order_type,
  status,
  subtotal,
  tax,
  total_amount,
  payment_status
) VALUES (
  'TEST-' || to_char(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS'),
  '<booking_id>',
  'room_service',
  'completed',
  45.00,
  5.00,
  50.00,
  'charged_to_room'
) RETURNING id, order_number;

-- 3. Vérifier qu'une ligne a été ajoutée dans payments
SELECT 
  p.id,
  p.amount,
  p.payment_method,
  p.description,
  p.status,
  b.id as booking_id,
  r.room_number
FROM payments p
JOIN bookings b ON p.booking_id = b.id
JOIN rooms r ON b.room_id = r.id
WHERE p.description LIKE 'Restaurant%'
ORDER BY p.created_at DESC
LIMIT 5;

-- Devrait montrer une nouvelle ligne avec :
-- - amount = 50.00
-- - payment_method = 'room_charge'
-- - description = 'Restaurant - Commande #TEST-...'
-- - status = 'completed'
```

## 🔍 Diagnostic en Cas de Problème

### Vérifier que les Triggers sont Actifs
```sql
SELECT 
  tgname as trigger_name,
  tgenabled as enabled,
  tgrelid::regclass as table_name
FROM pg_trigger
WHERE tgname IN ('table_status_update_trigger', 'add_to_room_folio_trigger');
```

`tgenabled` devrait être `O` (pour "Origin")

### Vérifier les Logs des Triggers
Les triggers émettent des `RAISE NOTICE`. Pour les voir :
1. Dans Supabase, aller dans **Logs** → **Postgres Logs**
2. Filtrer par "NOTICE"
3. Vous devriez voir les messages des triggers

### Désactiver Temporairement un Trigger
```sql
-- Désactiver
ALTER TABLE table_reservations DISABLE TRIGGER table_status_update_trigger;

-- Réactiver
ALTER TABLE table_reservations ENABLE TRIGGER table_status_update_trigger;
```

## ⚠️ Notes Importantes

### 1. Les Triggers S'exécutent Automatiquement
Une fois le script exécuté, les triggers fonctionnent **automatiquement** :
- Pas besoin de code supplémentaire
- Pas besoin de redémarrer Render
- Fonctionne pour toutes les opérations (INSERT, UPDATE)

### 2. Commandes Existantes
Les triggers ne s'appliquent QUE aux **nouvelles** commandes et réservations créées après l'exécution du script.

Pour appliquer aux commandes existantes :
```sql
-- Mettre à jour toutes les commandes room_service existantes
-- ATTENTION : Exécuter avec prudence
UPDATE restaurant_orders 
SET updated_at = CURRENT_TIMESTAMP
WHERE order_type = 'room_service' 
  AND payment_status = 'charged_to_room'
  AND booking_id IS NOT NULL;
```

### 3. Sauvegarder les Données
Avant d'exécuter, vous pouvez faire une sauvegarde :
```sql
-- Sauvegarder les statuts actuels
CREATE TEMP TABLE backup_table_status AS
SELECT * FROM restaurant_tables;

CREATE TEMP TABLE backup_reservations AS
SELECT * FROM table_reservations;
```

## 🎯 Résultat Final

Après l'exécution :
- ✅ Les tables changent automatiquement de statut selon les réservations
- ✅ Les commandes room_service s'ajoutent automatiquement à la facture
- ✅ L'heure d'arrivée des clients est enregistrée
- ✅ Pas besoin de code backend supplémentaire pour ces fonctionnalités

---

**⏰ Temps d'Exécution** : 30 secondes  
**🔧 Complexité** : Simple  
**✅ Réversible** : Oui (avec DROP TRIGGER)  
**⚡ Prochaine Étape** : Mettre à jour le frontend pour utiliser ces nouvelles fonctionnalités
