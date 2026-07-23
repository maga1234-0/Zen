# 🔧 FIX RESTAURANT - À Exécuter Maintenant

**Problème** : Room Service et bouton "Commencer" ne fonctionnent pas  
**Erreur** : `payments_payment_method_check constraint violation`

---

## 🎯 SOLUTION RAPIDE

### Étape 1 : Ouvre Supabase SQL Editor

Va sur https://supabase.com/dashboard → Ton projet → **SQL Editor**

### Étape 2 : Copie et Exécute ce Script

**Fichier** : `database/FIX_RESTAURANT_ROOM_SERVICE_COMPLET.sql`

Ou copie directement ce code :

```sql
-- Ajouter 'room_charge' à la contrainte payment_method
ALTER TABLE payments 
DROP CONSTRAINT IF EXISTS payments_payment_method_check;

ALTER TABLE payments 
ADD CONSTRAINT payments_payment_method_check 
CHECK (payment_method IN ('cash', 'card', 'mobile_money', 'bank_transfer', 'room_charge'));

-- Supprimer l'ancien trigger
DROP TRIGGER IF EXISTS add_to_room_folio_trigger ON restaurant_orders;
DROP FUNCTION IF EXISTS add_restaurant_order_to_room_folio();

-- Créer la fonction corrigée
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

-- Recréer le trigger
CREATE TRIGGER add_to_room_folio_trigger
  AFTER INSERT ON restaurant_orders
  FOR EACH ROW
  EXECUTE FUNCTION add_restaurant_order_to_room_folio();
```

### Étape 3 : Clique sur "Run" (ou Ctrl+Enter)

Tu devrais voir :
```
Success. No rows returned
```

---

## 📋 CE QUI EST CORRIGÉ

### Problème 1 : payment_method invalide
**Avant** : Trigger utilise `'room_charge'` mais contrainte n'accepte que `cash, card, mobile_money, bank_transfer`  
**Après** : `'room_charge'` ajouté à la liste des méthodes valides

### Problème 2 : Mauvais noms de colonnes
**Avant** : Trigger utilise `status` et `description` (colonnes inexistantes)  
**Après** : Trigger utilise `payment_status` et `notes` (colonnes correctes)

---

## ✅ TESTER

Après avoir exécuté le script :

### Test 1 : Room Service
1. Va sur **Restaurant**
2. Sélectionne un item du menu
3. Choisis **Order Type = Room Service**
4. Sélectionne une chambre occupée
5. Clique **Submit Order**
6. ✅ Devrait fonctionner sans erreur

### Test 2 : Bouton "Commencer"
1. Va sur **Restaurant**
2. Trouve une commande "pending"
3. Clique sur **Commencer**
4. ✅ Status devrait passer à "preparing"

---

## 🔍 VÉRIFICATION

Pour vérifier que le fix est appliqué :

```sql
-- Voir la contrainte mise à jour
SELECT pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conname = 'payments_payment_method_check';

-- Résultat attendu: Doit contenir 'room_charge'
```

---

## ⚠️ SI ÇA NE MARCHE TOUJOURS PAS

### Erreur "constraint still fails"
- Vide le cache du navigateur (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Réessaye

### Erreur "trigger does not exist"
- Le script devrait créer le trigger
- Vérifie qu'il n'y a pas d'erreur de syntaxe dans Supabase
- Copie le script ligne par ligne si nécessaire

### Autre erreur
- Note l'erreur exacte
- Vérifie les logs backend sur Render
- Partage l'erreur pour diagnostic

---

## 🎯 RÉSULTAT ATTENDU

Après ce fix :
- ✅ Room Service fonctionne
- ✅ Paiement ajouté automatiquement à la folio de la chambre
- ✅ Bouton "Commencer" fonctionne
- ✅ Status des commandes change correctement
- ✅ Plus d'erreur `payment_method_check`

---

**MAINTENANT** : Exécute le script SQL dans Supabase! 🚀
