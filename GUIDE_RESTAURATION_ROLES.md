# 🚨 GUIDE DE RESTAURATION DES RÔLES

## PROBLÈME IDENTIFIÉ

Le script `FORCE_FIX_ROLES.sql` a supprimé uniquement les 4 rôles restaurant, MAIS les 6 rôles originaux avaient déjà été supprimés auparavant. Résultat: **TOUS les rôles ont disparu** de la liste Staff.

### Rôles manquants:

**6 Rôles Originaux:**
- ❌ admin
- ❌ manager
- ❌ receptionist
- ❌ housekeeping
- ❌ maintenance
- ❌ accountant

**4 Rôles Restaurant:**
- ❌ restaurant_server (Serveur Restaurant)
- ❌ restaurant_cashier (Caissier Restaurant)
- ❌ restaurant_manager (Responsable Restaurant)
- ❌ restaurant_chef (Chef de Cuisine)

---

## ✅ SOLUTION IMMÉDIATE

### ÉTAPE 1: Exécuter le script de restauration dans Supabase

1. **Ouvrir Supabase:**
   - Aller sur https://supabase.com
   - Se connecter à votre projet

2. **Ouvrir SQL Editor:**
   - Menu gauche → SQL Editor
   - Cliquer sur "New query"

3. **Copier le script:**
   - Ouvrir le fichier: `database/RESTAURER_TOUS_LES_ROLES.sql`
   - **COPIER TOUT LE CONTENU**

4. **Exécuter:**
   - Coller le script dans SQL Editor
   - Cliquer sur **"Run"** (ou F5)
   - Attendre la fin de l'exécution (environ 5-10 secondes)

5. **Vérifier le résultat:**
   - Vous devriez voir un message final:
   ```
   ✅ SUCCÈS COMPLET! Tous les 10 rôles sont restaurés!
   ```

### ÉTAPE 2: Vérifier dans la base de données

Exécuter cette requête dans Supabase pour confirmer:

```sql
SELECT name, description FROM roles WHERE is_active = true ORDER BY name;
```

**Résultat attendu (10 lignes):**
```
name                 | description
---------------------|--------------------
accountant           | Accountant
admin                | Admin
housekeeping         | Housekeeping
maintenance          | Maintenance
manager              | Manager
receptionist         | Receptionist
restaurant_cashier   | Caissier Restaurant
restaurant_chef      | Chef de Cuisine
restaurant_manager   | Responsable Restaurant
restaurant_server    | Serveur Restaurant
```

### ÉTAPE 3: Vider le cache du navigateur

1. **Ouvrir l'application**: https://zen-lyart.vercel.app
2. **Vider le cache:**
   - Windows/Linux: `Ctrl + Shift + Delete`
   - Mac: `Cmd + Shift + Delete`
   - OU faire un **Hard Refresh**: `Ctrl + Shift + R`

### ÉTAPE 4: Tester la liste des rôles

1. Se connecter à l'application
2. Aller sur **Staff**
3. Cliquer sur **"Add Staff"**
4. Ouvrir le dropdown **"Role"**

**✅ Vous devriez maintenant voir les 10 rôles:**
- Admin
- Manager
- Receptionist
- Housekeeping
- Maintenance
- Accountant
- Serveur Restaurant
- Caissier Restaurant
- Responsable Restaurant
- Chef de Cuisine

---

## 🔍 POURQUOI CE PROBLÈME EST ARRIVÉ?

### Historique des événements:

1. **Initialement**: Les 6 rôles originaux existaient dans la base de données
2. **Ajout restaurant**: Script `add-restaurant-roles.sql` devait ajouter 4 rôles restaurant
3. **Problème 1**: Les rôles n'apparaissaient pas car le frontend était hardcodé
4. **Tentative de fix**: Script `FORCE_FIX_ROLES.sql` a été créé
5. **Problème 2**: Ce script a supprimé uniquement les 4 rôles restaurant (ligne 10)
6. **Mais**: Les 6 rôles originaux avaient déjà disparu avant (cause inconnue)
7. **Résultat**: Plus aucun rôle dans la base de données

### La vraie cause du problème:

Le **frontend était hardcodé** (fichier `client/src/pages/Staff.tsx` lignes 492-498, 631-637). Les rôles n'étaient PAS chargés depuis la base de données, mais écrits en dur dans le code.

### Ce qui a été corrigé:

1. ✅ **Backend**: Ajout de l'endpoint `GET /auth/roles` pour récupérer les rôles depuis la base
2. ✅ **Frontend**: Modification de `Staff.tsx` pour charger les rôles dynamiquement via API
3. ✅ **Déploiement**: Backend et frontend déployés avec les corrections

---

## 📊 IMPACT DES PERMISSIONS

### Admin et Manager ont maintenant accès complet à:

#### Module Restaurant:
- ✅ `restaurant.orders.*` - Créer, lire, modifier, supprimer des commandes
- ✅ `restaurant.menu.*` - Gérer le menu complet
- ✅ `restaurant.tables.*` - Gérer les tables
- ✅ `restaurant.reservations.*` - Gérer les réservations
- ✅ `restaurant.payments.*` - Traiter les paiements et remboursements
- ✅ `restaurant.stats.read` - Voir les statistiques
- ✅ `restaurant.stats.read_production` - Voir les stats de production cuisine
- ✅ `restaurant.reports.*` - Voir et exporter les rapports

#### Module Spa:
- ✅ `spa.bookings.*` - Gérer les réservations spa
- ✅ `spa.services.*` - Gérer les services spa
- ✅ `spa.therapists.*` - Gérer les thérapeutes
- ✅ `spa.payments.*` - Traiter les paiements spa
- ✅ `spa.stats.read` - Voir les statistiques spa

---

## 🐛 ERREUR 500 RESTAURANT STATS

Cette erreur devrait également être résolue car:

1. **Avant**: Admin/Manager n'avaient pas les permissions `restaurant.stats.read` et `restaurant.stats.read_production`
2. **Maintenant**: Le script de restauration ajoute ces permissions à admin et manager
3. **Résultat**: L'erreur 500 sur `/restaurant/stats` devrait disparaître

---

## 📝 PROCHAINES ÉTAPES APRÈS RESTAURATION

1. ✅ Exécuter `RESTAURER_TOUS_LES_ROLES.sql` dans Supabase
2. ✅ Vérifier que les 10 rôles existent dans la base
3. ✅ Vider le cache du navigateur
4. ✅ Tester l'ajout d'un nouveau staff
5. ✅ Vérifier que tous les 10 rôles apparaissent dans le dropdown
6. ✅ Tester la page Restaurant (l'erreur 500 devrait disparaître)
7. ✅ Créer une table de restaurant pour vérifier les permissions

---

## ⚠️ IMPORTANT

**NE PLUS EXÉCUTER** les scripts suivants:
- ❌ `FORCE_FIX_ROLES.sql` (supprime les rôles)
- ❌ `add-restaurant-roles.sql` (ancien script, remplacé)

**UTILISER UNIQUEMENT:**
- ✅ `RESTAURER_TOUS_LES_ROLES.sql` (restaure TOUS les rôles)

---

## 🎯 RÉSUMÉ EN 3 ÉTAPES

1. **Exécuter** `database/RESTAURER_TOUS_LES_ROLES.sql` dans Supabase SQL Editor
2. **Vider le cache** du navigateur (Ctrl+Shift+R)
3. **Tester** Staff → Add New Staff → Voir les 10 rôles dans le dropdown

---

**Date**: 2 juin 2026  
**Status**: ✅ Solution prête - Attente d'exécution par l'utilisateur
