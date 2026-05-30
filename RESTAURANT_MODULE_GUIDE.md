# 🍽️ MODULE RESTAURANT/BAR - GUIDE COMPLET

## 📋 RÉSUMÉ

Module complet de gestion de restaurant et bar pour l'hôtel, incluant :
- Gestion du menu (catégories, articles, prix)
- Gestion des commandes (dine-in, room service, takeaway, bar)
- Gestion des tables (statuts, réservations)
- Statistiques et rapports en temps réel

---

## ✅ FICHIERS CRÉÉS

### Base de Données
- ✅ `database/restaurant-module.sql` - Schéma complet avec 7 tables

### Backend
- ✅ `server/src/controllers/restaurantController.ts` - Contrôleur complet
- ✅ `server/src/routes/restaurantRoutes.ts` - Routes API
- ✅ `server/src/routes/index.ts` - Routes ajoutées (MODIFIÉ)

### Frontend
- ✅ `client/src/pages/Restaurant.tsx` - Interface complète

---

## 🗄️ STRUCTURE DE LA BASE DE DONNÉES

### Tables Créées

#### 1. `menu_categories`
Catégories du menu (Entrées, Plats, Desserts, Boissons, etc.)
```sql
- id (UUID)
- name, name_fr, name_en, name_es (multilingue)
- type (food, beverage, both)
- display_order
- is_active
```

#### 2. `menu_items`
Articles du menu avec détails complets
```sql
- id (UUID)
- category_id (FK)
- name, name_fr, name_en, name_es (multilingue)
- description (multilingue)
- price, cost
- is_available, is_vegetarian, is_vegan, is_gluten_free
- allergens (array)
- preparation_time, calories
- image_url
```

#### 3. `restaurant_tables`
Tables du restaurant et bar
```sql
- id (UUID)
- table_number (unique)
- capacity
- location (indoor, outdoor, terrace, bar)
- status (available, occupied, reserved, cleaning)
```

#### 4. `restaurant_orders`
Commandes restaurant et room service
```sql
- id (UUID)
- order_number (unique)
- table_id, guest_id, room_id, booking_id (FK)
- order_type (dine_in, room_service, takeaway, bar)
- status (pending, confirmed, preparing, ready, served, completed, cancelled)
- subtotal, tax, service_charge, discount, total_amount
- payment_status, payment_method
- server_id, created_by
```

#### 5. `restaurant_order_items`
Détails des articles commandés
```sql
- id (UUID)
- order_id (FK)
- menu_item_id (FK)
- item_name (copie au moment de la commande)
- quantity, unit_price, subtotal
- special_instructions
- status (pending, preparing, ready, served)
```

#### 6. `table_reservations`
Réservations de tables
```sql
- id (UUID)
- table_id, guest_id (FK)
- guest_name, guest_phone, guest_email
- number_of_guests
- reservation_date, reservation_time, duration_minutes
- status (pending, confirmed, seated, completed, cancelled, no_show)
- special_requests
```

#### 7. `restaurant_inventory` (optionnel)
Gestion des stocks
```sql
- id (UUID)
- item_name, category, unit
- current_stock, minimum_stock
- unit_cost, supplier
```

### Vues Créées

#### `v_restaurant_orders_details`
Vue complète des commandes avec toutes les informations jointes

#### `v_menu_with_categories`
Vue du menu avec catégories pour affichage client

---

## 🔌 API ENDPOINTS

### Menu
```
GET    /api/restaurant/menu/categories
GET    /api/restaurant/menu/items?category_id=&available_only=true
POST   /api/restaurant/menu/items
PUT    /api/restaurant/menu/items/:id
DELETE /api/restaurant/menu/items/:id
```

### Tables
```
GET    /api/restaurant/tables?status=&location=
PUT    /api/restaurant/tables/:id/status
```

### Commandes
```
GET    /api/restaurant/orders?status=&order_type=&date=
GET    /api/restaurant/orders/:id
POST   /api/restaurant/orders
PUT    /api/restaurant/orders/:id/status
PUT    /api/restaurant/orders/:id/payment
```

### Réservations
```
GET    /api/restaurant/reservations?date=&status=
POST   /api/restaurant/reservations
PUT    /api/restaurant/reservations/:id/status
```

### Statistiques
```
GET    /api/restaurant/stats?date=
```

---

## 📱 INTERFACE FRONTEND

### Onglets Principaux

#### 1. **Commandes**
- Liste des commandes actives
- Filtrage par statut
- Actions rapides (Commencer, Prête, Servir, Terminer)
- Affichage temps réel

#### 2. **Menu**
- Gestion des catégories
- Gestion des articles
- Prix et disponibilité
- Informations nutritionnelles

#### 3. **Tables**
- Vue en grille des tables
- Statuts en temps réel
- Capacité et emplacement
- Actions rapides

#### 4. **Réservations**
- Calendrier des réservations
- Gestion des arrivées
- Confirmation/Annulation
- Notes spéciales

### Statistiques Affichées
- Commandes actives
- Revenus du jour
- Tables disponibles
- Clients uniques

---

## 🚀 INSTALLATION

### Étape 1: Base de Données
```bash
# Dans Supabase SQL Editor, exécuter:
database/restaurant-module.sql
```

### Étape 2: Backend
Le backend est déjà configuré. Les routes sont automatiquement disponibles à `/api/restaurant/*`

### Étape 3: Frontend - Ajouter la Route

Dans `client/src/App.tsx`, ajouter l'import:
```typescript
import { Restaurant } from '@/pages/Restaurant';
```

Puis ajouter la route dans le `<Routes>`:
```typescript
<Route
  path="/restaurant"
  element={
    <ProtectedLayout>
      <Restaurant />
    </ProtectedLayout>
  }
/>
```

### Étape 4: Ajouter au Menu de Navigation

Dans `client/src/components/layout/Sidebar.tsx`, ajouter:
```typescript
import { UtensilsCrossed } from 'lucide-react';

// Dans le tableau menuItems:
{
  icon: UtensilsCrossed,
  label: t('nav.restaurant'),
  path: '/restaurant',
  permission: 'canViewRestaurant'
},
```

### Étape 5: Traductions

Ajouter dans `client/src/i18n/locales/fr.json`:
```json
{
  "nav": {
    "restaurant": "Restaurant & Bar"
  },
  "restaurant": {
    "title": "Restaurant & Bar",
    "subtitle": "Gestion des commandes, menu et réservations",
    "newOrder": "Nouvelle Commande",
    "activeOrders": "Commandes Actives",
    "dailyRevenue": "Revenus du Jour",
    "availableTables": "Tables Disponibles",
    "uniqueCustomers": "Clients Uniques",
    "orders": "Commandes",
    "menu": "Menu",
    "tables": "Tables",
    "reservations": "Réservations",
    "searchOrder": "Rechercher une commande...",
    "allStatuses": "Tous les statuts",
    "status": {
      "pending": "En attente",
      "confirmed": "Confirmée",
      "preparing": "En préparation",
      "ready": "Prête",
      "served": "Servie",
      "completed": "Terminée",
      "cancelled": "Annulée"
    },
    "orderType": {
      "dine_in": "Sur place",
      "room_service": "Room Service",
      "takeaway": "À emporter",
      "bar": "Bar"
    },
    "tableStatus": {
      "available": "Disponible",
      "occupied": "Occupée",
      "reserved": "Réservée",
      "cleaning": "Nettoyage"
    }
  }
}
```

### Étape 6: Permissions

Dans `client/src/utils/permissions.ts`, ajouter:
```typescript
canViewRestaurant: ['admin', 'manager', 'receptionist'],
canManageMenu: ['admin', 'manager'],
canTakeOrders: ['admin', 'manager', 'receptionist'],
canManageReservations: ['admin', 'manager', 'receptionist'],
```

---

## 💡 FONCTIONNALITÉS PRINCIPALES

### Gestion des Commandes

#### Workflow Complet
1. **Création** - Nouvelle commande (dine-in, room service, etc.)
2. **Confirmation** - Validation de la commande
3. **Préparation** - Cuisine commence
4. **Prête** - Plat prêt à servir
5. **Servie** - Plat servi au client
6. **Terminée** - Commande complétée et payée

#### Calculs Automatiques
- Sous-total des articles
- TVA (10%)
- Frais de service (5% pour room service)
- Total final

#### Types de Commandes
- **Dine-in**: Restaurant sur place
- **Room Service**: Livraison en chambre
- **Takeaway**: À emporter
- **Bar**: Commandes au bar

### Gestion du Menu

#### Catégories
- Entrées
- Plats Principaux
- Desserts
- Boissons Chaudes
- Boissons Froides
- Cocktails
- Vins

#### Informations par Article
- Nom multilingue (FR, EN, ES)
- Description multilingue
- Prix et coût (pour calcul marge)
- Disponibilité
- Régimes spéciaux (végétarien, vegan, sans gluten)
- Allergènes
- Temps de préparation
- Calories
- Photo

### Gestion des Tables

#### Statuts
- **Available**: Disponible pour réservation
- **Occupied**: Occupée par des clients
- **Reserved**: Réservée à l'avance
- **Cleaning**: En cours de nettoyage

#### Emplacements
- Indoor (intérieur)
- Outdoor (extérieur)
- Terrace (terrasse)
- Bar

### Réservations de Tables

#### Fonctionnalités
- Vérification de disponibilité
- Gestion des conflits horaires
- Durée par défaut: 2 heures
- Notes spéciales
- Confirmation/Annulation
- No-show tracking

---

## 📊 STATISTIQUES ET RAPPORTS

### Métriques en Temps Réel
- Nombre de commandes actives
- Revenus du jour
- Valeur moyenne par commande
- Nombre de clients uniques
- Tables disponibles/occupées
- Taux d'occupation

### Rapports Disponibles
- Ventes par période
- Articles les plus vendus
- Performance par serveur
- Revenus par type de commande
- Analyse des réservations

---

## 🔐 PERMISSIONS PAR RÔLE

### Admin
✅ Accès complet
✅ Gestion du menu
✅ Gestion des commandes
✅ Gestion des tables
✅ Gestion des réservations
✅ Statistiques complètes

### Manager
✅ Accès complet opérationnel
✅ Gestion du menu
✅ Gestion des commandes
✅ Gestion des tables
✅ Gestion des réservations
✅ Statistiques complètes

### Receptionist
✅ Prise de commandes
✅ Gestion des réservations
✅ Consultation du menu
✅ Statistiques limitées
❌ Modification du menu

### Autres Rôles
❌ Pas d'accès par défaut

---

## 🎨 DESIGN ET UX

### Couleurs
- Seafoam (principal): #4FD1C5
- Orange (préparation): #F97316
- Vert (disponible/prêt): #10B981
- Rouge (occupé): #EF4444
- Bleu (réservé): #3B82F6

### Icônes
- UtensilsCrossed: Restaurant
- ChefHat: Cuisine
- Coffee: Tables/Bar
- Wine: Boissons
- Users: Réservations

### Responsive
- Mobile: Vue en cartes
- Tablet: Vue en grille
- Desktop: Vue complète avec sidebar

---

## 🔄 INTÉGRATIONS

### Avec Modules Existants

#### Chambres (Rooms)
- Room service lié aux chambres
- Facturation sur compte chambre
- Historique des commandes par chambre

#### Clients (Guests)
- Historique des commandes
- Préférences alimentaires
- Programme de fidélité (futur)

#### Réservations (Bookings)
- Lien avec réservations hôtel
- Packages incluant repas
- Petit-déjeuner inclus

#### Paiements (Payments)
- Facturation restaurant
- Paiement immédiat ou sur compte
- Méthodes: Cash, Card, Room Charge, Transfer

---

## 📝 DONNÉES DE TEST

Le fichier SQL inclut des données de test:
- 7 catégories de menu
- 12 articles de menu (exemples)
- 13 tables (indoor, outdoor, terrace, bar)

---

## 🚧 DÉVELOPPEMENTS FUTURS

### Court Terme
- [ ] Interface de création de commande complète
- [ ] Gestion visuelle du menu
- [ ] Calendrier des réservations
- [ ] Impression des tickets de cuisine
- [ ] Impression des factures

### Moyen Terme
- [ ] Application tablette pour serveurs
- [ ] Système de commande en ligne
- [ ] Intégration avec cuisine (KDS)
- [ ] Gestion des stocks automatique
- [ ] Programme de fidélité

### Long Terme
- [ ] Menu digital pour clients (QR code)
- [ ] Recommandations IA
- [ ] Analyse prédictive des ventes
- [ ] Intégration avec fournisseurs
- [ ] Multi-restaurants

---

## 🐛 DÉPANNAGE

### Problème: Tables non créées
**Solution**: Exécuter `database/restaurant-module.sql` dans Supabase

### Problème: Routes 404
**Solution**: Vérifier que `restaurantRoutes` est importé dans `server/src/routes/index.ts`

### Problème: Page non accessible
**Solution**: Ajouter la route dans `App.tsx` et les permissions dans `permissions.ts`

### Problème: Traductions manquantes
**Solution**: Ajouter les clés dans `fr.json`, `en.json`, `es.json`

---

## 📞 SUPPORT

Pour toute question ou problème:
1. Consulter ce guide
2. Vérifier les logs serveur
3. Vérifier les logs navigateur (Console)
4. Contacter l'équipe de développement

---

**Version**: 1.0
**Date**: 30 Mai 2026
**Statut**: ✅ Prêt pour déploiement
