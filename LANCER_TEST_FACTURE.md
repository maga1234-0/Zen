# 🚀 LANCER LE TEST DE FACTURE CONSOLIDÉE

## ✅ Le script est FINALEMENT prêt !

**Fichier** : `database/TEST_FACTURE_FINAL.sql`

**Toutes les corrections incluses** :
- ✅ `number_of_guests` ajouté
- ✅ `payment_status = 'unpaid'`
- ✅ `status` (pas `order_status`)
- ✅ **`subtotal` calculé automatiquement** (quantity × unit_price)
- ✅ Gestion d'erreurs si aucune réservation
- ✅ Messages de confirmation détaillés

---

## 📋 ÉTAPES SIMPLES

### 1️⃣ Assurez-vous d'avoir une réservation

**Option A** : Utilisez une réservation existante
- Si vous avez déjà des réservations → Passez à l'étape 2

**Option B** : Créez une nouvelle réservation
1. Ouvrez : https://zen-lyart.vercel.app
2. Connectez-vous : aubinmaga@gmail.com / admin123
3. Allez dans : **Front Desk** → **Réservations**
4. Cliquez : **Nouvelle Réservation**
5. Remplissez le formulaire et enregistrez

---

### 2️⃣ Exécutez le script SQL

1. **Ouvrez Supabase** : https://supabase.com/dashboard
2. **Sélectionnez** votre projet
3. **Menu** → **SQL Editor**
4. **Cliquez** sur **"New query"**
5. **Copiez** le contenu de `database/TEST_FACTURE_FINAL.sql`
6. **Collez** dans l'éditeur
7. **Cliquez** sur **"Run"** (ou Ctrl + Enter)

---

### 3️⃣ Vérifiez le résultat

**Vous devriez voir** :
```
NOTICE: ✅ Réservation trouvée: Aubin Maga
NOTICE:    Chambre: 101
NOTICE: ✅ Commande restaurant créée
NOTICE: ✅ Items ajoutés (5 items, total: 85.50€)
NOTICE: ✅ Réservation spa créée (120.00€)
NOTICE: 
NOTICE: ==========================================
NOTICE: 🎉 TEST CRÉÉ AVEC SUCCÈS !
NOTICE: ==========================================
NOTICE: Client: Aubin Maga
NOTICE: Chambre: 101
NOTICE: Booking ID: <uuid>
NOTICE: 
NOTICE: 💰 Charges ajoutées:
NOTICE:    🍔 Restaurant: 85.50 €
NOTICE:    💆 Spa: 120.00 €
NOTICE:    ──────────────────────
NOTICE:    📊 Total ajouté: 205.50 €
```

**Et un tableau** avec les factures :
```
┌─────────────┬──────────┬─────────┬───────────┬──────────────┬───────┬─────────┬────────┐
│ Client      │ Chambre  │ Statut  │ Chambre(€)│ Restaurant(€)│ Spa(€)│ TOTAL(€)│ Solde  │
├─────────────┼──────────┼─────────┼───────────┼──────────────┼───────┼─────────┼────────┤
│ Aubin Maga  │ 101      │checked_in│ 450.00   │ 85.50        │120.00 │ 655.50  │ 655.50 │
└─────────────┴──────────┴─────────┴───────────┴──────────────┴───────┴─────────┴────────┘
```

---

### 4️⃣ Testez dans l'application

1. **Ouvrez** : https://zen-lyart.vercel.app
2. **Allez dans** : **Paiements & Factures**
3. **Cliquez** sur l'onglet : **"Factures Consolidées"**

**Vous devriez voir la facture !** 🎉

---

### 5️⃣ Voir les détails

1. **Cliquez** sur **"Voir Détails"** sur la ligne de la facture
2. **Modal qui s'ouvre** avec :
   - 📋 Informations client
   - 🏨 Détails chambre (450€)
   - 🍔 **Détails restaurant** (85.50€) :
     - Burger Deluxe × 2 = 37.00€
     - Salade César × 1 = 12.00€
     - Coca-Cola × 2 = 9.00€
     - Tiramisu × 2 = 16.00€
     - Café Espresso × 2 = 7.00€
   - 💆 **Détails spa** (120.00€)
   - 💰 **Récapitulatif** :
     - Total : 655.50€
     - Payé : 0.00€
     - **Solde dû : 655.50€**

---

### 6️⃣ Tester un paiement

**Dans le formulaire en bas de la modal** :

#### Paiement complet :
- Montant : `655.50`
- Méthode : "Espèces" ou "Carte bancaire"
- Cliquez : **"Enregistrer le paiement"**

**Résultat** :
- ✅ Message de succès
- ✅ La facture disparaît du tableau (tout est payé !)

---

#### Paiement partiel :
- Montant : `300`
- Méthode : "Espèces"
- Cliquez : **"Enregistrer le paiement"**

**Résultat** :
- ✅ Message de succès
- ✅ Solde mis à jour : **355.50€** restant
- ✅ La facture reste visible avec le nouveau solde

---

## 🔍 Si ça ne marche pas

### Erreur : "Aucune réservation trouvée"

**Le script vous dira** :
```
❌ AUCUNE RÉSERVATION TROUVÉE
Créez d'abord une réservation dans l'application
```

**Solution** : Créez une réservation (voir étape 1, Option B)

---

### Erreur SQL

**Copiez-collez l'erreur** complète et contactez le support.

Mais normalement, ce script devrait fonctionner car il inclut **TOUTES** les colonnes requises !

---

## ✅ SUCCÈS !

Une fois le test réussi, votre **Système de Facturation Consolidée** est **100% opérationnel** ! 🎊

Vous pouvez maintenant :
- ✅ Voir toutes les factures avec charges non payées
- ✅ Afficher les détails complets (Chambre + Restaurant + Spa)
- ✅ Enregistrer des paiements complets ou partiels
- ✅ Suivre les soldes en temps réel
- ✅ Tout fonctionne en production !

---

## 🎯 Rappel : URLs importantes

- **Application** : https://zen-lyart.vercel.app
- **Backend API** : https://zen-backend-jzjh.onrender.com
- **Supabase** : https://supabase.com/dashboard
- **GitHub Frontend** : https://github.com/maga1234-0/Zen
- **GitHub Backend** : https://github.com/maga1234-0/zen_backend-

**Félicitations !** 🚀
