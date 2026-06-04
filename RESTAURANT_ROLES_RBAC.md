# 🍽️ RBAC pour les Rôles Restaurant

## 📋 OBJECTIF

Créer des **dashboards et sidebars personnalisés** pour les 4 rôles restaurant :
1. **restaurant_server** (Serveur)
2. **restaurant_cashier** (Caissier)
3. **restaurant_manager** (Manager Restaurant)
4. **restaurant_chef** (Chef)

---

## 🎨 DESIGN DES PERMISSIONS

### 1. Restaurant Server (Serveur) 🧑‍💼

**Accès**:
- ✅ Dashboard → Statistiques serveur (commandes du jour, tables actives)
- ✅ Restaurant → Gestion des commandes
  - Prendre commandes
  - Voir commandes en cours
  - Marquer commandes servies
- ✅ Notifications
- ✅ Profile

**Sidebar**:
- 📊 Dashboard
- 🍽️ Restaurant
- 🔔 Notifications
- 👤 Profile

**Dashboard Cards**:
- Commandes du jour
- Tables actives
- Commandes en attente
- Revenus du jour (view only)

---

### 2. Restaurant Cashier (Caissier) 💰

**Accès**:
- ✅ Dashboard → Statistiques caisse
- ✅ Restaurant → Gestion paiements
  - Voir toutes les commandes
  - Traiter paiements
  - Voir historique paiements
- ✅ Payments → Module paiements (read + restaurant payments)
- ✅ Notifications
- ✅ Profile

**Sidebar**:
- 📊 Dashboard
- 🍽️ Restaurant (focus paiements)
- 💳 Payments
- 🔔 Notifications
- 👤 Profile

**Dashboard Cards**:
- Total encaissements du jour
- Paiements en attente
- Commandes payées
- Méthodes de paiement (cash, card, etc.)

---

### 3. Restaurant Manager (Manager Restaurant) 👔

**Accès**:
- ✅ Dashboard → Statistiques complètes restaurant
- ✅ Restaurant → Accès complet
  - Gestion commandes
  - Gestion menu
  - Gestion tables
  - Rapports restaurant
- ✅ Staff → Voir staff restaurant uniquement
- ✅ Payments → Vue restaurant
- ✅ Reports → Rapports restaurant
- ✅ Notifications
- ✅ Profile

**Sidebar**:
- 📊 Dashboard
- 🍽️ Restaurant
- 👥 Staff (restaurant only)
- 💳 Payments
- 📈 Reports
- 🔔 Notifications
- 👤 Profile

**Dashboard Cards**:
- Revenus du jour/mois
- Commandes totales
- Staff actif
- Tables occupées
- Statistiques menu (plats populaires)

---

### 4. Restaurant Chef (Chef) 👨‍🍳

**Accès**:
- ✅ Dashboard → Statistiques cuisine
- ✅ Restaurant → Vue cuisine
  - Voir commandes en attente (à préparer)
  - Marquer plats prêts
  - Gérer statuts préparation
- ✅ Notifications (commandes prioritaires)
- ✅ Profile

**Sidebar**:
- 📊 Dashboard
- 🍽️ Restaurant (vue cuisine)
- 🔔 Notifications
- 👤 Profile

**Dashboard Cards**:
- Commandes en préparation
- Commandes en attente
- Plats servis aujourd'hui
- Temps moyen de préparation

---

## 📁 FICHIERS À MODIFIER

### 1. Permissions (`client/src/utils/permissions.ts`)
```typescript
// Ajouter les 4 nouveaux rôles
const RESTAURANT_ROLES = [
  'restaurant_server',
  'restaurant_cashier', 
  'restaurant_manager',
  'restaurant_chef'
];

// Fonction: hasRestaurantAccess()
// Fonction: canViewRestaurantDashboard()
// Fonction: canManageOrders()
// Fonction: canProcessPayments()
// etc.
```

### 2. Sidebar (`client/src/components/layout/Sidebar.tsx`)
```typescript
// Filtrer les menus selon le rôle
const getMenuItems = (role) => {
  if (role === 'restaurant_server') return [...];
  if (role === 'restaurant_cashier') return [...];
  if (role === 'restaurant_manager') return [...];
  if (role === 'restaurant_chef') return [...];
  // ... autres rôles
};
```

### 3. Dashboard (`client/src/pages/Dashboard.tsx`)
```typescript
// Créer des dashboards spécifiques
const RestaurantServerDashboard = () => { ... };
const RestaurantCashierDashboard = () => { ... };
const RestaurantManagerDashboard = () => { ... };
const RestaurantChefDashboard = () => { ... };

// Dans le composant principal
if (role === 'restaurant_server') return <RestaurantServerDashboard />;
```

### 4. Routes protégées (`client/src/App.tsx`)
```typescript
// Ajouter les protections
<ProtectedRoute 
  path="/restaurant" 
  allowedRoles={['admin', 'manager', ...RESTAURANT_ROLES]}
/>
```

### 5. Restaurant Page (`client/src/pages/Restaurant.tsx`)
```typescript
// Adapter la vue selon le rôle
if (role === 'restaurant_server') {
  // Vue serveur : prendre commandes, voir tables
}
if (role === 'restaurant_cashier') {
  // Vue caissier : paiements
}
if (role === 'restaurant_chef') {
  // Vue chef : cuisine, préparation
}
```

---

## 🔧 BACKEND (Si nécessaire)

### API Endpoints à vérifier
- `GET /restaurant/orders` → Filtrer selon rôle
- `GET /dashboard/stats` → Retourner stats selon rôle
- `GET /users` (Staff) → Filtrer restaurant staff pour manager

---

## 🚀 PLAN D'IMPLÉMENTATION

### Phase 1 : Permissions (30 min)
1. Modifier `permissions.ts`
2. Ajouter fonctions de vérification pour restaurant
3. Tester les permissions

### Phase 2 : Sidebar (20 min)
4. Modifier `Sidebar.tsx`
5. Créer menus spécifiques par rôle
6. Tester affichage sidebar

### Phase 3 : Dashboard (60 min)
7. Créer composants dashboard restaurant
8. Intégrer dans `Dashboard.tsx`
9. Ajouter les cartes statistiques

### Phase 4 : Restaurant Page (40 min)
10. Adapter la vue selon rôle
11. Filtrer actions disponibles
12. Tester chaque vue

### Phase 5 : Routes & Protection (15 min)
13. Vérifier routes protégées
14. Tester accès

### Phase 6 : Tests (30 min)
15. Créer 4 utilisateurs test
16. Se connecter avec chaque rôle
17. Vérifier dashboard et sidebar

**TOTAL ESTIMÉ** : 3-4 heures

---

## 📊 MATRICE DES PERMISSIONS

| Module | Server | Cashier | Manager | Chef |
|--------|--------|---------|---------|------|
| **Dashboard** | Serveur | Caisse | Complet | Cuisine |
| **Restaurant** | Commandes | Paiements | Complet | Cuisine |
| **Staff** | ❌ | ❌ | ✅ (resto) | ❌ |
| **Payments** | ❌ | ✅ (resto) | ✅ (resto) | ❌ |
| **Reports** | ❌ | ❌ | ✅ (resto) | ❌ |
| **Notifications** | ✅ | ✅ | ✅ | ✅ |
| **Profile** | ✅ | ✅ | ✅ | ✅ |

---

## 🎯 QUESTIONS POUR VOUS

1. **Dashboard** : Voulez-vous que je crée des dashboards complètement différents ou adapter le dashboard existant ?

2. **Restaurant Manager** : Doit-il voir TOUT le staff ou seulement le staff restaurant ?

3. **Paiements** : Le caissier doit-il voir tous les paiements (hôtel + restaurant) ou seulement restaurant ?

4. **Chef** : Doit-il pouvoir modifier le menu ou seulement voir les commandes ?

5. **Ordre de priorité** : Quel rôle voulez-vous que je fasse en premier ?

---

## 🚀 PROCHAINES ÉTAPES

**Option A** : Je commence maintenant (Phase 1 : Permissions)
**Option B** : Vous répondez aux questions d'abord
**Option C** : On teste d'abord le changement de mot de passe et la création de staff

**Que préférez-vous ?**

