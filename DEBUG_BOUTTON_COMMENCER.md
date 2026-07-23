# 🔍 DEBUG - Bouton "Commencer" Restaurant

**Problème** : Le bouton "Commencer" ne fonctionne pas  
**Erreur** : 500 Server Error (générique)

---

## 🎯 DIAGNOSTIC

### 1. Vérifier si le Script SQL a été Exécuté

Le problème initial était le trigger de paiement. As-tu exécuté le script SQL?

**Script** : `database/FIX_RESTAURANT_ROOM_SERVICE_COMPLET.sql`

**Vérifier dans Supabase** :
```sql
-- Vérifier que 'room_charge' est dans la contrainte
SELECT pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conname = 'payments_payment_method_check';

-- Résultat attendu: Doit contenir 'room_charge'
```

Si le résultat ne contient PAS `'room_charge'`, **exécute d'abord le script SQL**.

---

### 2. Vérifier les Logs Backend

Le backend est déployé sur **Render** : https://zen-backend-jzjh.onrender.com

**Voir les Logs** :
1. Va sur https://dashboard.render.com
2. Sélectionne ton service backend
3. Clique sur **Logs** (menu gauche)
4. Clique sur "Commencer" dans l'app
5. **Note l'erreur** qui apparaît dans les logs

---

### 3. Tester la Route Directement

**Test avec curl** (dans PowerShell) :

```powershell
# Remplace ORDER_ID_ICI par un vrai ID de commande
$orderId = "ORDER_ID_ICI"
$token = "TON_JWT_TOKEN"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    status = "preparing"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://zen-backend-jzjh.onrender.com/api/restaurant/orders/$orderId/status" -Method PUT -Headers $headers -Body $body
```

**Ou avec l'interface** :
1. Ouvre la console du navigateur (F12)
2. Va dans l'onglet **Network**
3. Clique sur "Commencer"
4. Clique sur la requête `status` qui apparaît
5. Regarde l'onglet **Response** pour voir l'erreur exacte

---

## ⚠️ CAUSES POSSIBLES

### Cause 1 : Script SQL pas exécuté
**Symptôme** : Erreur `payment_method_check constraint violation`  
**Solution** : Exécuter `database/FIX_RESTAURANT_ROOM_SERVICE_COMPLET.sql`

### Cause 2 : Backend pas redéployé
**Symptôme** : Code modifié mais erreur persiste  
**Solution** : Render redéploie automatiquement, mais ça prend 3-5 min

### Cause 3 : Permissions manquantes
**Symptôme** : Erreur `Permission denied` ou `Unauthorized`  
**Solution** : Vérifier que le rôle a la permission `restaurant.orders.update_status`

### Cause 4 : Commande n'existe pas
**Symptôme** : Erreur `Order not found`  
**Solution** : La commande a peut-être été supprimée

### Cause 5 : Base de données déconnectée
**Symptôme** : Timeout ou connection error  
**Solution** : Vérifier les variables d'environnement sur Render

---

## 🔧 SOLUTIONS

### Solution 1 : Exécuter le Script SQL (SI PAS ENCORE FAIT)

**Dans Supabase SQL Editor** :

```sql
-- Ajouter 'room_charge' aux méthodes valides
ALTER TABLE payments 
DROP CONSTRAINT IF EXISTS payments_payment_method_check;

ALTER TABLE payments 
ADD CONSTRAINT payments_payment_method_check 
CHECK (payment_method IN ('cash', 'card', 'mobile_money', 'bank_transfer', 'room_charge'));

-- Recréer le trigger
DROP TRIGGER IF EXISTS add_to_room_folio_trigger ON restaurant_orders;
DROP FUNCTION IF EXISTS add_restaurant_order_to_room_folio();

CREATE OR REPLACE FUNCTION add_restaurant_order_to_room_folio()
RETURNS TRIGGER AS $$
DECLARE
  v_room_number VARCHAR(10);
  v_guest_name VARCHAR(255);
BEGIN
  IF NEW.order_type = 'room_service' AND NEW.booking_id IS NOT NULL THEN
    
    SELECT r.room_number, g.first_name || ' ' || g.last_name
    INTO v_room_number, v_guest_name
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN guests g ON b.guest_id = g.id
    WHERE b.id = NEW.booking_id;
    
    INSERT INTO payments (
      booking_id,
      amount,
      payment_method,
      payment_status,
      notes,
      payment_date
    ) VALUES (
      NEW.booking_id,
      NEW.total_amount,
      'room_charge',
      'pending',
      'Restaurant - Commande #' || NEW.order_number || 
        CASE 
          WHEN v_room_number IS NOT NULL THEN ' (Chambre ' || v_room_number || ')'
          ELSE ''
        END,
      NOW()
    );
    
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_to_room_folio_trigger
  AFTER INSERT ON restaurant_orders
  FOR EACH ROW
  EXECUTE FUNCTION add_restaurant_order_to_room_folio();
```

---

### Solution 2 : Vérifier les Permissions

**Dans Supabase SQL Editor** :

```sql
-- Voir les permissions du rôle restaurant_chef
SELECT r.name as role, p.resource, p.action
FROM roles r
JOIN role_permissions p ON r.id = p.role_id
WHERE r.name = 'restaurant_chef'
AND p.resource = 'restaurant.orders'
ORDER BY p.action;

-- Résultat attendu: Doit contenir 'update_status'
```

**Si la permission manque** :

```sql
-- Ajouter la permission
INSERT INTO role_permissions (role_id, resource, action)
SELECT id, 'restaurant.orders', 'update_status'
FROM roles
WHERE name IN ('restaurant_chef', 'restaurant_manager')
ON CONFLICT DO NOTHING;
```

---

### Solution 3 : Redémarrer le Service Render

Si le backend ne répond plus :

1. Va sur https://dashboard.render.com
2. Sélectionne ton service backend
3. Clique sur **Manual Deploy** → **Clear build cache & deploy**
4. Attends 3-5 minutes

---

## 📊 CHECKLIST DEBUG

```
[ ] 1. Script SQL exécuté dans Supabase
[ ] 2. room_charge dans la contrainte payment_method
[ ] 3. Trigger add_to_room_folio_trigger existe
[ ] 4. Permissions restaurant.orders.update_status existe
[ ] 5. Backend répond (ping https://zen-backend-jzjh.onrender.com)
[ ] 6. Logs backend vérifiés
[ ] 7. Console navigateur vérifiée (F12)
[ ] 8. Cache navigateur vidé (Ctrl+Shift+Delete)
```

---

## 🆘 PARTAGE CES INFOS

Pour que je puisse t'aider davantage, partage :

1. **L'erreur exacte** dans les logs Render (copie-colle)
2. **L'erreur dans la console** navigateur (F12 → Console)
3. **Le résultat** de cette requête SQL :
   ```sql
   SELECT pg_get_constraintdef(oid)
   FROM pg_constraint
   WHERE conname = 'payments_payment_method_check';
   ```

Avec ces infos, je pourrai identifier exactement le problème! 🔍
