# 🔍 PROBLÈME: Les 4 rôles restaurant causent erreur 500

## SYMPTÔMES

- ✅ **6 rôles originaux**: Création/modification d'utilisateurs fonctionne bien
  - admin, manager, receptionist, housekeeping, maintenance, accountant

- ❌ **4 rôles restaurant**: Erreur 500 lors de création/modification
  - restaurant_server, restaurant_cashier, restaurant_manager, restaurant_chef

**Erreur:** `API Error: 500 - Server error`

---

## CAUSES POSSIBLES

### 1. Contrainte CHECK dans la base de données

La table `users` pourrait avoir une contrainte CHECK qui limite les valeurs acceptées pour la colonne `role`:

```sql
CHECK (role IN ('admin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'accountant'))
```

Si c'est le cas, tous les nouveaux rôles `restaurant_*` seront rejetés.

### 2. ENUM Type PostgreSQL

La colonne `role` pourrait être définie comme un type ENUM avec seulement les 6 valeurs originales:

```sql
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'accountant');
```

### 3. Trigger sur INSERT/UPDATE

Un trigger PostgreSQL pourrait valider le rôle et rejeter les valeurs non reconnues.

---

## DIAGNOSTIC

### ÉTAPE 1: Exécuter le script de diagnostic

Dans Supabase SQL Editor, exécutez:

```sql
-- Voir le fichier: database/DIAGNOSTIC_CONSTRAINT_ROLE.sql
```

Ce script va:
1. Afficher la structure de la table `users`
2. Lister toutes les contraintes CHECK
3. Vérifier si `role` est un ENUM
4. Tester la création d'un utilisateur avec `restaurant_server`

### ÉTAPE 2: Analyser les résultats

**Si vous voyez une contrainte CHECK:**
```
constraint_name: users_role_check
constraint_definition: CHECK (role IN ('admin', 'manager', ...))
```
→ **Solution A: Supprimer ou modifier la contrainte**

**Si vous voyez un ENUM:**
```
enum_name: user_role
enum_values: admin, manager, receptionist, ...
```
→ **Solution B: Ajouter les valeurs au ENUM**

**Si le test échoue avec une erreur:**
```
❌ ERREUR: new row for relation "users" violates check constraint "users_role_check"
```
→ Confirme qu'il y a une contrainte

---

## SOLUTION A: Supprimer la contrainte CHECK

Si la table `users` a une contrainte CHECK sur `role`:

```sql
-- 1. Trouver le nom exact de la contrainte
SELECT conname 
FROM pg_constraint 
WHERE conrelid = 'users'::regclass 
AND contype = 'c'
AND pg_get_constraintdef(oid) LIKE '%role%';

-- 2. Supprimer la contrainte (remplacer CONSTRAINT_NAME)
ALTER TABLE users DROP CONSTRAINT users_role_check;

-- 3. Optionnel: Ajouter une nouvelle contrainte avec tous les rôles
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN (
  'admin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'accountant',
  'restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef'
));
```

---

## SOLUTION B: Ajouter valeurs au ENUM

Si la colonne `role` est un ENUM type:

```sql
-- 1. Vérifier le nom du type ENUM
SELECT typname FROM pg_type WHERE typname LIKE '%role%';

-- 2. Ajouter les nouvelles valeurs
ALTER TYPE user_role ADD VALUE 'restaurant_server';
ALTER TYPE user_role ADD VALUE 'restaurant_cashier';
ALTER TYPE user_role ADD VALUE 'restaurant_manager';
ALTER TYPE user_role ADD VALUE 'restaurant_chef';
```

**Note:** Les valeurs ENUM doivent être ajoutées une par une et ne peuvent pas être supprimées facilement.

---

## SOLUTION C: Changer le type de colonne

Si l'ENUM est trop restrictif, changez la colonne en VARCHAR:

```sql
-- 1. Modifier le type de colonne
ALTER TABLE users 
ALTER COLUMN role TYPE VARCHAR(50);

-- 2. Optionnel: Ajouter une contrainte CHECK flexible
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN (
  SELECT name FROM roles WHERE is_active = true
));
```

**Attention:** Cette contrainte dynamique vérifiera les rôles actifs dans la table `roles`.

---

## VÉRIFICATION

Après avoir appliqué la solution, testez:

```sql
-- Test d'insertion
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES ('test@example.com', 'dummy', 'Test', 'User', 'restaurant_server')
RETURNING id, email, role;

-- Si succès, supprimer
DELETE FROM users WHERE email = 'test@example.com';
```

---

## ÉTAPES À SUIVRE MAINTENANT

1. ✅ **Exécuter** `database/DIAGNOSTIC_CONSTRAINT_ROLE.sql` dans Supabase
2. 📋 **Analyser** les résultats pour identifier la cause
3. 🔧 **Appliquer** la solution A, B ou C selon le diagnostic
4. ✅ **Tester** la création d'un utilisateur avec un rôle restaurant
5. 🔄 **Rafraîchir** l'application et réessayer

---

## DITES-MOI LES RÉSULTATS

Après avoir exécuté le script de diagnostic, dites-moi:

1. **Y a-t-il une contrainte CHECK?**
   - Oui / Non
   - Si oui, quelle est la définition?

2. **Y a-t-il un ENUM type?**
   - Oui / Non
   - Si oui, quelles sont les valeurs?

3. **Le test de création a-t-il réussi?**
   - ✅ Succès
   - ❌ Erreur: (copiez le message)

Avec ces informations, je pourrai vous donner la solution exacte ! 🔍
