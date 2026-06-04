# 🎯 ACTION: Diagnostic des rôles restaurant

## LE PROBLÈME

**Seulement les 4 nouveaux rôles restaurant** causent erreur 500:
- ❌ restaurant_server
- ❌ restaurant_cashier
- ❌ restaurant_manager
- ❌ restaurant_chef

**Les 6 rôles originaux fonctionnent:**
- ✅ admin, manager, receptionist, housekeeping, maintenance, accountant

---

## LA CAUSE PROBABLE

La table `users` a probablement une **contrainte** qui bloque les nouveaux rôles:
- **Contrainte CHECK**: `role IN ('admin', 'manager', ...)`
- **OU ENUM type**: Type PostgreSQL avec valeurs fixes

---

## ACTION IMMÉDIATE: Exécuter ce script dans Supabase

### ÉTAPE 1: Copier ce script

```sql
-- Vérifier les contraintes CHECK
SELECT 
    con.conname AS constraint_name,
    pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'users'
AND con.contype = 'c';

-- Vérifier si role est un ENUM
SELECT 
    t.typname AS enum_name,
    string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS enum_values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname LIKE '%role%'
GROUP BY t.typname;

-- Test de création
DO $$ 
BEGIN
    INSERT INTO users (email, password_hash, first_name, last_name, role)
    VALUES ('test_restaurant@example.com', 'dummy', 'Test', 'Restaurant', 'restaurant_server');
    
    RAISE NOTICE '✅ SUCCÈS: Création possible';
    DELETE FROM users WHERE email = 'test_restaurant@example.com';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ ERREUR: %', SQLERRM;
END $$;
```

### ÉTAPE 2: Exécuter dans Supabase

1. Supabase → SQL Editor
2. New query
3. Coller le script ci-dessus
4. Run

### ÉTAPE 3: Dites-moi les résultats

**Question 1:** Y a-t-il une contrainte CHECK affichée?
```
constraint_name: _______
constraint_definition: _______
```

**Question 2:** Y a-t-il un ENUM type affiché?
```
enum_name: _______
enum_values: _______
```

**Question 3:** Le test de création affiche-t-il?
- [ ] ✅ SUCCÈS: Création possible
- [ ] ❌ ERREUR: (copiez le message d'erreur)

---

## SOLUTIONS SELON LE DIAGNOSTIC

### Si CONTRAINTE CHECK trouvée:

```sql
-- Supprimer l'ancienne contrainte
ALTER TABLE users DROP CONSTRAINT users_role_check;

-- Ajouter nouvelle contrainte avec tous les rôles
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN (
  'admin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'accountant',
  'restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef'
));
```

### Si ENUM TYPE trouvé:

```sql
-- Ajouter les nouvelles valeurs
ALTER TYPE user_role ADD VALUE 'restaurant_server';
ALTER TYPE user_role ADD VALUE 'restaurant_cashier';
ALTER TYPE user_role ADD VALUE 'restaurant_manager';
ALTER TYPE user_role ADD VALUE 'restaurant_chef';
```

---

## TIMELINE

```
1. Exécuter script diagnostic (30 secondes)
2. Identifier le problème
3. Appliquer la solution (30 secondes)
4. Tester l'application
```

**TOTAL: 2-3 minutes**

---

## APRÈS LE FIX

1. ✅ Rafraîchir l'app (Ctrl+Shift+R)
2. ✅ Staff → Add New Staff
3. ✅ Choisir un rôle restaurant (ex: Serveur Restaurant)
4. ✅ Remplir le formulaire
5. ✅ Cliquer "Add Staff"
6. ✅ **PAS d'erreur 500** → Succès !

---

**EXÉCUTEZ LE SCRIPT MAINTENANT ET DITES-MOI LES RÉSULTATS ! 🔍**
