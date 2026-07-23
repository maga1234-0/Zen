# 🗑️ Supprimer la Réservation joe mudibu

## ✅ SOLUTION LA PLUS SIMPLE : Utiliser le Bouton dans l'Interface

### Le bouton "Supprimer" existe déjà! 

1. **Va sur** : https://zen-lyart.vercel.app/bookings
2. **Connecte-toi** en tant qu'Admin
3. **Trouve** la réservation "joe mudibu"
4. **Clique** sur l'icône **🗑️ (poubelle)** à droite de la ligne
5. **Confirme** la suppression

**C'est tout!** Le bouton supprime automatiquement :
- ✅ La réservation
- ✅ Les paiements liés
- ✅ Les commandes restaurant liées
- ✅ Tout est géré par le backend

---

## 🔧 ALTERNATIVE : Script SQL (Si le bouton ne marche pas)

Si tu préfères utiliser SQL ou si le bouton ne fonctionne pas, voici le script corrigé :

### Copie ce script dans Supabase SQL Editor :

```sql
-- Trouver et supprimer la réservation de joe mudibu
DO $$
DECLARE
    v_guest_id UUID;
    v_booking_id UUID;
BEGIN
    -- Étape 1: Trouver le guest par téléphone
    SELECT id INTO v_guest_id
    FROM guests
    WHERE phone LIKE '%8320480200%'
    LIMIT 1;

    IF v_guest_id IS NOT NULL THEN
        RAISE NOTICE 'Guest trouvé: %', v_guest_id;
        
        -- Étape 2: Trouver sa réservation du 03/06/2026
        SELECT id INTO v_booking_id
        FROM bookings
        WHERE guest_id = v_guest_id
        AND check_in_date = '2026-06-03'
        LIMIT 1;

        IF v_booking_id IS NOT NULL THEN
            RAISE NOTICE 'Réservation trouvée: %', v_booking_id;
            
            -- Étape 3: Supprimer les dépendances
            DELETE FROM payments WHERE booking_id = v_booking_id;
            RAISE NOTICE 'Paiements supprimés';
            
            DELETE FROM restaurant_orders WHERE booking_id = v_booking_id;
            RAISE NOTICE 'Commandes restaurant supprimées';
            
            DELETE FROM spa_bookings WHERE booking_id = v_booking_id;
            RAISE NOTICE 'Réservations spa supprimées';
            
            -- Étape 4: Supprimer la réservation
            DELETE FROM bookings WHERE id = v_booking_id;
            RAISE NOTICE '✅ Réservation supprimée avec succès!';
        ELSE
            RAISE NOTICE '❌ Aucune réservation trouvée pour ce guest à cette date';
        END IF;
    ELSE
        RAISE NOTICE '❌ Guest non trouvé avec ce numéro de téléphone';
    END IF;
END $$;
```

### Vérifier que c'est supprimé :

```sql
-- Vérifier qu'il n'y a plus de réservations
SELECT 
    b.*,
    g.full_name,
    g.phone
FROM bookings b
JOIN guests g ON b.guest_id = g.id
WHERE g.phone LIKE '%8320480200%';
-- Résultat attendu: 0 lignes
```

---

## 🔍 DEBUG : Trouver l'ID de la Réservation

Si tu veux d'abord voir l'ID de la réservation avant de la supprimer :

```sql
-- Voir toutes les infos de la réservation
SELECT 
    b.id as booking_id,
    b.check_in_date,
    b.check_out_date,
    b.status,
    b.total_amount,
    g.id as guest_id,
    g.full_name,
    g.phone,
    r.room_number
FROM bookings b
JOIN guests g ON b.guest_id = g.id
LEFT JOIN rooms r ON b.room_id = r.id
WHERE g.phone LIKE '%8320480200%'
ORDER BY b.check_in_date DESC;
```

Une fois que tu as l'ID, tu peux supprimer directement :

```sql
-- Remplace BOOKING_ID_ICI par l'ID trouvé
DO $$
DECLARE
    v_booking_id UUID := 'BOOKING_ID_ICI';
BEGIN
    DELETE FROM payments WHERE booking_id = v_booking_id;
    DELETE FROM restaurant_orders WHERE booking_id = v_booking_id;
    DELETE FROM spa_bookings WHERE booking_id = v_booking_id;
    DELETE FROM bookings WHERE id = v_booking_id;
    RAISE NOTICE 'Réservation supprimée';
END $$;
```

---

## ⚠️ IMPORTANT

### Le Bouton dans l'Interface est la Meilleure Option

**Pourquoi?**
- ✅ Plus simple (1 clic)
- ✅ Plus sûr (confirmation demandée)
- ✅ Gère automatiquement toutes les dépendances
- ✅ Utilise l'API officielle
- ✅ Logs automatiques
- ✅ Pas besoin d'accès Supabase

**Le script SQL est seulement nécessaire si** :
- ❌ Le bouton ne fonctionne pas
- ❌ Tu veux supprimer plusieurs réservations en masse
- ❌ Tu veux faire un debug avancé

---

## 📸 OÙ EST LE BOUTON ?

Dans la page **Bookings**, chaque ligne de réservation a :

```
| Guest          | Room | Check-in   | Check-out  | Status | Amount  | Actions    |
|----------------|------|------------|------------|--------|---------|------------|
| joe mudibu     | T1   | 03/06/2026 | ...        | ...    | $XX.XX  | ✏️ 🗑️     |
```

Le bouton **🗑️** est à droite dans la colonne "Actions".

Clique dessus → Confirme → C'est supprimé!

---

## ✅ RECOMMANDATION

**UTILISE LE BOUTON** dans l'interface plutôt que le SQL.

C'est plus simple, plus sûr, et déjà fonctionnel! 🎉
