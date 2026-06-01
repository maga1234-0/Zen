# 🔌 EXEMPLES D'API REST - SYSTÈME RBAC

## 📋 TABLE DES MATIÈRES

1. [Authentification](#authentification)
2. [Gestion des Rôles](#gestion-des-rôles)
3. [Gestion des Permissions](#gestion-des-permissions)
4. [Attribution des Rôles](#attribution-des-rôles)
5. [Vérification des Permissions](#vérification-des-permissions)
6. [Logs d'Accès](#logs-daccès)
7. [Exemples par Module](#exemples-par-module)

---

## 🔐 AUTHENTIFICATION

Toutes les requêtes nécessitent un token JWT dans le header :

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 👥 GESTION DES RÔLES

### 1. Récupérer tous les rôles

```http
GET /api/rbac/roles
Authorization: Bearer {token}
```

**Réponse** :
```json
[
  {
    "id": "uuid-1",
    "name": "Super Administrateur",
    "code": "super_admin",
    "description": "Accès complet à tous les modules",
    "level": 0,
    "is_active": true
  },
  {
    "id": "uuid-2",
    "name": "Directeur Hôtel",
    "code": "hotel_manager",
    "description": "Gestion complète de l'hôtel",
    "level": 1,
    "is_active": true
  }
]
```

### 2. Récupérer un rôle par ID

```http
GET /api/rbac/roles/{roleId}
Authorization: Bearer {token}
```

**Réponse** :
```json
{
  "id": "uuid-1",
  "name": "Réceptionniste",
  "code": "receptionist",
  "description": "Opérations quotidiennes de réception",
  "level": 3,
  "is_active": true,
  "permissions": [
    {
      "id": "perm-1",
      "code": "reservation.create",
      "name": "Créer réservation"
    },
    {
      "id": "perm-2",
      "code": "reservation.read",
      "name": "Voir réservations"
    }
  ]
}
```

### 3. Créer un nouveau rôle

```http
POST /api/rbac/roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Manager Événements",
  "code": "event_manager",
  "description": "Gestion des événements et conférences",
  "level": 2
}
```

**Réponse** :
```json
{
  "id": "uuid-new",
  "name": "Manager Événements",
  "code": "event_manager",
  "description": "Gestion des événements et conférences",
  "level": 2,
  "is_active": true,
  "created_at": "2026-05-31T10:00:00Z"
}
```

### 4. Mettre à jour un rôle

```http
PUT /api/rbac/roles/{roleId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Manager Événements Senior",
  "description": "Gestion avancée des événements",
  "level": 2,
  "is_active": true
}
```

---

## 🔑 GESTION DES PERMISSIONS

### 1. Récupérer toutes les permissions

```http
GET /api/rbac/permissions
Authorization: Bearer {token}
```

**Réponse** :
```json
[
  {
    "id": "perm-1",
    "name": "Créer réservation",
    "code": "reservation.create",
    "module": "reservation",
    "action": "create",
    "description": "Créer une nouvelle réservation"
  },
  {
    "id": "perm-2",
    "name": "Voir réservations",
    "code": "reservation.read",
    "module": "reservation",
    "action": "read",
    "description": "Consulter les réservations"
  }
]
```

### 2. Récupérer les permissions par module

```http
GET /api/rbac/permissions?module=reservation
Authorization: Bearer {token}
```

**Réponse** :
```json
[
  {
    "id": "perm-1",
    "code": "reservation.create",
    "name": "Créer réservation",
    "module": "reservation",
    "action": "create"
  },
  {
    "id": "perm-2",
    "code": "reservation.read",
    "name": "Voir réservations",
    "module": "reservation",
    "action": "read"
  }
]
```

### 3. Récupérer les permissions groupées par module

```http
GET /api/rbac/permissions/by-module
Authorization: Bearer {token}
```

**Réponse** :
```json
[
  {
    "module": "reservation",
    "permissions": [
      {
        "id": "perm-1",
        "code": "reservation.create",
        "name": "Créer réservation",
        "action": "create"
      },
      {
        "id": "perm-2",
        "code": "reservation.read",
        "name": "Voir réservations",
        "action": "read"
      }
    ]
  },
  {
    "module": "room",
    "permissions": [...]
  }
]
```

---

## 🎭 ATTRIBUTION DES RÔLES

### 1. Assigner un rôle à un utilisateur

```http
POST /api/rbac/users/roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user-uuid-123",
  "roleId": "role-uuid-456"
}
```

**Avec expiration** :
```json
{
  "userId": "user-uuid-123",
  "roleId": "role-uuid-456",
  "expiresAt": "2026-12-31T23:59:59Z"
}
```

**Réponse** :
```json
{
  "id": "assignment-uuid",
  "user_id": "user-uuid-123",
  "role_id": "role-uuid-456",
  "assigned_at": "2026-05-31T10:00:00Z",
  "expires_at": "2026-12-31T23:59:59Z",
  "is_active": true
}
```

### 2. Retirer un rôle à un utilisateur

```http
DELETE /api/rbac/users/{userId}/roles/{roleId}
Authorization: Bearer {token}
```

**Réponse** :
```json
{
  "message": "Rôle retiré avec succès"
}
```

### 3. Récupérer les rôles d'un utilisateur

```http
GET /api/rbac/users/{userId}/roles
Authorization: Bearer {token}
```

**Réponse** :
```json
[
  {
    "id": "role-uuid-1",
    "name": "Réceptionniste",
    "code": "receptionist",
    "level": 3,
    "assigned_at": "2026-01-15T08:00:00Z",
    "expires_at": null,
    "is_active": true
  },
  {
    "id": "role-uuid-2",
    "name": "Caissier Restaurant",
    "code": "restaurant_cashier",
    "level": 3,
    "assigned_at": "2026-03-01T09:00:00Z",
    "expires_at": "2026-12-31T23:59:59Z",
    "is_active": true
  }
]
```

### 4. Assigner des permissions à un rôle

```http
POST /api/rbac/roles/{roleId}/permissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "permissionIds": [
    "perm-uuid-1",
    "perm-uuid-2",
    "perm-uuid-3"
  ]
}
```

**Réponse** :
```json
{
  "message": "Permissions mises à jour avec succès"
}
```

### 5. Récupérer les permissions d'un rôle

```http
GET /api/rbac/roles/{roleId}/permissions
Authorization: Bearer {token}
```

**Réponse** :
```json
[
  {
    "id": "perm-1",
    "code": "reservation.create",
    "name": "Créer réservation",
    "module": "reservation",
    "action": "create"
  },
  {
    "id": "perm-2",
    "code": "reservation.read",
    "name": "Voir réservations",
    "module": "reservation",
    "action": "read"
  }
]
```

---

## ✅ VÉRIFICATION DES PERMISSIONS

### 1. Récupérer mes permissions

```http
GET /api/rbac/me/permissions
Authorization: Bearer {token}
```

**Réponse** :
```json
{
  "permissions": [
    "reservation.create",
    "reservation.read",
    "reservation.update",
    "reservation.checkin",
    "reservation.checkout",
    "room.read",
    "room.assign",
    "guest.create",
    "guest.read",
    "guest.update",
    "payment.create",
    "payment.read"
  ]
}
```

### 2. Vérifier une permission spécifique

```http
GET /api/rbac/me/permissions/reservation.create
Authorization: Bearer {token}
```

**Réponse** :
```json
{
  "permission": "reservation.create",
  "hasPermission": true
}
```

**Si non autorisé** :
```json
{
  "permission": "user.delete",
  "hasPermission": false
}
```

---

## 📊 LOGS D'ACCÈS

### 1. Récupérer tous les logs

```http
GET /api/rbac/access-logs?limit=100
Authorization: Bearer {token}
```

**Réponse** :
```json
[
  {
    "id": "log-uuid-1",
    "user_id": "user-uuid-123",
    "user_email": "receptionist@hotel.com",
    "permission_code": "reservation.create",
    "action": "POST",
    "status": "success",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0...",
    "created_at": "2026-05-31T10:15:30Z"
  },
  {
    "id": "log-uuid-2",
    "user_id": "user-uuid-456",
    "user_email": "waiter@hotel.com",
    "permission_code": "user.delete",
    "action": "DELETE",
    "status": "denied",
    "ip_address": "192.168.1.101",
    "created_at": "2026-05-31T10:20:15Z"
  }
]
```

### 2. Filtrer les logs par utilisateur

```http
GET /api/rbac/access-logs?userId={userId}&limit=50
Authorization: Bearer {token}
```

### 3. Filtrer les logs par statut

```http
GET /api/rbac/access-logs?status=denied&limit=100
Authorization: Bearer {token}
```

### 4. Filtrer les logs par période

```http
GET /api/rbac/access-logs?startDate=2026-05-01&endDate=2026-05-31&limit=200
Authorization: Bearer {token}
```

---

## 🎯 EXEMPLES PAR MODULE

### MODULE RÉSERVATIONS

#### Créer une réservation (nécessite `reservation.create`)

```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "guestId": "guest-uuid",
  "roomTypeId": "room-type-uuid",
  "checkInDate": "2026-06-15",
  "checkOutDate": "2026-06-20",
  "adults": 2,
  "children": 0
}
```

**Si permission refusée** :
```json
{
  "message": "Accès refusé",
  "required_permission": "reservation.create"
}
```

#### Check-in (nécessite `reservation.checkin`)

```http
POST /api/bookings/{bookingId}/checkin
Authorization: Bearer {token}
Content-Type: application/json

{
  "roomId": "room-uuid",
  "actualCheckInTime": "2026-06-15T14:00:00Z"
}
```

---

### MODULE CHAMBRES

#### Changer le statut d'une chambre (nécessite `room.change_status`)

```http
PUT /api/rooms/{roomId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "dirty"
}
```

#### Marquer une chambre comme nettoyée (nécessite `room.clean`)

```http
POST /api/rooms/{roomId}/clean
Authorization: Bearer {token}
Content-Type: application/json

{
  "cleanedBy": "housekeeper-uuid",
  "notes": "Nettoyage complet effectué"
}
```

---

### MODULE PAIEMENTS

#### Créer un paiement (nécessite `payment.create`)

```http
POST /api/payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": "booking-uuid",
  "amount": 250.00,
  "method": "credit_card",
  "reference": "TXN123456"
}
```

#### Effectuer un remboursement (nécessite `payment.refund`)

```http
POST /api/payments/{paymentId}/refund
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 100.00,
  "reason": "Annulation de réservation"
}
```

---

### MODULE RESTAURANT

#### Créer une commande (nécessite `restaurant.order.create`)

```http
POST /api/restaurant/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "tableId": "table-uuid",
  "items": [
    {
      "menuItemId": "item-uuid-1",
      "quantity": 2
    },
    {
      "menuItemId": "item-uuid-2",
      "quantity": 1
    }
  ]
}
```

#### Consulter les rapports (nécessite `restaurant.report.read`)

```http
GET /api/restaurant/reports?startDate=2026-05-01&endDate=2026-05-31
Authorization: Bearer {token}
```

---

### MODULE SPA

#### Créer une réservation spa (nécessite `spa.booking.create`)

```http
POST /api/spa/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "guestId": "guest-uuid",
  "serviceId": "service-uuid",
  "therapistId": "therapist-uuid",
  "bookingDate": "2026-06-10",
  "startTime": "14:00"
}
```

#### Gérer les services (nécessite `spa.service.manage`)

```http
PUT /api/spa/services/{serviceId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Massage Relaxant 90min",
  "duration": 90,
  "price": 120.00
}
```

---

## 🚫 GESTION DES ERREURS

### Erreur 401 - Non authentifié

```json
{
  "message": "Non authentifié"
}
```

**Cause** : Token manquant ou invalide

### Erreur 403 - Permission refusée

```json
{
  "message": "Accès refusé",
  "required_permission": "reservation.delete"
}
```

**Cause** : L'utilisateur n'a pas la permission requise

### Erreur 403 - Rôle insuffisant

```json
{
  "message": "Rôle insuffisant",
  "required_roles": ["super_admin", "hotel_manager"]
}
```

**Cause** : L'utilisateur n'a pas le bon rôle

### Erreur 404 - Ressource non trouvée

```json
{
  "message": "Rôle non trouvé"
}
```

### Erreur 500 - Erreur serveur

```json
{
  "message": "Erreur serveur"
}
```

---

## 📝 NOTES IMPORTANTES

1. **Toutes les routes nécessitent une authentification** via JWT
2. **Les permissions sont vérifiées automatiquement** par le middleware
3. **Les accès sont loggés automatiquement** (succès et refus)
4. **Les rôles système ne peuvent pas être modifiés** (`is_system_role = true`)
5. **Les permissions sont cumulatives** : un utilisateur avec plusieurs rôles a toutes leurs permissions

---

## 🔗 RESSOURCES

- **Guide d'installation** : `RBAC_INSTALLATION_GUIDE.md`
- **Matrice des permissions** : `RBAC_ROLES_MATRIX.md`
- **Documentation complète** : `RBAC_COMPLETE_DOCUMENTATION.md`
