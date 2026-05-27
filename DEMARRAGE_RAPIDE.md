# 🚀 Guide de Démarrage Rapide

## Bienvenue dans votre Système de Gestion Hôtelière !

Ce guide vous aidera à démarrer rapidement avec votre nouveau système.

---

## 📱 Accéder à l'Application

### URL de Production
```
Frontend: https://votre-app.vercel.app
Backend: https://votre-backend.onrender.com
```

### Première Connexion
1. Ouvrez votre navigateur (Chrome, Firefox, Edge)
2. Allez sur votre URL Vercel
3. Vous verrez la page de connexion en **français**

---

## 🔐 Se Connecter

### Compte Administrateur (Accès Complet)
```
📧 Email: admin@hotel.com
🔒 Mot de passe: admin123
```

**Cliquez sur "Administrateur" dans les comptes de démonstration pour remplir automatiquement.**

### Autres Comptes Disponibles
```
👤 Gestionnaire
   Email: manager@hotel.com
   Mot de passe: password123

👤 Réceptionniste
   Email: receptionist@hotel.com
   Mot de passe: password123
```

---

## 🏠 Tableau de Bord

Après connexion, vous arrivez sur le **Tableau de bord** qui affiche:

### Statistiques Principales
- 💰 **Revenu total** - Revenus des 30 derniers jours
- 📈 **Taux d'occupation** - Pourcentage de chambres occupées
- 📅 **Réservations totales** - Nombre total de réservations
- 🏨 **Chambres disponibles** - Chambres prêtes à réserver

### Graphiques
- 📊 **Aperçu des revenus** - Évolution mensuelle
- 📈 **Tendances des réservations** - Réservations sur 30 jours
- 🏨 **Occupation des chambres** - Répartition par statut

### Activités Récentes
- Liste des 10 dernières réservations
- Statuts et dates

### 🤖 Insights IA (En Bas)
- Analyses intelligentes de vos données
- Recommandations de tarification
- Prévisions de revenus
- **Note:** Nécessite une clé API Gemini

---

## 📋 Navigation Rapide

### Menu Principal (Barre Latérale)

#### 🏠 Tableau de bord
Vue d'ensemble de l'hôtel

#### 📅 Réservations
- Créer une nouvelle réservation
- Voir toutes les réservations
- Gérer les arrivées/départs
- Modifier les statuts

#### 🏨 Chambres
- Ajouter des chambres
- Modifier les chambres
- Changer les statuts
- Réservation rapide

#### 👥 Clients
- Ajouter des clients
- Voir l'historique
- Gérer les informations

#### 💰 Paiements
- Traiter les paiements
- Voir l'historique
- Paiements en attente

#### 👔 Personnel
- Gérer les employés
- Assigner les rôles
- Activer/Désactiver

#### 🧹 Ménage
- Chambres sales
- Chambres en nettoyage
- Marquer comme propre

#### 🔧 Maintenance
- Tâches urgentes
- Tâches normales
- Terminer les tâches

#### 📊 Rapports
- Rapports de revenus
- Rapports d'occupation
- Exporter en PDF/Excel

#### 🔔 Notifications
- Voir les alertes
- Marquer comme lu
- Effacer tout

#### ⚙️ Paramètres
- Informations de l'hôtel
- Apparence (thème, langue)
- Notifications
- Signature de facture

---

## 🎯 Tâches Courantes

### 1. Créer une Réservation

```
1. Cliquez sur "Réservations" dans le menu
2. Cliquez sur "Nouvelle réservation"
3. Remplissez le formulaire:
   - Nom du client
   - Chambre
   - Date d'arrivée
   - Date de départ
   - Nombre de clients
   - Demandes spéciales (optionnel)
4. Cliquez sur "Créer la réservation"
```

**Astuce:** Si le client n'existe pas, il sera créé automatiquement avec un profil minimal.

### 2. Enregistrer une Arrivée (Check-in)

```
1. Allez dans "Réception"
2. Section "Arrivées aujourd'hui"
3. Trouvez la réservation
4. Cliquez sur "Enregistrer l'arrivée"
5. Confirmez
```

**Résultat:** 
- Statut de la réservation → "Arrivé"
- Statut de la chambre → "Occupé"

### 3. Enregistrer un Départ (Check-out)

```
1. Allez dans "Réception"
2. Section "Départs aujourd'hui"
3. Trouvez la réservation
4. Cliquez sur "Enregistrer le départ"
5. Confirmez
```

**Résultat:**
- Statut de la réservation → "Parti"
- Statut de la chambre → "Sale"
- Notification envoyée au ménage

### 4. Traiter un Paiement

```
1. Allez dans "Paiements"
2. Cliquez sur "Traiter le paiement"
3. Sélectionnez la réservation
4. Entrez le montant
5. Choisissez la méthode:
   - Espèces
   - Carte
   - Mobile Money
   - Virement bancaire
6. Cliquez sur "Traiter"
```

### 5. Nettoyer une Chambre

```
1. Allez dans "Ménage"
2. Section "Chambres sales"
3. Trouvez la chambre
4. Cliquez sur "Commencer le nettoyage"
5. Une fois terminé, cliquez sur "Marquer comme propre"
```

**Résultat:**
- Statut de la chambre → "Disponible"
- Notification envoyée à la réception

### 6. Signaler une Maintenance

```
1. Allez dans "Chambres"
2. Trouvez la chambre
3. Cliquez sur "Modifier"
4. Changez le statut en "Maintenance"
5. Entrez la raison (obligatoire)
6. Cochez "Urgent" si nécessaire
7. Enregistrez
```

**Résultat:**
- Notification envoyée à l'équipe de maintenance
- Chambre marquée comme indisponible

---

## ⚙️ Personnaliser le Système

### Changer la Langue

```
1. Cliquez sur "Paramètres"
2. Section "Apparence"
3. Langue → Sélectionnez:
   - French (Français) ✅
   - English (Anglais)
   - Spanish (Espagnol)
4. Cliquez sur "Enregistrer les modifications"
```

### Changer le Thème

```
1. Paramètres > Apparence
2. Thème → Sélectionnez:
   - Clair (fond blanc)
   - Sombre (fond noir) ✅
   - Système (suit votre OS)
3. Enregistrez
```

### Modifier les Informations de l'Hôtel

```
1. Paramètres > Général
2. Modifiez:
   - Nom de l'hôtel
   - Adresse
   - Téléphone
   - Email
   - Fuseau horaire
3. Enregistrez
```

### Ajouter une Signature de Facture

```
1. Paramètres > Signature de facture
2. Cliquez sur "Dessiner une signature"
3. Dessinez avec la souris/doigt
4. Cliquez sur "Enregistrer la signature"
5. Cliquez sur "Enregistrer les modifications"
```

---

## 🤖 Activer l'IA (Optionnel)

### Obtenir une Clé API Gemini (Gratuit)

```
1. Allez sur https://aistudio.google.com/app/apikey
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Create API Key"
4. Copiez la clé
```

### Ajouter la Clé dans Render

```
1. Allez sur https://dashboard.render.com
2. Sélectionnez votre service backend
3. Onglet "Environment"
4. Cliquez sur "Add Environment Variable"
5. Name: GEMINI_API_KEY
6. Value: collez votre clé
7. Cliquez sur "Save Changes"
8. Attendez 2-3 minutes (redéploiement automatique)
```

### Tester l'IA

```
1. Connectez-vous comme Admin ou Gestionnaire
2. Allez sur le Tableau de bord
3. Scrollez tout en bas
4. Section "Insights IA"
5. Cliquez sur "Générer des insights"
6. Attendez 2-5 secondes
7. Voyez les recommandations !
```

---

## 📊 Comprendre les Statuts

### Statuts des Chambres
| Statut | Signification | Couleur |
|--------|---------------|---------|
| Disponible | Prête à réserver | Vert |
| Occupé | Client présent | Bleu |
| Sale | Nécessite nettoyage | Orange |
| Nettoyage | En cours de nettoyage | Jaune |
| Maintenance | En réparation | Rouge |

### Statuts des Réservations
| Statut | Signification | Action |
|--------|---------------|--------|
| En attente | Pas encore confirmé | Confirmer |
| Confirmé | Réservation validée | Attendre arrivée |
| Arrivé | Client présent | Gérer séjour |
| Parti | Client parti | Nettoyer chambre |
| Annulé | Réservation annulée | Archiver |

### Statuts des Paiements
| Statut | Signification |
|--------|---------------|
| En attente | Pas encore payé |
| Complété | Payé avec succès |
| Échoué | Paiement refusé |
| Remboursé | Argent rendu |

---

## 🔔 Notifications

### Types de Notifications
- 📅 **Réservation** - Nouvelles réservations, modifications
- 💰 **Paiement** - Paiements reçus, en attente
- 🏨 **Chambre** - Changements de statut
- 👤 **Arrivée/Départ** - Check-in/Check-out
- 🔧 **Maintenance** - Tâches urgentes
- 🧹 **Ménage** - Chambres à nettoyer
- ⚙️ **Système** - Mises à jour, alertes

### Gérer les Notifications
```
1. Cliquez sur l'icône 🔔 en haut à droite
2. Voyez le nombre de notifications non lues
3. Cliquez pour ouvrir le panneau
4. Actions disponibles:
   - Marquer tout comme lu
   - Effacer tout
   - Supprimer individuellement
```

---

## 👥 Rôles et Permissions

### Administrateur (Admin)
✅ Accès complet à tout
- Gérer le personnel
- Modifier les paramètres
- Voir tous les rapports
- Accéder à l'IA

### Gestionnaire (Manager)
✅ Gestion des opérations
- Gérer les réservations
- Voir les rapports
- Gérer les chambres
- Accéder à l'IA

### Réceptionniste
✅ Gestion des clients
- Créer des réservations
- Check-in/Check-out
- Gérer les clients
- Traiter les paiements

### Ménage (Housekeeping)
✅ Nettoyage
- Voir les chambres sales
- Marquer comme propre
- Voir les tâches

### Maintenance
✅ Réparations
- Voir les tâches de maintenance
- Marquer comme terminé
- Signaler des problèmes

### Comptable (Accountant)
✅ Finances
- Voir les paiements
- Générer des rapports
- Voir les revenus

---

## 🆘 Aide Rapide

### Problème: Page blanche
```
Solution:
1. Effacez le cache (Ctrl+Shift+Delete)
2. Faites un hard refresh (Ctrl+Shift+R)
3. Réessayez
```

### Problème: Pas en français
```
Solution:
1. Allez dans Paramètres
2. Apparence > Langue
3. Sélectionnez "French"
4. Enregistrez
```

### Problème: Erreur de connexion
```
Solution:
1. Vérifiez l'email et le mot de passe
2. Essayez admin@hotel.com / admin123
3. Vérifiez que le backend est en ligne
```

### Problème: IA ne fonctionne pas
```
Solution:
1. Vérifiez que GEMINI_API_KEY est dans Render
2. Attendez 2-3 minutes après l'ajout
3. Connectez-vous comme Admin ou Manager
4. Scrollez en bas du Dashboard
```

---

## 📞 Support

### Documentation
- `CONFIGURATION_FRANCAIS.md` - Configuration détaillée
- `RESUME_FINAL.md` - Résumé complet
- `AI_STATUS_SUMMARY.md` - Statut de l'IA
- `CURRENT_STATUS.md` - Statut du système

### Dépannage
1. Consultez la console (F12)
2. Vérifiez les logs Render
3. Lisez les guides de dépannage

---

## 🎉 Bon Démarrage !

Vous êtes maintenant prêt à utiliser votre système de gestion hôtelière !

**Conseils:**
- Explorez chaque section
- Testez avec des données fictives
- Personnalisez selon vos besoins
- Activez l'IA pour plus de fonctionnalités

**Bonne gestion ! 🏨✨**
