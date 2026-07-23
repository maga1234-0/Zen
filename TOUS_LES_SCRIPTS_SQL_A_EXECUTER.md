# 📜 TOUS LES SCRIPTS SQL À EXÉCUTER

**Date** : 26 juin 2026  
**Status** : Frontend déployé, SQL en attente

---

## 🎯 ORDRE D'EXÉCUTION

Exécute ces scripts dans l'ordre dans **Supabase SQL Editor** :

### 1️⃣ PRIORITÉ 1 : Fix Restaurant Room Service ⚡
**Fichier** : `database/FIX_RESTAURANT_ROOM_SERVICE_COMPLET.sql`

**Problème** : 
- Room Service ne fonctionne pas
- Bouton "Commencer" ne fonctionne pas
- Erreur : `payment_method_check constraint violation`

**Ce que ça fait** :
- ✅ Ajoute 'room_charge' aux méthodes de paiement valides
- ✅ Corrige le trigger avec les bons noms de colonnes
- ✅ Fix payment_status et notes (au lieu de status et description)

**Impact** : 🔴 CRITIQUE - Restaurant inutilisable sans ce fix

---

### 2️⃣ Fix Catégories Restaurant Doublons
**Fichier** : `database/FIX_CATEGORIES_UUID.sql`

**Problème** : 
- Catégories apparaissent 3 fois chacune dans le dropdown
- Entrées x3, Plats Principaux x3, Desserts x3, Boissons x3

**Ce que ça fait** :
- ✅ Supprime les doublons
- ✅ Garde 1 seule ligne par catégorie
- ✅ 4 catégories au lieu de 12

**Impact** : 🟡 IMPORTANT - Améliore UX restaurant

---

### 3️⃣ Système Multi-Devises - Table
**Fichier** : `database/ADD_MULTI_CURRENCY_SYSTEM.sql`

**Ce que ça fait** :
- ✅ Crée la table `currencies`
- ✅ Ajoute colonne `currency` à `user_settings`
- ✅ Prépare le système pour les conversions

**Impact** : 🟢 FONCTIONNALITÉ - Nécessaire pour les devises

---

### 4️⃣ Système Multi-Devises - Données
**Fichier** : `database/ADD_EXCHANGE_RATES_TO_CURRENCIES.sql`

**Ce que ça fait** :
- ✅ Insert 6 devises (USD, CDF, EUR, GBP, ZAR, XAF)
- ✅ Insert taux de change initiaux
- ✅ Active le système multi-devises

**Impact** : 🟢 FONCTIONNALITÉ - Active les conversions

---

### 5️⃣ OPTIONNEL : Supprimer Réservation
**Fichier** : `database/DELETE_SPECIFIC_BOOKING.sql`

**Ce que ça fait** :
- 🗑️ Supprime la réservation joe mudibu
- 🗑️ Supprime paiements et commandes liés

**Impact** : ⚪ OPTIONNEL - Peut aussi utiliser le bouton dans l'interface

---

## 📋 CHECKLIST COMPLÈTE

```
[ ] 1. FIX_RESTAURANT_ROOM_SERVICE_COMPLET.sql
[ ] 2. FIX_CATEGORIES_UUID.sql
[ ] 3. ADD_MULTI_CURRENCY_SYSTEM.sql
[ ] 4. ADD_EXCHANGE_RATES_TO_CURRENCIES.sql
[ ] 5. DELETE_SPECIFIC_BOOKING.sql (optionnel)
```

---

## 🚀 PROCÉDURE D'EXÉCUTION

### Pour Chaque Script :

1. **Ouvre** https://supabase.com/dashboard
2. **Sélectionne** ton projet
3. **Va dans** SQL Editor (menu gauche)
4. **Clique** sur "New Query"
5. **Copie-colle** le contenu du script
6. **Clique** sur "Run" (ou Ctrl+Enter)
7. **Vérifie** le message :
   - ✅ "Success. No rows returned" = OK
   - ✅ "Success. X rows returned" = OK avec résultats
   - ❌ "Error: ..." = Erreur à corriger

8. **Passe** au script suivant

---

## 📂 EMPLACEMENTS DES FICHIERS

Tous dans le dossier `database/` :

```
database/
├── FIX_RESTAURANT_ROOM_SERVICE_COMPLET.sql  ← PRIORITÉ 1
├── FIX_CATEGORIES_UUID.sql
├── ADD_MULTI_CURRENCY_SYSTEM.sql
├── ADD_EXCHANGE_RATES_TO_CURRENCIES.sql
└── DELETE_SPECIFIC_BOOKING.sql (optionnel)
```

---

## ✅ APRÈS TOUS LES SCRIPTS

### Tests à Faire :

#### Restaurant
- [ ] Créer une commande Room Service
- [ ] Vérifier qu'elle s'ajoute à la folio
- [ ] Cliquer sur "Commencer" sur une commande
- [ ] Vérifier les catégories (pas de doublons)

#### Multi-Devises
- [ ] Aller dans Settings
- [ ] Changer devise (USD → CDF)
- [ ] Vérifier Dashboard (prix convertis)
- [ ] Vérifier Restaurant (prix convertis)
- [ ] Retour à USD

#### Bookings
- [ ] Vérifier que joe mudibu n'existe plus (si supprimé)
- [ ] Créer une nouvelle réservation (test)

---

## ⏱️ TEMPS ESTIMÉ

- Script 1 (Restaurant) : 30 secondes
- Script 2 (Catégories) : 30 secondes
- Script 3 (Devises Table) : 30 secondes
- Script 4 (Devises Data) : 30 secondes
- Script 5 (Suppression) : 15 secondes

**Total** : ~3 minutes pour tout exécuter

---

## 🆘 EN CAS DE PROBLÈME

### Erreur "relation does not exist"
- La table n'existe pas encore
- Vérifie que tu es dans le bon projet Supabase
- Vérifie que les tables de base existent

### Erreur "constraint violation"
- Il y a des données qui violent la contrainte
- Lis l'erreur pour voir quelle donnée pose problème
- Corrige les données d'abord

### Erreur "permission denied"
- Tu n'as pas les droits
- Utilise l'utilisateur postgres principal
- Vérifie tes permissions Supabase

### Script échoue à moitié
- C'est normal si certaines parties ont déjà été exécutées
- Les scripts utilisent `IF EXISTS` pour être réexécutables
- Vérifie juste le message final

---

## 📊 RÉSULTAT FINAL

Après tous les scripts :

### Restaurant
- ✅ Room Service fonctionne
- ✅ Bouton "Commencer" fonctionne
- ✅ 4 catégories (pas de doublons)
- ✅ Paiements ajoutés à la folio automatiquement

### Système Multi-Devises
- ✅ 6 devises disponibles
- ✅ Conversion automatique
- ✅ Taux Forex live (cache 1h)
- ✅ Formatage correct par devise

### Dashboard Housekeeping
- ✅ Données réelles
- ✅ Statistiques correctes
- ✅ Refresh automatique

### Application
- ✅ Stable et fonctionnelle
- ✅ Toutes les features opérationnelles
- ✅ Prête pour utilisation

---

## 🎯 COMMENCER MAINTENANT

**Étape 1** : Ouvre Supabase SQL Editor

**Étape 2** : Exécute le **Script 1** (Restaurant) en premier - C'est le plus urgent!

**Étape 3** : Continue avec les autres dans l'ordre

**Temps** : 3 minutes pour tout faire 🚀
