# 📊 MATRICE DES RÔLES ET PERMISSIONS - RBAC

## 🎯 LÉGENDE

- ✅ Permission accordée
- ❌ Permission refusée
- 🔸 Permission partielle (lecture seule)

---

## 📋 TABLEAU RÉCAPITULATIF DES RÔLES

| # | Rôle | Code | Niveau | Utilisateurs |
|---|------|------|--------|--------------|
| 1 | Super Administrateur | `super_admin` | 0 | Admin système |
| 2 | Directeur Hôtel | `hotel_manager` | 1 | Direction |
| 3 | Responsable Réception | `front_desk_manager` | 2 | Manager réception |
| 4 | Réceptionniste | `receptionist` | 3 | Staff réception |
| 5 | Responsable Restaurant | `restaurant_manager` | 2 | Manager restaurant |
| 6 | Serveur Restaurant | `waiter` | 3 | Staff restaurant |
| 7 | Caissier Restaurant | `restaurant_cashier` | 3 | Caisse restaurant |
| 8 | Responsable Spa | `spa_manager` | 2 | Manager spa |
| 9 | Réception Spa | `spa_receptionist` | 3 | Accueil spa |
| 10 | Thérapeute | `therapist` | 3 | Praticiens spa |
| 11 | Responsable Boutique | `shop_manager` | 2 | Manager boutique |
| 12 | Caissier Boutique | `shop_cashier` | 3 | Caisse boutique |
| 13 | Responsable Housekeeping | `housekeeping_manager` | 2 | Manager ménage |
| 14 | Agent Housekeeping | `housekeeper` | 3 | Agent ménage |
| 15 | Comptable | `accountant` | 2 | Comptabilité |
| 16 | Client Hôtel | `guest` | 10 | Clients |

---

## 🔐 MATRICE DES PERMISSIONS PAR MODULE

### MODULE RÉSERVATIONS

| Permission | Super Admin | Directeur | Resp. Réception | Réceptionniste | Client |
|------------|-------------|-----------|-----------------|----------------|--------|
| reservation.create | ✅ | ✅ | ✅ | ✅ | ❌ |
| reservation.read | ✅ | ✅ | ✅ | ✅ | 🔸 (ses réservations) |
| reservation.update | ✅ | ✅ | ✅ | ✅ | 🔸 (avant check-in) |
| reservation.delete | ✅ | ✅ | ✅ | ❌ | ❌ |
| reservation.cancel | ✅ | ✅ | ✅ | ✅ | 🔸 (ses réservations) |
| reservation.confirm | ✅ | ✅ | ✅ | ✅ | ❌ |
| reservation.checkin | ✅ | ✅ | ✅ | ✅ | ❌ |
| reservation.checkout | ✅ | ✅ | ✅ | ✅ | ❌ |
| reservation.change_rate | ✅ | ✅ | ✅ | ❌ | ❌ |

### MODULE CHAMBRES

| Permission | Super Admin | Directeur | Resp. Réception | Réceptionniste | Resp. Housekeeping | Agent Housekeeping |
|------------|-------------|-----------|-----------------|----------------|--------------------|--------------------|
| room.create | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| room.read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| room.update | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| room.delete | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| room.assign | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| room.change_status | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| room.maintenance | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| room.clean | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| room.inspect | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |

### MODULE PAIEMENTS

| Permission | Super Admin | Directeur | Réceptionniste | Caissier Restaurant | Comptable |
|------------|-------------|-----------|----------------|---------------------|-----------|
| payment.create | ✅ | ✅ | ✅ | ✅ | ✅ |
| payment.read | ✅ | ✅ | ✅ | ✅ | ✅ |
| payment.update | ✅ | ✅ | ✅ | ❌ | ✅ |
| payment.delete | ✅ | ✅ | ❌ | ❌ | ✅ |
| payment.refund | ✅ | ✅ | ❌ | ❌ | ✅ |
| payment.validate | ✅ | ✅ | ✅ | ✅ | ✅ |
| payment.cancel | ✅ | ✅ | ❌ | ❌ | ✅ |


### MODULE RESTAURANT

| Permission | Super Admin | Directeur | Resp. Restaurant | Serveur | Caissier Restaurant | Client |
|------------|-------------|-----------|------------------|---------|---------------------|--------|
| restaurant.order.create | ✅ | ✅ | ✅ | ✅ | ✅ | 🔸 (portail) |
| restaurant.order.read | ✅ | ✅ | ✅ | ✅ | ✅ | 🔸 (ses commandes) |
| restaurant.order.update | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| restaurant.order.cancel | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| restaurant.payment.create | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| restaurant.report.read | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| restaurant.menu.manage | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| restaurant.table.manage | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

### MODULE SPA

| Permission | Super Admin | Directeur | Resp. Spa | Réception Spa | Thérapeute | Client |
|------------|-------------|-----------|-----------|---------------|------------|--------|
| spa.booking.create | ✅ | ✅ | ✅ | ✅ | ❌ | 🔸 (portail) |
| spa.booking.read | ✅ | ✅ | ✅ | ✅ | 🔸 (ses RDV) | 🔸 (ses RDV) |
| spa.booking.update | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| spa.booking.cancel | ✅ | ✅ | ✅ | ✅ | ❌ | 🔸 (ses RDV) |
| spa.service.manage | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| spa.therapist.manage | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| spa.report.read | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| spa.payment.create | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

### MODULE HOUSEKEEPING

| Permission | Super Admin | Directeur | Resp. Housekeeping | Agent Housekeeping |
|------------|-------------|-----------|--------------------|--------------------|
| housekeeping.task.read | ✅ | ✅ | ✅ | ✅ |
| housekeeping.task.create | ✅ | ✅ | ✅ | ❌ |
| housekeeping.task.assign | ✅ | ✅ | ✅ | ❌ |
| housekeeping.task.complete | ✅ | ✅ | ✅ | ✅ |
| housekeeping.report.read | ✅ | ✅ | ✅ | ❌ |

### MODULE RAPPORTS

| Permission | Super Admin | Directeur | Comptable | Managers | Staff |
|------------|-------------|-----------|-----------|----------|-------|
| report.read | ✅ | ✅ | ✅ | 🔸 (leur module) | ❌ |
| report.export | ✅ | ✅ | ✅ | ❌ | ❌ |
| report.financial | ✅ | ✅ | ✅ | ❌ | ❌ |
| report.occupancy | ✅ | ✅ | ✅ | 🔸 (réception) | ❌ |
| report.revenue | ✅ | ✅ | ✅ | ❌ | ❌ |

### MODULE UTILISATEURS

| Permission | Super Admin | Directeur | Managers |
|------------|-------------|-----------|----------|
| user.create | ✅ | ✅ | ❌ |
| user.read | ✅ | ✅ | 🔸 (leur équipe) |
| user.update | ✅ | ✅ | ❌ |
| user.delete | ✅ | ✅ | ❌ |
| user.role.manage | ✅ | ✅ | ❌ |
| user.password.reset | ✅ | ✅ | ❌ |

### MODULE PARAMÈTRES

| Permission | Super Admin | Directeur |
|------------|-------------|-----------|
| settings.manage | ✅ | ✅ |
| settings.hotel.manage | ✅ | ✅ |
| settings.room_type.manage | ✅ | ✅ |
| settings.rate.manage | ✅ | ✅ |
| settings.tax.manage | ✅ | ✅ |

---

## 📝 RÉSUMÉ PAR RÔLE

### 1. SUPER ADMINISTRATEUR
- **Permissions** : 100% (toutes)
- **Modules** : Tous
- **Restrictions** : Aucune

### 2. DIRECTEUR HÔTEL
- **Permissions** : ~95%
- **Modules** : Tous sauf gestion système
- **Restrictions** : Ne peut pas modifier les rôles système

### 3. RESPONSABLE RÉCEPTION
- **Permissions** : ~60%
- **Modules** : Réservations, Chambres, Clients, Paiements, Folio
- **Restrictions** : Pas d'accès aux autres départements

### 4. RÉCEPTIONNISTE
- **Permissions** : ~40%
- **Modules** : Réservations, Chambres (lecture), Clients
- **Restrictions** : Pas de suppression, pas de modification de tarifs

### 5. RESPONSABLE RESTAURANT
- **Permissions** : ~50% (restaurant uniquement)
- **Modules** : Restaurant complet
- **Restrictions** : Accès limité au module restaurant

### 6. SERVEUR RESTAURANT
- **Permissions** : ~25% (restaurant uniquement)
- **Modules** : Commandes restaurant
- **Restrictions** : Pas d'accès paiements ni rapports

### 7. CAISSIER RESTAURANT
- **Permissions** : ~30% (restaurant uniquement)
- **Modules** : Commandes et paiements restaurant
- **Restrictions** : Pas de gestion menu ni rapports

### 8. RESPONSABLE SPA
- **Permissions** : ~50% (spa uniquement)
- **Modules** : Spa complet
- **Restrictions** : Accès limité au module spa

### 9. RÉCEPTION SPA
- **Permissions** : ~30% (spa uniquement)
- **Modules** : Réservations spa
- **Restrictions** : Pas de gestion services ni thérapeutes

### 10. THÉRAPEUTE
- **Permissions** : ~15% (spa uniquement)
- **Modules** : Consultation de ses rendez-vous
- **Restrictions** : Lecture seule de ses RDV

### 11. RESPONSABLE BOUTIQUE
- **Permissions** : ~45% (boutique uniquement)
- **Modules** : Boutique complet
- **Restrictions** : Accès limité au module boutique

### 12. CAISSIER BOUTIQUE
- **Permissions** : ~25% (boutique uniquement)
- **Modules** : Ventes boutique
- **Restrictions** : Pas de gestion stock ni produits

### 13. RESPONSABLE HOUSEKEEPING
- **Permissions** : ~40% (housekeeping + chambres)
- **Modules** : Housekeeping, Statuts chambres
- **Restrictions** : Pas d'accès réservations

### 14. AGENT HOUSEKEEPING
- **Permissions** : ~20% (housekeeping uniquement)
- **Modules** : Tâches de nettoyage
- **Restrictions** : Exécution uniquement, pas de gestion

### 15. COMPTABLE
- **Permissions** : ~55% (finance uniquement)
- **Modules** : Paiements, Rapports financiers, Folio
- **Restrictions** : Pas d'accès opérationnel

### 16. CLIENT HÔTEL
- **Permissions** : ~10% (portail client)
- **Modules** : Portail client uniquement
- **Restrictions** : Accès limité à ses propres données

---

## 🔒 RÈGLES DE SÉCURITÉ

### Hiérarchie des Rôles

```
Niveau 0: Super Admin (accès total)
Niveau 1: Directeur (accès management)
Niveau 2: Managers (accès département)
Niveau 3: Staff (accès opérationnel)
Niveau 10: Clients (accès portail)
```

### Principes de Sécurité

1. **Principe du moindre privilège** : Chaque rôle a uniquement les permissions nécessaires
2. **Séparation des tâches** : Les rôles critiques sont séparés (ex: caissier ≠ comptable)
3. **Audit complet** : Toutes les actions sont loguées
4. **Expiration des sessions** : Sessions limitées dans le temps
5. **Validation multi-niveaux** : Actions critiques nécessitent validation supérieure

---

## 📊 STATISTIQUES

- **Total rôles** : 16
- **Total permissions** : ~80
- **Modules couverts** : 12
- **Niveaux hiérarchiques** : 5
