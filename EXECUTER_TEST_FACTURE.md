# 🚀 EXÉCUTER LE TEST DE FACTURE CONSOLIDÉE

## ✅ Scripts corrigés !

J'ai créé **2 versions** du script de test :

### Version 1 : `TEST_FACTURE_CONSOLIDEE.sql` (Corrigée)
- ✅ `order_status` → `status`
- ✅ `payment_status = 'pending'` → `'unpaid'`

### Version 2 : `TEST_SIMPLE_FACTURE.sql` (Plus robuste)
- ✅ Gestion d'erreurs améliorée
- ✅ Messages de confirmation détaillés
- ✅ Vérification automatique des résultats

---

## 📋 MÉTHODE RECOMMANDÉE : Utilisez TEST_SIMPLE_FACTURE.sql

### Étape 1 : Ouvrez Supabase
1. **Allez sur** : https://supabase.com/dashboard
2. **Sélectionnez** votre projet
3. **Menu de gauche** → **SQL Editor**
4. **Cliquez** sur **"New query"**

---

### Étape 2 : Copiez le script

Ouvrez le fichier **`database/TEST_SIMPLE_FACTURE.sql`** et copiez tout le contenu.

**OU copiez directement depuis l'éditeur Kiro** (fichier ouvert à côté).

---

### Étape 3 : Exécutez

1. **Collez** le script dans Supabase SQL Editor
2. **Cliquez** sur **"Run"** (ou Ctrl + Enter)
3. **Attendez** 2-3 secondes

---

### Étape 4 : Vérifiez les résultats

**Vous devriez voir** :
- ✅ Messages de confirmation :
  ```
  NOTICE: Réservation créée: <uuid>
  NOTICE: Commande restaurant créée: <uuid>
  NOTICE: Réservation spa créée
  NOTICE: ==========================================
  NOTICE: RÉSUMÉ DU TEST
  NOTICE: ==========================================
  NOTICE: Booking ID: <uuid>
  NOTICE: Chambre: 450.00 €
  NOTICE: Restaurant: 85.50 €
  NOTICE: Spa: 120.00 €
  NOTICE: TOTAL: 655.50 €
  ```

- ✅ **Un tableau de résultats** avec :
  ```
  booking_id | client      | chambre | Chambre(€) | Restaurant(€) | Spa(€)  | TOTAL(€) | Payé(€) | Solde(€)
  -----------|-------------|---------|------------|---------------|---------|----------|---------|----------
  <uuid>     | Aubin Maga  | 101     | 450.00     | 85.50         | 120.00  | 655.50   | 0.00    | 655.50
  ```

---

### Étape 5 : Testez dans l'application

1. **Ouvrez** : https://zen-lyart.vercel.app
2. **Connectez-vous** avec `aubinmaga@gmail.com` / `admin123`
3. **Allez dans** : **Paiements & Factures**
4. **Cliquez** sur l'onglet : **"Factures Consolidées"**
5. **Vous devriez voir** :
   - ✅ Une ligne avec Aubin Maga
   - ✅ Chambre: 450.00€
   - ✅ Restaurant: 85.50€
   - ✅ Spa: 120.00€
   - ✅ Total: 655.50€
   - ✅ Solde: 655.50€
   - ✅ **Bouton "Voir Détails"**

---

### Étape 6 : Tester le détail de la facture

1. **Cliquez** sur **"Voir Détails"**
2. **Modal qui s'ouvre** avec :
   - 📋 Informations du client (Aubin Maga)
   - 🏨 Détails de la chambre (101, 450€, 3 nuits)
   - 🍔 **Détails Restaurant** :
     - Burger Deluxe x2 - 37.00€
     - Salade César x1 - 12.00€
     - Coca-Cola x2 - 9.00€
     - Tiramisu x2 - 16.00€
     - Café x2 - 7.00€
     - **Sous-total : 85.50€**
   - 💆 **Détails Spa** :
     - Massage - 120.00€
     - Date/Heure
   - 💰 **Récapitulatif** :
     - Chambre: 450.00€
     - Restaurant: 85.50€
     - Spa: 120.00€
     - **TOTAL: 655.50€**
     - Payé: 0.00€
     - **Solde dû: 655.50€**
   - 💳 **Formulaire de paiement**

---

### Étape 7 : Tester le paiement

1. **Dans le formulaire en bas** :
   - Montant : `655.50` (ou paiement partiel comme `300`)
   - Méthode : Sélectionnez "Espèces" ou "Carte bancaire"
   - Notes : (optionnel) "Test de facturation consolidée"

2. **Cliquez** sur **"Enregistrer le paiement"**

3. **Résultat attendu** :
   - ✅ Message de succès
   - ✅ Le solde se met à jour
   - ✅ Si paiement complet (655.50€), la ligne disparaît du tableau
   - ✅ Si paiement partiel (ex: 300€), le solde devient 355.50€

---

## 🔍 En cas d'erreur

### Si "Aucun guest trouvé"
Changez l'email dans le script :
```sql
WHERE g.email = 'votre-email@example.com'  -- Utilisez un email existant
```

### Si "Aucune chambre disponible"
1. Allez dans l'application → Chambres
2. Changez le statut d'une chambre en "Disponible"
3. Relancez le script

### Si une autre erreur SQL
Copiez-collez l'erreur complète et envoyez-la moi !

---

## ✅ Succès !

Une fois le script exécuté avec succès, votre **système de facturation consolidée** est **100% fonctionnel** ! 🎉

Vous pouvez maintenant :
- ✅ Voir toutes les factures impayées
- ✅ Voir les détails complets (chambre + restaurant + spa)
- ✅ Enregistrer des paiements complets ou partiels
- ✅ Suivre les soldes en temps réel
