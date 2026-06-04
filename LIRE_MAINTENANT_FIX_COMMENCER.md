# 🔧 Fix Bouton "Commencer" - Action Requise

## 📍 Situation

Le bouton "Commencer" dans la section Commandes du Restaurant affiche une erreur 500.

## ✅ Ce que j'ai fait

### 1. Correction Build Vercel ✅
- Problème: Le build Vercel échouait (`@headlessui/react` manquant)
- Solution: Bump version client pour forcer réinstallation
- Status: Déploiement en cours (2-3 minutes)

### 2. Vérification Backend ✅
- CORS: Configuré correctement avec Vercel URL
- API Endpoint: Fonctionne correctement
- Status: Déjà déployé sur Render

## 🔴 Ce que TU dois faire

### Action Unique: Exécuter un Script SQL

Le problème vient d'une contrainte dans la base de données qui bloque le statut "preparing".

#### Étapes:

1. **Ouvrir Supabase SQL Editor**
   - https://supabase.com
   - Ton projet
   - SQL Editor (menu gauche)
   - New Query

2. **Copier le contenu du fichier:**
   ```
   database/FIX_ORDER_STATUS_CONSTRAINT.sql
   ```

3. **Coller et Exécuter** (bouton Run)

4. **Attendre le message:**
   ```
   ✅ Contrainte CHECK mise à jour pour accepter tous les statuts
   ```

5. **Tester:**
   - Ouvrir https://zen-lyart.vercel.app
   - Restaurant > Commandes
   - Cliquer "Commencer"
   - ✅ Devrait fonctionner!

## 📄 Contenu du Script SQL

```sql
-- Supprimer l'ancienne contrainte
ALTER TABLE restaurant_orders 
DROP CONSTRAINT IF EXISTS restaurant_orders_status_check;

-- Ajouter la nouvelle avec tous les statuts
ALTER TABLE restaurant_orders 
ADD CONSTRAINT restaurant_orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'));
```

## ⏱️ Timing

1. **Attendre 2-3 minutes** que Vercel finisse le build
2. **Exécuter le SQL** (1 minute)
3. **Tester** (30 secondes)

**Total: ~5 minutes**

## 📚 Documentation Complète

- Instructions détaillées: `EXECUTER_FIX_STATUS_SQL.md`
- Script SQL: `database/FIX_ORDER_STATUS_CONSTRAINT.sql`
- Situation complète: `SITUATION_ACTUELLE_COMPLETE.md`

## 🆘 Si ça ne marche pas

1. Vérifier les logs Render: https://dashboard.render.com
2. Vérifier que tu es connecté avec un rôle `admin`, `manager`, `restaurant_manager` ou `restaurant_chef`
3. Ouvrir la console navigateur (F12) et chercher l'erreur exacte

---

**Prêt?** Exécute le SQL et teste! 🚀
