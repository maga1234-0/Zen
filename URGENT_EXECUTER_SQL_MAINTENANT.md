# 🚨 URGENT - EXÉCUTER LE SCRIPT SQL MAINTENANT

## ❌ CONFIRMATION DU PROBLÈME

Votre capture d'écran montre que vous avez **SEULEMENT** ces rôles:
- Receptionist
- Housekeeping
- Maintenance
- Accountant
- Manager
- Admin

**Il MANQUE les 4 nouveaux rôles**:
- ❌ Serveur Restaurant
- ❌ Caissier Restaurant
- ❌ Responsable Restaurant
- ❌ Chef de Cuisine

**CECI CONFIRME QUE LE SCRIPT SQL N'A PAS ÉTÉ EXÉCUTÉ!**

---

## ✅ SOLUTION - SUIVEZ CES ÉTAPES EXACTEMENT

### ÉTAPE 1: Ouvrir Supabase

1. Ouvrez votre navigateur
2. Allez sur: **https://supabase.com/dashboard**
3. Cliquez sur votre projet (celui avec votre base de données)
4. Dans le menu de gauche, cliquez sur **"SQL Editor"**
5. Cliquez sur le bouton **"+ New query"** en haut

### ÉTAPE 2: Copier le Script SQL

1. Sur votre ordinateur, allez dans le dossier: `c:\Users\aubin\Downloads\kiro1\database\`
2. Ouvrez le fichier: **`FIX_RESTAURANT_ROLES_COMPLET.sql`**
3. Appuyez sur **Ctrl+A** (sélectionner tout)
4. Appuyez sur **Ctrl+C** (copier)

### ÉTAPE 3: Coller et Exécuter

1. Retournez sur Supabase SQL Editor
2. Cliquez dans la zone de texte (l'éditeur SQL)
3. Appuyez sur **Ctrl+V** (coller le script)
4. Cliquez sur le bouton **"Run"** (en haut à droite)
   - OU appuyez sur **Ctrl+Enter**

### ÉTAPE 4: Attendre le Résultat

Vous devriez voir dans la console en bas:

```
✅ SCRIPT EXÉCUTÉ AVEC SUCCÈS
Rôles restaurant actifs: 4
```

Et plusieurs tableaux qui montrent:
- Les rôles actuels
- Les permissions admin
- Les nouveaux rôles restaurant créés

### ÉTAPE 5: Vérifier dans l'Application

1. Retournez sur: **https://zen-lyart.vercel.app**
2. Appuyez sur **F5** (rafraîchir la page)
3. Allez sur **Staff**
4. Cliquez sur **"Ajouter un Membre"**
5. Cliquez sur le dropdown **"Rôle"**

**Vous devriez maintenant voir 10 rôles**:
- Receptionist
- Housekeeping
- Maintenance
- Accountant
- Manager
- Admin
- ✅ **Serveur Restaurant** (NOUVEAU)
- ✅ **Caissier Restaurant** (NOUVEAU)
- ✅ **Responsable Restaurant** (NOUVEAU)
- ✅ **Chef de Cuisine** (NOUVEAU)

---

## 🔍 SI VOUS NE TROUVEZ PAS LE FICHIER SQL

Le fichier SQL se trouve ici:
```
c:\Users\aubin\Downloads\kiro1\database\FIX_RESTAURANT_ROLES_COMPLET.sql
```

**OU** vous pouvez le copier directement depuis le bas de ce document ⬇️

---

## 📋 COPIE DU SCRIPT SQL (Si vous ne trouvez pas le fichier)

Si vous avez du mal à trouver le fichier, **copiez tout le texte ci-dessous** et collez-le dans Supabase:

```sql
-- ============================================
-- DIAGNOSTIC ET FIX COMPLET - RÔLES RESTAURANT
-- Date: 2 juin 2026
-- ============================================

-- ÉTAPE 1: DIAGNOSTIC
-- Voir les rôles actuels
SELECT '====== RÔLES ACTUELS ======' as diagnostic;
SELECT name, description, is_active 
FROM roles 
ORDER BY name;

-- ÉTAPE 2: AJOUT/MISE À JOUR DES RÔLES
-- ============================================

-- 1. SERVEUR RESTAURANT
INSERT INTO roles (name, description, permissions, is_active) VALUES
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
}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    is_active = true,
    updated_at = CURRENT_TIMESTAMP;

-- 2. CAISSIER RESTAURANT
INSERT INTO roles (name, description, permissions, is_active) VALUES
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
}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    is_active = true,
    updated_at = CURRENT_TIMESTAMP;

-- 3. RESPONSABLE RESTAURANT
INSERT INTO roles (name, description, permissions, is_active) VALUES
('restaurant_manager', 'Responsable Restaurant', '{
  "restaurant": {
    "orders": ["create", "read", "update", "delete"],
    "menu": ["create", "read", "update", "delete"],
    "categories": ["create", "read", "update", "delete"],
    "tables": ["create", "read", "update", "delete", "update_status"],
    "reservations": ["create", "read", "update", "delete"],
    "payments": ["read", "refund"],
    "stats": ["read", "read_production"],
    "reports": ["read", "export"],
    "print": ["all"]
  },
  "bookings": {
    "rooms": ["read"]
  }
}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    is_active = true,
    updated_at = CURRENT_TIMESTAMP;

-- 4. CHEF DE CUISINE
INSERT INTO roles (name, description, permissions, is_active) VALUES
('restaurant_chef', 'Chef de Cuisine', '{
  "restaurant": {
    "orders": ["read", "update_status"],
    "menu": ["read"],
    "stats": ["read_production"]
  }
}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    permissions = EXCLUDED.permissions,
    is_active = true,
    updated_at = CURRENT_TIMESTAMP;

-- ÉTAPE 3: MISE À JOUR ADMIN ET MANAGER
-- ============================================

-- Mettre à jour ADMIN avec toutes les permissions restaurant
UPDATE roles 
SET permissions = jsonb_set(
      COALESCE(permissions, '{}'::jsonb),
      '{restaurant}',
      '{
        "orders": ["create", "read", "update", "delete"],
        "menu": ["create", "read", "update", "delete"],
        "categories": ["create", "read", "update", "delete"],
        "tables": ["create", "read", "update", "delete", "update_status"],
        "reservations": ["create", "read", "update", "delete"],
        "payments": ["create", "read", "refund"],
        "stats": ["read", "read_production"],
        "reports": ["read", "export"],
        "print": ["all"]
      }'::jsonb
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'admin';

-- Mettre à jour MANAGER avec toutes les permissions restaurant
UPDATE roles 
SET permissions = jsonb_set(
      COALESCE(permissions, '{}'::jsonb),
      '{restaurant}',
      '{
        "orders": ["create", "read", "update", "delete"],
        "menu": ["create", "read", "update", "delete"],
        "categories": ["create", "read", "update", "delete"],
        "tables": ["create", "read", "update", "delete", "update_status"],
        "reservations": ["create", "read", "update", "delete"],
        "payments": ["create", "read", "refund"],
        "stats": ["read", "read_production"],
        "reports": ["read", "export"],
        "print": ["all"]
      }'::jsonb
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'manager';

-- ÉTAPE 4: VÉRIFICATION FINALE
-- ============================================

SELECT '====== VÉRIFICATION FINALE - TOUS LES RÔLES ======' as diagnostic;
SELECT 
    name,
    description,
    is_active,
    created_at
FROM roles
ORDER BY name;

-- MESSAGE FINAL
DO $$ 
DECLARE
    role_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO role_count 
    FROM roles 
    WHERE name IN ('restaurant_server', 'restaurant_cashier', 'restaurant_manager', 'restaurant_chef')
    AND is_active = true;
    
    RAISE NOTICE '============================================';
    RAISE NOTICE '✅ SCRIPT EXÉCUTÉ AVEC SUCCÈS';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Rôles restaurant actifs: %', role_count;
    RAISE NOTICE '';
    RAISE NOTICE 'RÔLES CRÉÉS/MIS À JOUR:';
    RAISE NOTICE '  ✅ restaurant_server - Serveur Restaurant';
    RAISE NOTICE '  ✅ restaurant_cashier - Caissier Restaurant';
    RAISE NOTICE '  ✅ restaurant_manager - Responsable Restaurant';
    RAISE NOTICE '  ✅ restaurant_chef - Chef de Cuisine';
    RAISE NOTICE '============================================';
END $$;
```

---

## ⚠️ IMPORTANT

**VOUS DEVEZ EXÉCUTER CE SCRIPT DANS SUPABASE!**

Sans cela:
- ❌ Les 4 rôles restaurant resteront invisibles
- ❌ L'erreur 500 sur Restaurant stats continuera
- ❌ Impossible d'ajouter des tables
- ❌ Le module Restaurant ne fonctionnera pas

---

## 🆘 BESOIN D'AIDE?

Si vous avez des difficultés:
1. Prenez une capture d'écran de Supabase SQL Editor
2. Prenez une capture d'écran du résultat après avoir cliqué "Run"
3. Envoyez-moi les captures

Mais SVP, **ESSAYEZ D'ABORD** - c'est vraiment simple:
1. Ouvrir Supabase
2. Copier le script
3. Coller dans SQL Editor
4. Cliquer Run
5. Attendre 10 secondes
6. TERMINÉ!

---

**C'EST LA SEULE CHOSE QUI MANQUE POUR QUE TOUT FONCTIONNE! 🚀**
