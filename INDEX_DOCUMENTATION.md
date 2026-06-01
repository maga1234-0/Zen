# 📚 INDEX DE LA DOCUMENTATION

**Dernière mise à jour** : Continuation de session

---

## 🚀 COMMENCER ICI

| Fichier | Description | Priorité |
|---------|-------------|----------|
| **A_FAIRE_MAINTENANT.md** | Guide principal - Ce qu'il faut faire maintenant | 🔴 URGENT |
| **RESUME_VISUEL.md** | Vue d'ensemble visuelle du projet | 🟡 Important |
| **STATUT_ACTUEL_COMPLET.md** | État détaillé de tous les problèmes | 🟡 Important |

---

## 🔧 GUIDES DE RÉPARATION

### Problèmes Résolus ✅

| Fichier | Problème | Statut |
|---------|----------|--------|
| **FIX_ROOM_NUMBER_UNDEFINED.md** | Erreur room_number undefined | ✅ Résolu |
| **FIX_HOTEL_ID_COMPLETE.md** | Erreur hotel_id foreign key | ✅ Résolu |
| **SPA_FIX_APPLIED.md** | Erreur toFixed spa module | ✅ Résolu |

### Problèmes En Attente ⏳

| Fichier | Problème | Action Requise |
|---------|----------|----------------|
| **ACTION_IMMEDIATE_2_ETAPES.md** | Module Spa erreur 500 | Exécuter SQL + Redéployer |
| **RBAC_INSTALLATION_GUIDE.md** | Système RBAC non installé | Exécuter 3 scripts SQL |

---

## 📊 DOCUMENTATION SYSTÈME

### Architecture et Configuration

| Fichier | Description |
|---------|-------------|
| **ARCHITECTURE.md** | Architecture complète du système |
| **API_DOCUMENTATION.md** | Documentation des endpoints API |
| **CAHIER_DES_CHARGES.md** | Spécifications du projet |
| **CONFIGURATION_FRANCAIS.md** | Configuration en français |

### Déploiement

| Fichier | Description |
|---------|-------------|
| **DEPLOYMENT.md** | Guide de déploiement général |
| **VERCEL_DEPLOYMENT_COMPLETE.md** | Déploiement Vercel (Frontend) |
| **RENDER_DEPLOYMENT_GUIDE.md** | Déploiement Render (Backend) |
| **BACKEND_DEPLOYMENT_CHECKLIST.md** | Checklist déploiement backend |

### Installation

| Fichier | Description |
|---------|-------------|
| **INSTALL.md** | Guide d'installation général |
| **START_HERE.md** | Point de départ du projet |
| **COMMENCER_ICI.md** | Guide de démarrage en français |

---

## 🗄️ SCRIPTS SQL

### Scripts Principaux

| Fichier | Description | Statut |
|---------|-------------|--------|
| **database/SETUP_INITIAL_DATA.sql** | Données initiales (hôtel, admin, 24 types de chambres) | ✅ Exécuté |
| **database/ADD_SPA_VIEWS.sql** | Vues SQL pour le module spa | ⏳ À exécuter |
| **database/rbac-system.sql** | Tables RBAC | ⏳ À exécuter |
| **database/rbac-permissions.sql** | Permissions RBAC | ⏳ À exécuter |
| **database/rbac-role-permissions.sql** | Associations rôles-permissions | ⏳ À exécuter |

### Scripts de Diagnostic

| Fichier | Description |
|---------|-------------|
| **database/DIAGNOSTIC_CHAMBRES.sql** | Diagnostic des chambres |
| **database/VERIFIER_ET_CORRIGER_HOTEL.sql** | Vérification hôtel |
| **database/verify-all-tables.sql** | Vérification de toutes les tables |

### Scripts de Maintenance

| Fichier | Description |
|---------|-------------|
| **database/MODIFIER_PRIX_CHAMBRES.sql** | Modifier les prix des chambres |
| **database/clean-data.sql** | Nettoyer les données |
| **database/reset-database.sql** | Réinitialiser la base de données |

### Scripts de Modules

| Fichier | Description |
|---------|-------------|
| **database/spa-module.sql** | Tables du module spa |
| **database/restaurant-module.sql** | Tables du module restaurant |
| **database/schema.sql** | Schéma complet de la base |

---

## 📖 GUIDES SPÉCIFIQUES

### Modules

| Fichier | Description |
|---------|-------------|
| **GUIDE_TYPES_CHAMBRES.md** | Guide des 24 types de chambres |
| **MAINTENANCE_WORKFLOW.md** | Workflow de maintenance |
| **NOTIFICATION_DISTRIBUTION_GUIDE.md** | Guide des notifications |
| **GUEST_WORKFLOW_GUIDE.md** | Workflow de gestion des clients |

### Fonctionnalités

| Fichier | Description |
|---------|-------------|
| **SETTINGS_IMPLEMENTATION.md** | Implémentation des paramètres |
| **ROOM_MANAGEMENT_PERMISSIONS.md** | Permissions de gestion des chambres |
| **PAYMENT_NOTIFICATIONS_FIX.md** | Notifications de paiement |

### Intelligence Artificielle

| Fichier | Description |
|---------|-------------|
| **AI_INSIGHTS_GUIDE.md** | Guide des insights IA |
| **AI_INTEGRATION_COMPLETE.md** | Intégration IA complète |
| **AI_DEPLOYMENT_COMPLETE.md** | Déploiement IA |
| **AI_SETUP_STEPS.md** | Étapes de configuration IA |

---

## 🔐 DOCUMENTATION RBAC

| Fichier | Description |
|---------|-------------|
| **RBAC_INDEX.md** | Index de la documentation RBAC |
| **RBAC_QUICK_START.md** | Démarrage rapide RBAC |
| **RBAC_INSTALLATION_GUIDE.md** | Guide d'installation RBAC |
| **RBAC_API_REFERENCE.md** | Référence API RBAC |
| **RBAC_ROLES_REFERENCE.md** | Référence des rôles |
| **RBAC_PERMISSIONS_REFERENCE.md** | Référence des permissions |
| **RBAC_FRONTEND_INTEGRATION.md** | Intégration frontend RBAC |
| **RBAC_TROUBLESHOOTING.md** | Dépannage RBAC |

---

## 🐛 DÉPANNAGE

### Guides de Dépannage

| Fichier | Description |
|---------|-------------|
| **AI_INSIGHTS_TROUBLESHOOTING.md** | Dépannage insights IA |
| **RBAC_TROUBLESHOOTING.md** | Dépannage RBAC |
| **VERCEL_TROUBLESHOOTING.md** | Dépannage Vercel |
| **CHECKOUT_ROOM_STATUS_DEBUG.md** | Debug statut chambre checkout |

### Fixes Spécifiques

| Fichier | Description |
|---------|-------------|
| **FIX_ROOM_NUMBER_EXISTS.md** | Fix numéro de chambre existe |
| **FIX_ROOM_TYPES_DROPDOWN.md** | Fix dropdown types de chambres |
| **FIX_ROOM_DIRTY_STATUS.md** | Fix statut "dirty" des chambres |
| **FRONT_DESK_CHECKINS_FIX.md** | Fix check-ins front desk |
| **GUEST_DUPLICATE_FIX.md** | Fix doublons clients |
| **PAYMENT_CANCELLED_BOOKINGS_FIX.md** | Fix paiements réservations annulées |

---

## 📋 CHECKLISTS

| Fichier | Description |
|---------|-------------|
| **TESTING_CHECKLIST.md** | Checklist de tests |
| **DEPLOY_NOW_CHECKLIST.md** | Checklist de déploiement |
| **BACKEND_DEPLOYMENT_CHECKLIST.md** | Checklist déploiement backend |
| **PRE_PUSH_CHECKLIST.md** | Checklist avant push GitHub |

---

## 📝 RÉSUMÉS ET STATUTS

| Fichier | Description |
|---------|-------------|
| **RESUME_SESSION_FINALE.md** | Résumé complet de la session |
| **RESUME_FINAL.md** | Résumé final du projet |
| **CURRENT_STATUS.md** | Statut actuel (anglais) |
| **SITUATION_ACTUELLE.md** | Situation actuelle (français) |
| **AI_STATUS_SUMMARY.md** | Résumé statut IA |
| **IMPLEMENTATION_SUMMARY.md** | Résumé implémentation |

---

## 🔗 GUIDES GITHUB

| Fichier | Description |
|---------|-------------|
| **CONNECT_TO_GITHUB.md** | Connexion à GitHub |
| **PUSH_TO_GITHUB_STEPS.md** | Étapes pour push sur GitHub |
| **COMMIT_AND_PUSH_CHANGES.md** | Commit et push des changements |
| **GITHUB_PUSH_SUMMARY.md** | Résumé push GitHub |
| **EASIEST_WAY_TO_PUSH.md** | Méthode la plus simple pour push |

---

## 🎯 GUIDES RAPIDES

| Fichier | Description |
|---------|-------------|
| **QUICK_REFERENCE.md** | Référence rapide |
| **QUICK_START_MAINTENANCE.md** | Démarrage rapide maintenance |
| **QUICK_FIX_STEPS.md** | Étapes de correction rapide |
| **QUICK_CONNECT_GUIDE.md** | Guide de connexion rapide |

---

## 📊 ORGANISATION PAR PRIORITÉ

### 🔴 URGENT - À LIRE MAINTENANT

1. **A_FAIRE_MAINTENANT.md** - Ce qu'il faut faire
2. **RESUME_VISUEL.md** - Vue d'ensemble
3. **STATUT_ACTUEL_COMPLET.md** - État détaillé

### 🟡 IMPORTANT - À LIRE ENSUITE

4. **ACTION_IMMEDIATE_2_ETAPES.md** - Réparer le spa
5. **RBAC_INSTALLATION_GUIDE.md** - Installer RBAC
6. **FIX_ROOM_NUMBER_UNDEFINED.md** - Comprendre le fix

### 🟢 RÉFÉRENCE - À CONSULTER AU BESOIN

7. **ARCHITECTURE.md** - Architecture système
8. **API_DOCUMENTATION.md** - Documentation API
9. **GUIDE_TYPES_CHAMBRES.md** - Types de chambres

---

## 🔍 RECHERCHE PAR SUJET

### Chambres (Rooms)
- FIX_ROOM_NUMBER_UNDEFINED.md
- FIX_HOTEL_ID_COMPLETE.md
- GUIDE_TYPES_CHAMBRES.md
- ROOM_MANAGEMENT_PERMISSIONS.md
- FIX_ROOM_TYPES_DROPDOWN.md
- FIX_ROOM_DIRTY_STATUS.md

### Spa
- ACTION_IMMEDIATE_2_ETAPES.md
- SPA_FIX_APPLIED.md
- database/ADD_SPA_VIEWS.sql
- database/spa-module.sql

### RBAC (Permissions)
- RBAC_INDEX.md
- RBAC_QUICK_START.md
- RBAC_INSTALLATION_GUIDE.md
- database/rbac-system.sql

### Déploiement
- DEPLOYMENT.md
- VERCEL_DEPLOYMENT_COMPLETE.md
- RENDER_DEPLOYMENT_GUIDE.md
- BACKEND_DEPLOYMENT_CHECKLIST.md

### Base de Données
- database/SETUP_INITIAL_DATA.sql
- database/ADD_SPA_VIEWS.sql
- database/schema.sql
- database/verify-all-tables.sql

---

## 📞 LIENS UTILES

| Service | URL |
|---------|-----|
| **Frontend** | https://zen-lyart.vercel.app |
| **Backend** | https://zen-backend-jzjh.onrender.com |
| **Supabase** | https://supabase.com/dashboard |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Render Dashboard** | https://dashboard.render.com |
| **GitHub Frontend** | https://github.com/maga1234-0/Zen |
| **GitHub Backend** | https://github.com/maga1234-0/zen_backend- |

---

## 💡 CONSEILS

### Pour Trouver un Document

1. **Cherchez par nom** : Utilisez Ctrl+F dans ce fichier
2. **Cherchez par sujet** : Consultez "Recherche par Sujet"
3. **Suivez la priorité** : Commencez par les documents 🔴 URGENT

### Pour Résoudre un Problème

1. **Consultez** : STATUT_ACTUEL_COMPLET.md
2. **Suivez** : Le guide spécifique au problème
3. **Vérifiez** : Les scripts SQL nécessaires

### Pour Déployer

1. **Lisez** : DEPLOYMENT.md
2. **Suivez** : Les checklists
3. **Vérifiez** : Les guides Vercel/Render

---

**📖 COMMENCEZ PAR : A_FAIRE_MAINTENANT.md** 🚀

**🔍 UTILISEZ CET INDEX POUR NAVIGUER !** 📚

**💡 TOUS LES GUIDES SONT DANS CE DOSSIER !** 📁
