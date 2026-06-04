# 🍽️ GUIDE COMPLET - RBAC RESTAURANT

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#vue-densemble)
2. [Décisions prises](#décisions-prises)
3. [Sidebar - Navigation](#sidebar---navigation)
4. [Dashboard - Cartes filtrées](#dashboard---cartes-filtrées)
5. [Restaurant.tsx - Vues par rôle](#restauranttsx---vues-par-rôle)
6. [Staff.tsx - Filtrage](#stafftsx---filtrage)
7. [Payments.tsx - Filtrage](#paymentstsx---filtrage)
8. [Déploiement](#déploiement)
9. [Tests](#tests)

---

## 📊 VUE D'ENSEMBLE

### Objectif
Créer des **dashboards et sidebars personnalisés** pour les 4 rôles restaurant.

### Rôles concernés
1. **restaurant_chef** (Chef) - PRIORITÉ 1
2. **restaurant_server** (Serveur)
3. **restaurant_cashier** (Caissier)
4. **restaurant_manager** (Manager Restaurant)

### Stratégie
- ✅ **Dashboard** : Adapter avec cartes filtrées (pas de dashboards séparés)
- ✅ **Sidebar** : Utiliser le système existant `canAccessRoute()` - DÉJÀ FAIT
- ✅ **Restaurant** : Vues conditionnelles selon rôle
- ✅ **Staff** : Filtrer pour manager restaurant
- ✅ **Payments** : Filtrer pour caissier

---

## ✅ DÉCISIONS PRISES

### 1. Dashboard
**Adapter l'existant** avec cartes filtrées selon le rôle.

### 2. Restaurant Manager - Staff
Voir **seulement staff restaurant** (pas hôtel).

### 3. Caissier - Paiements
Voir **seulement paiements restaurant** (pas hôtel).

### 4. Chef - Menu
Peut **voir commandes + marquer prêt + modifier menu**.



---

## 🎯 PARTIE 1 : SIDEBAR - NAVIGATION

### ✅ ÉTAT ACTUEL

Le **Sidebar** utilise déjà `canAccessRoute()` de `permissions.ts` pour filtrer les menus.

**Code actuel (lignes 87-90)** :
```typescript
const filteredSections = menuSections.map(section => ({
  ...section,
  items: section.items.filter(item => 
    user?.role ? canAccessRoute(user.role, item.path) : false
  ),
})).filter(section => section.items.length > 0);
```

### 🎨 RÉSULTAT PAR RÔLE

#### Chef (`restaurant_chef`)
**Permissions** : `dashboard.view`, `restaurant.view`, `notifications.view`

**Sidebar visible** :
- 📊 Dashboard
- 🍽️ Restaurant
- 🔔 Notifications
- ⚙️ Settings (si permission)

**Code** : ✅ **AUCUNE MODIFICATION NÉCESSAIRE** - Le filtrage fonctionne déjà !

---

#### Serveur (`restaurant_server`)
**Permissions** : `dashboard.view`, `restaurant.view`, `rooms.view`, `notifications.view`

**Sidebar visible** :
- 📊 Dashboard
- 🏨 Rooms (pour assigner aux chambres)
- 🍽️ Restaurant
- 🔔 Notifications

**Code** : ✅ **AUCUNE MODIFICATION NÉCESSAIRE**

---

#### Caissier (`restaurant_cashier`)
**Permissions** : `dashboard.view`, `restaurant.view`, `billing.view`, `notifications.view`

**Sidebar visible** :
- 📊 Dashboard
- 💳 Payments
- 🍽️ Restaurant
- 🔔 Notifications

**Code** : ✅ **AUCUNE MODIFICATION NÉCESSAIRE**

---

#### Manager Restaurant (`restaurant_manager`)
**Permissions** : `dashboard.view`, `restaurant.view`, `notifications.view`, `rooms.view`

**Sidebar visible** :
- 📊 Dashboard
- 🏨 Rooms (pour assigner aux chambres)
- 🍽️ Restaurant
- 🔔 Notifications
- 👥 Staff (avec filtrage, voir Partie 4)

**Code** : ✅ **AUCUNE MODIFICATION NÉCESSAIRE**

---

### 📝 CONCLUSION SIDEBAR

**✅ AUCUN CODE À CHANGER** - Le système actuel avec `canAccessRoute()` filtre déjà correctement !



---

## 📊 PARTIE 2 : DASHBOARD - CARTES FILTRÉES

### 🎯 STRATÉGIE

Au lieu de créer 4 dashboards séparés, nous **filtrons les cartes** selon le rôle.

### 📝 FONCTION HELPER

**Fichier** : `client/src/pages/Dashboard.tsx`

**Ajouter cette fonction helper** (après les imports, avant le composant Dashboard) :

```typescript
// Helper pour filtrer les cartes du dashboard selon le rôle
const getDashboardCards = (role: string) => {
  const isRestaurantRole = ['restaurant_chef', 'restaurant_server', 'restaurant_cashier', 'restaurant_manager'].includes(role);
  
  return {
    // Cartes communes à tous
    showNotifications: true,
    
    // Cartes hôtel (admin, manager, receptionist, etc.)
    showHotelStats: ['admin', 'manager', 'receptionist', 'accountant'].includes(role),
    showOccupancy: ['admin', 'manager', 'receptionist', 'housekeeping'].includes(role),
    showBookings: ['admin', 'manager', 'receptionist'].includes(role),
    showRevenue: ['admin', 'manager', 'accountant'].includes(role),
    showCheckIns: ['admin', 'manager', 'receptionist'].includes(role),
    showMaintenance: ['admin', 'manager', 'maintenance'].includes(role),
    showHousekeepingTasks: ['admin', 'manager', 'housekeeping'].includes(role),
    
    // Cartes restaurant
    showRestaurantStats: isRestaurantRole || ['admin', 'manager'].includes(role),
    
    // Cartes spécifiques par rôle restaurant
    showKitchenOrders: role === 'restaurant_chef',
    showServerTables: role === 'restaurant_server',
    showCashierPayments: role === 'restaurant_cashier',
    showManagerReports: role === 'restaurant_manager',
  };
};
```

### 📌 UTILISATION DANS LE COMPOSANT

Dans le composant `Dashboard`, utiliser la fonction :

```typescript
export const Dashboard = () => {
  const { user } = useAuthStore();
  const cards = getDashboardCards(user?.role || '');
  
  // ... reste du code
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {t('dashboard.title')}
        </h1>
        <p className="text-gray-500 dark:text-slate-300">
          {t('dashboard.welcome')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARTES HÔTEL - Afficher si showHotelStats */}
        {cards.showHotelStats && (
          <StatCard
            title={t('dashboard.totalBookings')}
            value={stats?.totalBookings || 0}
            icon={Calendar}
            trend={{ value: 12, isPositive: true }}
            color="blue"
          />
        )}
        
        {cards.showOccupancy && (
          <StatCard
            title={t('dashboard.occupancy')}
            value={`${stats?.occupancyRate || 0}%`}
            icon={Bed}
            trend={{ value: 5, isPositive: true }}
            color="green"
          />
        )}
        
        {cards.showRevenue && (
          <StatCard
            title={t('dashboard.revenue')}
            value={`$${stats?.revenue?.toLocaleString() || 0}`}
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
            color="purple"
          />
        )}
        
        {/* CARTES RESTAURANT - Afficher si showRestaurantStats */}
        {cards.showRestaurantStats && (
          <StatCard
            title="Commandes Restaurant"
            value={stats?.restaurantOrders || 0}
            icon={UtensilsCrossed}
            trend={{ value: 15, isPositive: true }}
            color="orange"
          />
        )}
        
        {/* CARTE CHEF - Commandes en préparation */}
        {cards.showKitchenOrders && (
          <StatCard
            title="En préparation"
            value={stats?.kitchenOrders || 0}
            icon={ChefHat}
            color="red"
          />
        )}
        
        {/* CARTE SERVEUR - Tables actives */}
        {cards.showServerTables && (
          <StatCard
            title="Tables actives"
            value={stats?.activeTables || 0}
            icon={Table}
            color="cyan"
          />
        )}
        
        {/* CARTE CAISSIER - Paiements du jour */}
        {cards.showCashierPayments && (
          <StatCard
            title="Encaissements"
            value={`$${stats?.todayPayments?.toLocaleString() || 0}`}
            icon={CreditCard}
            color="green"
          />
        )}
        
      </div>
      
      {/* ... reste des sections (charts, etc.) */}
      
    </div>
  );
};
```

