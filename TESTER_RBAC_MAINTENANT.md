# 🧪 TESTER LE RBAC RESTAURANT - GUIDE RAPIDE

## ⏱️ ATTENDRE 3 MINUTES

Vercel est en train de déployer les changements. Attendez **3 minutes** avant de tester.

URL : https://zen-lyart.vercel.app

---

## 🧪 TEST 1 : CHEF DE CUISINE (5 minutes)

### Étape 1 : Créer un utilisateur Chef
1. Se connecter en tant qu'**Admin**
2. Aller sur **Staff**
3. Cliquer **Add Staff**
4. Remplir :
   - Prénom : Test
   - Nom : Chef
   - Email : chef@test.com
   - Téléphone : 0600000001
   - **Rôle : Chef de Cuisine**
   - Mot de passe : test123
5. Cliquer **Add Staff**

### Étape 2 : Se connecter en tant que Chef
1. Se déconnecter
2. Se connecter avec :
   - Email : chef@test.com
   - Password : test123

### Étape 3 : Vérifier le Dashboard
✅ Vous devez voir :
- Titre : "🍳 Tableau de Bord - Chef"
- 3 cartes : Commandes en Attente, En Préparation, Prêtes à Servir
- Section "📋 Commandes Actives"
- Section "📊 Statistiques de Production"

### Étape 4 : Vérifier la Sidebar
✅ Vous devez voir SEULEMENT :
- Dashboard
- Restaurant
- Notifications
- Profile

❌ Vous NE devez PAS voir :
- Bookings, Rooms, Guests, Payments, Staff, etc.

### Étape 5 : Tester Restaurant
1. Cliquer sur **Restaurant** dans la sidebar
2. ✅ Vous devez voir : "Cuisine - Vue Chef"
3. ✅ Deux onglets : Commandes, Menu
4. ✅ Filtres : Actives, En attente, En cours, Prêtes

### Étape 6 : Créer une commande (avec Admin)
1. Se déconnecter du Chef
2. Se reconnecter en tant qu'Admin
3. Aller sur Restaurant
4. Cliquer **Nouvelle Commande**
5. Créer une commande

### Étape 7 : Voir la commande en tant que Chef
1. Se déconnecter de l'Admin
2. Se reconnecter en tant que Chef
3. Aller sur Restaurant
4. ✅ La commande doit apparaître avec statut "En attente"
5. Cliquer **▶️ Commencer**
6. ✅ Le statut devient "En préparation" (orange)
7. Cliquer **✅ Prête**
8. ✅ Le statut devient "Prête" (vert)

---

## 🧪 TEST 2 : CAISSIER RESTAURANT (3 minutes)

### Étape 1 : Créer un utilisateur Caissier
1. Se connecter en tant qu'**Admin**
2. Aller sur **Staff**
3. Cliquer **Add Staff**
4. Remplir :
   - Prénom : Test
   - Nom : Cashier
   - Email : cashier@test.com
   - **Rôle : Caissier Restaurant**
   - Mot de passe : test123
5. Cliquer **Add Staff**

### Étape 2 : Se connecter en tant que Caissier
1. Se déconnecter
2. Se connecter avec cashier@test.com / test123

### Étape 3 : Vérifier le Dashboard
✅ Vous devez voir :
- Titre : "💳 Tableau de Bord - Caissier"
- 3 cartes : Revenus du Jour, Paiements en Attente, Transactions

### Étape 4 : Vérifier Payments
1. Cliquer sur **Payments** dans la sidebar
2. ✅ Vous devez voir SEULEMENT les paiements restaurant
3. ✅ Les paiements doivent avoir "REST-" dans le numéro de transaction
4. ❌ Aucun paiement d'hôtel ne doit apparaître

---

## 🧪 TEST 3 : MANAGER RESTAURANT (3 minutes)

### Étape 1 : Créer un utilisateur Manager
1. Se connecter en tant qu'**Admin**
2. Aller sur **Staff**
3. Cliquer **Add Staff**
4. Remplir :
   - Prénom : Test
   - Nom : Manager
   - Email : manager@test.com
   - **Rôle : Manager Restaurant**
   - Mot de passe : test123
5. Cliquer **Add Staff**

### Étape 2 : Se connecter en tant que Manager
1. Se déconnecter
2. Se connecter avec manager@test.com / test123

### Étape 3 : Vérifier le Dashboard
✅ Vous devez voir :
- Titre : "👨‍💼 Tableau de Bord - Manager Restaurant"
- 4 cartes : Commandes Actives, Revenus, Tables, Clients
- Section "📊 Performance du Jour"
- Section "⚡ Vue Rapide"

### Étape 4 : Vérifier Staff
1. Cliquer sur **Staff** dans la sidebar
2. ✅ Vous devez voir SEULEMENT le staff restaurant :
   - Serveur Restaurant
   - Caissier Restaurant
   - Chef de Cuisine
   - Manager Restaurant
3. ❌ Aucun staff hôtel ne doit apparaître (receptionist, housekeeping, etc.)

---

## 🧪 TEST 4 : SERVEUR RESTAURANT (2 minutes)

### Étape 1 : Créer un utilisateur Serveur
1. Se connecter en tant qu'**Admin**
2. Aller sur **Staff**
3. Créer avec rôle **Serveur Restaurant**

### Étape 2 : Vérifier le Dashboard
✅ Titre : "🍽️ Tableau de Bord - Serveur"  
✅ 3 cartes : Tables Disponibles, Mes Commandes, Commandes Servies

---

## ✅ CHECKLIST DE VALIDATION

### Dashboard
- [ ] Chef : 3 cartes + commandes actives + stats production
- [ ] Serveur : 3 cartes + mes dernières commandes
- [ ] Caissier : 3 cartes + paiements en attente
- [ ] Manager : 4 cartes + performance + vue rapide

### Restaurant
- [ ] Chef : Vue cuisine avec filtres et boutons statut
- [ ] Serveur : Vue complète avec création commandes
- [ ] Caissier : Vue complète avec paiements
- [ ] Manager : Vue complète tous accès

### Staff
- [ ] Manager Restaurant : Voit seulement staff restaurant
- [ ] Admin : Voit tout le staff
- [ ] Chef/Serveur/Caissier : N'a pas accès à Staff

### Payments
- [ ] Caissier Restaurant : Voit seulement paiements restaurant
- [ ] Admin : Voit tous les paiements
- [ ] Chef/Serveur : N'a pas accès à Payments

### Sidebar
- [ ] Chef : Dashboard, Restaurant, Notifications
- [ ] Serveur : Dashboard, Restaurant, Notifications
- [ ] Caissier : Dashboard, Restaurant, Payments, Notifications
- [ ] Manager : Dashboard, Restaurant, Staff, Payments, Notifications

---

## 🐛 PROBLÈMES CONNUS

### Problème : Les rôles restaurant n'apparaissent pas dans Staff
**Solution** : Vérifier que le script `FIX_ROLE_CONSTRAINT.sql` a été exécuté dans Supabase

### Problème : Erreur 500 lors de la création d'un staff restaurant
**Solution** : La constraint de la base de données bloque. Exécuter le script SQL de fix.

### Problème : Le dashboard n'est pas personnalisé
**Solution** : Vider le cache du navigateur (Ctrl+Shift+R) et recharger

### Problème : Les paiements restaurant n'apparaissent pas
**Solution** : Créer des commandes restaurant d'abord via Admin

---

## 📞 SUPPORT

Si vous rencontrez des problèmes :
1. Vérifier que vous attendu 3 minutes après le push
2. Vider le cache du navigateur
3. Vérifier la console du navigateur (F12)
4. Vérifier que les rôles existent en base de données

---

## 🎉 SUCCÈS

Si tous les tests passent, l'implémentation RBAC est **COMPLÈTE** et **FONCTIONNELLE** ! 🎊

**Temps de test estimé** : 15 minutes  
**Nombre de comptes à créer** : 4 (Chef, Serveur, Caissier, Manager)
