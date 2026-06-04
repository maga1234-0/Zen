# 📋 SITUATION ACTUELLE - RÔLES DISPARUS

## 🔴 PROBLÈME ACTUEL

**TOUS les rôles ont disparu de la liste Staff** lors de l'ajout d'un nouveau membre du personnel.

---

## 🎯 CE QUI S'EST PASSÉ

### Chronologie des événements:

1. **Avant**: Vous aviez 6 rôles originaux (admin, manager, receptionist, housekeeping, maintenance, accountant)

2. **Demande**: Ajouter 4 nouveaux rôles restaurant (serveur, caissier, responsable, chef)

3. **Tentative 1**: Script `add-restaurant-roles.sql` exécuté
   - ❌ Les rôles n'apparaissaient pas dans la liste
   - **Cause**: Le frontend était hardcodé, pas connecté à la base de données

4. **Tentative 2**: Script `FORCE_FIX_ROLES.sql` exécuté
   - ❌ Ce script a supprimé les 4 rôles restaurant (ligne 10: `DELETE FROM roles WHERE name IN (...)`)
   - ❌ Les 6 rôles originaux avaient déjà été supprimés avant

5. **Résultat actuel**: 
   - ❌ 0 rôles dans la base de données
   - ❌ Liste dropdown vide dans Staff → Add New Staff
   - ❌ Erreur 500 sur la page Restaurant (permissions manquantes)

---

## ✅ CE QUI A ÉTÉ CORRIGÉ (BACKEND + FRONTEND)

### 1. Backend (✅ Déployé sur Render)

**Fichier**: `zen_backend/src/controllers/authController.ts`
```typescript
export const getRoles = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, permissions FROM roles WHERE is_active = true ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des rôles' });
  }
};
```

**Fichier**: `zen_backend/src/routes/authRoutes.ts`
```typescript
router.get('/roles', getRoles); // Nouvelle route
```

**Commit**: `dd03b17`  
**URL**: https://zen-backend-jzjh.onrender.com/auth/roles

### 2. Frontend (✅ Déployé sur Vercel)

**Fichier**: `client/src/pages/Staff.tsx`

**Avant (hardcodé):**
```typescript
<select ...>
  <option value="receptionist">Receptionist</option>
  <option value="housekeeping">Housekeeping</option>
  <option value="maintenance">Maintenance</option>
  <option value="accountant">Accountant</option>
  <option value="manager">Manager</option>
  <option value="admin">Admin</option>
</select>
```

**Après (dynamique depuis API):**
```typescript
const { data: roles, isLoading: rolesLoading } = useQuery({
  queryKey: ['roles'],
  queryFn: async () => {
    const res = await api.get('/auth/roles');
    return res.data;
  },
});

<select ...>
  {rolesLoading ? (
    <option>Loading roles...</option>
  ) : roles && roles.length > 0 ? (
    roles.map((role: any) => (
      <option key={role.id} value={role.name}>
        {role.description || role.name}
      </option>
    ))
  ) : (
    <option>No roles available</option>
  )}
</select>
```

**Commits**: `574b8aa`, `33668c4`  
**URL**: https://zen-lyart.vercel.app

### 3. Badges de couleur et descriptions ajoutés

**Restaurant roles avec badges:**
- 🌹 `restaurant_manager` → Rose (Responsable Restaurant)
- 💠 `restaurant_server` → Cyan (Serveur Restaurant)
- 💚 `restaurant_cashier` → Emerald (Caissier Restaurant)
- 🟡 `restaurant_chef` → Amber (Chef de Cuisine)

**Descriptions des permissions:**
```typescript
{formData.role === 'restaurant_manager' && '🍽️ Full restaurant management: orders, menu, tables, reservations'}
{formData.role === 'restaurant_server' && '👨‍🍳 Create orders, manage tables, view menu'}
{formData.role === 'restaurant_cashier' && '💳 Process payments, handle refunds, print receipts'}
{formData.role === 'restaurant_chef' && '👨‍🍳 View orders, update order status, kitchen operations'}
```

---

## 🎯 SOLUTION PRÊTE

**Fichier créé**: `database/RESTAURER_TOUS_LES_ROLES.sql`

Ce script va:
1. ✅ Restaurer les 6 rôles originaux (admin, manager, receptionist, housekeeping, maintenance, accountant)
2. ✅ Restaurer les 4 rôles restaurant (serveur, caissier, responsable, chef)
3. ✅ Ajouter les permissions restaurant à admin et manager
4. ✅ Ajouter les permissions spa à admin et manager
5. ✅ Utiliser `INSERT ... ON CONFLICT DO UPDATE` pour éviter les doublons
6. ✅ Afficher un rapport détaillé de la restauration

---

## 📝 ACTION REQUISE MAINTENANT

### ÉTAPE 1: Exécuter le script SQL

1. Aller sur **Supabase** → https://supabase.com
2. Ouvrir votre projet
3. Menu gauche → **SQL Editor**
4. Cliquer sur **"New query"**
5. Ouvrir le fichier: `database/RESTAURER_TOUS_LES_ROLES.sql`
6. **Copier TOUT le contenu**
7. Coller dans SQL Editor
8. Cliquer sur **"Run"** (ou appuyer sur F5)
9. Attendre 5-10 secondes

### ÉTAPE 2: Vérifier le résultat

Exécuter cette requête dans Supabase:
```sql
SELECT name, description FROM roles WHERE is_active = true ORDER BY name;
```

**Vous devriez voir 10 lignes:**
1. accountant
2. admin
3. housekeeping
4. maintenance
5. manager
6. receptionist
7. restaurant_cashier
8. restaurant_chef
9. restaurant_manager
10. restaurant_server

### ÉTAPE 3: Vider le cache

1. Ouvrir l'application: https://zen-lyart.vercel.app
2. Appuyer sur `Ctrl + Shift + R` (Windows/Linux) ou `Cmd + Shift + R` (Mac)
3. OU vider le cache complet: `Ctrl + Shift + Delete`

### ÉTAPE 4: Tester

1. Se connecter à l'application
2. Aller sur **Staff**
3. Cliquer sur **"Add Staff"**
4. Ouvrir le dropdown **"Role"**
5. ✅ Vérifier que les 10 rôles apparaissent

---

## 📊 APRÈS LA RESTAURATION

### Les 10 rôles seront disponibles:

**Rôles Originaux (6):**
- ✅ Admin - Accès complet à tout
- ✅ Manager - Gestion opérationnelle complète
- ✅ Receptionist - Front desk et réservations
- ✅ Housekeeping - Entretien des chambres
- ✅ Maintenance - Maintenance technique
- ✅ Accountant - Comptabilité et rapports financiers

**Rôles Restaurant (4):**
- ✅ Serveur Restaurant - Créer commandes, gérer tables
- ✅ Caissier Restaurant - Traiter paiements, remboursements
- ✅ Responsable Restaurant - Gestion complète restaurant
- ✅ Chef de Cuisine - Voir commandes, mettre à jour statuts

### L'erreur 500 sera résolue:

L'erreur `"Erreur serveur lors de la vérification des permissions"` sur la page Restaurant disparaîtra car:
- Admin et Manager auront les permissions `restaurant.stats.read` et `restaurant.stats.read_production`
- L'endpoint `/restaurant/stats` fonctionnera correctement

---

## 🚀 POURQUOI ÇA VA MARCHER MAINTENANT?

### 1. Backend prêt ✅
- Route `/auth/roles` existe et fonctionne
- Retourne les rôles depuis la base de données
- Déployé sur Render

### 2. Frontend prêt ✅
- Plus de rôles hardcodés
- Chargement dynamique via API
- Badges de couleur pour tous les rôles
- Déployé sur Vercel

### 3. Base de données prête ✅
- Script de restauration complet
- Utilise `ON CONFLICT DO UPDATE` (pas de doublons)
- Restaure TOUS les rôles (6 originaux + 4 restaurant)
- Ajoute toutes les permissions nécessaires

---

## 📞 BESOIN D'AIDE?

Si après avoir exécuté le script, les rôles n'apparaissent toujours pas:

1. **Vérifier dans Supabase:**
   ```sql
   SELECT COUNT(*) FROM roles WHERE is_active = true;
   ```
   - Doit retourner: **10**

2. **Vérifier l'API Backend:**
   - Ouvrir: https://zen-backend-jzjh.onrender.com/auth/roles
   - Doit retourner un JSON avec 10 rôles

3. **Vérifier le cache navigateur:**
   - Ouvrir DevTools (F12)
   - Onglet Network
   - Rafraîchir la page
   - Chercher la requête `/auth/roles`
   - Vérifier la réponse (200 OK avec 10 rôles)

---

**Date**: 2 juin 2026  
**Status**: ⏳ Attente d'exécution du script SQL par l'utilisateur  
**Fichier à exécuter**: `database/RESTAURER_TOUS_LES_ROLES.sql`
