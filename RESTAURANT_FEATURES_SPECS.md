# 📋 Spécifications Fonctionnalités Restaurant

## 🎯 Nouvelles Fonctionnalités Demandées

### 1. Changement Automatique du Statut des Tables
**Problème** : Les tables réservées ne changent pas automatiquement de statut

**Solution** :
- Quand une réservation est créée avec statut `confirmed` → Table passe à `reserved`
- Quand le client arrive et la réservation passe à `seated` → Table passe à `occupied`
- Quand la commande est terminée et la réservation passe à `completed` → Table passe à `available`
- Quand une réservation est annulée → Table revient à `available`

### 2. Gestion Complète des Réservations
**Fonctionnalités manquantes** :
- ❌ Modifier le statut d'une réservation (pending → confirmed → seated → completed)
- ❌ Modifier l'heure d'arrivée prévue
- ❌ Supprimer une réservation

**Solution** :
- Ajouter bouton "Modifier" sur chaque réservation
- Modal de modification avec :
  - Statut (dropdown)
  - Date et heure d'arrivée
  - Nombre de convives
  - Demandes spéciales
- Ajouter bouton "Supprimer" avec confirmation
- Mettre à jour le statut de la table automatiquement

### 3. Intégration Commandes Internes avec Facturation Hôtel
**Problème** : Les commandes room_service ne s'ajoutent pas à la facture du client

**Solution** :
- Quand une commande est créée avec `order_type = 'room_service'` ET `payment_status = 'charged_to_room'`
- Créer automatiquement une ligne dans la table `payments` avec :
  - `booking_id` : ID de la réservation du client
  - `amount` : Total de la commande restaurant
  - `payment_method` : 'room_charge'
  - `description` : 'Restaurant - Commande #XXX'
  - `status` : 'completed'

## 📊 Modifications Base de Données

### Ajouter Colonne `arrived_at` dans `table_reservations`
```sql
ALTER TABLE table_reservations 
ADD COLUMN IF NOT EXISTS arrived_at TIMESTAMP;
```
Cette colonne stockera l'heure réelle d'arrivée du client.

### Trigger pour Statut des Tables
```sql
-- Fonction pour mettre à jour le statut de la table
CREATE OR REPLACE FUNCTION update_table_status_on_reservation()
RETURNS TRIGGER AS $$
BEGIN
  -- Quand une réservation est créée/modifiée
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Si confirmée ou en attente → table réservée
    IF NEW.status IN ('confirmed', 'pending') THEN
      UPDATE restaurant_tables 
      SET status = 'reserved', updated_at = CURRENT_TIMESTAMP 
      WHERE id = NEW.table_id;
    
    -- Si client assis → table occupée
    ELSIF NEW.status = 'seated' THEN
      UPDATE restaurant_tables 
      SET status = 'occupied', updated_at = CURRENT_TIMESTAMP 
      WHERE id = NEW.table_id;
    
    -- Si terminée, annulée, ou no-show → table disponible
    ELSIF NEW.status IN ('completed', 'cancelled', 'no_show') THEN
      UPDATE restaurant_tables 
      SET status = 'available', updated_at = CURRENT_TIMESTAMP 
      WHERE id = NEW.table_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
DROP TRIGGER IF EXISTS table_status_update_trigger ON table_reservations;
CREATE TRIGGER table_status_update_trigger
AFTER INSERT OR UPDATE ON table_reservations
FOR EACH ROW
EXECUTE FUNCTION update_table_status_on_reservation();
```

### Trigger pour Ajouter Commandes à la Facture
```sql
-- Fonction pour ajouter la commande à la facture du client
CREATE OR REPLACE FUNCTION add_restaurant_order_to_room_folio()
RETURNS TRIGGER AS $$
BEGIN
  -- Si c'est une commande room_service chargée à la chambre
  IF NEW.order_type = 'room_service' 
     AND NEW.payment_status = 'charged_to_room' 
     AND NEW.booking_id IS NOT NULL THEN
    
    -- Insérer dans la table payments
    INSERT INTO payments (
      booking_id,
      amount,
      payment_method,
      payment_date,
      description,
      status,
      created_at
    ) VALUES (
      NEW.booking_id,
      NEW.total_amount,
      'room_charge',
      CURRENT_TIMESTAMP,
      'Restaurant - Commande #' || NEW.order_number,
      'completed',
      CURRENT_TIMESTAMP
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
DROP TRIGGER IF EXISTS add_to_room_folio_trigger ON restaurant_orders;
CREATE TRIGGER add_to_room_folio_trigger
AFTER INSERT OR UPDATE ON restaurant_orders
FOR EACH ROW
EXECUTE FUNCTION add_restaurant_order_to_room_folio();
```

## 🔧 Modifications Backend

### 1. Route pour Modifier une Réservation
```typescript
// PUT /api/restaurant/reservations/:id
router.put('/reservations/:id', 
  checkPermission('restaurant.reservations', 'update'), 
  updateReservation
);
```

**Controller** :
```typescript
export const updateReservation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { 
    status, 
    reservation_date, 
    reservation_time, 
    number_of_guests,
    special_requests,
    arrived_at 
  } = req.body;
  
  const result = await pool.query(
    `UPDATE table_reservations 
     SET status = $1, 
         reservation_date = $2, 
         reservation_time = $3,
         number_of_guests = $4,
         special_requests = $5,
         arrived_at = $6,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING *`,
    [status, reservation_date, reservation_time, number_of_guests, special_requests, arrived_at, id]
  );
  
  res.json(result.rows[0]);
};
```

### 2. Route pour Supprimer une Réservation
```typescript
// DELETE /api/restaurant/reservations/:id
router.delete('/reservations/:id', 
  checkPermission('restaurant.reservations', 'delete'), 
  deleteReservation
);
```

**Controller** :
```typescript
export const deleteReservation = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Récupérer la table_id avant de supprimer
  const reservation = await pool.query(
    'SELECT table_id FROM table_reservations WHERE id = $1',
    [id]
  );
  
  // Supprimer la réservation
  await pool.query('DELETE FROM table_reservations WHERE id = $1', [id]);
  
  // Remettre la table à disponible
  if (reservation.rows[0]?.table_id) {
    await pool.query(
      'UPDATE restaurant_tables SET status = $1 WHERE id = $2',
      ['available', reservation.rows[0].table_id]
    );
  }
  
  res.json({ message: 'Réservation supprimée' });
};
```

## 🎨 Modifications Frontend

### 1. Composant Modal de Modification de Réservation
Créer `client/src/components/restaurant/EditReservationModal.tsx` :
- Form avec tous les champs modifiables
- Dropdown pour le statut avec badges colorés
- DateTimePicker pour date/heure
- Bouton "Marquer comme arrivé" qui set `arrived_at` et change status à `seated`

### 2. Boutons d'Action sur Chaque Réservation
Dans `Restaurant.tsx` section Réservations :
- Bouton "Modifier" (crayon) → Ouvre modal
- Bouton "Arrivé" (check) → Change status à `seated` et set `arrived_at`
- Bouton "Supprimer" (poubelle) → Confirmation puis suppression

### 3. Affichage des Commandes Internes
Dans le tableau des commandes, ajouter :
- Badge "Interne" pour les commandes `order_type = 'room_service'`
- Info "Chambre XXX" avec le numéro de chambre
- Badge "Facturé à la chambre" si `payment_status = 'charged_to_room'`

## 📝 Workflow Complet

### Scénario 1 : Réservation et Service
1. Serveur crée une réservation → Table devient `reserved`
2. Client arrive → Serveur clique "Arrivé" → Table devient `occupied`
3. Serveur prend la commande → Commande liée à la table
4. Cuisine prépare → Chef change status `preparing` → `ready`
5. Serveur sert → Change status à `served`
6. Client termine → Serveur marque réservation `completed` → Table devient `available`

### Scénario 2 : Room Service
1. Serveur crée une commande avec :
   - `order_type` = 'room_service'
   - `room_id` = Chambre du client
   - `booking_id` = Réservation actuelle du client
   - `payment_status` = 'charged_to_room'
2. **Trigger automatique** : Ligne ajoutée dans `payments` pour cette booking
3. Cuisine prépare et livre
4. Lors du checkout, le total inclut automatiquement cette commande

### Scénario 3 : Annulation de Réservation
1. Client appelle pour annuler
2. Serveur/Manager clique "Supprimer" sur la réservation
3. Confirmation demandée
4. Réservation supprimée → Table revient à `available`

## 🎯 Priorités d'Implémentation

### Phase 1 : Base de Données (Urgent)
1. ✅ Ajouter colonne `arrived_at`
2. ✅ Créer trigger changement statut table
3. ✅ Créer trigger ajout commandes à facture

### Phase 2 : Backend (Important)
1. ✅ Route PUT /reservations/:id
2. ✅ Route DELETE /reservations/:id
3. ✅ Tester les triggers

### Phase 3 : Frontend (Normal)
1. ✅ Modal modification réservation
2. ✅ Boutons actions sur réservations
3. ✅ Affichage badges commandes internes

## 🧪 Tests à Effectuer

### Test 1 : Changement Automatique Statut Table
- Créer réservation → Vérifier table = `reserved`
- Marquer arrivé → Vérifier table = `occupied`
- Terminer → Vérifier table = `available`

### Test 2 : Modification Réservation
- Modifier l'heure → Vérifier sauvegarde
- Changer statut → Vérifier changement table
- Supprimer → Vérifier table libérée

### Test 3 : Room Service Facturation
- Créer commande room_service pour chambre 101
- Vérifier qu'une ligne apparaît dans `payments`
- Vérifier le montant est correct

---

**Temps Estimé Total** : 4-6 heures de développement
**Complexité** : Moyenne
**Impact** : Haut - Améliore grandement l'expérience utilisateur
