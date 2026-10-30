# ⚡ GUIDE 5 MINUTES - CORRIGER ET TESTER

**Ce qu'on va faire** :
1. ✅ Corriger 2 erreurs (5 min)
2. ✅ Tester que tout fonctionne (2 min)
3. ✅ Voir la facturation consolidée (1 min)

**Temps total** : 8 minutes

---

## PARTIE 1 : CORRIGER LES ERREURS (5 minutes)

### ⚙️ CORRECTION 1 : Render (2 min)

#### Étape 1 : Ouvrir Render
👉 https://dashboard.render.com

#### Étape 2 : Trouver le service
```
Cliquer sur : "zen-backend-jzjh"
```

#### Étape 3 : Ouvrir Environment
```
Menu gauche → "Environment"
```

#### Étape 4 : Ajouter variable
```
Cliquer : "Add Environment Variable"

┌─────────────────────────────────────────┐
│  Key:                                   │
│  DATABASE_URL                           │
├─────────────────────────────────────────┤
│  Value:                                 │
│  postgresql://postgres.hxvhkhwhhf...   │ ← Copier de plus bas
└─────────────────────────────────────────┘
```

**Value à copier** (copier TOUT) :
```
postgresql://postgres.hxvhkhwhhfwtthujkahx:suUxX267q1OWx3Kw@aws-1-eu-central-2.pooler.supabase.com:6543/postgres
```

#### Étape 5 : Sauvegarder
```
Cliquer : "Save Changes"
```

⏳ Attendre 2-3 minutes (Render redémarre)

✅ **CORRECTION 1 TERMINÉE !**

---

### 📧 CORRECTION 2 : Supabase (2 min)

#### Étape 1 : Ouvrir Supabase
👉 https://supabase.com/dashboard

#### Étape 2 : Trouver le projet
```
Cliquer sur : "hxvhkhwhhfwtthujkahx"
```

#### Étape 3 : Ouvrir SQL Editor
```
Menu gauche → "SQL Editor"
```

#### Étape 4 : Ouvrir le script SQL
Sur votre PC :
```
Ouvrir : C:\Users\aubin\Downloads\kiro1\database\CREATE_EMAIL_LOGS_TABLE.sql
```

```
Ctrl+A  (tout sélectionner)
Ctrl+C  (copier)
```

#### Étape 5 : Coller et exécuter
Retour sur Supabase :
```
Ctrl+V  (coller dans SQL Editor)
Cliquer : "RUN" (en bas à droite)
```

✅ Vérifier :
```
✅ CREATE TABLE
✅ CREATE INDEX
✅ Query executed successfully
```

✅ **CORRECTION 2 TERMINÉE !**

---

## PARTIE 2 : TESTER (2 minutes)

### 🔐 TEST 1 : Login

#### Ouvrir l'application
👉 https://zen-lyart.vercel.app

#### Se connecter
```
Email    : aubinmaga@gmail.com
Password : admin123
```

```
Cliquer : "Se connecter"
```

✅ **Attendu** : Vous arrivez sur le Dashboard

❌ **Si erreur** : Attendre 1 minute de plus (Render redémarre)

---

### 💰 TEST 2 : Factures Consolidées

#### Aller dans Payments
```
Menu gauche → Cliquer : "Payments"
```

#### Ouvrir l'onglet Factures
```
Cliquer sur l'onglet : "Factures Consolidées"
```

**Vous voyez** :
```
┌──────────────────────────────────────────────────────────┐
│  Client        Chambre  Hébergement  Restaurant  Spa  ...│
├──────────────────────────────────────────────────────────┤
│  Jean Dupont   205      1,000€       107€        230€  ...│
│  Marie Martin  103      600€         0€          80€   ...│
│  ...                                                      │
└──────────────────────────────────────────────────────────┘
```

#### Voir une facture
```
Cliquer : "Voir & Payer" (sur n'importe quelle ligne)
```

**Une grande fenêtre s'ouvre avec** :
```
┌─────────────────────────────────────────────────┐
│  📄 FACTURE CONSOLIDÉE #INV-ABC123              │
├─────────────────────────────────────────────────┤
│                                                 │
│  🏨 Hébergement                                 │
│     Chambre 205 - Suite                         │
│     5 nuits × 200€                    1,000€    │
│                                                 │
│  🍽️ Restaurant / Room Service                   │
│     Commande #R001 - Room Service               │
│     - 2x Burger (15€)                           │
│     - 1x Pasta (18€)                  48€       │
│                                                 │
│     Commande #R002 - Restaurant                 │
│     - 1x Steak (35€)                            │
│     - 2x Wine (12€)                   59€       │
│                                    ──────       │
│     Total Restaurant:                 107€      │
│                                                 │
│  💆 Spa                                          │
│     Massage Relaxant                  80€       │
│     Forfait Bien-être                150€       │
│                                    ──────       │
│     Total Spa:                        230€      │
│                                                 │
├─────────────────────────────────────────────────┤
│  TOTAL GÉNÉRAL                      1,337€      │
│  Montant payé                        -500€      │
│  ═════════════════════════════════            │
│  SOLDE À PAYER                        837€      │
│                                                 │
│  [💰 Payer Maintenant]                          │
│                                                 │
└─────────────────────────────────────────────────┘
```

✅ **C'est exactement ce que vous vouliez !**

---

## 🎉 FÉLICITATIONS !

### Ce qui fonctionne maintenant :
- ✅ Login sans erreur DB
- ✅ Emails avec logging
- ✅ Factures consolidées visibles
- ✅ Tous les achats regroupés (Chambre + Restaurant + Spa)
- ✅ Paiement direct depuis la facture

### Ce que fait la facture consolidée :
1. **Regroupe automatiquement** :
   - 🏨 Tous les frais de chambre de la réservation
   - 🍽️ Toutes les commandes restaurant (room service) de la réservation
   - 💆 Toutes les réservations spa de la réservation

2. **Affiche le détail complet** :
   - Description de chaque achat
   - Prix unitaires
   - Quantités
   - Sous-totaux par catégorie
   - Total général
   - Montant déjà payé
   - Solde restant

3. **Permet le paiement** :
   - Bouton "Payer Maintenant"
   - Choix de la méthode (Espèces, Carte, Virement, Mobile)
   - Enregistrement automatique dans la base
   - Mise à jour du solde

---

## 📱 UTILISATION QUOTIDIENNE

### Scénario typique :

#### 1. Client arrive et réserve chambre
```
Bookings → Créer réservation
```

#### 2. Client commande room service
```
Restaurant → Nouvelle commande
Type : "Room Service"
Sélectionner : Chambre du client
```

#### 3. Client réserve massage
```
Spa → Nouvelle réservation
Lier à la réservation de chambre
```

#### 4. Client check-out et paie tout
```
Payments → Factures Consolidées
Cliquer : "Voir & Payer" sur la ligne du client
Vérifier : Tous les achats sont là
Cliquer : "Payer Maintenant"
Choisir : Méthode de paiement
Confirmer
```

#### 5. Facture imprimable
```
Dans la facture → Cliquer : "Imprimer"
```

---

## ⚠️ SI VOUS VOYEZ ENCORE DES ERREURS

### Erreur : "tenant/user not found"
**Raison** : Render n'a pas fini de redémarrer  
**Solution** : Attendre 2 minutes de plus

### Erreur : "email_logs does not exist"
**Raison** : Script SQL pas exécuté ou pas terminé  
**Solution** : Retourner dans Supabase SQL Editor et réexécuter

### Onglet vide dans "Factures Consolidées"
**Raison** : Pas de réservations avec achats non payés  
**Solution** : Normal ! Créer une réservation test avec room service

---

## 🎯 PROCHAINES ÉTAPES (Optionnel)

### Pour tester complètement :

1. **Créer réservation test**
   - Bookings → Nouvelle réservation
   - Check-in : Aujourd'hui
   - Check-out : Demain
   - Client : Choisir un client
   - Chambre : Choisir une chambre
   - Sauvegarder

2. **Ajouter room service**
   - Restaurant → Nouvelle commande
   - Type : Room Service
   - Chambre : Celle de la réservation test
   - Ajouter items
   - Sauvegarder

3. **Ajouter spa**
   - Spa → Nouvelle réservation
   - Client : Même client que la réservation
   - Lier à la réservation de chambre
   - Sauvegarder

4. **Voir la facture**
   - Payments → Factures Consolidées
   - Trouver votre réservation test
   - Cliquer "Voir & Payer"
   - Vérifier : Chambre + Restaurant + Spa = 3 sections

---

## 📞 BESOIN D'AIDE ?

### Logs backend (pour debug)
👉 https://dashboard.render.com
```
zen-backend-jzjh → Logs
```

Chercher :
- ✅ `Database connected successfully` (bon)
- ✅ `Server is running on port` (bon)
- ❌ `ENOTFOUND` (mauvais - variable DATABASE_URL manquante)
- ❌ `email_logs does not exist` (mauvais - table pas créée)

---

## ✅ CHECKLIST FINALE

Vérifier que :
- [ ] Variable DATABASE_URL ajoutée sur Render
- [ ] Table email_logs créée dans Supabase
- [ ] Login fonctionne (aubinmaga@gmail.com / admin123)
- [ ] Dashboard s'affiche
- [ ] Onglet "Factures Consolidées" visible dans Payments
- [ ] Clic sur "Voir & Payer" ouvre la facture détaillée
- [ ] Les 3 sections apparaissent (si données existent) : 🏨 🍽️ 💆

---

## 🎉 C'EST FINI !

**Votre système de facturation consolidée est opérationnel !**

Il fait exactement ce que vous vouliez :
- ✅ Regroupe chambre + restaurant + spa
- ✅ Affiche tout dans une seule facture
- ✅ Permet de payer le tout d'un coup
- ✅ Met à jour automatiquement le solde

**Aucun déploiement nécessaire - tout est déjà en production !**

---

*Guide rapide - 16 octobre 2026* 🚀
