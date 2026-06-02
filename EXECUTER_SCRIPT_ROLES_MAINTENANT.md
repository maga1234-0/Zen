# 🚨 ACTION REQUISE: Ajouter les Rôles Restaurant

**Date**: 2 juin 2026  
**Problème**: Les 4 nouveaux rôles restaurant n'apparaissent pas dans le dropdown du Staff  
**Cause**: Le script SQL n'a pas encore été exécuté dans Supabase  
**Solution**: Exécuter le script SQL ci-dessous

---

## 🎯 POURQUOI LES RÔLES N'APPARAISSENT PAS ?

Le code frontend connaît les rôles (ils sont dans `permissions.ts`), mais la **base de données** ne les a pas encore.

Le dropdown Staff affiche les rôles depuis la table `roles` dans Supabase. Sans exécuter le script SQL, ces rôles n'existent pas dans la base de données.

---

## ✅ ÉTAPES À SUIVRE (5 MINUTES)

### 1️⃣ Ouvrir Supabase Dashboard
- Aller sur: https://supabase.com/dashboard
- Se connecter avec votre compte
- Sélectionner votre projet Zen

### 2️⃣ Ouvrir SQL Editor
- Dans le menu de gauche, cliquer sur **"SQL Editor"**
- Cliquer sur **"New query"**

### 3️⃣ Copier le Script SQL
Le script se trouve dans: `database/add-restaurant-roles.sql`

**OU** copier directement ci-dessous ⬇️

### 4️⃣ Coller et Exécuter
- Coller tout le contenu du script dans l'éditeur SQL
- Cliquer sur le bouton **"Run"** (ou appuyer sur `Ctrl+Enter`)
- Attendre confirmation (quelques secondes)

### 5️⃣ Vérifier
Exécuter cette requête pour voir les nouveaux rôles:

```sql
SELECT name, description 
FROM roles 
WHERE name LIKE '%restaurant%' OR name = 'receptionist'
ORDER BY name;
```

**Résultat attendu**:
```
restaurant_cashier      Caissier Restaurant
restaurant_chef         Chef de Cuisine  
restaurant_manager      Responsable Restaurant
restaurant_server       Serveur Restaurant
receptionist           Receptionist (étendu avec permissions restaurant)
```

### 6️⃣ Rafraîchir l'Application
- Retourner sur https://zen-lyart.vercel.app
- Aller dans **Staff**
- Cliquer sur **"Add Staff"**
- Les 4 nouveaux rôles devraient maintenant apparaître dans le dropdown! ✅

---

## 📋 SCRIPT SQL À EXÉCUTER

```sql
-- ============================================
-- AJOUT DES RÔLES RESTAURANT
-- Date: 2 juin 2026
-- Description: Ajoute les rôles spécifiques au module Restaurant
-- ============================================

-- Vérifier si la table roles existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'roles') THEN
        RAISE NOTICE 'Table roles non trouvée. Création...';
        
        CREATE TABLE IF NOT EXISTS roles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(50) UNIQUE NOT NULL,
            description TEXT,
            permissions JSONB DEFAULT '{}'::jsonb,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- ============================================
-- 1. SERVEUR RESTAURANT
-- ============================================
INSERT INTO roles (name, description, permissions) VALUES
('restaurant_server', 'Serveur Restaurant', '{
  "restaurant": {
    "orders": ["create", "read", "update_own"],
    "menu": ["read"],
    "tables": ["read", "update_status"],
    "print": ["tickets"]
  },
  "bookings": {
    "rooms": ["read"]
  }
}'::jsonb)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 2. CAISSIER RESTAURANT
-- ============================================
INSERT INTO roles (name, description, permissions) VALUES
('restaurant_cashier', 'Caissier Restaurant', '{
  "restaurant": {
    "orders": ["read", "update_payment"],
    "payments": ["create", "read", "refund"],
    "print": ["invoices", "receipts"]
  },
  "bookings": {
    "rooms": ["read"],
    "payments": ["create"]
  }
}'::jsonb)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 3. RESPONSABLE RESTAURANT
-- ============================================
INSERT INTO roles (name, description, permissions) VALUES
('restaurant_manager', 'Responsable Restaurant', '{
  "restaurant": {
    "orders": ["create", "read", "update", "delete"],
    "menu": ["create", "read", "update", "delete"],
    "categories": ["create", "read", "update", "delete"],
    "tables": ["create", "read", "update", "delete"],
    "reservations": ["create", "read", "update", "delete"],
    "payments": ["read", "refund"],
    "stats": ["read"],
    "reports": ["read", "export"],
    "print": ["all"]
  },
  "bookings": {
    "rooms": ["read"]
  }
}'::jsonb)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 4. CHEF DE CUISINE
-- ============================================
INSERT INTO roles (name, description, permissions) VALUES
('restaurant_chef', 'Chef de Cuisine', '{
  "restaurant": {
    "orders": ["read", "update_status"],
    "menu": ["read"],
    "stats": ["read_production"]
  }
}'::jsonb)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 5. EXTENSION RÔLE RECEPTIONIST
-- ============================================
-- Ajouter les permissions restaurant au réceptionniste
UPDATE roles 
SET permissions = permissions || '{
  "restaurant": {
    "orders": ["read"],
    "payments": ["create"],
    "reports": ["read_guest"]
  }
}'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'receptionist';

-- ============================================
-- 6. S'ASSURER QUE ADMIN A TOUS LES DROITS
-- ============================================
UPDATE roles 
SET permissions = permissions || '{
  "restaurant": {
    "orders": ["create", "read", "update", "delete"],
    "menu": ["create", "read", "update", "delete"],
    "categories": ["create", "read", "update", "delete"],
    "tables": ["create", "read", "update", "delete"],
    "reservations": ["create", "read", "update", "delete"],
    "payments": ["create", "read", "refund"],
    "stats": ["read"],
    "reports": ["read", "export"],
    "print": ["all"]
  }
}'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'admin';

-- ============================================
-- 7. S'ASSURER QUE MANAGER A ACCÈS RESTAURANT
-- ============================================
UPDATE roles 
SET permissions = permissions || '{
  "restaurant": {
    "orders": ["create", "read", "update", "delete"],
    "menu": ["create", "read", "update", "delete"],
    "categories": ["create", "read", "update", "delete"],
    "tables": ["create", "read", "update", "delete"],
    "reservations": ["create", "read", "update", "delete"],
    "payments": ["create", "read", "refund"],
    "stats": ["read"],
    "reports": ["read", "export"],
    "print": ["all"]
  }
}'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'manager';

-- ============================================
-- VÉRIFICATION
-- ============================================
-- Afficher tous les rôles créés/modifiés
SELECT 
    name,
    description,
    permissions,
    is_active,
    created_at
FROM roles
WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef', 'receptionist', 'admin', 'manager')
ORDER BY 
    CASE name
        WHEN 'admin' THEN 1
        WHEN 'manager' THEN 2
        WHEN 'restaurant_manager' THEN 3
        WHEN 'restaurant_chef' THEN 4
        WHEN 'restaurant_server' THEN 5
        WHEN 'restaurant_cashier' THEN 6
        WHEN 'receptionist' THEN 7
        ELSE 99
    END;

-- ============================================
-- RÉSUMÉ
-- ============================================
DO $$ 
DECLARE
    role_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO role_count 
    FROM roles 
    WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef');
    
    RAISE NOTICE '============================================';
    RAISE NOTICE 'RÔLES RESTAURANT AJOUTÉS: %', role_count;
    RAISE NOTICE '============================================';
    RAISE NOTICE '✅ restaurant_server - Serveur Restaurant';
    RAISE NOTICE '✅ restaurant_cashier - Caissier Restaurant';
    RAISE NOTICE '✅ restaurant_manager - Responsable Restaurant';
    RAISE NOTICE '✅ restaurant_chef - Chef de Cuisine';
    RAISE NOTICE '✅ receptionist - Étendu avec permissions restaurant';
    RAISE NOTICE '✅ admin - Étendu avec permissions restaurant';
    RAISE NOTICE '✅ manager - Étendu avec permissions restaurant';
    RAISE NOTICE '============================================';
END $$;
```

---

## 📊 QUE FAIT CE SCRIPT ?

### ✅ Crée 4 Nouveaux Rôles
1. **restaurant_server** (Serveur)
   - Peut créer des commandes
   - Peut voir le menu
   - Peut assigner aux chambres

2. **restaurant_cashier** (Caissier)
   - Peut encaisser les paiements
   - Peut imprimer factures
   - Peut faire des remboursements

3. **restaurant_manager** (Responsable)
   - Accès complet au restaurant
   - Peut modifier le menu
   - Peut voir les statistiques

4. **restaurant_chef** (Chef de Cuisine)
   - Peut voir les commandes
   - Peut mettre à jour le statut (en préparation, prêt)
   - Peut voir les stats de production

### ✅ Étend les Rôles Existants
- **receptionist**: Peut voir commandes et ajouter au folio chambre
- **admin**: Accès complet au restaurant
- **manager**: Accès complet au restaurant

---

## 🎯 CE QUI VA CHANGER

### Avant (maintenant)
Dropdown dans Staff page:
```
Receptionist
Housekeeping
Maintenance
Accountant
Manager
Admin
```

### Après (après exécution du script)
Dropdown dans Staff page:
```
Receptionist
Housekeeping
Maintenance
Accountant
Manager
Admin
Restaurant Server        ← NOUVEAU ✨
Restaurant Cashier       ← NOUVEAU ✨
Restaurant Manager       ← NOUVEAU ✨
Restaurant Chef          ← NOUVEAU ✨
```

---

## ⚠️ IMPORTANT

### Le Script est Sécurisé
- ✅ Utilise `ON CONFLICT DO UPDATE` - ne duplique pas les rôles
- ✅ Utilise `UPDATE ... WHERE name =` - ne modifie que les rôles ciblés
- ✅ Peut être exécuté plusieurs fois sans problème
- ✅ Ne supprime aucune donnée existante

### Pourquoi le Dropdown était Vide ?
Le frontend (React) demande au backend "quels rôles existent ?", et le backend lit la table `roles` dans Supabase. Sans ce script, ces 4 rôles n'existent pas dans la base de données.

---

## 🧪 TESTER APRÈS EXÉCUTION

### 1. Créer un Utilisateur Serveur
- Aller dans **Staff** > **Add Staff**
- Remplir les informations
- **Role**: Sélectionner **Restaurant Server** ✅
- Sauvegarder

### 2. Se Connecter avec ce Compte
- Se déconnecter
- Se connecter avec le nouveau serveur
- Aller dans **Restaurant**

### 3. Vérifier les Permissions
Le serveur devrait:
- ✅ Voir le bouton "Nouvelle Commande"
- ✅ Pouvoir créer des commandes
- ❌ NE PAS voir le bouton "Ajouter un Article" (menu)
- ❌ NE PAS voir les boutons edit/delete sur le menu
- ❌ NE PAS voir les statistiques financières

---

## 🆘 EN CAS DE PROBLÈME

### Erreur: "relation 'roles' does not exist"
➡️ La table `roles` n'existe pas dans votre base de données.  
**Solution**: Le script crée automatiquement la table si elle n'existe pas.

### Les Rôles N'Apparaissent Toujours Pas
1. ✅ Vérifier que le script s'est bien exécuté sans erreur
2. ✅ Exécuter la requête de vérification (voir étape 5)
3. ✅ Rafraîchir complètement le navigateur (`Ctrl+F5`)
4. ✅ Se déconnecter et se reconnecter

### Erreur: "permission denied"
➡️ Votre utilisateur Supabase n'a pas les droits suffisants.  
**Solution**: Utiliser le compte admin Supabase (celui avec lequel vous vous êtes inscrit).

---

## 📞 BESOIN D'AIDE ?

Si vous rencontrez un problème:
1. Copiez le message d'erreur exact
2. Prenez une capture d'écran
3. Partagez avec moi les détails

---

## ✅ CHECKLIST RAPIDE

- [ ] Ouvrir Supabase Dashboard
- [ ] Aller dans SQL Editor
- [ ] Copier le script SQL complet
- [ ] Coller dans l'éditeur
- [ ] Cliquer sur "Run"
- [ ] Attendre confirmation
- [ ] Exécuter requête de vérification
- [ ] Rafraîchir l'application
- [ ] Aller dans Staff > Add Staff
- [ ] Vérifier que les 4 nouveaux rôles apparaissent ✅

---

**TEMPS ESTIMÉ**: 5 minutes  
**DIFFICULTÉ**: ⭐ Facile (copier-coller)  
**IMPACT**: 🟢 Critique (nécessaire pour utiliser les rôles restaurant)

