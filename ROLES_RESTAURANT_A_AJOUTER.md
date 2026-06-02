# 🎭 NOUVEAUX RÔLES RESTAURANT À AJOUTER

**Date**: 2 juin 2026  
**Module**: Restaurant & Bar  
**Statut**: 📝 **À IMPLÉMENTER**

---

## 🎯 RÔLES ACTUELS DU SYSTÈME

### Existants (Hôtel)
- ✅ **Admin** - Accès complet
- ✅ **Manager** - Gestion globale
- ✅ **Receptionist** - Front desk
- ✅ **Housekeeper** - Ménage
- ✅ **Maintenance** - Maintenance

---

## 🆕 NOUVEAUX RÔLES À AJOUTER

### 1. **Serveur Restaurant** (`restaurant_server`)

#### Permissions
**Peut**:
- ✅ Créer une commande
- ✅ Modifier une commande avant validation
- ✅ Affecter une commande à une chambre
- ✅ Imprimer les tickets
- ✅ Voir ses propres commandes
- ✅ Consulter le menu
- ✅ Voir les tables et leur statut

**Ne peut PAS**:
- ❌ Modifier les prix
- ❌ Voir les rapports financiers complets
- ❌ Gérer les utilisateurs
- ❌ Modifier le menu
- ❌ Supprimer des commandes validées
- ❌ Voir les statistiques de vente

#### Code permissions
```typescript
restaurant_server: {
  restaurant: {
    orders: ['create', 'read', 'update_own'],
    menu: ['read'],
    tables: ['read', 'update_status'],
    print: ['tickets']
  },
  bookings: {
    rooms: ['read'] // Pour affecter à une chambre
  }
}
```

---

### 2. **Caissier Restaurant** (`restaurant_cashier`)

#### Permissions
**Peut**:
- ✅ Encaisser les paiements
- ✅ Clôturer les tickets
- ✅ Gérer les remboursements (selon autorisation)
- ✅ Voir toutes les commandes
- ✅ Modifier le statut de paiement
- ✅ Imprimer les factures
- ✅ Consulter l'historique des paiements

**Ne peut PAS**:
- ❌ Modifier les prix du menu
- ❌ Créer/modifier les articles du menu
- ❌ Voir les rapports de gestion
- ❌ Gérer les utilisateurs

#### Code permissions
```typescript
restaurant_cashier: {
  restaurant: {
    orders: ['read', 'update_payment'],
    payments: ['create', 'read', 'refund'],
    print: ['invoices', 'receipts']
  },
  bookings: {
    rooms: ['read'], // Pour facturer à la chambre
    payments: ['create'] // Ajouter au folio
  }
}
```

---

### 3. **Responsable Restaurant** (`restaurant_manager`)

#### Permissions
**Peut**:
- ✅ Consulter les ventes
- ✅ Gérer les menus (CRUD)
- ✅ Modifier les prix
- ✅ Consulter les statistiques
- ✅ Gérer les catégories
- ✅ Voir tous les rapports restaurant
- ✅ Gérer les tables
- ✅ Gérer les réservations de tables
- ✅ Valider les remboursements
- ✅ Exporter les données

**Ne peut PAS**:
- ❌ Gérer les utilisateurs système
- ❌ Modifier les paramètres globaux
- ❌ Accéder aux autres modules (sauf lecture)

#### Code permissions
```typescript
restaurant_manager: {
  restaurant: {
    orders: ['create', 'read', 'update', 'delete'],
    menu: ['create', 'read', 'update', 'delete'],
    categories: ['create', 'read', 'update', 'delete'],
    tables: ['create', 'read', 'update', 'delete'],
    reservations: ['create', 'read', 'update', 'delete'],
    payments: ['read', 'refund'],
    stats: ['read'],
    reports: ['read', 'export'],
    print: ['all']
  },
  bookings: {
    rooms: ['read']
  }
}
```

---

### 4. **Chef de Cuisine** (`restaurant_chef`)

#### Permissions
**Peut**:
- ✅ Voir les commandes en cours
- ✅ Modifier le statut des commandes (en préparation, prêt)
- ✅ Consulter le menu
- ✅ Voir les statistiques de production
- ✅ Gérer les temps de préparation

**Ne peut PAS**:
- ❌ Créer des commandes
- ❌ Voir les prix
- ❌ Modifier le menu
- ❌ Gérer les paiements

#### Code permissions
```typescript
restaurant_chef: {
  restaurant: {
    orders: ['read', 'update_status'],
    menu: ['read'],
    stats: ['read_production']
  }
}
```

---

## 📋 EXTENSIONS RÔLES EXISTANTS

### **Receptionist** (Extension)
Doit pouvoir accéder au restaurant pour:

#### Nouvelles permissions
```typescript
receptionist: {
  // Permissions existantes...
  restaurant: {
    orders: ['read'], // Consulter les consommations
    payments: ['create'], // Ajouter au folio chambre
    reports: ['read_guest'] // Voir les dépenses d'un client
  }
}
```

**Cas d'usage**:
- Consulter les consommations des clients
- Ajouter les dépenses restaurant au folio de la chambre
- Vérifier les charges avant le check-out

---

## 🗃️ STRUCTURE BASE DE DONNÉES

### Script SQL à ajouter

```sql
-- Ajouter les nouveaux rôles
INSERT INTO roles (name, description, permissions) VALUES

-- Serveur Restaurant
('restaurant_server', 'Serveur Restaurant', '{
  "restaurant": {
    "orders": ["create", "read", "update_own"],
    "menu": ["read"],
    "tables": ["read", "update_status"],
    "print": ["tickets"]
  },
  "bookings": {
    "rooms": ["read"]
  }
}'),

-- Caissier Restaurant
('restaurant_cashier', 'Caissier Restaurant', '{
  "restaurant": {
    "orders": ["read", "update_payment"],
    "payments": ["create", "read", "refund"],
    "print": ["invoices", "receipts"]
  },
  "bookings": {
    "rooms": ["read"],
    "payments": ["create"]
  }
}'),

-- Responsable Restaurant
('restaurant_manager', 'Responsable Restaurant', '{
  "restaurant": {
    "orders": ["create", "read", "update", "delete"],
    "menu": ["create", "read", "update", "delete"],
    "categories": ["create", "read", "update", "delete"],
    "tables": ["create", "read", "update", "delete"],
    "reservations": ["create", "read", "update", "delete"],
    "payments": ["read", "refund"],
    "stats": ["read"],
    "reports": ["read", "export"],
    "print": ["all"]
  },
  "bookings": {
    "rooms": ["read"]
  }
}'),

-- Chef de Cuisine
('restaurant_chef', 'Chef de Cuisine', '{
  "restaurant": {
    "orders": ["read", "update_status"],
    "menu": ["read"],
    "stats": ["read_production"]
  }
}');

-- Mettre à jour le rôle Receptionist
UPDATE roles 
SET permissions = jsonb_set(
  permissions, 
  '{restaurant}', 
  '{
    "orders": ["read"],
    "payments": ["create"],
    "reports": ["read_guest"]
  }'::jsonb
)
WHERE name = 'receptionist';
```

---

## 🎨 INTERFACE UTILISATEUR

### Modifications nécessaires

#### 1. Page Restaurant - Permissions par rôle

```typescript
// client/src/pages/Restaurant.tsx

const canCreateOrder = hasPermission('restaurant.orders.create');
const canUpdateMenu = hasPermission('restaurant.menu.update');
const canViewStats = hasPermission('restaurant.stats.read');
const canManagePrices = hasPermission('restaurant.menu.update');

// Affichage conditionnel
{canCreateOrder && (
  <Button onClick={openOrderModal}>Nouvelle Commande</Button>
)}

{canUpdateMenu && (
  <Button onClick={openMenuModal}>Ajouter un Article</Button>
)}

{canViewStats && (
  <StatisticsCards data={stats} />
)}
```

#### 2. Menu Navigation - Visibilité

```typescript
// client/src/components/layout/Navbar.tsx

const menuItems = [
  {
    path: '/restaurant',
    label: 'Restaurant',
    icon: UtensilsCrossed,
    requiredPermission: 'restaurant.orders.read'
  },
  // Afficher seulement si l'utilisateur a accès
];
```

---

## 🔐 MIDDLEWARE BACKEND

### Protection des routes

```typescript
// zen_backend/src/middleware/checkPermission.ts

export const checkPermission = (resource: string, action: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userPermissions = req.user?.permissions;
    
    if (!hasPermission(userPermissions, resource, action)) {
      return res.status(403).json({ 
        message: 'Permission denied' 
      });
    }
    
    next();
  };
};

// Utilisation dans les routes
router.post('/orders', 
  checkPermission('restaurant.orders', 'create'),
  createOrder
);

router.put('/menu/items/:id',
  checkPermission('restaurant.menu', 'update'),
  updateMenuItem
);
```

---

## 📊 MATRICE DES PERMISSIONS

| Action | Admin | Restaurant Manager | Serveur | Caissier | Chef | Réception |
|--------|-------|-------------------|---------|----------|------|-----------|
| **Commandes** |
| Créer | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Voir toutes | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Voir propres | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Modifier avant validation | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Changer statut cuisine | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Supprimer | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Menu** |
| Voir | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Créer/Modifier | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Modifier prix | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Supprimer | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Paiements** |
| Encaisser | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Voir historique | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Remboursement | ✅ | ✅ | ❌ | ✅* | ❌ | ❌ |
| Facturer à chambre | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Statistiques** |
| Ventes | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Production | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Rapports complets | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Impression** |
| Tickets | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Factures | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |

*✅ = Avec limite/autorisation

---

## 📝 ÉTAPES D'IMPLÉMENTATION

### Phase 1: Base de données ⏱️ 1h
1. Créer le script SQL pour les nouveaux rôles
2. Exécuter dans Supabase
3. Vérifier que les rôles sont créés

### Phase 2: Backend ⏱️ 2h
1. Créer le middleware `checkPermission`
2. Ajouter les protections aux routes restaurant
3. Tester les permissions

### Phase 3: Frontend ⏱️ 3h
1. Modifier `permissions.ts` avec les nouvelles permissions
2. Ajouter les vérifications dans Restaurant.tsx
3. Masquer/afficher les éléments selon le rôle
4. Tester chaque rôle

### Phase 4: Tests ⏱️ 1h
1. Créer des utilisateurs de test pour chaque rôle
2. Vérifier les permissions
3. Tester les cas limites

---

## 🧪 TESTS À EFFECTUER

### Test Serveur
- [ ] Peut créer une commande
- [ ] Peut voir ses commandes
- [ ] Peut affecter à une chambre
- [ ] Ne peut PAS modifier les prix
- [ ] Ne peut PAS voir les stats

### Test Caissier
- [ ] Peut encaisser
- [ ] Peut voir toutes les commandes
- [ ] Peut faire un remboursement
- [ ] Ne peut PAS modifier le menu

### Test Responsable Restaurant
- [ ] Peut tout faire dans le restaurant
- [ ] Peut voir les stats
- [ ] Peut modifier les prix
- [ ] Ne peut PAS gérer les utilisateurs système

### Test Chef
- [ ] Peut voir les commandes
- [ ] Peut changer statut (préparation → prêt)
- [ ] Ne peut PAS voir les prix
- [ ] Ne peut PAS créer de commandes

### Test Réception
- [ ] Peut voir les consommations clients
- [ ] Peut ajouter au folio
- [ ] Ne peut PAS créer de commandes
- [ ] Ne peut PAS modifier le menu

---

## 📁 FICHIERS À CRÉER/MODIFIER

### Backend
```
zen_backend/
├── src/
│   ├── middleware/
│   │   └── checkPermission.ts          # NOUVEAU
│   ├── routes/
│   │   └── restaurantRoutes.ts         # MODIFIER (ajouter protections)
│   └── controllers/
│       └── restaurantController.ts      # MODIFIER (vérifier permissions)
```

### Frontend
```
client/src/
├── utils/
│   └── permissions.ts                   # MODIFIER (ajouter permissions restaurant)
├── pages/
│   └── Restaurant.tsx                   # MODIFIER (affichage conditionnel)
└── components/
    └── restaurant/
        └── CreateOrderModal.tsx         # MODIFIER (limiter selon rôle)
```

### Database
```
database/
└── add-restaurant-roles.sql            # NOUVEAU
```

---

## 💡 RECOMMANDATIONS

### Sécurité
1. ✅ **Double validation**: Frontend (UX) + Backend (sécurité)
2. ✅ **Logs d'audit**: Tracer qui fait quoi
3. ✅ **Timeouts de session**: Déconnexion automatique
4. ✅ **Permissions granulaires**: Éviter les rôles "super-utilisateur"

### UX
1. ✅ **Messages clairs**: "Vous n'avez pas accès à cette fonctionnalité"
2. ✅ **Masquage proactif**: Ne pas afficher ce qu'on ne peut pas faire
3. ✅ **Feedback visuel**: Désactiver les boutons au lieu de les cacher
4. ✅ **Aide contextuelle**: Expliquer pourquoi une action est bloquée

---

## ✅ PROCHAINES ÉTAPES

### Immédiat
1. 📝 **Valider les rôles** avec vous
2. 📝 **Ajuster les permissions** si besoin
3. 📝 **Prioriser les rôles** (commencer par lesquels?)

### À planifier
1. 🗃️ Créer le script SQL
2. 🔐 Implémenter le middleware
3. 🎨 Modifier le frontend
4. 🧪 Tester tous les rôles

---

**Status**: 📝 **SPÉCIFICATION COMPLÈTE**  
**Prochaine action**: Validation et implémentation  
**Priorité**: ⭐⭐⭐ **HAUTE** (sécurité et gestion)
