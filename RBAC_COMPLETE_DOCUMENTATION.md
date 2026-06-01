# 🔐 SYSTÈME RBAC COMPLET - PMS HÔTELIER

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture RBAC](#architecture-rbac)
3. [Rôles et Permissions](#rôles-et-permissions)
4. [Structure de Base de Données](#structure-de-base-de-données)
5. [Implémentation Backend](#implémentation-backend)
6. [Middleware d'Autorisation](#middleware-dautorisation)
7. [API REST](#api-rest)
8. [Sécurité](#sécurité)
9. [Guide d'Installation](#guide-dinstallation)

---

## 🎯 VUE D'ENSEMBLE

Le système RBAC (Role-Based Access Control) permet de gérer finement les accès et permissions dans le PMS hôtelier.

### Principes

- **Rôles** : Groupes de permissions (ex: Réceptionniste, Directeur)
- **Permissions** : Actions spécifiques (ex: reservation.create)
- **Utilisateurs** : Peuvent avoir un ou plusieurs rôles
- **Hiérarchie** : Les rôles ont des niveaux (0 = plus élevé)

### Avantages

✅ Sécurité renforcée
✅ Gestion centralisée des accès
✅ Audit complet des actions
✅ Flexibilité et évolutivité
✅ Conformité RGPD

---

## 🏗️ ARCHITECTURE RBAC

```
┌─────────────┐
│  UTILISATEUR│
└──────┬──────┘
       │
       │ a un ou plusieurs
       ▼
┌─────────────┐
│    RÔLE     │
└──────┬──────┘
       │
       │ contient plusieurs
       ▼
┌─────────────┐
│ PERMISSION  │
└─────────────┘
```

### Tables Principales

1. **roles** - Définition des rôles
2. **permissions** - Définition des permissions
3. **role_permissions** - Liaison rôles ↔ permissions
4. **user_roles** - Liaison utilisateurs ↔ rôles
5. **access_logs** - Logs d'accès et audit

---

## 👥 RÔLES ET PERMISSIONS

### 1. SUPER ADMINISTRATEUR

**Code** : `super_admin`
**Niveau** : 0 (le plus élevé)

**Description** :
Accès complet à tous les modules et paramètres système. Peut gérer tous les utilisateurs et rôles.

**Permissions** : TOUTES (100%)

**Modules accessibles** :
- ✅ Tous les modules
- ✅ Paramètres système
- ✅ Gestion des rôles et permissions
- ✅ Logs et audit

**Actions CRUD** :
- ✅ Create, Read, Update, Delete sur tous les modules

**Permissions spéciales** :
- ✅ Validation, annulation, remboursement
- ✅ Tous les rapports
- ✅ Export de données
- ✅ Gestion des utilisateurs

---

### 2. DIRECTEUR HÔTEL

**Code** : `hotel_manager`
**Niveau** : 1

**Description** :
Gestion complète de l'hôtel, accès à tous les rapports financiers et opérationnels.

**Permissions autorisées** :
