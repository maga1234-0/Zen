# 📍 Situation Actuelle - Restaurant Module

## ✅ Ce qui a été fait (dernier déploiement)

### 1. Correction Build Vercel
**Problème**: Build échouait avec `Cannot find module '@headlessui/react'`

**Solution**: 
- Bump de la version du client (`1.0.0` → `1.0.1`) pour forcer Vercel à réinstaller les dépendances
- Commit: `85afaaf - fix: bump client version to force Vercel cache refresh`
- Push effectué: ✅ Déploiement Vercel en cours

**Statut**: 🔄 En attente que Vercel finisse le build (2-3 minutes)

---

## 🔴 Problème Actuel à Résoudre

### Erreur 500 sur le Bouton "Commencer"

**Symptômes**:
```
API Error: 500
Object { message: "Server error" }
```

**Cause**:
La contrainte `restaurant_orders_status_check` dans la base de données n'accepte pas le statut `'preparing'`

**Solution**: Exécuter le script SQL
- **Fichier**: `database/FIX_ORDER_STATUS_CONSTRAINT.sql`
- **Instructions détaillées**: `EXECUTER_FIX_STATUS_SQL.md`

---

## 📋 Étapes pour Résoudre le Problème

### Étape 1: Attendre la Fin du Build Vercel ⏳
1. Ouvrir https://vercel.com/dashboard
2. Vérifier que le dernier déploiement (commit `85afaaf`) est terminé
3. Statut attendu: ✅ "Ready"

### Étape 2: Exécuter le Script SQL dans Supabase 🔧
1. Ouvrir https://supabase.com
2. Aller dans "SQL Editor"
3. Copier le contenu de `database/FIX_ORDER_STATUS_CONSTRAINT.sql`
4. Exécuter (Run)
5. Vérifier le message: ✅ "Contrainte CHECK mise à jour"

### Étape 3: Tester le Bouton "Commencer" ✅
1. Ouvrir https://zen-lyart.vercel.app
2. Se connecter avec un compte admin/manager/restaurant_manager/restaurant_chef
3. Aller dans Restaurant > Commandes
4. Cliquer sur "Commencer" pour une commande en attente
5. Vérifier que le statut passe à "En préparation" ✅

---

## 📂 Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `database/FIX_ORDER_STATUS_CONSTRAINT.sql` | Script SQL à exécuter |
| `EXECUTER_FIX_STATUS_SQL.md` | Instructions détaillées |
| `database/DIAGNOSTIC_ORDER_STATUS.sql` | Diagnostic optionnel |
| `client/src/pages/Restaurant.tsx` | Page Restaurant (déployée) |
| `client/src/components/restaurant/EditReservationModal.tsx` | Modal réservation (déployée) |
| `zen_backend/src/controllers/restaurantController.ts` | Contrôleur backend (déployé sur Render) |

---

## 🔐 Permissions pour Mettre à Jour le Statut

### ✅ Peut changer le statut:
- `admin`
- `manager`
- `restaurant_manager`
- `restaurant_chef`

### ❌ Ne peut PAS changer le statut:
- `restaurant_server` (peut uniquement voir)
- `restaurant_cashier` (peut uniquement voir)
- `receptionist`

---

## 🌊 Flow Complet d'une Commande

```
1. pending (en attente)
   ↓ [Chef clique "Commencer"]
2. preparing (en préparation) ← ⚠️ Erreur 500 ICI
   ↓ [Chef clique "Prête"]
3. ready (prête)
   ↓ [Serveur clique "Servie"]
4. served (servie)
   ↓ [Système ou Manager clique "Terminée"]
5. completed (terminée)
```

---

## 🎯 Prochaines Actions

1. ⏳ **Attendre** que Vercel finisse le build
2. 🔧 **Exécuter** `database/FIX_ORDER_STATUS_CONSTRAINT.sql` dans Supabase
3. ✅ **Tester** le bouton "Commencer"
4. 🎉 **Confirmer** que tout fonctionne

---

## 📞 En Cas de Problème

Si l'erreur 500 persiste après avoir exécuté le SQL:

1. **Vérifier les logs backend Render**:
   - https://dashboard.render.com
   - Aller dans le service `zen-backend`
   - Cliquer sur "Logs"
   - Chercher l'erreur exacte

2. **Vérifier les permissions de l'utilisateur**:
   - Ouvrir la console du navigateur (F12)
   - Chercher "canUpdateOrderStatus" dans les logs
   - Vérifier que c'est `true`

3. **Vérifier la contrainte**:
   ```sql
   SELECT 
       conname,
       pg_get_constraintdef(oid)
   FROM pg_constraint
   WHERE conrelid = 'restaurant_orders'::regclass
   AND conname = 'restaurant_orders_status_check';
   ```

---

**Dernière mise à jour**: Maintenant  
**Prochain déploiement estimé**: Vercel (2-3 min), Render (déjà déployé)
