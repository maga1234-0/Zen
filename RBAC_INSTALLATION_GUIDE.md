# 🚀 GUIDE D'INSTALLATION - SYSTÈME RBAC

## 📋 TABLE DES MATIÈRES

1. [Prérequis](#prérequis)
2. [Installation Base de Données](#installation-base-de-données)
3. [Installation Backend](#installation-backend)
4. [Configuration](#configuration)
5. [Tests](#tests)
6. [Utilisation](#utilisation)

---

## ✅ PRÉREQUIS

- PostgreSQL 12+
- Node.js 16+
- TypeScript
- Express.js

---

## 📦 INSTALLATION BASE DE DONNÉES

### Étape 1 : Créer les tables RBAC

Exécuter dans l'ordre :

```bash
# 1. Créer les tables principales
psql -U postgres -d votre_base -f database/rbac-system.sql

# 2. Insérer les permissions
psql -U postgres -d votre_base -f database/rbac-permissions.sql

# 3. Attribuer les permissions aux rôles
psql -U postgres -d votre_base -f database/rbac-role-permissions.sql
```

### Étape 2 : Vérifier l'installation

```sql
-- Vérifier les rôles
SELECT * FROM roles ORDER BY level;

-- Vérifier les permissions
SELECT COUNT(*) as total_permissions FROM permissions;

-- Vérifier les attributions
SELECT r.name, COUNT(rp.permission_id) as nb_permissions
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY r.name
ORDER BY r.level;
```

**Résultat attendu** :
- 16 rôles créés
- ~80 permissions créées
- Permissions attribuées aux rôles

---

## 🔧 INSTALLATION BACKEND

### Étape 1 : Copier les fichiers

```bash
# Middleware RBAC
cp zen_backend/src/middleware/rbac.ts votre_backend/src/middleware/

# Contrôleur RBAC
cp zen_backend/src/controllers/rbacController.ts votre_backend/src/controllers/

# Routes RBAC
cp zen_backend/src/routes/rbacRoutes.ts votre_backend/src/routes/
```

### Étape 2 : Enregistrer les routes

Dans `src/routes/index.ts` :

```typescript
import rbacRoutes from './rbacRoutes';

// ...

router.use('/rbac', rbacRoutes);
```

### Étape 3 : Compiler TypeScript

```bash
npm run build
```

---

## ⚙️ CONFIGURATION

### Variables d'environnement

Aucune variable supplémentaire nécessaire si vous utilisez déjà PostgreSQL.

### Middleware d'authentification

Le système RBAC nécessite que `req.user` soit défini par votre middleware d'authentification :

```typescript
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}
```

---

## 🧪 TESTS

### Test 1 : Vérifier les rôles

```bash
curl -X GET http://localhost:5000/api/rbac/roles \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Résultat attendu** : Liste des 16 rôles

### Test 2 : Vérifier les permissions

```bash
curl -X GET http://localhost:5000/api/rbac/permissions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Résultat attendu** : Liste de toutes les permissions

### Test 3 : Vérifier les permissions utilisateur

```bash
curl -X GET http://localhost:5000/api/rbac/me/permissions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Résultat attendu** : Liste des permissions de l'utilisateur connecté

### Test 4 : Vérifier une permission spécifique

```bash
curl -X GET http://localhost:5000/api/rbac/me/permissions/reservation.create \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Résultat attendu** :
```json
{
  "permission": "reservation.create",
  "hasPermission": true
}
```

---

## 📖 UTILISATION

### 1. Protéger une route avec une permission

```typescript
import { checkPermission } from '../middleware/rbac';

// Route protégée
router.post('/reservations', 
  authenticateToken,
  checkPermission('reservation.create'),
  createReservation
);
```

### 2. Protéger avec plusieurs permissions (OR)

```typescript
import { checkAnyPermission } from '../middleware/rbac';

router.get('/reports', 
  authenticateToken,
  checkAnyPermission(['report.read', 'report.financial']),
  getReports
);
```

### 3. Protéger avec plusieurs permissions (AND)

```typescript
import { checkAllPermissions } from '../middleware/rbac';

router.delete('/users/:id', 
  authenticateToken,
  checkAllPermissions(['user.delete', 'user.role.manage']),
  deleteUser
);
```

### 4. Protéger par rôle

```typescript
import { checkRole } from '../middleware/rbac';

router.get('/admin/settings', 
  authenticateToken,
  checkRole(['super_admin', 'hotel_manager']),
  getSettings
);
```

### 5. Vérifier une permission dans le code

```typescript
import { getUserPermissions } from '../middleware/rbac';

async function myFunction(userId: string) {
  const permissions = await getUserPermissions(userId);
  
  if (permissions.includes('reservation.create')) {
    // L'utilisateur peut créer des réservations
  }
}
```

---

## 🔐 EXEMPLES D'UTILISATION PAR MODULE

### Module Réservations

```typescript
// routes/bookingRoutes.ts
import { checkPermission } from '../middleware/rbac';

router.post('/bookings', 
  authenticateToken,
  checkPermission('reservation.create'),
  createBooking
);

router.get('/bookings', 
  authenticateToken,
  checkPermission('reservation.read'),
  getBookings
);

router.put('/bookings/:id', 
  authenticateToken,
  checkPermission('reservation.update'),
  updateBooking
);

router.delete('/bookings/:id', 
  authenticateToken,
  checkPermission('reservation.delete'),
  deleteBooking
);

router.post('/bookings/:id/checkin', 
  authenticateToken,
  checkPermission('reservation.checkin'),
  checkinBooking
);

router.post('/bookings/:id/checkout', 
  authenticateToken,
  checkPermission('reservation.checkout'),
  checkoutBooking
);
```

### Module Chambres

```typescript
// routes/roomRoutes.ts
router.post('/rooms', 
  authenticateToken,
  checkPermission('room.create'),
  createRoom
);

router.put('/rooms/:id/status', 
  authenticateToken,
  checkPermission('room.change_status'),
  changeRoomStatus
);

router.post('/rooms/:id/clean', 
  authenticateToken,
  checkPermission('room.clean'),
  markRoomCleaned
);

router.post('/rooms/:id/inspect', 
  authenticateToken,
  checkPermission('room.inspect'),
  inspectRoom
);
```

### Module Paiements

```typescript
// routes/paymentRoutes.ts
router.post('/payments', 
  authenticateToken,
  checkPermission('payment.create'),
  createPayment
);

router.post('/payments/:id/refund', 
  authenticateToken,
  checkPermission('payment.refund'),
  refundPayment
);

router.post('/payments/:id/validate', 
  authenticateToken,
  checkPermission('payment.validate'),
  validatePayment
);
```

### Module Restaurant

```typescript
// routes/restaurantRoutes.ts
router.post('/restaurant/orders', 
  authenticateToken,
  checkPermission('restaurant.order.create'),
  createOrder
);

router.post('/restaurant/orders/:id/payment', 
  authenticateToken,
  checkPermission('restaurant.payment.create'),
  processPayment
);

router.get('/restaurant/reports', 
  authenticateToken,
  checkPermission('restaurant.report.read'),
  getReports
);
```

### Module Spa

```typescript
// routes/spaRoutes.ts
router.post('/spa/bookings', 
  authenticateToken,
  checkPermission('spa.booking.create'),
  createSpaBooking
);

router.put('/spa/services', 
  authenticateToken,
  checkPermission('spa.service.manage'),
  manageSpaServices
);

router.get('/spa/reports', 
  authenticateToken,
  checkPermission('spa.report.read'),
  getSpaReports
);
```

---

## 📊 GESTION DES RÔLES ET PERMISSIONS

### Assigner un rôle à un utilisateur

```typescript
POST /api/rbac/users/roles
{
  "userId": "uuid-user",
  "roleId": "uuid-role",
  "expiresAt": "2025-12-31" // Optionnel
}
```

### Retirer un rôle

```typescript
DELETE /api/rbac/users/{userId}/roles/{roleId}
```

### Modifier les permissions d'un rôle

```typescript
POST /api/rbac/roles/{roleId}/permissions
{
  "permissionIds": ["uuid1", "uuid2", "uuid3"]
}
```

---

## 🔍 AUDIT ET LOGS

### Consulter les logs d'accès

```typescript
GET /api/rbac/access-logs?userId=xxx&status=denied&limit=100
```

### Logs automatiques

Chaque tentative d'accès est automatiquement loguée dans `access_logs` :
- ✅ Accès autorisés
- ❌ Accès refusés
- IP, User-Agent, Timestamp

---

## 🛡️ SÉCURITÉ

### Bonnes pratiques

1. **Principe du moindre privilège** : N'accordez que les permissions nécessaires
2. **Audit régulier** : Consultez les logs d'accès refusés
3. **Expiration des rôles** : Utilisez `expires_at` pour les rôles temporaires
4. **Séparation des tâches** : Ne donnez pas trop de permissions à un seul rôle
5. **Protection des rôles système** : Les rôles `is_system_role=true` ne peuvent pas être modifiés

### Vérifications automatiques

- ✅ Authentification requise sur toutes les routes RBAC
- ✅ Vérification des permissions avant chaque action
- ✅ Logs de toutes les tentatives d'accès
- ✅ Protection contre la modification des rôles système

---

## 🐛 DÉPANNAGE

### Problème : "Permission denied"

**Cause** : L'utilisateur n'a pas la permission requise

**Solution** :
1. Vérifier les rôles de l'utilisateur : `GET /api/rbac/users/{userId}/roles`
2. Vérifier les permissions du rôle : `GET /api/rbac/roles/{roleId}/permissions`
3. Assigner le bon rôle ou ajouter la permission manquante

### Problème : "Role not found"

**Cause** : Le rôle n'existe pas ou est inactif

**Solution** :
1. Vérifier que le rôle existe : `GET /api/rbac/roles`
2. Vérifier que `is_active = true`

### Problème : Permissions non mises à jour

**Cause** : Cache ou session non rafraîchie

**Solution** :
1. Déconnecter/reconnecter l'utilisateur
2. Vérifier que les permissions sont bien en base : `SELECT * FROM role_permissions WHERE role_id = 'xxx'`

---

## 📚 RESSOURCES

- **Documentation complète** : `RBAC_COMPLETE_DOCUMENTATION.md`
- **Matrice des permissions** : `RBAC_ROLES_MATRIX.md`
- **Scripts SQL** : `database/rbac-*.sql`
- **Middleware** : `zen_backend/src/middleware/rbac.ts`
- **Contrôleur** : `zen_backend/src/controllers/rbacController.ts`

---

## ✅ CHECKLIST D'INSTALLATION

- [ ] Tables RBAC créées dans PostgreSQL
- [ ] Rôles insérés (16 rôles)
- [ ] Permissions insérées (~80 permissions)
- [ ] Permissions attribuées aux rôles
- [ ] Middleware RBAC copié
- [ ] Contrôleur RBAC copié
- [ ] Routes RBAC enregistrées
- [ ] Backend compilé et redémarré
- [ ] Tests API réussis
- [ ] Premier utilisateur avec rôle assigné
- [ ] Logs d'accès fonctionnels

---

**🎉 Votre système RBAC est maintenant opérationnel !**
