# 📄 EXEMPLE VISUEL - FACTURE CONSOLIDÉE

**Ce document montre** à quoi ressemble exactement la facture consolidée dans votre application.

---

## 🖥️ VUE 1 : LISTE DES FACTURES

**Où** : Payments → Onglet "Factures Consolidées"

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                                     ┃
┃  💰 Paiements & Factures                                                            ┃
┃  Gérer les paiements et factures consolidées                                        ┃
┃                                                                                     ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                                     ┃
┃   ┌─────────────┬──────────────────────┬──────────────────┐                       ┃
┃   │  Paiements  │  Factures Consolidées │ Factures Client │                       ┃
┃   └─────────────┴──────────────────────┴──────────────────┘                       ┃
┃                          ▲                                                          ┃
┃                          └─ Onglet actif                                            ┃
┃                                                                                     ┃
┃   ┌───────────────────────────────────────────────────────────────────────────┐   ┃
┃   │ ℹ️  3 facture(s) avec solde impayé                                        │   ┃
┃   └───────────────────────────────────────────────────────────────────────────┘   ┃
┃                                                                                     ┃
┃   ┌──────────────────────────────────────────────────────────────────────────────┐┃
┃   │ Client         │ Chambre │ Séjour       │ 🏨      │ 🍽️     │ 💆    │ Total  ││┃
┃   ├──────────────────────────────────────────────────────────────────────────────┤┃
┃   │ Jean Dupont    │ 205     │ 10/10-15/10  │ 1,000€  │ 107€   │ 230€  │ 1,337€ ││┃
┃   │ Suite Deluxe   │         │              │         │        │       │        ││┃
┃   │ Solde: 837€                                      [Voir & Payer] ━━━━━━━━━━━━━┫┃
┃   ├──────────────────────────────────────────────────────────────────────────────┤┃
┃   │ Marie Martin   │ 103     │ 12/10-14/10  │ 600€    │ —      │ 80€   │ 680€   ││┃
┃   │ Chambre Double │         │              │         │        │       │        ││┃
┃   │ Solde: 680€                                      [Voir & Payer]             ││┃
┃   ├──────────────────────────────────────────────────────────────────────────────┤┃
┃   │ Paul Durand    │ 301     │ 14/10-16/10  │ 400€    │ 52€    │ —     │ 452€   ││┃
┃   │ Chambre Simple │         │              │         │        │       │        ││┃
┃   │ Solde: 200€                                      [Voir & Payer]             ││┃
┃   └──────────────────────────────────────────────────────────────────────────────┘┃
┃                                                                                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**Colonnes affichées** :
- **Client** : Nom + Type de chambre
- **Chambre** : Numéro
- **Séjour** : Dates check-in → check-out
- **🏨** : Frais hébergement
- **🍽️** : Frais restaurant (room service)
- **💆** : Frais spa
- **Total** : Somme de tout
- **Solde** : Montant restant à payer
- **Actions** : Bouton "Voir & Payer"

---

## 🖥️ VUE 2 : FACTURE DÉTAILLÉE

**Quand** : Après avoir cliqué sur "Voir & Payer"

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                                   ┃
┃  📄 Facture Consolidée           [🖨️ Imprimer] [⬇️ Télécharger] [✕]            ┃
┃                                                                                   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                                   ┃
┃  ┌─────────────────────────────────────┐   ┌────────────────────────────────┐   ┃
┃  │  ZENITH Hotel                       │   │  Numéro de Facture             │   ┃
┃  │  123 Avenue des Champs              │   │  INV-ABC12345                  │   ┃
┃  │  Paris 75008                        │   │                                │   ┃
┃  │  Tél: +33 1 23 45 67 89             │   │  Date d'émission               │   ┃
┃  │  Email: contact@zenith.hotel        │   │  16 octobre 2026               │   ┃
┃  └─────────────────────────────────────┘   └────────────────────────────────┘   ┃
┃                                                                                   ┃
┃  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ┃
┃                                                                                   ┃
┃  FACTURÉ À                                                                        ┃
┃  ┌───────────────────────────────────────────────────────────────────────────┐   ┃
┃  │  Jean Dupont                                                              │   ┃
┃  │  Email: jean.dupont@email.com                                             │   ┃
┃  │  Tél: +33 6 12 34 56 78                                                   │   ┃
┃  │                                                                            │   ┃
┃  │  Chambre: 205 - Suite Deluxe                                              │   ┃
┃  │  Séjour: 10 octobre 2026 - 15 octobre 2026                                │   ┃
┃  └───────────────────────────────────────────────────────────────────────────┘   ┃
┃                                                                                   ┃
┃  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ┃
┃                                                                                   ┃
┃  DÉTAIL DES CHARGES                                                               ┃
┃                                                                                   ┃
┃  ┌───────────────────────────────────────────────────────────────────────────┐   ┃
┃  │  🏨 HÉBERGEMENT                                              1,000.00 €   │   ┃
┃  │                                                                            │   ┃
┃  │  Chambre 205 - Suite Deluxe                                               │   ┃
┃  │  Tarif: 200.00 €/nuit                                                     │   ┃
┃  │  Du 10 octobre au 15 octobre (5 nuits)                                    │   ┃
┃  └───────────────────────────────────────────────────────────────────────────┘   ┃
┃                                                                                   ┃
┃  ┌───────────────────────────────────────────────────────────────────────────┐   ┃
┃  │  🍽️ RESTAURANT / ROOM SERVICE                                 107.00 €   │   ┃
┃  │                                                                            │   ┃
┃  │  ├─ Commande #R001 - Room Service                           48.00 €      │   ┃
┃  │  │  11 octobre 2026, 19:30                                                │   ┃
┃  │  │  • 2x Burger Classic (15.00 €)                                         │   ┃
┃  │  │  • 1x Pasta Carbonara (18.00 €)                                        │   ┃
┃  │  │                                                                         │   ┃
┃  │  └─ Commande #R002 - Restaurant                             59.00 €      │   ┃
┃  │     13 octobre 2026, 20:15                                                │   ┃
┃  │     • 1x Steak Frites (35.00 €)                                           │   ┃
┃  │     • 2x Vin Rouge (12.00 €)                                              │   ┃
┃  └───────────────────────────────────────────────────────────────────────────┘   ┃
┃                                                                                   ┃
┃  ┌───────────────────────────────────────────────────────────────────────────┐   ┃
┃  │  💆 SPA                                                       230.00 €    │   ┃
┃  │                                                                            │   ┃
┃  │  ├─ Massage Relaxant                                         80.00 €     │   ┃
┃  │  │  12 octobre 2026 à 14:00                                               │   ┃
┃  │  │  Thérapeute: Sophie Martin                                             │   ┃
┃  │  │                                                                         │   ┃
┃  │  └─ Forfait Bien-être                                       150.00 €     │   ┃
┃  │     13 octobre 2026 à 10:00                                               │   ┃
┃  │     Thérapeute: Marie Dubois                                              │   ┃
┃  └───────────────────────────────────────────────────────────────────────────┘   ┃
┃                                                                                   ┃
┃  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ┃
┃                                                                                   ┃
┃  RÉSUMÉ                                                                           ┃
┃  ┌───────────────────────────────────────────────────────────────────────────┐   ┃
┃  │                                                                            │   ┃
┃  │  Frais d'hébergement                                       1,000.00 €     │   ┃
┃  │  Frais de restaurant                                         107.00 €     │   ┃
┃  │  Frais de spa                                                230.00 €     │   ┃
┃  │                                                          ─────────────     │   ┃
┃  │  TOTAL GÉNÉRAL                                           1,337.00 €       │   ┃
┃  │                                                                            │   ┃
┃  │  Montant Payé                                             -500.00 €       │   ┃
┃  │                                                          ═════════════     │   ┃
┃  │  SOLDE À PAYER                                             837.00 €       │   ┃
┃  │                                                                            │   ┃
┃  └───────────────────────────────────────────────────────────────────────────┘   ┃
┃                                                                                   ┃
┃  ┌───────────────────────────────────────────────────────────────────────────┐   ┃
┃  │  ⚠️  FACTURE NON RÉGLÉE                                                   │   ┃
┃  │                                                                            │   ┃
┃  │  Il reste 837.00 € à payer                                                │   ┃
┃  │                                                                            │   ┃
┃  │                                                      [💰 Payer Maintenant] │   ┃
┃  └───────────────────────────────────────────────────────────────────────────┘   ┃
┃                                                                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🖥️ VUE 3 : FORMULAIRE DE PAIEMENT

**Quand** : Après avoir cliqué sur "💰 Payer Maintenant"

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                                   ┃
┃  📄 Facture Consolidée           [🖨️ Imprimer] [⬇️ Télécharger] [✕]            ┃
┃                                                                                   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                                   ┃
┃  ... (facture complète ci-dessus) ...                                            ┃
┃                                                                                   ┃
┃  ┌───────────────────────────────────────────────────────────────────────────┐   ┃
┃  │  💳 PROCÉDER AU PAIEMENT                                                  │   ┃
┃  │                                                                            │   ┃
┃  │  Méthode de Paiement                                                       │   ┃
┃  │  ┌─────────────────────────────────────────────────────────────────────┐  │   ┃
┃  │  │  💵 Espèces                                                       ▼ │  │   ┃
┃  │  └─────────────────────────────────────────────────────────────────────┘  │   ┃
┃  │                                                                            │   ┃
┃  │  Options disponibles :                                                     │   ┃
┃  │  • 💵 Espèces                                                              │   ┃
┃  │  • 💳 Carte Bancaire                                                       │   ┃
┃  │  • 🏦 Virement Bancaire                                                    │   ┃
┃  │  • 📱 Paiement Mobile                                                      │   ┃
┃  │                                                                            │   ┃
┃  │                                                                            │   ┃
┃  │  ┌────────────────┐   ┌──────────────────────────────────────────────┐   │   ┃
┃  │  │  [Annuler]     │   │  [Confirmer - 837.00 €]                      │   │   ┃
┃  │  └────────────────┘   └──────────────────────────────────────────────┘   │   ┃
┃  └───────────────────────────────────────────────────────────────────────────┘   ┃
┃                                                                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🖥️ VUE 4 : FACTURE PAYÉE

**Après** : Confirmation du paiement

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                                   ┃
┃  📄 Facture Consolidée           [🖨️ Imprimer] [⬇️ Télécharger] [✕]            ┃
┃                                                                                   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                                   ┃
┃  ... (détail complet de la facture) ...                                          ┃
┃                                                                                   ┃
┃  RÉSUMÉ                                                                           ┃
┃  ┌───────────────────────────────────────────────────────────────────────────┐   ┃
┃  │                                                                            │   ┃
┃  │  Frais d'hébergement                                       1,000.00 €     │   ┃
┃  │  Frais de restaurant                                         107.00 €     │   ┃
┃  │  Frais de spa                                                230.00 €     │   ┃
┃  │                                                          ─────────────     │   ┃
┃  │  TOTAL GÉNÉRAL                                           1,337.00 €       │   ┃
┃  │                                                                            │   ┃
┃  │  Montant Payé                                           -1,337.00 €       │   ┃
┃  │                                                          ═════════════     │   ┃
┃  │  SOLDE À PAYER                                               0.00 €       │   ┃
┃  │                                                                            │   ┃
┃  └───────────────────────────────────────────────────────────────────────────┘   ┃
┃                                                                                   ┃
┃  ┌───────────────────────────────────────────────────────────────────────────┐   ┃
┃  │  ✅ FACTURE ENTIÈREMENT RÉGLÉE                                            │   ┃
┃  │                                                                            │   ┃
┃  │  Merci pour votre paiement                                                │   ┃
┃  └───────────────────────────────────────────────────────────────────────────┘   ┃
┃                                                                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 📊 EXPLICATIONS

### Section 🏨 Hébergement
- **Affichée si** : Le client a une réservation de chambre
- **Contenu** :
  - Description de la chambre
  - Tarif par nuit
  - Nombre de nuits
  - Total hébergement

### Section 🍽️ Restaurant / Room Service
- **Affichée si** : Le client a commandé au restaurant (room service ou table)
- **Contenu** :
  - Liste de toutes les commandes
  - Pour chaque commande :
    - Numéro de commande
    - Type (Room Service / Restaurant)
    - Date et heure
    - Liste détaillée des items
    - Quantité × Prix unitaire
    - Sous-total par commande
  - Total restaurant

### Section 💆 Spa
- **Affichée si** : Le client a réservé des services spa
- **Contenu** :
  - Liste de toutes les réservations spa
  - Pour chaque réservation :
    - Nom du service/forfait
    - Date et heure
    - Nom du thérapeute
    - Prix
  - Total spa

### Section Résumé
- **Toujours affichée**
- **Contenu** :
  - Sous-total hébergement
  - Sous-total restaurant (si applicable)
  - Sous-total spa (si applicable)
  - **Total général** (somme de tout)
  - **Montant déjà payé** (paiements précédents)
  - **Solde à payer** (reste à payer)

### Section Paiement
- **Affichée si** : Solde > 0
- **Contenu** :
  - Bouton "Payer Maintenant"
  - Formulaire avec choix de méthode
  - Bouton de confirmation avec montant

### Section Payée
- **Affichée si** : Solde = 0
- **Contenu** :
  - Message de confirmation "Facture Entièrement Réglée"

---

## 🎯 CAS D'UTILISATION

### Cas 1 : Client avec chambre seulement
**Sections affichées** :
- ✅ 🏨 Hébergement
- ❌ 🍽️ Restaurant (pas de commande)
- ❌ 💆 Spa (pas de réservation)
- ✅ Résumé (total = hébergement)

### Cas 2 : Client avec chambre + room service
**Sections affichées** :
- ✅ 🏨 Hébergement
- ✅ 🍽️ Restaurant
- ❌ 💆 Spa
- ✅ Résumé (total = hébergement + restaurant)

### Cas 3 : Client avec tout
**Sections affichées** :
- ✅ 🏨 Hébergement
- ✅ 🍽️ Restaurant
- ✅ 💆 Spa
- ✅ Résumé (total = hébergement + restaurant + spa)

### Cas 4 : Client ayant payé partiellement
**Exemple** :
- Total : 1,337€
- Déjà payé : 500€
- Solde : 837€

**Affichage** :
```
TOTAL GÉNÉRAL                 1,337.00 €
Montant Payé                   -500.00 €
═══════════════════════════════════════
SOLDE À PAYER                   837.00 €

⚠️  FACTURE NON RÉGLÉE
Il reste 837.00 € à payer
                    [💰 Payer Maintenant]
```

### Cas 5 : Client ayant tout payé
**Exemple** :
- Total : 1,337€
- Déjà payé : 1,337€
- Solde : 0€

**Affichage** :
```
TOTAL GÉNÉRAL                 1,337.00 €
Montant Payé                -1,337.00 €
═══════════════════════════════════════
SOLDE À PAYER                     0.00 €

✅ FACTURE ENTIÈREMENT RÉGLÉE
Merci pour votre paiement
```

---

## 🔄 WORKFLOW COMPLET

### Étape 1 : Client arrive et réserve
```
Bookings → Nouvelle réservation
↓
Réservation créée avec booking_id = "abc-123"
```

### Étape 2 : Client commande room service
```
Restaurant → Nouvelle commande
Type : Room Service
Chambre : 205
↓
Commande créée avec booking_id = "abc-123"
```

### Étape 3 : Client réserve massage
```
Spa → Nouvelle réservation
Client : Jean Dupont
Lier à réservation : "abc-123"
↓
Réservation spa créée avec booking_id = "abc-123"
```

### Étape 4 : Employé ouvre facture
```
Payments → Factures Consolidées
Cliquer : "Voir & Payer" sur Jean Dupont
↓
Système récupère :
- Réservation chambre (booking_id = "abc-123")
- Toutes commandes restaurant (booking_id = "abc-123")
- Toutes réservations spa (booking_id = "abc-123")
↓
Affiche facture consolidée avec 3 sections
```

### Étape 5 : Employé enregistre paiement
```
Cliquer : "Payer Maintenant"
Choisir : Méthode (ex: Espèces)
Cliquer : "Confirmer - 1,337.00 €"
↓
Système enregistre :
- Nouveau paiement dans table "payments"
- Montant : 1,337€
- Méthode : cash
- Lié à : booking_id = "abc-123"
↓
Facture se met à jour :
- Montant payé : 1,337€
- Solde : 0€
- Message : "Facture Entièrement Réglée"
```

---

## ✅ RÉSUMÉ

**Cette facture consolidée fait EXACTEMENT ce que vous voulez** :

1. ✅ **Regroupe tous les achats** du client en un seul document
2. ✅ **Sépare par catégorie** pour clarté (🏨 🍽️ 💆)
3. ✅ **Affiche le détail** de chaque achat
4. ✅ **Calcule automatiquement** les totaux
5. ✅ **Permet le paiement direct** depuis la facture
6. ✅ **Met à jour le solde** en temps réel
7. ✅ **Imprimable** pour donner au client

**Et elle est déjà déployée dans votre application !** 🎉

---

*Exemple visuel - 16 octobre 2026*
