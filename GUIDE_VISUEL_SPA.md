# 🎨 GUIDE VISUEL - CORRECTION ERREUR SPA

## 🎯 OBJECTIF
Corriger l'erreur "Erreur lors du chargement des données" sur la page `/spa`

---

## 📍 ÉTAPE 1: VÉRIFIER SUPABASE (5 min)

### 1.1 Ouvrir Supabase
```
🌐 https://supabase.com/dashboard
```

### 1.2 Aller dans SQL Editor
```
Dashboard → [Votre Projet] → SQL Editor (menu gauche)
```

### 1.3 Exécuter cette requête
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'spa_%'
ORDER BY table_name;
```

### 1.4 Résultat attendu
```
┌─────────────────────────────┐
│ table_name                  │
├─────────────────────────────┤
│ spa_bookings                │
│ spa_package_services        │
│ spa_packages                │
│ spa_product_sales           │
│ spa_products                │
│ spa_reviews                 │
│ spa_service_categories      │
│ spa_services                │
│ spa_therapist_schedules     │
│ spa_therapist_services      │
│ spa_therapists              │
│ spa_treatment_rooms         │
└─────────────────────────────┘
13 rows
```

### ❌ Si vous voyez "0 rows"
**ACTION**: Exécuter le fichier `database/spa-module.sql`

1. Ouvrir le fichier `database/spa-module.sql` dans votre éditeur
2. Copier TOUT le contenu (Ctrl+A, Ctrl+C)
3. Retourner dans Supabase SQL Editor
4. Coller le contenu (Ctrl+V)
5. Cliquer sur **RUN** (ou appuyer sur F5)
6. Attendre le message "Success. No rows returned"
7. Re-exécuter la requête de vérification ci-dessus

---

## 📍 ÉTAPE 2: REDÉPLOYER RENDER (10 min)

### 2.1 Ouvrir Render Dashboard
```
🌐 https://dashboard.render.com
```

### 2.2 Sélectionner votre service backend
```
Dashboard → [Votre Service Backend]
(Probablement nommé "zen-backend" ou similaire)
```

### 2.3 Cliquer sur "Manual Deploy"
```
┌─────────────────────────────────────────┐
│  [Manual Deploy ▼]                      │
│    ├─ Deploy latest commit              │
│    └─ Clear build cache & deploy  ← CECI│
└─────────────────────────────────────────┘
```

### 2.4 Attendre le déploiement
```
Status: Building... ⏳
  ↓
Status: Deploying... ⏳
  ↓
Status: Live ✅
```

**DURÉE**: 5-10 minutes

### 2.5 Vérifier les logs
```
Logs (onglet) → Chercher:
  ✅ "Server running on port 10000"
  ✅ "Database connected"
  ❌ Pas d'erreurs rouges
```

---

## 📍 ÉTAPE 3: TESTER LE BACKEND (2 min)

### 3.1 Copier l'URL de votre backend
```
Render Dashboard → Votre Service → URL en haut
Exemple: https://zen-backend-xxxx.onrender.com
```

### 3.2 Tester dans le navigateur

**Test 1: Health Check**
```
https://VOTRE_URL/api/health
```
**Résultat attendu**:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-05-30T..."
}
```

**Test 2: Spa Services**
```
https://VOTRE_URL/api/spa/services
```
**Résultat attendu**:
```json
[]
```
ou
```json
[{"id": "...", "name": "..."}]
```

**❌ Si vous voyez 404**:
```json
{
  "message": "Cannot GET /api/spa/services"
}
```
**SOLUTION**: Le backend n'est pas redéployé correctement
- Retourner à l'étape 2.3
- Vérifier que vous avez bien sélectionné "Clear build cache & deploy"
- Attendre la fin complète du déploiement

---

## 📍 ÉTAPE 4: TESTER LE FRONTEND (1 min)

### 4.1 Ouvrir votre application
```
🌐 https://zen-lyart.vercel.app
```

### 4.2 Se connecter
```
Email: admin@hotel.com
Password: [votre mot de passe]
```

### 4.3 Aller sur la page Spa
```
Menu gauche → Spa 🧘
```

### 4.4 Résultat attendu
```
┌─────────────────────────────────────────┐
│ 🧘 Gestion du Spa                       │
├─────────────────────────────────────────┤
│ [Réservations] [Services] [Thérapeutes] │
│ [Forfaits] [Produits]                   │
├─────────────────────────────────────────┤
│                                         │
│  Aucune réservation pour le moment     │
│                                         │
│  [+ Nouvelle Réservation]              │
│                                         │
└─────────────────────────────────────────┘
```

### ❌ Si vous voyez encore l'erreur
```
┌─────────────────────────────────────────┐
│ ❌ Erreur lors du chargement des données│
└─────────────────────────────────────────┘
```

**DIAGNOSTIC**:
1. Ouvrir la console (F12)
2. Aller dans l'onglet "Console"
3. Chercher les erreurs rouges
4. Noter l'URL qui retourne 404

**SOLUTIONS POSSIBLES**:

**Problème A: 404 sur `/api/spa/...`**
→ Backend pas redéployé (retour étape 2)

**Problème B: CORS error**
→ Vérifier les variables d'environnement Render:
```
CORS_ORIGIN=https://zen-lyart.vercel.app
```

**Problème C: 401 Unauthorized**
→ Token expiré, se déconnecter et reconnecter

**Problème D: 500 Internal Server Error**
→ Vérifier les logs Render pour voir l'erreur exacte

---

## 📍 ÉTAPE 5: TESTER LES FONCTIONNALITÉS (5 min)

### 5.1 Créer une catégorie de service
```
Onglet "Services" → [+ Nouveau Service]
  Catégorie: Massage
  Nom: Massage Relaxant
  Durée: 60 minutes
  Prix: 80.00
  [Enregistrer]
```

### 5.2 Créer un thérapeute
```
Onglet "Thérapeutes" → [+ Nouveau Thérapeute]
  Prénom: Marie
  Nom: Dubois
  Email: marie@hotel.com
  Spécialités: Massage, Aromathérapie
  [Enregistrer]
```

### 5.3 Créer une réservation
```
Onglet "Réservations" → [+ Nouvelle Réservation]
  Client: [Sélectionner un client]
  Service: Massage Relaxant
  Thérapeute: Marie Dubois
  Date: [Aujourd'hui]
  Heure: 14:00
  [Enregistrer]
```

### ✅ Si tout fonctionne
```
✅ Service créé avec succès
✅ Thérapeute créé avec succès
✅ Réservation créée avec succès
✅ Référence: SPA-20260530-0001
```

---

## 🎉 SUCCÈS!

Si vous arrivez ici sans erreur, le module spa est **100% fonctionnel**!

### Ce que vous pouvez faire maintenant:
- ✅ Gérer les services spa
- ✅ Gérer les thérapeutes
- ✅ Créer des réservations
- ✅ Créer des forfaits
- ✅ Vendre des produits
- ✅ Voir les statistiques

---

## 🆘 AIDE RAPIDE

### Commandes utiles

**Tester le backend avec le script**:
```bash
node test-spa-backend.js https://VOTRE_URL_BACKEND
```

**Vérifier les tables Supabase**:
```sql
SELECT COUNT(*) FROM spa_services;
SELECT COUNT(*) FROM spa_therapists;
SELECT COUNT(*) FROM spa_bookings;
```

**Voir les logs Render en temps réel**:
```
Render Dashboard → Service → Logs → [Activer "Auto-scroll"]
```

---

## 📞 CHECKLIST FINALE

- [ ] 13 tables spa existent dans Supabase
- [ ] Backend redéployé sur Render (status "Live")
- [ ] `/api/health` retourne `{"status":"ok"}`
- [ ] `/api/spa/services` retourne `[]` (pas 404)
- [ ] Page `/spa` se charge sans erreur
- [ ] Onglets visibles: Réservations, Services, Thérapeutes, Forfaits, Produits
- [ ] Peut créer un service test
- [ ] Peut créer un thérapeute test
- [ ] Peut créer une réservation test

**Si toutes les cases sont cochées: BRAVO! 🎉**
