# 🔧 URGENT - Corriger l'Erreur 500 du Bouton "Commencer"

## 🐛 Problème Identifié

Quand tu cliques sur "Commencer", tu obtiens **API Error: 500 "Server error"**.

**Cause probable**: La contrainte CHECK sur la colonne `status` de la table `restaurant_orders` n'accepte peut-être pas le statut `'preparing'`.

## ✅ Solution

Exécuter le script SQL suivant dans **Supabase SQL Editor**:

### Étapes:

1. **Ouvrir Supabase**
   - Aller sur https://supabase.com
   - Ouvrir ton projet
   - Cliquer sur "SQL Editor" dans le menu de gauche

2. **Copier-Coller le Script**
   ```sql
   -- Supprimer l'ancienne contrainte si elle existe
   ALTER TABLE restaurant_orders 
   DROP CONSTRAINT IF EXISTS restaurant_orders_status_check;

   -- Ajouter la nouvelle contrainte avec TOUS les statuts
   ALTER TABLE restaurant_orders 
   ADD CONSTRAINT restaurant_orders_status_check 
   CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'));

   -- Vérifier
   SELECT 
       conname AS constraint_name,
       pg_get_constraintdef(oid) AS constraint_definition
   FROM pg_constraint
   WHERE conrelid = 'restaurant_orders'::regclass
   AND conname = 'restaurant_orders_status_check';
   ```

3. **Exécuter** (bouton "Run" ou Ctrl+Enter)

4. **Vérifier le résultat**
   - Tu devrais voir un message de succès
   - La contrainte `restaurant_orders_status_check` devrait apparaître avec tous les statuts

5. **Retester le Bouton "Commencer"**
   - Rafraîchir la page web
   - Cliquer sur "Commencer" sur une commande
   - ✅ Ça devrait fonctionner!

## 📊 Statuts Autorisés Après le Fix

| Statut | Description | Utilisé par |
|--------|-------------|-------------|
| `pending` | En attente | Nouvelle commande |
| `confirmed` | Confirmée | (optionnel) |
| `preparing` | En préparation | Chef commence ✅ |
| `ready` | Prête | Chef termine |
| `served` | Servie | Serveur |
| `completed` | Terminée | Fin |
| `cancelled` | Annulée | Annulation |

## 🧪 Test Rapide (Optionnel)

Si tu veux tester manuellement dans SQL Editor:

```sql
-- 1. Voir les commandes en attente
SELECT id, order_number, status FROM restaurant_orders WHERE status = 'pending' LIMIT 1;

-- 2. Copier l'ID de la commande et tester l'UPDATE
-- UPDATE restaurant_orders SET status = 'preparing' WHERE id = 'ID-FROM-STEP-1';
```

## 🎯 Prochaine Action

Une fois le script exécuté:
1. ✅ Rafraîchir https://zen-lyart.vercel.app
2. ✅ Cliquer sur "Commencer"
3. ✅ Le statut devrait passer à "En préparation"
4. ✅ Le bouton "Prête" devrait apparaître

---

**Temps estimé**: 2 minutes
**Fichier SQL**: `database/FIX_ORDER_STATUS_CONSTRAINT.sql`
