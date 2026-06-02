# CAHIER DES CHARGES
## Système de Gestion Hôtelière (PMS - Property Management System)

---

## 📋 TABLE DES MATIÈRES

1. [Présentation du Projet](#1-présentation-du-projet)
2. [Objectifs](#2-objectifs)
3. [Périmètre Fonctionnel](#3-périmètre-fonctionnel)
4. [Spécifications Techniques](#4-spécifications-techniques)
5. [Rôles et Permissions](#5-rôles-et-permissions)
6. [Modules Fonctionnels](#6-modules-fonctionnels)
7. [Intelligence Artificielle](#7-intelligence-artificielle)
8. [Contraintes et Exigences](#8-contraintes-et-exigences)
9. [Architecture Système](#9-architecture-système)
10. [Sécurité](#10-sécurité)
11. [Déploiement](#11-déploiement)
12. [Maintenance et Support](#12-maintenance-et-support)

---

## 1. PRÉSENTATION DU PROJET

### 1.1 Contexte
Développement d'une application web complète de gestion hôtelière permettant la gestion intégrale des opérations d'un hôtel, de la réservation au départ du client.

### 1.2 Nom du Projet
**Grand Hôtel Seafoam - Système de Gestion Hôtelière**

### 1.3 Portée
Application web responsive accessible depuis navigateurs desktop, tablettes et mobiles.

### 1.4 Public Cible
- Personnel hôtelier (réception, housekeeping, maintenance, comptabilité)
- Direction et management
- Administrateurs système

---

## 2. OBJECTIFS

### 2.1 Objectifs Principaux

- ✅ Centraliser toutes les opérations hôtelières dans une seule plateforme
- ✅ Automatiser les processus de réservation, check-in et check-out
- ✅ Optimiser la gestion des chambres et du personnel
- ✅ Améliorer l'expérience client et la satisfaction
- ✅ Fournir des analyses et rapports en temps réel
- ✅ Intégrer l'intelligence artificielle pour l'aide à la décision

### 2.2 Objectifs Secondaires
- Réduire les erreurs manuelles
- Améliorer la communication entre départements
- Faciliter la formation du nouveau personnel
- Permettre l'accès multilingue (Français, Anglais, Espagnol)
- Assurer la traçabilité des opérations

---

## 3. PÉRIMÈTRE FONCTIONNEL

### 3.1 Modules Inclus
✅ **Tableau de bord** - Vue d'ensemble et statistiques
✅ **Gestion des réservations** - Création, modification, annulation
✅ **Gestion des chambres** - Statuts, types, tarifs
✅ **Gestion des clients** - Profils, historique, préférences
✅ **Réception (Front Desk)** - Check-in, check-out, arrivées du jour
✅ **Housekeeping** - Nettoyage, statuts des chambres
✅ **Maintenance** - Signalement et suivi des problèmes
✅ **Paiements** - Facturation, encaissements, historique
✅ **Personnel** - Gestion des utilisateurs et permissions
✅ **Rapports** - Statistiques, analyses, exports
✅ **Notifications** - Alertes en temps réel
✅ **Paramètres** - Configuration de l'hôtel, préférences
✅ **Intelligence Artificielle** - Recommandations et analyses
✅ **Restaurant & Bar** - Gestion des commandes, menu, tables, réservations
✅ **Spa & Wellness** - Soins, forfaits, réservations

### 3.2 Modules Non Inclus (Hors Périmètre)
❌ Système de réservation en ligne public
❌ Intégration avec OTA (Booking.com, Expedia, etc.)
❌ Point de vente (POS) pour boutique
❌ Gestion d'événements et conférences
❌ Gestion de parking


---

## 4. SPÉCIFICATIONS TECHNIQUES

### 4.1 Technologies Frontend
- **Framework**: React 18 avec TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Internationalisation**: i18next
- **Gestion de formulaires**: React Hook Form
- **Requêtes API**: TanStack Query (React Query)

### 4.2 Technologies Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Langage**: TypeScript
- **Base de données**: PostgreSQL (Supabase)
- **ORM**: SQL natif avec pg
- **Authentification**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Sécurité**: bcrypt, helmet, cors
- **Planification**: node-cron
- **IA**: Google Gemini API

### 4.3 Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Base de données**: Supabase (PostgreSQL)
- **Contrôle de version**: Git / GitHub
- **CI/CD**: Automatique via Vercel et Render

### 4.4 Compatibilité
- **Navigateurs**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Appareils**: Desktop, Tablette, Mobile (responsive)
- **Résolutions**: 320px à 4K


---

## 5. RÔLES ET PERMISSIONS

### 5.1 Administrateur (Admin)
**Accès complet à toutes les fonctionnalités**

✅ Tableau de bord complet avec AI Insights
✅ Gestion des réservations (CRUD complet)
✅ Gestion des chambres (CRUD complet)
✅ Gestion des clients (CRUD complet)
✅ Front Desk (check-in, check-out)
✅ Housekeeping (gestion complète)
✅ Maintenance (gestion complète)
✅ Paiements (toutes opérations)
✅ Personnel (création, modification, suppression)
✅ Rapports (tous les rapports)
✅ Notifications (toutes)
✅ Paramètres (configuration complète)
✅ Profil (modification)

### 5.2 Manager (Gestionnaire)
**Accès opérationnel complet, paramètres limités**

✅ Tableau de bord complet avec AI Insights
✅ Gestion des réservations (CRUD complet)
✅ Gestion des chambres (CRUD complet)
✅ Gestion des clients (CRUD complet)
✅ Front Desk (check-in, check-out)
✅ Housekeeping (gestion complète)
✅ Maintenance (gestion complète)
✅ Paiements (toutes opérations)
✅ Personnel (consultation uniquement)
✅ Rapports (tous les rapports)
✅ Notifications (toutes)
✅ Paramètres (consultation uniquement)
✅ Profil (modification)

### 5.3 Réceptionniste (Receptionist)
**Accès front office et réservations**

✅ Tableau de bord (statistiques limitées)
✅ Gestion des réservations (CRUD complet)
✅ Gestion des chambres (consultation, modification statut)
✅ Gestion des clients (CRUD complet)
✅ Front Desk (check-in, check-out)
❌ Housekeeping (pas d'accès)
❌ Maintenance (pas d'accès)
✅ Paiements (consultation, création)
❌ Personnel (pas d'accès)
✅ Rapports (rapports de base)
✅ Notifications (ses notifications)
❌ Paramètres (pas d'accès)
✅ Profil (modification)


### 5.4 Housekeeping (Entretien)
**Accès gestion des chambres et nettoyage**

✅ Tableau de bord (statistiques limitées)
❌ Gestion des réservations (pas d'accès)
✅ Gestion des chambres (consultation, modification statut)
❌ Gestion des clients (pas d'accès)
❌ Front Desk (pas d'accès)
✅ Housekeeping (gestion complète)
❌ Maintenance (pas d'accès)
❌ Paiements (pas d'accès)
❌ Personnel (pas d'accès)
❌ Rapports (pas d'accès)
✅ Notifications (ses notifications)
❌ Paramètres (pas d'accès)
✅ Profil (modification)

### 5.5 Maintenance
**Accès maintenance et statuts chambres**

✅ Tableau de bord (statistiques limitées)
❌ Gestion des réservations (pas d'accès)
✅ Gestion des chambres (consultation uniquement)
❌ Gestion des clients (pas d'accès)
❌ Front Desk (pas d'accès)
❌ Housekeeping (pas d'accès)
✅ Maintenance (gestion complète)
❌ Paiements (pas d'accès)
❌ Personnel (pas d'accès)
❌ Rapports (pas d'accès)
✅ Notifications (ses notifications)
❌ Paramètres (pas d'accès)
✅ Profil (modification)

### 5.6 Comptable (Accountant)
**Accès finances et rapports**

✅ Tableau de bord (statistiques financières)
❌ Gestion des réservations (consultation uniquement)
❌ Gestion des chambres (consultation uniquement)
❌ Gestion des clients (consultation uniquement)
❌ Front Desk (pas d'accès)
❌ Housekeeping (pas d'accès)
❌ Maintenance (pas d'accès)
✅ Paiements (toutes opérations)
❌ Personnel (pas d'accès)
✅ Rapports (rapports financiers)
✅ Notifications (ses notifications)
❌ Paramètres (pas d'accès)
✅ Profil (modification)

---

### 5.7 Rôles Restaurant (NOUVEAU)

#### 5.7.1 Serveur Restaurant (Restaurant Server)
**Accès création de commandes et service**

✅ Tableau de bord (statistiques limitées)
✅ Restaurant - Commandes (création, lecture)
✅ Restaurant - Menu (consultation uniquement)
✅ Restaurant - Tables (consultation uniquement)
✅ Restaurant - Impression (tickets)
✅ Chambres (consultation pour affecter commandes)
❌ Restaurant - Modification menu
❌ Restaurant - Statistiques financières
❌ Restaurant - Paiements
❌ Autres modules hôtel

#### 5.7.2 Caissier Restaurant (Restaurant Cashier)
**Accès encaissements et paiements**

✅ Tableau de bord (statistiques limitées)
✅ Restaurant - Commandes (consultation, modification paiement)
✅ Restaurant - Menu (consultation uniquement)
✅ Restaurant - Paiements (création, remboursement)
✅ Restaurant - Impression (factures, reçus)
❌ Restaurant - Création commandes
❌ Restaurant - Modification menu
❌ Restaurant - Statistiques ventes

#### 5.7.3 Responsable Restaurant (Restaurant Manager)
**Accès complet module restaurant**

✅ Tableau de bord (statistiques complètes)
✅ Restaurant - Commandes (CRUD complet)
✅ Restaurant - Menu (CRUD complet, gestion prix)
✅ Restaurant - Catégories (CRUD complet)
✅ Restaurant - Tables (CRUD complet)
✅ Restaurant - Réservations tables (CRUD complet)
✅ Restaurant - Paiements (lecture, remboursement)
✅ Restaurant - Statistiques (toutes)
✅ Restaurant - Rapports (lecture, export)
✅ Restaurant - Impression (tous types)
✅ Chambres (consultation pour affecter commandes)

#### 5.7.4 Chef de Cuisine (Restaurant Chef)
**Accès cuisine et production**

✅ Tableau de bord (statistiques limitées)
✅ Restaurant - Commandes (lecture, modification statut cuisine)
✅ Restaurant - Menu (consultation uniquement)
✅ Restaurant - Statistiques production (temps, quantités)
✅ Restaurant - Impression (tickets cuisine)
❌ Restaurant - Création commandes
❌ Restaurant - Prix et finances
❌ Restaurant - Paiements
❌ Restaurant - Modification menu

---

### 5.8 Extension Rôle Réceptionniste pour Restaurant

**Permissions restaurant ajoutées**:
✅ Restaurant - Commandes (consultation uniquement)
✅ Restaurant - Paiements (ajout au folio chambre)
✅ Restaurant - Rapports (consommation client)
- Permet de voir les consommations restaurant d'un client
- Permet d'ajouter les charges restaurant au folio de la chambre
- Permet de vérifier les dépenses avant le check-out

---

## 6. MODULES FONCTIONNELS

### 6.1 MODULE TABLEAU DE BORD

#### Fonctionnalités
- **Statistiques en temps réel**
  - Taux d'occupation actuel
  - Revenus du jour/mois
  - Nombre de réservations
  - Arrivées et départs du jour
  - Chambres disponibles/occupées/en maintenance

- **Graphiques et visualisations**
  - Évolution des réservations (7 derniers jours)
  - Répartition des revenus par type de chambre
  - Taux d'occupation mensuel

- **Alertes et notifications**
  - Arrivées imminentes
  - Problèmes de maintenance
  - Paiements en attente

- **AI Insights (Admin/Manager uniquement)**
  - Recommandations de chambres
  - Analyse de sentiment client
  - Prédictions d'occupation
  - Chatbot d'assistance

#### Règles Métier
- Mise à jour automatique toutes les 30 secondes
- Affichage adapté selon le rôle utilisateur
- Données filtrables par période

---

### 6.2 MODULE RÉSERVATIONS

#### Fonctionnalités
- **Création de réservation**
  - Sélection client (existant ou nouveau)
  - Choix de chambre avec disponibilité en temps réel
  - Dates de séjour (check-in/check-out)
  - Nombre de personnes
  - Calcul automatique du montant total
  - Demandes spéciales (texte libre)
  - Statut initial: "pending" ou "confirmed"

- **Modification de réservation**
  - Changement de dates
  - Changement de chambre
  - Modification du nombre de personnes
  - Mise à jour des demandes spéciales

- **Annulation de réservation**
  - Confirmation obligatoire
  - Mise à jour automatique du statut chambre
  - Notification au client

- **Gestion des statuts**
  - Pending (en attente)
  - Confirmed (confirmée)
  - Checked-in (client arrivé)
  - Checked-out (client parti)
  - Cancelled (annulée)


#### Règles Métier
- Une chambre ne peut avoir qu'une seule réservation active par période
- Le check-out doit être après le check-in
- Calcul automatique: (nombre de nuits) × (prix chambre)
- Notification automatique à la création/modification
- Impossible de supprimer une réservation (seulement annuler)
- Les réservations annulées restent dans l'historique

---

### 6.3 MODULE CHAMBRES

#### Fonctionnalités
- **Gestion des chambres**
  - Création de nouvelle chambre
  - Modification des informations
  - Suppression (si aucune réservation active)
  - Consultation de l'historique

- **Informations par chambre**
  - Numéro de chambre (unique)
  - Type (Single, Double, Suite, Deluxe)
  - Prix par nuit
  - Capacité (nombre de personnes)
  - Équipements (WiFi, TV, Minibar, etc.)
  - Statut actuel

- **Gestion des statuts**
  - Available (disponible)
  - Occupied (occupée)
  - Dirty (à nettoyer)
  - Cleaning (en cours de nettoyage)
  - Maintenance (en maintenance)

- **Maintenance**
  - Signalement de problème
  - Raison de maintenance
  - Personne ayant signalé
  - Date de signalement
  - Résolution et remise en service

#### Règles Métier
- Numéro de chambre unique
- Prix minimum: 0.01
- Capacité minimum: 1 personne
- Changement de statut automatique lors check-in/check-out
- Statut "Dirty" automatique après check-out
- Notification housekeeping lors passage en "Dirty"
- Notification maintenance lors signalement problème


---

### 6.4 MODULE CLIENTS

#### Fonctionnalités
- **Gestion des profils clients**
  - Création de nouveau client
  - Modification des informations
  - Suppression (si aucune réservation)
  - Recherche et filtrage

- **Informations client**
  - Prénom et nom
  - Email (optionnel)
  - Téléphone (obligatoire)
  - Type de pièce d'identité
  - Numéro de pièce d'identité
  - Adresse complète
  - Ville et pays
  - Date de naissance

- **Historique client**
  - Liste des réservations passées
  - Montant total dépensé
  - Nombre de séjours
  - Préférences et notes

#### Règles Métier
- Téléphone obligatoire
- Email optionnel mais recommandé
- Vérification des doublons par email/téléphone
- Conservation de l'historique même après suppression
- Affichage du nom complet (éviter duplication)
- Recherche par nom, email ou téléphone

---

### 6.5 MODULE FRONT DESK (RÉCEPTION)

#### Fonctionnalités
- **Arrivées du jour**
  - Liste des check-ins prévus
  - Statut de chaque arrivée
  - Informations client et chambre
  - Bouton check-in rapide

- **Départs du jour**
  - Liste des check-outs prévus
  - Statut de chaque départ
  - Solde à payer
  - Bouton check-out rapide

- **Check-in**
  - Vérification identité client
  - Confirmation des informations
  - Attribution de la chambre
  - Changement statut: confirmed → checked-in
  - Changement statut chambre: available → occupied
  - Notification housekeeping

- **Check-out**
  - Vérification du solde
  - Libération de la chambre
  - Changement statut: checked-in → checked-out
  - Changement statut chambre: occupied → dirty
  - Notification housekeeping
  - Génération facture finale


#### Règles Métier
- Check-in possible uniquement pour réservations "confirmed"
- Check-out possible uniquement pour réservations "checked-in"
- Vérification automatique de la date du jour
- Mise à jour automatique des statuts
- Notifications automatiques aux départements concernés
- Impossibilité de check-in avant la date prévue
- Alerte si check-out avec solde impayé

---

### 6.6 MODULE HOUSEKEEPING (ENTRETIEN)

#### Fonctionnalités
- **Vue d'ensemble**
  - Liste de toutes les chambres
  - Filtrage par statut
  - Priorités de nettoyage
  - Statistiques du jour

- **Gestion des tâches**
  - Chambres à nettoyer (dirty)
  - Chambres en cours (cleaning)
  - Chambres terminées (available)
  - Attribution des tâches

- **Actions disponibles**
  - Démarrer le nettoyage (dirty → cleaning)
  - Terminer le nettoyage (cleaning → available)
  - Signaler un problème (→ maintenance)
  - Ajouter des notes

- **Notifications**
  - Nouvelle chambre à nettoyer
  - Chambre prioritaire (arrivée imminente)
  - Problème signalé

#### Règles Métier
- Seules les chambres "dirty" peuvent passer en "cleaning"
- Seules les chambres "cleaning" peuvent passer en "available"
- Notification automatique après check-out
- Priorité aux chambres avec arrivée le jour même
- Traçabilité: qui a nettoyé, quand
- Temps moyen de nettoyage: 30 minutes

---

### 6.7 MODULE MAINTENANCE

#### Fonctionnalités
- **Liste des problèmes**
  - Tous les problèmes signalés
  - Filtrage par statut (ouvert/résolu)
  - Priorité (haute/moyenne/basse)
  - Date de signalement

- **Détails du problème**
  - Numéro de chambre
  - Description du problème
  - Personne ayant signalé
  - Date et heure
  - Photos (optionnel)

- **Résolution**
  - Marquer comme résolu
  - Ajouter notes de résolution
  - Remettre chambre en service
  - Changement statut: maintenance → available

- **Notifications**
  - Nouveau problème signalé
  - Problème urgent
  - Rappel si non résolu après 24h


#### Règles Métier
- Chambre automatiquement en "maintenance" lors signalement
- Impossible de réserver une chambre en maintenance
- Notification immédiate à l'équipe maintenance
- Historique complet des interventions
- Temps moyen de résolution: 2 heures (urgent), 24h (normal)

---

### 6.8 MODULE PAIEMENTS

#### Fonctionnalités
- **Enregistrement des paiements**
  - Sélection de la réservation
  - Montant du paiement
  - Méthode (Cash, Card, Transfer)
  - Date et heure automatiques
  - Référence de transaction

- **Consultation**
  - Liste de tous les paiements
  - Filtrage par date, méthode, statut
  - Recherche par client ou réservation
  - Export des données

- **Statuts de paiement**
  - Paid (payé intégralement)
  - Partial (paiement partiel)
  - Pending (en attente)
  - Refunded (remboursé)

- **Rapports financiers**
  - Revenus du jour/semaine/mois
  - Répartition par méthode de paiement
  - Paiements en attente
  - Historique des transactions

#### Règles Métier
- Montant minimum: 0.01
- Impossible de payer plus que le montant dû
- Calcul automatique du solde restant
- Notification au client après paiement
- Notification comptabilité pour paiements importants
- Traçabilité complète (qui, quand, combien)
- Impossibilité de supprimer un paiement (seulement rembourser)

---

### 6.9 MODULE PERSONNEL

#### Fonctionnalités
- **Gestion des utilisateurs**
  - Création de nouveau membre
  - Modification des informations
  - Suppression (avec gestion des dépendances)
  - Activation/Désactivation

- **Informations utilisateur**
  - Prénom et nom
  - Email (unique, identifiant de connexion)
  - Téléphone
  - Rôle (Admin, Manager, Receptionist, etc.)
  - Statut (Actif/Inactif)
  - Photo de profil
  - Date de création

- **Gestion des rôles**
  - Attribution du rôle
  - Modification du rôle
  - Permissions automatiques selon rôle


#### Règles Métier
- Email unique obligatoire
- Mot de passe minimum 6 caractères
- Impossible de supprimer son propre compte
- Suppression d'un utilisateur: mise à NULL des références
- Historique des actions conservé
- Désactivation plutôt que suppression recommandée
- Notification à l'utilisateur lors création de compte

---

### 6.10 MODULE RAPPORTS

#### Fonctionnalités
- **Rapports d'occupation**
  - Taux d'occupation par période
  - Chambres les plus demandées
  - Durée moyenne de séjour
  - Prévisions d'occupation

- **Rapports financiers**
  - Revenus par période
  - Revenus par type de chambre
  - Méthodes de paiement utilisées
  - Comparaison périodes précédentes

- **Rapports opérationnels**
  - Performance housekeeping
  - Temps de résolution maintenance
  - Taux de satisfaction client
  - Statistiques par employé

- **Export de données**
  - Format PDF
  - Format Excel/CSV
  - Envoi par email
  - Planification automatique

#### Règles Métier
- Données en temps réel
- Filtrage par date, type, département
- Accès selon rôle utilisateur
- Génération asynchrone pour gros volumes
- Conservation historique 5 ans minimum

---

### 6.11 MODULE NOTIFICATIONS

#### Fonctionnalités
- **Types de notifications**
  - Réservations (nouvelle, modifiée, annulée)
  - Paiements (reçu, en attente, remboursé)
  - Check-in/Check-out (arrivée, départ)
  - Chambres (à nettoyer, maintenance)
  - Système (mise à jour, alerte)

- **Gestion**
  - Marquer comme lu/non lu
  - Supprimer
  - Filtrer par type
  - Recherche

- **Préférences**
  - Activer/désactiver par type
  - Notifications email
  - Notifications push (futur)
  - Fréquence des alertes


#### Règles Métier
- Notification en temps réel
- Persistance en base de données
- Badge de compteur sur icône
- Suppression automatique après 30 jours
- Priorité selon type (haute/moyenne/basse)
- Distribution selon rôle utilisateur

---

### 6.12 MODULE PARAMÈTRES

#### Fonctionnalités
- **Informations hôtel**
  - Nom de l'hôtel
  - Adresse complète
  - Téléphone et email
  - Logo (futur)

- **Préférences système**
  - Fuseau horaire
  - Devise
  - Format de date
  - Langue par défaut

- **Préférences utilisateur**
  - Thème (Clair/Sombre/Système)
  - Langue (Français/Anglais/Espagnol)
  - Notifications activées
  - Signature email

- **Sécurité**
  - Changement de mot de passe
  - Historique des connexions
  - Sessions actives

#### Règles Métier
- Paramètres hôtel: Admin uniquement
- Paramètres utilisateur: tous les rôles
- Validation des modifications
- Sauvegarde automatique
- Confirmation pour changements critiques

---

### 6.13 MODULE PROFIL

#### Fonctionnalités
- **Informations personnelles**
  - Photo de profil
  - Prénom et nom
  - Email (non modifiable)
  - Téléphone
  - Rôle (lecture seule)

- **Sécurité**
  - Changement de mot de passe
  - Mot de passe actuel requis
  - Validation force du mot de passe

- **Préférences**
  - Langue d'interface
  - Thème d'affichage
  - Notifications

#### Règles Métier
- Email non modifiable (identifiant unique)
- Photo de profil: format base64, max 2MB
- Mot de passe: minimum 6 caractères
- Confirmation obligatoire pour modifications

---

### 6.14 MODULE RESTAURANT & BAR (NOUVEAU)

#### Fonctionnalités

**Gestion du Menu**
- Création/Modification/Suppression d'articles
- Organisation par catégories (Entrées, Plats, Desserts, Boissons, etc.)
- Gestion des prix
- Disponibilité des articles (actif/inactif)
- Options diététiques (végétarien, vegan, sans gluten)
- Temps de préparation estimé
- Descriptions multilingues

**Gestion des Commandes**
- Création de commande avec types:
  - Service en chambre (Room Service)
  - En salle (Dine-in)
  - À emporter (Takeaway)
  - Bar
- Sélection des articles du menu
- Quantités et instructions spéciales par article
- Calcul automatique:
  - Sous-total
  - TVA (10%)
  - Frais de service (15% pour room service)
  - Total
- Statuts de commande:
  - Pending (en attente)
  - Confirmed (confirmée)
  - Preparing (en préparation)
  - Ready (prête)
  - Served (servie)
  - Completed (terminée)
  - Cancelled (annulée)

**Gestion des Tables**
- Numéro de table
- Capacité
- Statuts: Available, Occupied, Reserved, Cleaning
- Affectation automatique aux commandes dine-in

**Gestion des Paiements Restaurant**
- Encaissement direct
- Ajout au folio chambre
- Méthodes de paiement (Cash, Card, Transfer)
- Statuts: Paid, Partial, Pending
- Remboursements

**Statistiques et Rapports**
- Commandes actives en temps réel
- Revenus du jour/mois
- Tables disponibles/occupées
- Clients uniques
- Articles les plus vendus
- Performance par période
- Rapports exportables

**Interface selon Rôle**
- **Serveur**: Création commandes, impression tickets
- **Caissier**: Encaissement, factures
- **Chef**: Mise à jour statuts cuisine, tickets production
- **Responsable**: Gestion complète menu, stats, rapports

#### Règles Métier Restaurant
- Une commande doit contenir au moins un article
- Prix minimum article: 0.01€
- TVA fixe: 10%
- Frais de service room service: 15%
- Commande room service nécessite chambre occupée
- Commande dine-in nécessite table disponible
- Chef peut seulement modifier statut (preparing↔ready)
- Serveur ne peut pas modifier les prix
- Caissier ne peut pas créer de commandes
- Notification automatique cuisine pour nouvelles commandes
- Rafraîchissement données toutes les 30 secondes
- Historique complet des commandes conservé

#### Intégration avec l'Hôtel
- Liaison commandes room service ↔ réservations chambres
- Ajout charges restaurant au folio client
- Facturation groupée au check-out
- Statistiques restaurant dans dashboard global
- Notifications restaurant distribuées par rôle

---

### 6.15 MODULE SPA & WELLNESS (NOUVEAU)

#### Fonctionnalités

**Gestion des Soins**
- Catalogue de soins (Massages, Soins visage, Soins corps, etc.)
- Nom et description détaillée
- Durée (en minutes)
- Prix standard
- Disponibilité
- Images (à venir)

**Gestion des Forfaits**
- Création de forfaits combinant plusieurs soins
- Prix forfait (avec remise)
- Économies calculées automatiquement
- Description du forfait
- Durée totale
- Disponibilité

**Réservations Spa**
- Sélection soin ou forfait
- Choix date et heure
- Liaison avec client hôtel (optionnel)
- Liaison avec chambre (pour clients hôtel)
- Statuts:
  - Pending (en attente)
  - Confirmed (confirmée)
  - In Progress (en cours)
  - Completed (terminée)
  - Cancelled (annulée)
  - No Show (absence)
- Notes et demandes spéciales

**Gestion des Paiements Spa**
- Paiement direct
- Ajout au folio chambre (clients hôtel)
- Méthodes: Cash, Card, Transfer, Room Charge
- Statuts: Paid, Partial, Pending
- Factures et reçus

**Statistiques et Rapports**
- Réservations du jour
- Revenus période
- Taux d'occupation
- Soins les plus demandés
- Performance par thérapeute (à venir)
- Statistiques forfaits vs soins individuels

**Calendrier et Planning**
- Vue journalière/hebdomadaire/mensuelle
- Disponibilités en temps réel
- Conflits détectés automatiquement
- Rappels automatiques clients (à venir)

#### Règles Métier Spa
- Durée minimum soin: 15 minutes
- Prix minimum: 0.01€
- Réservation possible uniquement si soin disponible
- Pas de chevauchement de réservations pour même thérapeute
- Prix forfait doit être < somme des soins individuels
- Économie forfait affichée automatiquement
- Client hôtel peut charger sur chambre
- Client externe paiement obligatoire immédiat
- Notification 24h avant rendez-vous (à venir)
- Annulation gratuite jusqu'à 24h avant
- No-show enregistré dans historique client
- Statistiques actualisées en temps réel

#### Intégration avec l'Hôtel
- Liaison réservations spa ↔ clients hôtel
- Ajout charges spa au folio chambre
- Facturation groupée au check-out
- Statistiques spa dans dashboard global
- Clients hôtel prioritaires pour réservations
- Forfaits spéciaux pour clients longue durée

---

## 7. INTELLIGENCE ARTIFICIELLE

### 7.1 Présentation
Intégration de Google Gemini AI pour fournir des analyses intelligentes et des recommandations.

### 7.2 Fonctionnalités IA

#### 7.2.1 Chatbot Intelligent
- **Description**: Assistant conversationnel pour le personnel
- **Capacités**:
  - Répondre aux questions sur les opérations
  - Fournir des informations sur les réservations
  - Aider à la résolution de problèmes
  - Suggestions de meilleures pratiques
- **Accès**: Admin et Manager uniquement

#### 7.2.2 Recommandations de Chambres
- **Description**: Suggestions intelligentes de chambres pour clients
- **Critères**:
  - Préférences client historiques
  - Budget et durée de séjour
  - Disponibilité et occupation
  - Saison et événements
- **Format**: Top 3 recommandations avec justification
- **Accès**: Admin et Manager uniquement

#### 7.2.3 Génération de Messages
- **Description**: Création automatique de messages professionnels
- **Types**:
  - Emails de confirmation
  - Messages de bienvenue
  - Rappels de check-in
  - Messages de remerciement
- **Personnalisation**: Nom client, dates, détails séjour
- **Accès**: Admin et Manager uniquement

#### 7.2.4 Analyse de Sentiment
- **Description**: Analyse des avis et commentaires clients
- **Métriques**:
  - Score de satisfaction global
  - Tendances positives/négatives
  - Mots-clés récurrents
  - Recommandations d'amélioration
- **Source**: Table guest_reviews (à créer)
- **Accès**: Admin et Manager uniquement

#### 7.2.5 Prédictions d'Occupation
- **Description**: Prévisions intelligentes du taux d'occupation
- **Analyse**:
  - Historique des réservations
  - Tendances saisonnières
  - Événements locaux
  - Facteurs externes
- **Période**: 30 jours à venir
- **Précision**: Indicative, non garantie
- **Accès**: Admin et Manager uniquement

### 7.3 Configuration IA
- **API**: Google Gemini API
- **Modèle**: gemini-1.5-flash
- **Clé API**: Variable d'environnement GEMINI_API_KEY
- **Limite**: Selon quota Google
- **Gestion erreurs**: Fallback gracieux si API indisponible


### 7.4 Règles Métier IA
- Disponible uniquement pour Admin et Manager
- Affichage dans le tableau de bord
- Nécessite clé API valide
- Données anonymisées pour analyse
- Respect RGPD et confidentialité
- Résultats à titre indicatif
- Validation humaine recommandée

---

## 8. CONTRAINTES ET EXIGENCES

### 8.1 Contraintes Techniques
- **Performance**
  - Temps de chargement page < 3 secondes
  - Temps de réponse API < 500ms
  - Support 100 utilisateurs simultanés minimum
  - Base de données optimisée (index, requêtes)

- **Disponibilité**
  - Uptime 99.5% minimum
  - Sauvegarde quotidienne automatique
  - Plan de reprise après sinistre
  - Monitoring 24/7

- **Scalabilité**
  - Architecture modulaire
  - Possibilité d'ajouter des modules
  - Support multi-hôtels (futur)
  - API RESTful documentée

### 8.2 Contraintes de Sécurité
- **Authentification**
  - JWT avec expiration 24h
  - Refresh token (futur)
  - Déconnexion automatique après inactivité
  - Protection contre force brute

- **Autorisation**
  - Contrôle d'accès basé sur rôles (RBAC)
  - Validation côté serveur obligatoire
  - Principe du moindre privilège
  - Audit trail des actions sensibles

- **Données**
  - Chiffrement en transit (HTTPS)
  - Chiffrement au repos (base de données)
  - Mots de passe hashés (bcrypt)
  - Validation et sanitisation des entrées
  - Protection contre SQL injection
  - Protection contre XSS
  - Protection CSRF

### 8.3 Contraintes Légales
- **RGPD**
  - Consentement pour données personnelles
  - Droit à l'oubli
  - Portabilité des données
  - Notification en cas de fuite
  - Politique de confidentialité

- **Données Hôtelières**
  - Conservation minimum 10 ans (comptabilité)
  - Registre des clients (obligation légale)
  - Déclaration fiscale automatique (futur)


### 8.4 Contraintes d'Ergonomie
- **Accessibilité**
  - Conformité WCAG 2.1 niveau AA
  - Navigation au clavier
  - Lecteurs d'écran compatibles
  - Contrastes suffisants
  - Textes redimensionnables

- **Responsive Design**
  - Mobile First
  - Breakpoints: 320px, 768px, 1024px, 1440px
  - Touch-friendly (boutons min 44x44px)
  - Orientation portrait et paysage

- **Expérience Utilisateur**
  - Interface intuitive
  - Feedback visuel immédiat
  - Messages d'erreur clairs
  - Confirmation pour actions critiques
  - Temps de chargement visible (spinners)
  - Undo/Redo quand possible

### 8.5 Contraintes de Maintenance
- **Documentation**
  - Code commenté
  - Documentation API (Swagger futur)
  - Guide utilisateur
  - Guide administrateur
  - Procédures de déploiement

- **Tests**
  - Tests unitaires (futur)
  - Tests d'intégration (futur)
  - Tests de charge (futur)
  - Tests de sécurité

- **Monitoring**
  - Logs applicatifs
  - Logs d'erreurs
  - Métriques de performance
  - Alertes automatiques

---

## 9. ARCHITECTURE SYSTÈME

### 9.1 Architecture Globale
```
┌─────────────────┐
│   Utilisateurs  │
│  (Navigateurs)  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│   Frontend      │
│   (Vercel)      │
│   React + Vite  │
└────────┬────────┘
         │ REST API
         ▼
┌─────────────────┐
│   Backend       │
│   (Render)      │
│   Node.js       │
└────────┬────────┘
         │ SQL
         ▼
┌─────────────────┐
│  Base de        │
│  Données        │
│  (Supabase)     │
│  PostgreSQL     │
└─────────────────┘
```

### 9.2 Architecture Frontend
- **Structure des dossiers**
  ```
  client/
  ├── src/
  │   ├── components/    # Composants réutilisables
  │   ├── pages/         # Pages de l'application
  │   ├── services/      # Services API
  │   ├── store/         # State management
  │   ├── hooks/         # Custom hooks
  │   ├── utils/         # Utilitaires
  │   ├── types/         # Types TypeScript
  │   └── i18n/          # Traductions
  ```


### 9.3 Architecture Backend
- **Structure des dossiers**
  ```
  server/
  ├── src/
  │   ├── controllers/   # Logique métier
  │   ├── routes/        # Routes API
  │   ├── middleware/    # Middleware (auth, etc.)
  │   ├── services/      # Services (AI, notifications)
  │   ├── config/        # Configuration
  │   └── utils/         # Utilitaires
  ```

### 9.4 Base de Données

#### Tables Principales
1. **users** - Utilisateurs du système
2. **roles** - Rôles et permissions (JSONB)
3. **guests** - Clients de l'hôtel
4. **rooms** - Chambres
5. **bookings** - Réservations
6. **payments** - Paiements
7. **notifications** - Notifications
8. **user_settings** - Paramètres utilisateur
9. **audit_logs** - Journal d'audit
10. **guest_reviews** - Avis clients (pour IA)

#### Tables Restaurant (NOUVEAU)
11. **restaurant_menu_categories** - Catégories menu restaurant
12. **restaurant_menu_items** - Articles du menu
13. **restaurant_tables** - Tables du restaurant
14. **restaurant_orders** - Commandes restaurant
15. **restaurant_order_items** - Détails commandes (articles)
16. **restaurant_table_reservations** - Réservations de tables

#### Tables Spa (NOUVEAU)
17. **spa_treatments** - Soins spa
18. **spa_packages** - Forfaits spa
19. **spa_package_treatments** - Liaison forfaits-soins
20. **spa_bookings** - Réservations spa
21. **spa_payments** - Paiements spa

#### Relations
- bookings → guests (many-to-one)
- bookings → rooms (many-to-one)
- bookings → users (created_by)
- payments → bookings (many-to-one)
- notifications → users (many-to-one)
- user_settings → users (one-to-one)
- users → roles (many-to-one)
- restaurant_orders → bookings (many-to-one, optionnel)
- restaurant_orders → guests (many-to-one, optionnel)
- restaurant_orders → rooms (many-to-one, optionnel)
- restaurant_orders → restaurant_tables (many-to-one, optionnel)
- restaurant_order_items → restaurant_orders (many-to-one)
- restaurant_order_items → restaurant_menu_items (many-to-one)
- spa_bookings → guests (many-to-one, optionnel)
- spa_bookings → bookings (many-to-one, optionnel)
- spa_bookings → spa_treatments (many-to-one, optionnel)
- spa_bookings → spa_packages (many-to-one, optionnel)

### 9.5 API REST

#### Endpoints Principaux
```
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/dashboard/stats
GET    /api/dashboard/recent-bookings

GET    /api/bookings
POST   /api/bookings
PUT    /api/bookings/:id
DELETE /api/bookings/:id

GET    /api/rooms
POST   /api/rooms
PUT    /api/rooms/:id
DELETE /api/rooms/:id

GET    /api/guests
POST   /api/guests
PUT    /api/guests/:id
DELETE /api/guests/:id

GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

GET    /api/payments
POST   /api/payments

GET    /api/notifications
PUT    /api/notifications/:id/read
DELETE /api/notifications/:id

POST   /api/ai/chat
POST   /api/ai/recommend-room
POST   /api/ai/generate-message
GET    /api/ai/sentiment-analysis
GET    /api/ai/predict-occupancy

GET    /api/restaurant/menu/categories
GET    /api/restaurant/menu/items
POST   /api/restaurant/menu/items
PUT    /api/restaurant/menu/items/:id
DELETE /api/restaurant/menu/items/:id

GET    /api/restaurant/tables
PUT    /api/restaurant/tables/:id/status

GET    /api/restaurant/orders
GET    /api/restaurant/orders/:id
POST   /api/restaurant/orders
PUT    /api/restaurant/orders/:id/status
PUT    /api/restaurant/orders/:id/payment

GET    /api/restaurant/reservations
POST   /api/restaurant/reservations
PUT    /api/restaurant/reservations/:id/status

GET    /api/restaurant/stats

GET    /api/spa/treatments
POST   /api/spa/treatments
PUT    /api/spa/treatments/:id
DELETE /api/spa/treatments/:id

GET    /api/spa/packages
POST   /api/spa/packages
PUT    /api/spa/packages/:id
DELETE /api/spa/packages/:id

GET    /api/spa/bookings
POST   /api/spa/bookings
PUT    /api/spa/bookings/:id
DELETE /api/spa/bookings/:id

GET    /api/spa/stats
```

---

## 10. SÉCURITÉ

### 10.1 Authentification
- **Méthode**: JWT (JSON Web Tokens)
- **Durée**: 24 heures
- **Stockage**: localStorage (frontend)
- **Transmission**: Header Authorization: Bearer <token>
- **Validation**: Middleware sur toutes les routes protégées


### 10.2 Autorisation
- **Modèle**: RBAC (Role-Based Access Control) avec permissions JSONB
- **Structure Permissions**: Format hiérarchique (ex: `restaurant.menu.create`)
- **Stockage**: Table `roles` avec colonne `permissions` (JSONB)
- **Vérification**: 
  - Frontend: Masquage UI selon permissions
  - Backend: Middleware `checkPermission` sur toutes les routes protégées
- **Middleware**:
  - `checkPermission(resource, action)` - Vérification permission unique
  - `checkAnyPermission(permissionPairs[])` - Vérification permissions multiples (OR)
  - `checkOwnership(resource, action, check)` - Vérification ownership
- **Bypass**: Admin et Manager ont accès complet automatique
- **Granularité**: Permissions au niveau action (create, read, update, delete, update_status, etc.)

### 10.3 Protection des Données
- **En transit**: HTTPS/TLS 1.3
- **Au repos**: Chiffrement base de données
- **Mots de passe**: bcrypt (salt rounds: 10)
- **Données sensibles**: Jamais en logs
- **Backup**: Chiffré, stockage sécurisé

### 10.4 Validation des Entrées
- **Frontend**: Validation formulaires
- **Backend**: Validation obligatoire
- **Sanitisation**: Nettoyage des entrées
- **Types**: Vérification des types de données
- **Longueurs**: Limites sur tous les champs

### 10.5 Protection contre les Attaques
- **SQL Injection**: Requêtes paramétrées
- **XSS**: Échappement des sorties
- **CSRF**: Tokens CSRF (futur)
- **Brute Force**: Rate limiting
- **DDoS**: Cloudflare (via Vercel/Render)

### 10.6 Audit et Logs
- **Actions sensibles**: Journalisées
- **Connexions**: Horodatées et tracées
- **Modifications**: Qui, quoi, quand
- **Erreurs**: Loguées sans données sensibles
- **Conservation**: 1 an minimum

---

## 11. DÉPLOIEMENT

### 11.1 Environnements

#### Production
- **Frontend**: Vercel (https://votre-hotel.vercel.app)
- **Backend**: Render (https://votre-backend.onrender.com)
- **Base de données**: Supabase
- **Domaine**: Personnalisable

#### Développement
- **Frontend**: localhost:5173
- **Backend**: localhost:3000
- **Base de données**: Supabase (projet dev)

### 11.2 Variables d'Environnement

#### Frontend (.env)
```
VITE_API_URL=https://votre-backend.onrender.com
```

#### Backend (.env)
```
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=votre_secret_jwt
GEMINI_API_KEY=votre_cle_gemini
NODE_ENV=production
```

### 11.3 Processus de Déploiement

#### Frontend (Vercel)
1. Push code sur GitHub
2. Vercel détecte automatiquement
3. Build et déploiement automatique
4. URL de production mise à jour
5. Durée: 2-3 minutes

#### Backend (Render)
1. Push code sur GitHub
2. Render détecte automatiquement
3. Build et déploiement automatique
4. Service redémarré
5. Durée: 3-5 minutes


### 11.4 Rollback
- **Vercel**: Rollback instantané via dashboard
- **Render**: Redéploiement commit précédent
- **Base de données**: Backup restauration

### 11.5 Monitoring
- **Vercel**: Analytics intégré
- **Render**: Logs et métriques
- **Supabase**: Monitoring base de données
- **Uptime**: Monitoring externe (UptimeRobot)

---

## 12. MAINTENANCE ET SUPPORT

### 12.1 Maintenance Préventive
- **Mises à jour**: Mensuelles
- **Sécurité**: Patches immédiats
- **Dépendances**: Audit trimestriel
- **Performance**: Optimisation continue
- **Backup**: Quotidien automatique

### 12.2 Maintenance Corrective
- **Bugs critiques**: < 4 heures
- **Bugs majeurs**: < 24 heures
- **Bugs mineurs**: < 1 semaine
- **Améliorations**: Planifiées

### 12.3 Support Utilisateurs
- **Documentation**: En ligne, toujours à jour
- **FAQ**: Questions fréquentes
- **Tutoriels**: Vidéos et guides
- **Support technique**: Email/Chat
- **Formation**: Sessions initiales

### 12.4 Évolutions Futures

#### Court Terme (3-6 mois)
- [ ] Application mobile native
- [ ] Notifications push
- [ ] Export PDF avancé
- [ ] Intégration email (SMTP)
- [ ] Calendrier visuel des réservations

#### Moyen Terme (6-12 mois)
- [ ] Module restaurant/bar
- [ ] Gestion des événements
- [ ] Programme de fidélité
- [ ] Intégration OTA (Booking.com, etc.)
- [ ] API publique pour partenaires

#### Long Terme (12+ mois)
- [ ] Multi-hôtels (chaîne)
- [ ] Business Intelligence avancé
- [ ] Prédictions IA avancées
- [ ] Intégration IoT (serrures connectées)
- [ ] Marketplace de services

---

## 13. LIVRABLES

### 13.1 Code Source
✅ Repository GitHub complet
✅ Code frontend (React + TypeScript)
✅ Code backend (Node.js + TypeScript)
✅ Scripts SQL (schéma + seed data)
✅ Fichiers de configuration

### 13.2 Documentation
✅ README.md principal
✅ Guide d'installation (INSTALL.md)
✅ Guide de déploiement (DEPLOYMENT.md)
✅ Documentation API (API_DOCUMENTATION.md)
✅ Architecture (ARCHITECTURE.md)
✅ Guide utilisateur (ce document)


### 13.3 Application Déployée
✅ Frontend en production (Vercel)
✅ Backend en production (Render)
✅ Base de données configurée (Supabase)
✅ Variables d'environnement configurées
✅ Domaine personnalisé (optionnel)

### 13.4 Données de Test
✅ Utilisateurs de test (tous rôles)
✅ Chambres de test
✅ Clients de test
✅ Réservations de test
✅ Paiements de test

---

## 14. GLOSSAIRE

**PMS**: Property Management System - Système de gestion hôtelière

**Check-in**: Arrivée et enregistrement d'un client

**Check-out**: Départ et libération de chambre

**Housekeeping**: Service d'entretien et nettoyage

**Front Desk**: Réception de l'hôtel

**OTA**: Online Travel Agency - Agence de voyage en ligne

**RBAC**: Role-Based Access Control - Contrôle d'accès basé sur les rôles

**JWT**: JSON Web Token - Token d'authentification

**API**: Application Programming Interface

**CRUD**: Create, Read, Update, Delete

**RGPD**: Règlement Général sur la Protection des Données

**HTTPS**: HyperText Transfer Protocol Secure

**SQL**: Structured Query Language

**REST**: Representational State Transfer

**UI/UX**: User Interface / User Experience

---

## 15. ANNEXES

### 15.1 Comptes de Test

#### Administrateur
- Email: admin@hotel.com
- Mot de passe: admin123
- Rôle: Admin
- Accès: Complet

#### Manager
- Email: manager@hotel.com
- Mot de passe: manager123
- Rôle: Manager
- Accès: Opérationnel complet

#### Réceptionniste
- Email: receptionist@hotel.com
- Mot de passe: receptionist123
- Rôle: Receptionist
- Accès: Front office

#### Housekeeping
- Email: housekeeping@hotel.com
- Mot de passe: housekeeping123
- Rôle: Housekeeping
- Accès: Nettoyage

#### Maintenance
- Email: maintenance@hotel.com
- Mot de passe: maintenance123
- Rôle: Maintenance
- Accès: Maintenance

#### Comptable
- Email: accountant@hotel.com
- Mot de passe: accountant123
- Rôle: Accountant
- Accès: Finances

#### Serveur Restaurant (NOUVEAU)
- Email: serveur@hotel.com
- Mot de passe: serveur123
- Rôle: Restaurant Server
- Accès: Création commandes restaurant

#### Caissier Restaurant (NOUVEAU)
- Email: caissier@hotel.com
- Mot de passe: caissier123
- Rôle: Restaurant Cashier
- Accès: Encaissements restaurant

#### Responsable Restaurant (NOUVEAU)
- Email: resto-manager@hotel.com
- Mot de passe: restaurant123
- Rôle: Restaurant Manager
- Accès: Gestion complète restaurant

#### Chef de Cuisine (NOUVEAU)
- Email: chef@hotel.com
- Mot de passe: chef123
- Rôle: Restaurant Chef
- Accès: Cuisine et production


### 15.2 Types de Chambres

| Type    | Capacité | Prix/Nuit | Description                    |
|---------|----------|-----------|--------------------------------|
| Single  | 1-2      | 99€       | Chambre simple, lit double     |
| Double  | 2-3      | 149€      | Chambre double, deux lits      |
| Suite   | 2-4      | 299€      | Suite avec salon séparé        |
| Deluxe  | 2-4      | 399€      | Suite deluxe, vue panoramique  |

### 15.3 Statuts des Réservations

| Statut       | Description                           | Couleur  |
|--------------|---------------------------------------|----------|
| Pending      | En attente de confirmation            | Jaune    |
| Confirmed    | Confirmée, en attente d'arrivée       | Bleu     |
| Checked-in   | Client arrivé, séjour en cours        | Vert     |
| Checked-out  | Client parti, séjour terminé          | Gris     |
| Cancelled    | Réservation annulée                   | Rouge    |

### 15.4 Statuts des Chambres

| Statut      | Description                    | Couleur  | Action Suivante        |
|-------------|--------------------------------|----------|------------------------|
| Available   | Disponible à la réservation    | Vert     | Réserver               |
| Occupied    | Occupée par un client          | Rouge    | Attendre check-out     |
| Dirty       | À nettoyer après départ        | Orange   | Nettoyer               |
| Cleaning    | Nettoyage en cours             | Jaune    | Terminer nettoyage     |
| Maintenance | En maintenance, hors service   | Violet   | Réparer                |

### 15.5 Méthodes de Paiement

| Méthode  | Description                    | Frais    |
|----------|--------------------------------|----------|
| Cash     | Espèces                        | 0%       |
| Card     | Carte bancaire                 | 0%       |
| Transfer | Virement bancaire              | 0%       |

### 15.6 Langues Supportées

| Code | Langue    | Statut      | Traduction |
|------|-----------|-------------|------------|
| fr   | Français  | ✅ Complet  | 100%       |
| en   | English   | ✅ Complet  | 100%       |
| es   | Español   | ✅ Complet  | 100%       |

### 15.7 Thèmes Disponibles

| Thème   | Description                           |
|---------|---------------------------------------|
| Light   | Thème clair (fond blanc)              |
| Dark    | Thème sombre (fond noir)              |
| System  | Suit les préférences du système       |

---

## 16. CONTACTS ET SUPPORT

### 16.1 Équipe Projet
- **Développeur Principal**: [Votre Nom]
- **Email**: [votre.email@hotel.com]
- **GitHub**: [votre-username]

### 16.2 Ressources
- **Repository**: https://github.com/votre-username/hotel-pms
- **Documentation**: https://github.com/votre-username/hotel-pms/wiki
- **Issues**: https://github.com/votre-username/hotel-pms/issues
- **Démo**: https://votre-hotel.vercel.app

### 16.3 Support Technique
- **Email**: support@hotel.com
- **Heures**: Lundi-Vendredi, 9h-18h
- **Urgences**: 24/7 pour bugs critiques
- **Délai de réponse**: < 24 heures

---

## 17. VALIDATION ET ACCEPTATION

### 17.1 Critères d'Acceptation
✅ Toutes les fonctionnalités spécifiées sont implémentées
✅ Tests de sécurité passés
✅ Performance conforme aux exigences
✅ Documentation complète fournie
✅ Formation utilisateurs effectuée
✅ Déploiement en production réussi
✅ Période de garantie de 30 jours

### 17.2 Recette Fonctionnelle
- [ ] Test de tous les modules
- [ ] Test de tous les rôles
- [ ] Test des workflows complets
- [ ] Test de la sécurité
- [ ] Test de performance
- [ ] Test de compatibilité navigateurs
- [ ] Test responsive (mobile/tablette)

### 17.3 Mise en Production
- [ ] Backup base de données
- [ ] Configuration environnement production
- [ ] Déploiement frontend
- [ ] Déploiement backend
- [ ] Vérification fonctionnelle
- [ ] Formation utilisateurs
- [ ] Documentation remise
- [ ] Support post-déploiement

---

## 18. HISTORIQUE DES VERSIONS

### Version 2.0 - 2 Juin 2026
**Ajouts Majeurs**:
- ✅ Module Restaurant & Bar complet
  - Gestion menu (catégories, articles, prix)
  - Gestion commandes (room service, dine-in, takeaway, bar)
  - Gestion tables et réservations
  - Statistiques et rapports restaurant
  - Intégration paiements et folio chambre
- ✅ Module Spa & Wellness complet
  - Gestion soins et forfaits
  - Réservations spa
  - Intégration clients hôtel
  - Statistiques spa
- ✅ Système RBAC avancé
  - 4 nouveaux rôles restaurant (Serveur, Caissier, Manager, Chef)
  - Permissions granulaires (JSONB)
  - Middleware backend protection routes
  - Interface conditionnelle frontend
  - Extension rôle réceptionniste pour restaurant
- ✅ Tables database: 21 tables (vs 9 initialement)
- ✅ Endpoints API: +30 nouveaux endpoints
- ✅ Comptes de test: +4 rôles restaurant

**Améliorations**:
- Rafraîchissement automatique données (30s)
- Permissions granulaires au niveau action
- Double validation frontend/backend
- Architecture modulaire extensible

### Version 1.0 - 30 Mai 2026
**Version Initiale**:
- Modules hôtel de base (Dashboard, Réservations, Chambres, Clients, Front Desk, Housekeeping, Maintenance, Paiements, Personnel, Rapports, Notifications, Paramètres)
- Intelligence Artificielle (Google Gemini)
- 6 rôles de base (Admin, Manager, Réceptionniste, Housekeeping, Maintenance, Comptable)
- Authentification JWT
- Déploiement Vercel + Render + Supabase

---

**Document créé le**: 30 Mai 2026  
**Dernière mise à jour**: 2 Juin 2026  
**Version**: 2.0  
**Statut**: ✅ Complet et Validé - Inclut Modules Restaurant & Spa + RBAC

---

*Ce cahier des charges constitue le document de référence pour le développement, le déploiement et la maintenance du système de gestion hôtelière Grand Hôtel Seafoam.*
