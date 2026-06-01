# 🎨 GUIDE VISUEL - SYSTÈME RBAC

## 🏗️ ARCHITECTURE GLOBALE

```
┌─────────────────────────────────────────────────────────────┐
│                    SYSTÈME RBAC PMS HÔTELIER                │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│ UTILISATEUR  │────────▶│     RÔLE     │────────▶│  PERMISSION  │
│              │  a un   │              │ contient│              │
│  - ID        │  ou     │  - Nom       │         │  - Code      │
│  - Email     │  plusieurs│  - Code    │         │  - Module    │
│  - Nom       │         │  - Niveau    │         │  - Action    │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                         │
       │                        │                         │
       ▼                        ▼                         ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│ user_roles   │         │role_permissions│        │ access_logs  │
│              │         │              │         │              │
│ - user_id    │         │ - role_id    │         │ - user_id    │
│ - role_id    │         │ - permission_id│       │ - permission │
│ - expires_at │         │ - granted_at │         │ - status     │
└──────────────┘         └──────────────┘         └──────────────┘
```

---

## 👥 HIÉRARCHIE DES RÔLES

```
Niveau 0 (Accès Total)
    │
    └─── 🔴 SUPER ADMINISTRATEUR
            │
            │
Niveau 1 (Management Global)
            │
            └─── 🟠 DIRECTEUR HÔTEL
                    │
                    │
Niveau 2 (Management Départemental)
                    │
                    ├─── 🟡 Responsable Réception
                    ├─── 🟡 Responsable Restaurant
                    ├─── 🟡 Responsable Spa
                    ├─── 🟡 Responsable Boutique
                    ├─── 🟡 Responsable Housekeeping
                    └─── 🟡 Comptable
                            │
                            │
Niveau 3 (Opérationnel)
                            │
                            ├─── 🟢 Réceptionniste
                            ├─── 🟢 Serveur Restaurant
                            ├─── 🟢 Caissier Restaurant
                            ├─── 🟢 Réception Spa
                            ├─── 🟢 Thérapeute
                            ├─── 🟢 Caissier Boutique
                            └─── 🟢 Agent Housekeeping
                                    │
                                    │
Niveau 10 (Client)
                                    │
                                    └─── 🔵 CLIENT HÔTEL
```

---

## 🔐 FLUX D'AUTORISATION

```
┌─────────────────────────────────────────────────────────────┐
│  1. REQUÊTE HTTP                                            │
│     POST /api/reservations                                  │
│     Authorization: Bearer {token}                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  2. MIDDLEWARE D'AUTHENTIFICATION                           │
│     - Vérifier le token JWT                                 │
│     - Extraire user.id                                      │
│     - Passer à la suite si valide                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  3. MIDDLEWARE RBAC                                         │
│     checkPermission('reservation.create')                   │
│                                                             │
│     a) Récupérer les rôles de l'utilisateur                │
│     b) Récupérer les permissions des rôles                 │
│     c) Vérifier si 'reservation.create' est présent        │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        ┌──────────────┐        ┌──────────────┐
        │  AUTORISÉ ✅ │        │  REFUSÉ ❌   │
        └──────────────┘        └──────────────┘
                │                       │
                ▼                       ▼
    ┌──────────────────┐    ┌──────────────────┐
    │ 4a. LOGGER       │    │ 4b. LOGGER       │
    │ status: success  │    │ status: denied   │
    └──────────────────┘    └──────────────────┘
                │                       │
                ▼                       ▼
    ┌──────────────────┐    ┌──────────────────┐
    │ 5a. EXÉCUTER     │    │ 5b. RETOURNER    │
    │ createReservation│    │ 403 Forbidden    │
    └──────────────────┘    └──────────────────┘
```

---

## 📊 MATRICE VISUELLE DES PERMISSIONS

### MODULE RÉSERVATIONS

```
┌────────────────────────────────────────────────────────────────┐
│ PERMISSION          │ Super │ Direct│ Resp. │ Récep │ Client  │
│                     │ Admin │  Hôtel│ Récep │       │         │
├────────────────────────────────────────────────────────────────┤
│ reservation.create  │  ✅   │  ✅   │  ✅   │  ✅   │   ❌    │
│ reservation.read    │  ✅   │  ✅   │  ✅   │  ✅   │   🔸    │
│ reservation.update  │  ✅   │  ✅   │  ✅   │  ✅   │   🔸    │
│ reservation.delete  │  ✅   │  ✅   │  ✅   │  ❌   │   ❌    │
│ reservation.cancel  │  ✅   │  ✅   │  ✅   │  ✅   │   🔸    │
│ reservation.checkin │  ✅   │  ✅   │  ✅   │  ✅   │   ❌    │
│ reservation.checkout│  ✅   │  ✅   │  ✅   │  ✅   │   ❌    │
│ change_rate         │  ✅   │  ✅   │  ✅   │  ❌   │   ❌    │
└────────────────────────────────────────────────────────────────┘

Légende: ✅ Autorisé  ❌ Refusé  🔸 Partiel (ses propres données)
```

### MODULE CHAMBRES

```
┌────────────────────────────────────────────────────────────────┐
│ PERMISSION          │ Super │ Direct│ Resp. │ Agent │         │
│                     │ Admin │  Hôtel│ House │ House │         │
├────────────────────────────────────────────────────────────────┤
│ room.create         │  ✅   │  ✅   │  ❌   │  ❌   │         │
│ room.read           │  ✅   │  ✅   │  ✅   │  ✅   │         │
│ room.update         │  ✅   │  ✅   │  ❌   │  ❌   │         │
│ room.assign         │  ✅   │  ✅   │  ❌   │  ❌   │         │
│ room.change_status  │  ✅   │  ✅   │  ✅   │  ✅   │         │
│ room.maintenance    │  ✅   │  ✅   │  ✅   │  ❌   │         │
│ room.clean          │  ✅   │  ✅   │  ✅   │  ✅   │         │
│ room.inspect        │  ✅   │  ✅   │  ✅   │  ❌   │         │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎯 EXEMPLES DE CAS D'USAGE

### Cas 1 : Réceptionniste crée une réservation

```
┌─────────────────────────────────────────────────────────┐
│ UTILISATEUR: Marie (Réceptionniste)                    │
│ RÔLE: receptionist                                      │
│ ACTION: Créer une réservation                          │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│ VÉRIFICATION:                                           │
│ ✅ Marie a le rôle 'receptionist'                       │
│ ✅ Le rôle 'receptionist' a 'reservation.create'        │
│ ✅ AUTORISÉ                                             │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│ RÉSULTAT:                                               │
│ ✅ Réservation créée                                    │
│ 📝 Log: success - reservation.create                    │
└─────────────────────────────────────────────────────────┘
```

### Cas 2 : Serveur tente de supprimer un utilisateur

```
┌─────────────────────────────────────────────────────────┐
│ UTILISATEUR: Pierre (Serveur Restaurant)               │
│ RÔLE: waiter                                            │
│ ACTION: Supprimer un utilisateur                       │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│ VÉRIFICATION:                                           │
│ ✅ Pierre a le rôle 'waiter'                            │
│ ❌ Le rôle 'waiter' n'a PAS 'user.delete'               │
│ ❌ REFUSÉ                                               │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│ RÉSULTAT:                                               │
│ ❌ 403 Forbidden                                        │
│ 📝 Log: denied - user.delete                            │
└─────────────────────────────────────────────────────────┘
```

### Cas 3 : Client consulte ses réservations

```
┌─────────────────────────────────────────────────────────┐
│ UTILISATEUR: Jean Dupont (Client)                      │
│ RÔLE: guest                                             │
│ ACTION: Voir ses réservations                          │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│ VÉRIFICATION:                                           │
│ ✅ Jean a le rôle 'guest'                               │
│ ✅ Le rôle 'guest' a 'guest_portal.reservation.read'    │
│ ✅ AUTORISÉ (ses propres réservations uniquement)       │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│ RÉSULTAT:                                               │
│ ✅ Liste de SES réservations                            │
│ 📝 Log: success - guest_portal.reservation.read         │
└─────────────────────────────────────────────────────────┘
```

---

## 📈 STATISTIQUES PAR RÔLE

```
┌────────────────────────────────────────────────────────────┐
│ RÔLE                    │ PERMISSIONS │ % DU TOTAL │ NIVEAU│
├────────────────────────────────────────────────────────────┤
│ Super Administrateur    │     80      │   100%     │   0   │
│ Directeur Hôtel         │     76      │    95%     │   1   │
│ Responsable Réception   │     48      │    60%     │   2   │
│ Réceptionniste          │     32      │    40%     │   3   │
│ Responsable Restaurant  │     40      │    50%     │   2   │
│ Serveur Restaurant      │     20      │    25%     │   3   │
│ Caissier Restaurant     │     24      │    30%     │   3   │
│ Responsable Spa         │     40      │    50%     │   2   │
│ Réception Spa           │     24      │    30%     │   3   │
│ Thérapeute              │     12      │    15%     │   3   │
│ Responsable Boutique    │     36      │    45%     │   2   │
│ Caissier Boutique       │     20      │    25%     │   3   │
│ Responsable Housekeeping│     32      │    40%     │   2   │
│ Agent Housekeeping      │     16      │    20%     │   3   │
│ Comptable               │     44      │    55%     │   2   │
│ Client Hôtel            │      8      │    10%     │  10   │
└────────────────────────────────────────────────────────────┘
```

---

## 🔄 CYCLE DE VIE D'UNE PERMISSION

```
1. CRÉATION
   ↓
   INSERT INTO permissions (code, module, action)
   VALUES ('reservation.create', 'reservation', 'create')
   
2. ATTRIBUTION À UN RÔLE
   ↓
   INSERT INTO role_permissions (role_id, permission_id)
   VALUES ('receptionist-uuid', 'permission-uuid')
   
3. ATTRIBUTION DU RÔLE À UN UTILISATEUR
   ↓
   INSERT INTO user_roles (user_id, role_id)
   VALUES ('user-uuid', 'receptionist-uuid')
   
4. VÉRIFICATION À CHAQUE REQUÊTE
   ↓
   SELECT EXISTS(
     SELECT 1 FROM user_roles ur
     JOIN role_permissions rp ON ur.role_id = rp.role_id
     JOIN permissions p ON rp.permission_id = p.id
     WHERE ur.user_id = 'user-uuid'
     AND p.code = 'reservation.create'
   )
   
5. LOG DE L'ACCÈS
   ↓
   INSERT INTO access_logs (user_id, permission_code, status)
   VALUES ('user-uuid', 'reservation.create', 'success')
```

---

## 🎨 CODES COULEUR

```
🔴 Niveau 0 - Super Admin (Rouge)
   Accès total, aucune restriction

🟠 Niveau 1 - Direction (Orange)
   Management global, presque toutes les permissions

🟡 Niveau 2 - Managers (Jaune)
   Management départemental, permissions ciblées

🟢 Niveau 3 - Staff (Vert)
   Opérationnel, permissions limitées

🔵 Niveau 10 - Clients (Bleu)
   Portail client, accès minimal
```

---

## 📱 INTERFACE UTILISATEUR (Concept)

```
┌─────────────────────────────────────────────────────────┐
│  GESTION DES RÔLES ET PERMISSIONS                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Utilisateur: Marie Dubois                             │
│  Email: marie@hotel.com                                 │
│                                                         │
│  Rôles actuels:                                         │
│  ┌─────────────────────────────────────────┐           │
│  │ ✓ Réceptionniste                        │           │
│  │   Assigné le: 15/01/2026                │           │
│  │   Expire le: Jamais                     │           │
│  │   [Retirer]                             │           │
│  └─────────────────────────────────────────┘           │
│                                                         │
│  Ajouter un rôle:                                       │
│  ┌─────────────────────────────────────────┐           │
│  │ [Sélectionner un rôle ▼]                │           │
│  │ Date d'expiration (optionnel): [____]   │           │
│  │ [Assigner]                              │           │
│  └─────────────────────────────────────────┘           │
│                                                         │
│  Permissions effectives (32):                           │
│  ┌─────────────────────────────────────────┐           │
│  │ ✓ reservation.create                    │           │
│  │ ✓ reservation.read                      │           │
│  │ ✓ reservation.update                    │           │
│  │ ✓ reservation.checkin                   │           │
│  │ ✓ reservation.checkout                  │           │
│  │ ✓ room.read                             │           │
│  │ ✓ room.assign                           │           │
│  │ ... (25 autres)                         │           │
│  └─────────────────────────────────────────┘           │
│                                                         │
│  [Sauvegarder] [Annuler]                               │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 RÉSUMÉ VISUEL

```
┌──────────────────────────────────────────────────────────┐
│                  SYSTÈME RBAC COMPLET                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  📊 16 RÔLES                                             │
│  🔑 ~80 PERMISSIONS                                      │
│  📦 12 MODULES                                           │
│  🔒 5 NIVEAUX HIÉRARCHIQUES                              │
│  📝 LOGS AUTOMATIQUES                                    │
│  ✅ SÉCURITÉ RENFORCÉE                                   │
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │  UTILISATEUR → RÔLE → PERMISSION           │         │
│  │       ↓          ↓         ↓               │         │
│  │    user_roles  role_permissions  access_logs│        │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  🚀 PRÊT À DÉPLOYER                                      │
│  📚 DOCUMENTATION COMPLÈTE                               │
│  🔧 FACILE À UTILISER                                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

**🎨 GUIDE VISUEL COMPLET DU SYSTÈME RBAC !**
