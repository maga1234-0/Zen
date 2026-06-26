# 🎯 ACTIONS REQUISES DE L'UTILISATEUR

---

## 📋 RÉSUMÉ EXÉCUTIF

**3 scripts SQL** doivent être exécutés dans Supabase pour compléter la configuration.

**Temps Total**: ~10 minutes  
**Date**: 23 juin 2026  
**Prérequis**: Accès à Supabase Dashboard

---

## ✅ CE QUI EST DÉJÀ FAIT

### Frontend (100% Complet) ✅
- ✅ Système multi-devises avec Forex
- ✅ Sélecteur de devise dans Settings
- ✅ Conversion automatique sur 7 pages
- ✅ Formatage correct pour chaque devise
- ✅ **Dashboard fix appliqué** : Hook useCurrencyFormat ajouté
- ✅ **Build vérifié** : TypeScript compilation réussie
- ✅ **Déployé sur Vercel** : En cours (2-3 minutes)

### Backend (100% Complet) ✅
- ✅ API endpoints pour devises
- ✅ Settings endpoint mis à jour
- ✅ **Déployé sur Render**: https://zen-backend-jzjh.onrender.com

### Code (100% Commité) ✅
- ✅ Tous les changements committés sur GitHub
- ✅ Dernier commit: `380467d` (Dashboard fix)
- ✅ Auto-déploiement Vercel en cours

---

## ⏳ SCRIPTS SQL À EXÉCUTER

### 🔴 PRIORITÉ 1: Fix Catégories Doublons

**Fichier**: `database/FIX_CATEGORIES_UUID.sql`

**Problème**: Les catégories de menu restaurant (Entrées, Plats Principaux, Desserts, Boissons) apparaissent 3 fois chacune dans le dropdown.

**Solution**: Supprimer les doublons, garder 1 seule ligne par catégorie.

**Instructions**:
```
1. Ouvre https://supabase.com/dashboard
2. Sélectionne ton projet
3. Va dans "SQL Editor" (menu gauche)
4. Clique "New Query"
5. Copie TOUT le contenu de: database/FIX_CATEGORIES_UUID.sql
6. Colle dans l'éditeur
7. Clique "RUN"
8. Vérifie: Résultat doit montrer 4 catégories (pas 12)
```

**Résultat Attendu**:
```sql
-- Avant: 12 lignes (3 × 4 catégories)
-- Après: 4 lignes (1 × 4 catégories)
Entrées         | count: 1
Plats Principaux| count: 1
Desserts        | count: 1
Boissons        | count: 1
```

**Impact**: 🔴 URGENT - Affecte l'affichage du menu restaurant

---

### 🔴 PRIORITÉ 2: Fix Trigger Paiements

**Fichier**: `database/FIX_PAYMENTS_TRIGGER_SIMPLE.sql`

**Problème**: Erreur "column 'status' of relation 'payments' does not exist" lors de la création de commandes Restaurant "Room Service".

**Cause**: Le trigger `add_to_room_folio_trigger` utilise des noms de colonnes incorrects:
- ❌ `status` → ✅ `payment_status`
- ❌ `description` → ✅ `notes`

**Solution**: Recréer le trigger avec les bons noms de colonnes.

**Instructions**:
```
1. Dans Supabase SQL Editor
2. Clique "New Query"
3. Copie TOUT le contenu de: database/FIX_PAYMENTS_TRIGGER_SIMPLE.sql
4. Colle dans l'éditeur
5. Clique "RUN"
6. Vérifie: Message "Success. No rows returned"
```

**Résultat Attendu**:
- Trigger `add_to_room_folio_trigger` recréé
- Colonnes correctes: `payment_status`, `notes`

**Test**:
1. Va dans Restaurant
2. Crée une commande "Room Service" pour une chambre
3. ✅ La commande doit se créer sans erreur
4. ✅ Le paiement doit être ajouté automatiquement au folio de la chambre

**Impact**: 🔴 URGENT - Bloque les commandes Room Service

---

### 🟡 PRIORITÉ 3: Multi-Devises (2 scripts)

#### Script 3A: Créer les Devises

**Fichier**: `database/ADD_MULTI_CURRENCY_SYSTEM.sql`

**Objectif**: Créer la table `currencies` et ajouter 6 devises.

**Instructions**:
```
1. Dans Supabase SQL Editor
2. Clique "New Query"
3. Copie TOUT le contenu de: database/ADD_MULTI_CURRENCY_SYSTEM.sql
4. Colle dans l'éditeur
5. Clique "RUN"
6. Vérifie: Message "Success. No rows returned"
```

**Résultat Attendu**:
- Table `currencies` créée
- 6 devises insérées: USD, CDF, EUR, GBP, ZAR, XAF
- Colonnes `user_settings`: `currency`, `currency_symbol`, `currency_position`

---

#### Script 3B: Ajouter Taux de Change

**Fichier**: `database/ADD_EXCHANGE_RATES_TO_CURRENCIES.sql`

**Objectif**: Ajouter les colonnes pour les taux de change (fallback si API down).

**Instructions**:
```
1. Dans Supabase SQL Editor
2. Clique "New Query"
3. Copie TOUT le contenu de: database/ADD_EXCHANGE_RATES_TO_CURRENCIES.sql
4. Colle dans l'éditeur
5. Clique "RUN"
6. Vérifie: Message "Success. No rows returned"
```

**Résultat Attendu**:
- Colonnes ajoutées: `exchange_rate_to_usd`, `last_updated`
- Taux de fallback initialisés

**NOTE IMPORTANTE**: Ces taux sont un **fallback uniquement**. Le système utilise **prioritairement l'API Forex en temps réel** (exchangerate-api.com).

---

## 📊 RÉCAPITULATIF DES SCRIPTS

| # | Fichier | Priorité | Impact | Temps | Statut |
|---|---------|----------|--------|-------|--------|
| 1 | `FIX_CATEGORIES_UUID.sql` | 🔴 Urgent | Restaurant menu | 2 min | ⏳ À faire |
| 2 | `FIX_PAYMENTS_TRIGGER_SIMPLE.sql` | 🔴 Urgent | Room Service | 2 min | ⏳ À faire |
| 3A | `ADD_MULTI_CURRENCY_SYSTEM.sql` | 🟡 Important | Multi-devises | 3 min | ⏳ À faire |
| 3B | `ADD_EXCHANGE_RATES_TO_CURRENCIES.sql` | 🟡 Important | Fallback rates | 2 min | ⏳ À faire |

**Total**: 4 scripts, ~10 minutes

---

## 🎯 ORDRE D'EXÉCUTION RECOMMANDÉ

### Étape 1: Fixes Urgents (Priorité 🔴)
1. ✅ Exécute `FIX_CATEGORIES_UUID.sql`
2. ✅ Exécute `FIX_PAYMENTS_TRIGGER_SIMPLE.sql`
3. ✅ Teste: Crée une commande Room Service dans Restaurant

### Étape 2: Multi-Devises (Priorité 🟡)
1. ✅ Exécute `ADD_MULTI_CURRENCY_SYSTEM.sql`
2. ✅ Exécute `ADD_EXCHANGE_RATES_TO_CURRENCIES.sql`
3. ✅ Teste: Change la devise dans Settings
4. ✅ Vérifie: Prix convertis sur toutes les pages

---

## 🧪 TESTS APRÈS EXÉCUTION

### Test 1: Catégories Restaurant ✅
```
1. Va dans Restaurant → Menu
2. Crée un nouveau plat
3. Ouvre le dropdown "Category"
4. Vérifie: Seulement 4 catégories (pas 12)
   - Entrées
   - Plats Principaux
   - Desserts
   - Boissons
```

### Test 2: Room Service Paiements ✅
```
1. Va dans Restaurant → Orders
2. Clique "New Order"
3. Sélectionne "Room Service"
4. Choisis une chambre occupée
5. Ajoute des plats
6. Confirme la commande
7. Vérifie: Pas d'erreur "column status does not exist"
8. Vérifie: Paiement ajouté au folio de la chambre
```

### Test 3: Multi-Devises ✅
```
1. Va dans Settings
2. Change la devise à "CDF - Franc Congolais"
3. Sauvegarde
4. Va dans Dashboard
5. Vérifie: Revenus affichés en "FC 3 500 000" (pas $)
6. Va dans Rooms
7. Vérifie: Prix en "FC 280 000 /nuit"
8. Va dans Restaurant
9. Vérifie: Prix plats en "FC"
10. Change la devise à "EUR - Euro"
11. Vérifie: Tout passe en "€"
```

---

## 📁 LOCALISATION DES FICHIERS

Tous les scripts SQL sont dans le dossier:
```
database/
├── FIX_CATEGORIES_UUID.sql              ← Script 1
├── FIX_PAYMENTS_TRIGGER_SIMPLE.sql      ← Script 2
├── ADD_MULTI_CURRENCY_SYSTEM.sql        ← Script 3A
└── ADD_EXCHANGE_RATES_TO_CURRENCIES.sql ← Script 3B
```

---

## 🆘 EN CAS DE PROBLÈME

### Problème 1: "Syntax error" dans SQL Editor

**Solution**:
1. Vérifie que tu as copié **TOUT** le fichier
2. Vérifie qu'il n'y a pas de caractères bizarres
3. Essaie de copier à nouveau depuis le fichier source

---

### Problème 2: "Table already exists"

**Solution**:
- C'est normal si tu as déjà exécuté le script avant
- Le script peut être exécuté plusieurs fois sans problème
- Si tu veux vraiment recréer: Contacte-moi pour script de nettoyage

---

### Problème 3: "Permission denied"

**Solution**:
1. Vérifie que tu es connecté au bon projet Supabase
2. Vérifie que ton compte a les permissions d'écriture
3. Essaie de te déconnecter/reconnecter

---

### Problème 4: Les tests échouent après exécution

**Solution**:
1. Attends 1 minute (cache Supabase)
2. Recharge l'application (Ctrl+F5)
3. Si toujours pas bon: Vérifie les logs de la console (F12)
4. Partage l'erreur pour diagnostic

---

## 📞 SUPPORT

Si tu rencontres des difficultés:

1. ✅ Note le **message d'erreur exact**
2. ✅ Prends un **screenshot** de l'erreur
3. ✅ Note quel **script** tu exécutais
4. ✅ Partage ces infos avec moi

---

## ✅ CHECKLIST FINALE

Après avoir tout exécuté:

- [ ] ✅ Script 1 exécuté (Catégories)
- [ ] ✅ Script 2 exécuté (Trigger paiements)
- [ ] ✅ Script 3A exécuté (Devises)
- [ ] ✅ Script 3B exécuté (Taux de change)
- [ ] ✅ Test 1 passé (Menu restaurant)
- [ ] ✅ Test 2 passé (Room Service)
- [ ] ✅ Test 3 passé (Multi-devises)
- [ ] ✅ Aucune erreur dans la console
- [ ] ✅ Application fonctionne normalement

---

## 🎉 UNE FOIS TERMINÉ

**Tout sera opérationnel!**

Tu auras:
- ✅ Menu restaurant sans doublons
- ✅ Room Service qui fonctionne correctement
- ✅ Système multi-devises complet
- ✅ Conversion automatique avec taux Forex en temps réel
- ✅ 6 devises disponibles (USD, CDF, EUR, GBP, ZAR, XAF)

---

## 📚 DOCUMENTATION COMPLÈTE

Pour plus de détails:

1. **`SYSTEME_DEVISE_100_POURCENT_COMPLETE.md`** - Guide complet du système multi-devises
2. **`TESTER_DEVISES_MAINTENANT.md`** - Guide de test détaillé
3. **`CONVERSION_FOREX_COMPLETE.md`** - Documentation technique Forex
4. **`EXECUTER_SQL_DEVISES_MAINTENANT.md`** - Instructions SQL détaillées

---

**Date**: 23 juin 2026  
**Status**: ⏳ 4 scripts SQL en attente d'exécution  
**Temps Requis**: ~10 minutes  
**Prochaine Action**: Exécuter les scripts dans Supabase SQL Editor  

**Bon courage! 🚀**
