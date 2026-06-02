# 🔧 FIX URGENT - Rôles Restaurant et Erreur 500

## 📋 PROBLÈMES IDENTIFIÉS

### 1. ❌ Erreur 500 sur `/restaurant/stats`
```
API Error: 500 { message: "Erreur serveur lors de la vérification des permissions" }
```
**Cause**: Les permissions `restaurant.stats.read` ne sont pas correctement définies pour admin/manager

### 2. ❌ Les 4 nouveaux rôles n'apparaissent pas dans Staff
- restaurant_server
- restaurant_cashier  
- restaurant_manager
- restaurant_chef

**Cause**: Soit les rôles ne sont pas dans la base, soit ils sont désactivés (`is_active = false`)

---

## ✅ SOLUTION - EXÉCUTER CE SCRIPT SQL

### ÉTAPE 1: Ouvrir Supabase SQL Editor

1. Allez sur: https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur **"SQL Editor"** dans le menu gauche
4. Cliquez sur **"+ New query"**

### ÉTAPE 2: Copier-Coller le Script

1. Ouvrez le fichier: `database/FIX_RESTAURANT_ROLES_COMPLET.sql`
2. **Sélectionnez TOUT le contenu** (Ctrl+A)
3. **Copiez** (Ctrl+C)
4. **Collez** dans l'éditeur SQL de Supabase (Ctrl+V)

### ÉTAPE 3: Exécuter le Script

1. Cliquez sur le bouton **"Run"** (ou appuyez sur Ctrl+Enter)
2. ⏱️ Attendez 5-10 secondes
3. Vous devriez voir:
   ```
   ✅ SCRIPT EXÉCUTÉ AVEC SUCCÈS
   Rôles restaurant actifs: 4
   ```

### ÉTAPE 4: Vérifier les Résultats

Le script affiche automatiquement:
- ✅ Les rôles actuels dans la base
- ✅ Les permissions admin et manager
- ✅ Les 4 nouveaux rôles restaurant
- ✅ Un résumé final

---

## 🧪 TESTER APRÈS EXÉCUTION

### Test 1: Vérifier les Rôles dans Staff

1. Allez sur votre application: https://zen-lyart.vercel.app
2. Connectez-vous en tant qu'admin
3. Allez sur la page **Staff**
4. Cliquez sur **"Ajouter un Membre"**
5. Dans le dropdown **"Rôle"**, vous devriez maintenant voir:
   - ✅ Serveur Restaurant
   - ✅ Caissier Restaurant
   - ✅ Responsable Restaurant
   - ✅ Chef de Cuisine

### Test 2: Vérifier Restaurant Stats

1. Toujours connecté en tant qu'admin
2. Allez sur la page **Restaurant**
3. L'erreur `API Error: 500` devrait **disparaître**
4. Les statistiques devraient s'afficher correctement

---

## 🔍 SI LE PROBLÈME PERSISTE

### Diagnostic Rapide

Exécutez cette requête SQL dans Supabase:

```sql
-- Voir tous les rôles
SELECT name, description, is_active 
FROM roles 
ORDER BY name;

-- Voir les permissions admin
SELECT name, permissions->'restaurant'->'stats' as stats_permissions
FROM roles 
WHERE name = 'admin';
```

**Résultat attendu**:
- Vous devriez voir les 4 nouveaux rôles avec `is_active = true`
- Admin devrait avoir `["read", "read_production"]` pour stats

---

## 📞 BESOIN D'AIDE ?

Si après avoir exécuté le script:
1. Les rôles n'apparaissent toujours pas
2. L'erreur 500 persiste

**Envoyez-moi**:
1. Le résultat de la requête de diagnostic ci-dessus
2. Le message complet de l'erreur dans la console du navigateur (F12)
3. Les logs du backend Render (si disponibles)

---

## ⚡ RÉSUMÉ RAPIDE

1. ✅ Ouvrir Supabase SQL Editor
2. ✅ Copier le contenu de `database/FIX_RESTAURANT_ROLES_COMPLET.sql`
3. ✅ Coller et exécuter dans Supabase
4. ✅ Attendre le message de succès
5. ✅ Rafraîchir votre application (F5)
6. ✅ Tester Staff → Ajouter Membre → Vérifier dropdown
7. ✅ Tester Restaurant → Vérifier que stats s'affichent

---

**Date**: 2 juin 2026  
**Durée estimée**: 5 minutes  
**Impact**: Fix les 4 nouveaux rôles ET l'erreur 500 sur restaurant stats
