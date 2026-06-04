# 🎯 SOLUTION TROUVÉE ! Exécuter ce script maintenant

## LE PROBLÈME IDENTIFIÉ ✅

La contrainte **`users_role_check`** limite les rôles aux 6 valeurs originales:
- admin, manager, receptionist, housekeeping, maintenance, accountant

Elle **BLOQUE** les 4 nouveaux rôles restaurant:
- ❌ restaurant_server
- ❌ restaurant_cashier
- ❌ restaurant_manager  
- ❌ restaurant_chef

---

## LA SOLUTION

Supprimer l'ancienne contrainte et en créer une nouvelle avec **les 10 rôles**.

---

## ACTION IMMÉDIATE: Exécuter ce script dans Supabase

### ÉTAPE 1: Ouvrir Supabase

1. Aller sur https://supabase.com
2. Ouvrir votre projet
3. SQL Editor → New query

### ÉTAPE 2: Copier ce script

Ouvrir le fichier: **`database/FIX_ROLE_CONSTRAINT.sql`**

OU copier directement:

```sql
-- Supprimer l'ancienne contrainte
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Créer nouvelle contrainte avec 10 rôles
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (
  (role)::text = ANY (ARRAY[
    'admin'::character varying,
    'manager'::character varying,
    'receptionist'::character varying,
    'housekeeping'::character varying,
    'maintenance'::character varying,
    'accountant'::character varying,
    'restaurant_server'::character varying,
    'restaurant_cashier'::character varying,
    'restaurant_manager'::character varying,
    'restaurant_chef'::character varying
  ]::text[])
);
```

### ÉTAPE 3: Exécuter dans Supabase

1. Coller le script dans SQL Editor
2. Cliquer **"Run"** (ou F5)
3. Attendre 2-3 secondes

### ÉTAPE 4: Vérifier les tests

Le script affichera 5 tests:
```
✅ TEST 1: restaurant_server - SUCCÈS
✅ TEST 2: restaurant_cashier - SUCCÈS
✅ TEST 3: restaurant_manager - SUCCÈS
✅ TEST 4: restaurant_chef - SUCCÈS
✅ TEST 5: admin - SUCCÈS
```

**Si vous voyez 5x ✅** → C'est parfait !

---

## APRÈS L'EXÉCUTION

### ÉTAPE 1: Rafraîchir l'application

1. Aller sur https://zen-lyart.vercel.app
2. **Ctrl+Shift+R** (hard refresh)

### ÉTAPE 2: Tester la création d'un staff restaurant

1. Staff → Add New Staff
2. Remplir le formulaire:
   - First Name: **Test**
   - Last Name: **Restaurant**
   - Email: **test@restaurant.com**
   - Phone: **1234567890**
   - Role: **Serveur Restaurant** (ou n'importe quel rôle restaurant)
   - Password: **test123**
3. Cliquer **"Add Staff"**
4. ✅ **Devrait fonctionner sans erreur 500 !**

---

## RÉSULTAT ATTENDU

### AVANT:
```
6 rôles originaux: ✅ Fonctionnent
4 rôles restaurant: ❌ Erreur 500 (contrainte bloque)
```

### APRÈS:
```
6 rôles originaux: ✅ Fonctionnent
4 rôles restaurant: ✅ Fonctionnent (contrainte mise à jour)
```

---

## TIMELINE

```
1. Exécuter script Supabase (30 secondes)
2. Vérifier les 5 tests (✅✅✅✅✅)
3. Rafraîchir l'app (Ctrl+Shift+R)
4. Tester création staff restaurant
5. ✅ Succès !
```

**TOTAL: 1-2 minutes**

---

## EN CAS DE PROBLÈME

### Si un test échoue (❌)

Copiez le message d'erreur et montrez-le moi.

### Si erreur lors de DROP CONSTRAINT

```
ERROR: constraint "users_role_check" of relation "users" does not exist
```

→ C'est OK, ça signifie qu'elle n'existait pas. Continuez.

### Si erreur 500 persiste après le fix

1. Vérifiez dans Supabase que la contrainte a bien été modifiée:
   ```sql
   SELECT pg_get_constraintdef(oid) 
   FROM pg_constraint 
   WHERE conname = 'users_role_check';
   ```

2. Devrait afficher les 10 rôles

3. Si problème, montrez-moi le résultat

---

## POURQUOI CETTE CONTRAINTE EXISTAIT?

La contrainte `CHECK` a probablement été créée au début du projet pour **valider les valeurs de rôle**. C'est une bonne pratique de sécurité, mais elle doit être mise à jour quand de nouveaux rôles sont ajoutés.

**Alternative plus flexible:**
Au lieu d'une liste fixe, on pourrait utiliser:
```sql
CHECK (role IN (SELECT name FROM roles WHERE is_active = true))
```

Mais cela nécessite une sous-requête et peut être moins performant.

---

## RÉCAPITULATIF DES FICHIERS

- **`database/FIX_ROLE_CONSTRAINT.sql`** ← **EXÉCUTER CE SCRIPT**
- `database/DIAGNOSTIC_CONSTRAINT_ROLE.sql` - Diagnostic complet
- `PROBLEM_4_ROLES_RESTAURANT.md` - Explication du problème

---

**🚀 EXÉCUTEZ LE SCRIPT MAINTENANT ET DITES-MOI SI ÇA FONCTIONNE !**

Date: 2 juin 2026  
Solution: Mise à jour de la contrainte CHECK  
Temps estimé: 1-2 minutes
