# 🚨 Erreur 500 Restaurant - FIX URGENT

## ❌ Problème

Vous avez l'erreur suivante lors de l'accès au module Restaurant :

```
API Error: 500
Object { message: "Erreur serveur lors de la vérification des permissions" }
```

**URL** : `GET /restaurant/stats`  
**Backend** : https://zen-backend-jzjh.onrender.com

## 🔍 Cause Racine

Le **backend** ne reconnaît pas les 4 nouveaux rôles restaurant !

### Pourquoi ?

Le backend utilise la table `roles` dans Supabase pour vérifier les permissions :

```typescript
// zen_backend/src/middleware/checkPermission.ts
const result = await pool.query(
  `SELECT r.permissions, r.name as role_name
   FROM users u
   JOIN roles r ON u.role_id = r.id  // ← JOIN avec la table roles
   WHERE u.id = $1`,
  [req.user.id]
);
```

**Problème** : Les 4 rôles restaurant n'existent PAS dans la table `roles` de Supabase !

Donc quand un utilisateur avec `role = 'restaurant_chef'` essaie d'accéder au restaurant :
1. Le middleware cherche le rôle dans la table `roles`
2. Ne le trouve pas
3. **Erreur 500** : "Erreur serveur lors de la vérification des permissions"

## ✅ Solution

**Ajouter les 4 rôles restaurant dans la table `roles` de Supabase** avec leurs permissions JSONB.

## 🚀 ACTION IMMÉDIATE

### Étape 1 : Aller sur Supabase
1. Ouvrir https://supabase.com
2. Se connecter
3. Ouvrir votre projet
4. Cliquer sur **"SQL Editor"**
5. Cliquer sur **"New Query"**

### Étape 2 : Exécuter le Script SQL
Copier le fichier : `database/ADD_RESTAURANT_ROLES_TO_ROLES_TABLE.sql`

**OU** copier directement ce code :

```sql
-- Restaurant Server
INSERT INTO roles (name, description, permissions)
VALUES (
  'restaurant_server',
  'Serveur de restaurant',
  '{"restaurant":{"orders":["read","create"],"menu":["read"],"tables":["read"],"print":["tickets"]}}'::jsonb
) ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, permissions = EXCLUDED.permissions;

-- Restaurant Cashier
INSERT INTO roles (name, description, permissions)
VALUES (
  'restaurant_cashier',
  'Caissier de restaurant',
  '{"restaurant":{"orders":["read","update_payment"],"menu":["read"],"payments":["create","refund"],"print":["invoices"]}}'::jsonb
) ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, permissions = EXCLUDED.permissions;

-- Restaurant Manager
INSERT INTO roles (name, description, permissions)
VALUES (
  'restaurant_manager',
  'Manager de restaurant',
  '{"restaurant":{"orders":["read","create","update","update_status","update_payment"],"menu":["read","create","update","delete"],"tables":["read","create","update","delete","update_status"],"reservations":["read","create","update","delete"],"payments":["create","refund"],"stats":["read"],"print":["tickets","invoices"]}}'::jsonb
) ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, permissions = EXCLUDED.permissions;

-- Restaurant Chef
INSERT INTO roles (name, description, permissions)
VALUES (
  'restaurant_chef',
  'Chef de cuisine',
  '{"restaurant":{"orders":["read","update_status"],"menu":["read"],"stats":["read_production"],"print":["tickets"]}}'::jsonb
) ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, permissions = EXCLUDED.permissions;

-- Vérifier
SELECT id, name, description, permissions FROM roles 
WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef');
```

### Étape 3 : Cliquer sur "Run"

Vous devriez voir **4 lignes** dans les résultats.

### Étape 4 : Tester
1. Retourner sur https://zen-lyart.vercel.app
2. Se connecter avec `chef@hotel.com` / `password123`
3. ✅ Le dashboard devrait maintenant fonctionner !
4. ✅ Vous pouvez ajouter des tables sans erreur 500

## 📊 Ce Que le Script Fait

### Avant le Script
```
Table roles :
- admin
- manager
- receptionist
- housekeeping
- maintenance
- accountant
(6 rôles seulement)
```

### Après le Script
```
Table roles :
- admin
- manager
- receptionist
- housekeeping
- maintenance
- accountant
- restaurant_server      ← NOUVEAU
- restaurant_cashier     ← NOUVEAU
- restaurant_manager     ← NOUVEAU
- restaurant_chef        ← NOUVEAU
(10 rôles au total)
```

### Structure des Permissions JSONB

Exemple pour `restaurant_chef` :
```json
{
  "restaurant": {
    "orders": ["read", "update_status"],
    "menu": ["read"],
    "stats": ["read_production"],
    "print": ["tickets"]
  }
}
```

Le middleware vérifie :
- Route `/restaurant/stats` requiert `restaurant.stats.read` OU `restaurant.stats.read_production`
- Le chef a `restaurant.stats.read_production`
- ✅ Accès accordé

## 🔧 Vérifications Après Exécution

### 1. Vérifier que les Rôles Existent
Dans Supabase SQL Editor :
```sql
SELECT * FROM roles WHERE name LIKE 'restaurant%';
```

Devrait montrer 4 rôles.

### 2. Vérifier les Utilisateurs
```sql
SELECT u.email, r.name as role_name 
FROM users u 
JOIN roles r ON u.role_id = r.id
WHERE r.name LIKE 'restaurant%';
```

Devrait montrer tous vos utilisateurs restaurant avec leur rôle.

### 3. Tester dans l'Application
- ✅ Dashboard Chef fonctionne
- ✅ Ajout de tables fonctionne
- ✅ Plus d'erreur 500

## 📝 Documentation

Pour plus de détails, consultez :
- `EXECUTER_ROLES_SUPABASE_MAINTENANT.md` - Guide détaillé
- `database/ADD_RESTAURANT_ROLES_TO_ROLES_TABLE.sql` - Script complet

## 🎯 Résumé

**Problème** : Backend ne reconnaît pas les rôles restaurant → Erreur 500  
**Cause** : Les 4 rôles n'existent pas dans la table `roles` de Supabase  
**Solution** : Exécuter le script SQL pour ajouter les 4 rôles avec leurs permissions  
**Temps** : 2 minutes  
**Priorité** : URGENT - Bloque tout le module restaurant  

---

**⏰ PROCHAINE ACTION** : Exécuter le script SQL dans Supabase MAINTENANT
