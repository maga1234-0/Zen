# ⚡ DÉMARRAGE RAPIDE - SYSTÈME RBAC

## 🎯 EN 5 MINUTES

### Étape 1 : Installer la base de données (2 min)

```bash
# Dans Supabase SQL Editor ou psql
psql -U postgres -d votre_base -f database/rbac-system.sql
psql -U postgres -d votre_base -f database/rbac-permissions.sql
psql -U postgres -d votre_base -f database/rbac-role-permissions.sql
```

### Étape 2 : Copier les fichiers backend (1 min)

```bash
cp zen_backend/src/middleware/rbac.ts votre_backend/src/middleware/
cp zen_backend/src/controllers/rbacController.ts votre_backend/src/controllers/
cp zen_backend/src/routes/rbacRoutes.ts votre_backend/src/routes/
```

### Étape 3 : Enregistrer les routes (30 sec)

Dans `src/routes/index.ts` :

```typescript
import rbacRoutes from './rbacRoutes';
router.use('/rbac', rbacRoutes);
```

### Étape 4 : Protéger vos routes (1 min)

```typescript
import { checkPermission } from '../middleware/rbac';

router.post('/reservations', 
  authenticateToken,
  checkPermission('reservation.create'),
  createReservation
);
```

### Étape 5 : Tester (30 sec)

```bash
curl -X GET http://localhost:5000/api/rbac/roles \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**✅ C'est tout ! Votre système RBAC est opérationnel !**

---

## 📊 RÉSUMÉ DU SYSTÈME

### 16 Rôles Prédéfinis

1. Super Administrateur (niveau 0)
2. Directeur Hôtel (niveau 1)
3. Responsable Réception (niveau 2)
4. Réceptionniste (niveau 3)
5. Responsable Restaurant (niveau 2)
6. Serveur Restaurant (niveau 3)
7. Caissier Restaurant (niveau 3)
8. Responsable Spa (niveau 2)
9. Réception Spa (niveau 3)
10. Thérapeute (niveau 3)
11. Responsable Boutique (niveau 2)
12. Caissier Boutique (niveau 3)
13. Responsable Housekeeping (niveau 2)
14. Agent Housekeeping (niveau 3)
15. Comptable (niveau 2)
16. Client Hôtel (niveau 10)

### ~80 Permissions

Organisées par modules :
- Réservations (9 permissions)
- Chambres (9 permissions)
- Clients (5 permissions)
- Paiements (7 permissions)
- Restaurant (8 permissions)
- Spa (8 permissions)
- Boutique (5 permissions)
- Housekeeping (5 permissions)
- Rapports (5 permissions)
- Folio (5 permissions)
- Utilisateurs (6 permissions)
- Paramètres (5 permissions)
- Notifications (3 permissions)
- Dashboard (2 permissions)
- Portail Client (6 permissions)

---

## 🔐 UTILISATION BASIQUE

### Protéger une route

```typescript
// Une permission
router.post('/bookings', 
  authenticateToken,
  checkPermission('reservation.create'),
  createBooking
);

// Plusieurs permissions (OR)
router.get('/reports', 
  authenticateToken,
  checkAnyPermission(['report.read', 'report.financial']),
  getReports
);

// Plusieurs permissions (AND)
router.delete('/users/:id', 
  authenticateToken,
  checkAllPermissions(['user.delete', 'user.role.manage']),
  deleteUser
);

// Par rôle
router.get('/admin/settings', 
  authenticateToken,
  checkRole(['super_admin', 'hotel_manager']),
  getSettings
);
```

### Vérifier une permission dans le code

```typescript
import { getUserPermissions } from '../middleware/rbac';

const permissions = await getUserPermissions(userId);

if (permissions.includes('reservation.create')) {
  // Autorisé
}
```

---

## 📋 CHECKLIST RAPIDE

- [ ] Tables RBAC créées
- [ ] Fichiers backend copiés
- [ ] Routes enregistrées
- [ ] Backend redémarré
- [ ] Test API réussi
- [ ] Première route protégée

---

## 🎓 EXEMPLES COURANTS

### Exemple 1 : Réceptionniste

**Rôle** : `receptionist`

**Peut** :
- ✅ Créer des réservations
- ✅ Voir les réservations
- ✅ Modifier les réservations
- ✅ Check-in / Check-out
- ✅ Assigner des chambres
- ✅ Créer des clients

**Ne peut pas** :
- ❌ Supprimer des réservations
- ❌ Modifier les tarifs
- ❌ Voir les rapports financiers
- ❌ Gérer les utilisateurs

### Exemple 2 : Serveur Restaurant

**Rôle** : `waiter`

**Peut** :
- ✅ Créer des commandes
- ✅ Voir les commandes
- ✅ Modifier les commandes
- ✅ Gérer les tables

**Ne peut pas** :
- ❌ Encaisser les paiements
- ❌ Voir les rapports
- ❌ Gérer le menu
- ❌ Annuler des commandes

### Exemple 3 : Agent Housekeeping

**Rôle** : `housekeeper`

**Peut** :
- ✅ Voir ses tâches
- ✅ Marquer les chambres comme nettoyées
- ✅ Changer le statut des chambres

**Ne peut pas** :
- ❌ Créer des tâches
- ❌ Assigner des tâches
- ❌ Voir les rapports
- ❌ Accéder aux autres modules

---

## 🚀 PROCHAINES ÉTAPES

1. **Lire la documentation complète** : `RBAC_COMPLETE_DOCUMENTATION.md`
2. **Consulter la matrice des permissions** : `RBAC_ROLES_MATRIX.md`
3. **Voir les exemples d'API** : `RBAC_API_EXAMPLES.md`
4. **Suivre le guide d'installation** : `RBAC_INSTALLATION_GUIDE.md`

---

## 📞 SUPPORT

### Problèmes courants

**"Permission denied"**
→ Vérifier les rôles de l'utilisateur : `GET /api/rbac/users/{userId}/roles`

**"Role not found"**
→ Vérifier que le rôle existe : `GET /api/rbac/roles`

**Permissions non mises à jour**
→ Déconnecter/reconnecter l'utilisateur

---

## 📚 FICHIERS DU SYSTÈME

### Base de données
- `database/rbac-system.sql` - Tables principales
- `database/rbac-permissions.sql` - Permissions
- `database/rbac-role-permissions.sql` - Attributions

### Backend
- `zen_backend/src/middleware/rbac.ts` - Middleware
- `zen_backend/src/controllers/rbacController.ts` - Contrôleur
- `zen_backend/src/routes/rbacRoutes.ts` - Routes

### Documentation
- `RBAC_QUICK_START.md` - Ce fichier
- `RBAC_INSTALLATION_GUIDE.md` - Guide complet
- `RBAC_ROLES_MATRIX.md` - Matrice des permissions
- `RBAC_API_EXAMPLES.md` - Exemples d'API
- `RBAC_COMPLETE_DOCUMENTATION.md` - Documentation complète

---

**🎉 Vous êtes prêt à utiliser le système RBAC !**

**Questions ? Consultez la documentation complète ou les exemples d'API.**
