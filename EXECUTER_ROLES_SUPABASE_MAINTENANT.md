# 🚨 URGENT - Exécuter ce Script MAINTENANT dans Supabase

## ❌ Problème Actuel

**Erreur 500** : `"Erreur serveur lors de la vérification des permissions"`

### Cause
Le backend essaie de charger les permissions depuis la table `roles`, mais les 4 rôles restaurant **n'existent PAS** dans cette table dans Supabase !

### Symptôme
```
API Request: get /restaurant/stats
API Error: 500
Object { message: "Erreur serveur lors de la vérification des permissions" }
```

## ✅ Solution

Ajouter les 4 rôles restaurant dans la table `roles` de Supabase avec leurs permissions JSONB.

## 📋 ÉTAPES À SUIVRE

### 1️⃣ Ouvrir Supabase
1. Aller sur https://supabase.com
2. Se connecter
3. Ouvrir votre projet

### 2️⃣ Ouvrir SQL Editor
1. Cliquer sur **"SQL Editor"** dans le menu de gauche
2. Cliquer sur **"New Query"**

### 3️⃣ Copier-Coller le Script
Ouvrir le fichier :
```
database/ADD_RESTAURANT_ROLES_TO_ROLES_TABLE.sql
```

**OU** copier directement ce script :

```sql
-- 1. Restaurant Server (Serveur)
INSERT INTO roles (name, description, permissions)
VALUES (
  'restaurant_server',
  'Serveur de restaurant - Gère les commandes et les tables',
  '{
    "restaurant": {
      "orders": ["read", "create"],
      "menu": ["read"],
      "tables": ["read"],
      "print": ["tickets"]
    }
  }'::jsonb
)
ON CONFLICT (name) DO UPDATE
SET 
  description = EXCLUDED.description,
  permissions = EXCLUDED.permissions;

-- 2. Restaurant Cashier (Caissier)
INSERT INTO roles (name, description, permissions)
VALUES (
  'restaurant_cashier',
  'Caissier de restaurant - Gère les paiements restaurant',
  '{
    "restaurant": {
      "orders": ["read", "update_payment"],
      "menu": ["read"],
      "payments": ["create", "refund"],
      "print": ["invoices"]
    }
  }'::jsonb
)
ON CONFLICT (name) DO UPDATE
SET 
  description = EXCLUDED.description,
  permissions = EXCLUDED.permissions;

-- 3. Restaurant Manager (Manager Restaurant)
INSERT INTO roles (name, description, permissions)
VALUES (
  'restaurant_manager',
  'Manager de restaurant - Gestion complète du restaurant',
  '{
    "restaurant": {
      "orders": ["read", "create", "update", "update_status", "update_payment"],
      "menu": ["read", "create", "update", "delete"],
      "tables": ["read", "create", "update", "delete", "update_status"],
      "reservations": ["read", "create", "update", "delete"],
      "payments": ["create", "refund"],
      "stats": ["read"],
      "print": ["tickets", "invoices"]
    }
  }'::jsonb
)
ON CONFLICT (name) DO UPDATE
SET 
  description = EXCLUDED.description,
  permissions = EXCLUDED.permissions;

-- 4. Restaurant Chef (Chef de Cuisine)
INSERT INTO roles (name, description, permissions)
VALUES (
  'restaurant_chef',
  'Chef de cuisine - Gère la production en cuisine',
  '{
    "restaurant": {
      "orders": ["read", "update_status"],
      "menu": ["read"],
      "stats": ["read_production"],
      "print": ["tickets"]
    }
  }'::jsonb
)
ON CONFLICT (name) DO UPDATE
SET 
  description = EXCLUDED.description,
  permissions = EXCLUDED.permissions;

-- Vérifier les rôles
SELECT 
  id,
  name,
  description,
  permissions
FROM roles
WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef')
ORDER BY name;
```

### 4️⃣ Exécuter le Script
1. Cliquer sur **"Run"** (en haut à droite)
2. Attendre quelques secondes

### 5️⃣ Vérifier le Résultat
Vous devriez voir **4 lignes** dans les résultats avec les 4 rôles :
- `restaurant_cashier`
- `restaurant_chef`
- `restaurant_manager`
- `restaurant_server`

## 🔧 Après l'Exécution

### Tester Immédiatement
1. Retourner sur https://zen-lyart.vercel.app
2. Se connecter avec un rôle restaurant (ex: `chef@hotel.com`)
3. **Le dashboard devrait maintenant fonctionner** sans erreur 500

## 🤔 Pourquoi Ce Problème ?

### Architecture Backend
Le backend utilise un système RBAC (Role-Based Access Control) avec :
1. Table `users` → contient `role_id`
2. Table `roles` → contient `name` et `permissions` (JSONB)
3. Middleware `checkPermission` → charge les permissions depuis `roles`

### Le Problème
Les utilisateurs avec les nouveaux rôles restaurant ont été créés, mais les rôles n'existaient PAS dans la table `roles` !

Résultat : Le backend ne peut pas charger les permissions → Erreur 500

### La Solution
Ce script ajoute les 4 rôles avec leurs permissions JSONB dans la table `roles`.

## 📊 Structure des Permissions JSONB

Les permissions sont stockées en format JSONB hiérarchique :

```json
{
  "restaurant": {
    "orders": ["read", "create", "update"],
    "menu": ["read"],
    "tables": ["read", "update_status"]
  }
}
```

Le middleware vérifie : `permissions.restaurant.orders` contient `"read"` ?

## ⚠️ IMPORTANT

**ON CONFLICT (name) DO UPDATE** :
- Si le rôle existe déjà → Met à jour les permissions
- Si le rôle n'existe pas → Le crée

Donc **ce script est sécuritaire** à exécuter plusieurs fois.

## 🎯 Résultat Attendu

Après l'exécution :
- ✅ Les 4 rôles existent dans `roles`
- ✅ Chaque rôle a ses permissions JSONB
- ✅ Le backend peut vérifier les permissions
- ✅ Plus d'erreur 500 lors de l'accès au restaurant
- ✅ Les dashboards restaurant fonctionnent
- ✅ L'ajout de tables fonctionne

---

**⏰ TEMPS ESTIMÉ** : 2 minutes  
**⚡ PRIORITÉ** : URGENT - Bloque tout le module restaurant  
**🎯 ACTION** : Exécuter le script SQL maintenant dans Supabase
