# 🔧 FIX: Erreur Payments lors de la création de commande

---

## ❌ ERREUR

```
API Error: 500
column "status" of relation "payments" does not exist
```

**Quand?** Lors de la création d'une commande restaurant (Room Service)

---

## 🔍 CAUSE

Le trigger SQL `add_to_room_folio_trigger` utilise des colonnes incorrectes:
- ❌ `status` → N'existe pas
- ✅ `payment_status` → Nom correct de la colonne

Le trigger essaie aussi d'utiliser:
- ❌ `description` → N'existe pas  
- ✅ `notes` → Nom correct de la colonne

---

## ✅ SOLUTION (2 MINUTES)

### 1️⃣ Ouvre Supabase SQL Editor

**Va sur:** https://supabase.com/dashboard/project/vzzznyrlbhftixgkqcca/sql/new

---

### 2️⃣ Copie ce script SQL

```sql
-- Supprimer l'ancien trigger (avec les mauvaises colonnes)
DROP TRIGGER IF EXISTS add_to_room_folio_trigger ON restaurant_orders;
DROP FUNCTION IF EXISTS add_restaurant_order_to_room_folio();

-- Créer la fonction CORRIGÉE
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
    
    -- CORRECTION: Utiliser payment_status (pas status) et notes (pas description)
    INSERT INTO payments (
      booking_id,
      amount,
      payment_method,
      payment_status,
      notes
    ) VALUES (
      NEW.booking_id,
      NEW.total_amount,
      'room_charge',
      'completed',
      'Restaurant - Commande #' || NEW.order_number || 
        CASE 
          WHEN v_room_number IS NOT NULL THEN ' (Chambre ' || v_room_number || ')'
          ELSE ''
        END
    );
    
    RAISE NOTICE 'Commande ajoutée à la facture de la chambre % (%)', v_room_number, v_guest_name;
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

---

### 3️⃣ Exécute le script

1. Colle le script dans l'éditeur SQL
2. Clique sur **"RUN"** (en bas à droite)
3. Vérifie qu'il n'y a pas d'erreur

---

## ✅ RÉSULTAT ATTENDU

Tu dois voir:
```
Success. Rows returned by statement 0
```

Cela signifie que le trigger a été **recréé avec les bonnes colonnes**! ✅

---

## 🧪 VÉRIFICATION

Après avoir exécuté le script:

1. **Rafraîchis ton app**: https://zen-lyart.vercel.app
2. **Va dans**: Restaurant
3. **Crée une commande** de type "Room Service"
4. **Vérifie**: La commande doit se créer **sans erreur**! ✅

---

## 📋 CE QUI A ÉTÉ CORRIGÉ

| Avant (❌ Incorrect) | Après (✅ Correct) |
|---------------------|-------------------|
| `status`            | `payment_status`  |
| `description`       | `notes`           |
| `created_at` (manuel) | (auto-généré)   |
| `updated_at` (manuel) | (auto-généré)   |

---

## 📊 IMPACT

### Avant le fix:
- ❌ Impossible de créer une commande Room Service
- ❌ Erreur: `column "status" does not exist`

### Après le fix:
- ✅ Les commandes Room Service se créent normalement
- ✅ Les paiements sont automatiquement ajoutés à la facture de la chambre
- ✅ La notification apparaît dans les logs

---

## 📁 FICHIER SQL COMPLET

Le fichier détaillé est dans:
```
database/FIX_PAYMENTS_TRIGGER.sql
```

---

## ❓ BESOIN D'AIDE?

### Si tu vois une erreur SQL
→ Vérifie que tu as copié tout le script (du début à la fin)

### Si le problème persiste
→ Partage-moi l'erreur exacte

### Si la commande fonctionne après le fix
→ **BRAVO!** Le problème est résolu! 🎉

---

## ⚡ RÉSUMÉ ULTRA-RAPIDE

1. ✅ Ouvre Supabase SQL Editor
2. ✅ Copie le script SQL ci-dessus
3. ✅ Clique "RUN"
4. ✅ Rafraîchis ton app
5. ✅ Teste la création d'une commande
6. ✅ **C'EST RÉGLÉ!** 🎉

---

**Temps requis**: 2 minutes
**Difficulté**: ⭐ Facile
**Risque**: Aucun (remplace juste le trigger défectueux)

