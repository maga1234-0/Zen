# ✅ COMMENCER LES TESTS ICI

**Date**: 30 octobre 2026  
**Temps estimé**: 13 minutes

---

## 🎯 OBJECTIF

Valider les 3 fonctionnalités développées aujourd'hui.

---

## ⚡ TEST 1: DASHBOARD MINIMALISTE (2 minutes)

### Étapes
1. Ouvrir https://zen-lyart.vercel.app
2. Se connecter avec vos identifiants
3. Regarder le dashboard

### ✅ Résultat attendu
- Cartes blanches avec bordures grises (au lieu de couleurs vives)
- Graphiques en tons de gris (au lieu de couleurs)
- Design épuré et professionnel

### ❓ Ça marche pas ?
- Vider le cache : Ctrl+Shift+Delete
- Rafraîchir : Ctrl+F5
- Attendre 2-3 minutes (déploiement)

---

## ⚡ TEST 2: SPA RÉSERVATIONS (5 minutes)

### Étapes
1. Dans l'app, cliquer sur **"Spa"**
2. Cliquer sur **"Nouvelle Réservation"**
3. Vérifier que la modal s'ouvre correctement
4. Vérifier que les services s'affichent avec leurs prix
5. Sélectionner un service
6. Cliquer "Suivant"
7. Remplir date, heure, thérapeute
8. Cliquer "Suivant"
9. Remplir infos client
10. Vérifier que le "Total à payer" s'affiche correctement
11. (Optionnel) Créer la réservation

### ✅ Résultat attendu
- Modal s'ouvre (PAS de page blanche)
- Services affichés avec prix (ex: "50.00€")
- Navigation 3 étapes fonctionne
- Total calculé et affiché
- Réservation créée avec succès

### ❓ Ça marche pas ?
- Vider cache + Ctrl+F5
- Console (F12) → Vérifier erreurs
- Attendre 2-3 minutes (déploiement)

---

## ⚡ TEST 3: EXÉCUTER SQL (3 minutes)

### ⚠️ IMPORTANT: ACTION MANUELLE REQUISE

### Étapes
1. Aller sur https://supabase.com
2. Se connecter
3. Sélectionner votre projet
4. Cliquer sur **"SQL Editor"** (menu gauche)
5. Cliquer sur **"New Query"**
6. Ouvrir le fichier local: `database/ADD_ROOM_CLEANING_ALERT_SYSTEM_FIXED.sql`
7. Copier TOUT le contenu (Ctrl+A puis Ctrl+C)
8. Coller dans l'éditeur SQL Supabase (Ctrl+V)
9. Cliquer sur **"Run"** (ou Ctrl+Enter)
10. ✅ Vérifier que "Success" s'affiche

### ✅ Résultat attendu
- Message "Success. No rows returned"
- Pas d'erreur rouge

### ❓ Ça marche pas ?
- Vérifier que vous êtes dans le bon projet
- Copier l'erreur exacte
- Consulter `EXECUTER_CE_SCRIPT_SQL_CORRIGE.md`

---

## ⚡ TEST 4: SYSTÈME ALERTES (3 minutes)

### ⚠️ À faire APRÈS avoir exécuté le script SQL (Test 3)

### Étapes
1. Ouvrir Supabase SQL Editor
2. Nouvelle query
3. Copier/coller et exécuter:
```sql
-- Simuler une chambre sale depuis 3 heures
UPDATE rooms 
SET status = 'dirty', 
    status_changed_at = NOW() - INTERVAL '3 hours' 
WHERE room_number = '101';
```
4. Nouvelle query
5. Copier/coller et exécuter:
```sql
-- Vérifier que l'alerte est détectée
SELECT * FROM dirty_rooms_overdue;
```
6. Ouvrir dans navigateur: https://zen-backend-jzjh.onrender.com/api/room-alerts

### ✅ Résultat attendu
- Requête 1: "UPDATE 1" affiché
- Requête 2: Chambre 101 apparaît dans les résultats
- URL API: JSON avec la chambre 101

### 🧹 Nettoyer après test
```sql
-- Remettre la chambre disponible
UPDATE rooms 
SET status = 'available' 
WHERE room_number = '101';
```

### ❓ Ça marche pas ?
- Vérifier que le script SQL (Test 3) a été exécuté
- Attendre 3-5 minutes (déploiement backend)
- Vérifier https://dashboard.render.com → Logs

---

## ✅ CHECKLIST COMPLÈTE

- [ ] Test 1: Dashboard minimaliste vu et validé
- [ ] Test 2: Spa modal fonctionne, prix affichés
- [ ] Test 3: Script SQL exécuté avec succès
- [ ] Test 4: Alerte chambre détectée

---

## 🎉 TERMINÉ !

Si tous les tests sont ✅, félicitations !

Vous avez maintenant:
- ✅ Dashboard professionnel épuré
- ✅ Module Spa fonctionnel
- ✅ Système d'alertes chambres actif

---

## 📞 PROBLÈME ?

### Voir la documentation
- **Vue d'ensemble**: `LIRE_EN_PREMIER.md`
- **Détails tests**: `ACTIONS_UTILISATEUR_MAINTENANT.md`
- **Dashboard**: `DASHBOARD_MINIMALISTE_DEPLOYE.md`
- **Spa**: `FIX_SPA_PAGE_BLANCHE.md` + `FIX_SPA_PRIX_TOFIXED.md`
- **Alertes**: `EXECUTER_CE_SCRIPT_SQL_CORRIGE.md`

### Vérifier logs
- **Vercel**: https://vercel.com/dashboard
- **Render**: https://dashboard.render.com
- **Console**: F12 dans le navigateur

---

**Bonne validation ! 🚀**

**Temps total**: ~13 minutes  
**Complexité**: ⭐⭐☆☆☆ (Facile)
