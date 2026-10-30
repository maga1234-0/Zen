# 💡 FACTURE PAR CLIENT - SOLUTION SIMPLE

## ✅ CE QUI A ÉTÉ CRÉÉ

### Backend (3 fichiers)

1. **Controller**: `zen_backend/src/controllers/guestInvoiceController.ts`
   - `getGuestInvoice()` - Récupère TOUS les achats d'un client (restaurant + spa + chambre)
   - `payGuestInvoice()` - Enregistre un paiement pour un client
   - `getGuestsWithUnpaidCharges()` - Liste tous les clients avec des achats impayés

2. **Routes**: `zen_backend/src/routes/guestInvoiceRoutes.ts`
   - GET `/api/guest-invoices/unpaid` - Tous les clients avec solde
   - GET `/api/guest-invoices/:guestId` - Facture complète d'un client
   - POST `/api/guest-invoices/:guestId/pay` - Payer

3. **Index modifié**: `zen_backend/src/routes/index.ts`
   - Ajout de `import guestInvoiceRoutes`
   - Ajout de `router.use('/guest-invoices', guestInvoiceRoutes)`

### Frontend (1 fichier)

1. **Modal**: `client/src/components/GuestInvoiceModal.tsx`
   - Affiche TOUS les achats d'un client
   - Restaurant + Spa + Chambre
   - Permet paiement complet ou partiel
   - Design identique à InvoiceModal

---

## 🎯 COMMENT ÇA MARCHE

### Ancien système (par réservation)
```
Facture → Basée sur booking_id
├── Chambre (1 réservation)
├── Restaurant (lié à cette réservation)
└── Spa (lié à cette réservation)
```

### Nouveau système (par client)
```
Facture → Basée sur guest_id
├── TOUTES les chambres du client
├── TOUS les achats restaurant du client
└── TOUS les achats spa du client
```

---

## 📋 AVANTAGES

✅ **Client sans chambre**: Peut avoir une facture s'il achète au restaurant ou spa
✅ **Client avec plusieurs séjours**: Voit tous ses achats historiques
✅ **Paiements partiels**: Peut payer progressivement (ex: restaurant maintenant, chambre plus tard)
✅ **Historique complet**: Tous les achats du client en un seul endroit

---

## 🚀 DÉPLOIEMENT - MÉTHODE GITHUB WEB EDITOR

### Étape 1: Backend (GitHub Web Editor)

1. Aller sur: **https://github.dev/maga1234-0/zen_backend-**

2. **Créer** `src/controllers/guestInvoiceController.ts`:
   - Copier depuis: `c:\Users\aubin\Downloads\kiro1\zen_backend\src\controllers\guestInvoiceController.ts`

3. **Créer** `src/routes/guestInvoiceRoutes.ts`:
   - Copier depuis: `c:\Users\aubin\Downloads\kiro1\zen_backend\src\routes\guestInvoiceRoutes.ts`

4. **Modifier** `src/routes/index.ts`:
   - Ajouter ligne 10:
     ```typescript
     import guestInvoiceRoutes from './guestInvoiceRoutes';
     ```
   - Ajouter ligne 26:
     ```typescript
     router.use('/guest-invoices', guestInvoiceRoutes);
     ```

5. **Commit & Push**:
   - Message: `Add guest-based invoice system (all purchases per client)`

6. **Attendre déploiement Render** (3-5 min)

### Étape 2: Frontend (GitHub Web)

1. Aller sur: **https://github.dev/maga1234-0/Zen**

2. **Créer** `src/components/GuestInvoiceModal.tsx`:
   - Copier depuis: `c:\Users\aubin\Downloads\kiro1\client\src\components\GuestInvoiceModal.tsx`

3. **Commit & Push**:
   - Message: `Add guest invoice modal for all purchases`

4. **Attendre déploiement Vercel** (2-3 min)

---

## 🧪 TESTER

### Test API Backend

```
GET https://zen-backend-jzjh.onrender.com/api/guest-invoices/unpaid
```

**Résultat attendu**: Liste de clients avec solde impayé

```json
[
  {
    "guest_id": "...",
    "guest_name": "John Doe",
    "email": "john@example.com",
    "charges": {
      "room": 450.00,
      "restaurant": 85.50,
      "spa": 120.00
    },
    "grand_total": 655.50,
    "total_paid": 0,
    "balance": 655.50
  }
]
```

### Test Interface (après intégration dans Payments.tsx)

1. Ouvrir: https://zen-lyart.vercel.app
2. Login: aubinmaga@gmail.com / admin123
3. Menu → **Payments**
4. Onglet: **"Factures Par Client"** (à ajouter)
5. Cliquer sur un client
6. Voir TOUS ses achats
7. Enregistrer un paiement

---

## 📝 PROCHAINE ÉTAPE (À FAIRE)

Pour que ce soit utilisable dans l'interface, il faut **modifier `Payments.tsx`**:

1. Ajouter un nouvel onglet "Factures Par Client"
2. Importer `GuestInvoiceModal`
3. Afficher la liste des clients avec solde
4. Permettre d'ouvrir le modal pour chaque client

**Voulez-vous que je fasse cette modification maintenant?**

---

## 💡 EXEMPLE D'UTILISATION

### Scénario 1: Client mange au restaurant sans chambre
- Client: Marie Dupont
- Achats: 2 repas au restaurant (85€ + 62€)
- **Facture**: 147€ (restaurant seulement)
- Peut payer directement

### Scénario 2: Client avec chambre + restaurant + spa
- Client: Jean Martin
- Achats:
  - Chambre 3 nuits: 450€
  - Room service: 85.50€
  - Massage spa: 120€
- **Facture totale**: 655.50€
- Peut payer:
  - Option 1: Tout ensemble (655.50€)
  - Option 2: Restaurant d'abord (85.50€), puis le reste plus tard
  - Option 3: Partiellement (200€ maintenant, 455.50€ au checkout)

### Scénario 3: Client régulier avec plusieurs séjours
- Client: Sophie Bernard
- Historique:
  - Séjour 1 (Janvier): 300€ ✅ Payé
  - Restaurant (Mars): 45€ ❌ Impayé
  - Séjour 2 (Mai): 450€ ❌ Impayé
  - Spa (Mai): 80€ ❌ Impayé
- **Solde à payer**: 575€ (45 + 450 + 80)

---

## ❓ QUESTIONS ?

Si vous avez besoin que je:
1. **Déploie le backend** → Je crée les fichiers via GitHub Web Editor
2. **Déploie le frontend** → Je crée le modal via GitHub Web Editor
3. **Intègre dans Payments.tsx** → Je modifie la page pour ajouter l'onglet
4. **Crée un script SQL de test** → Je crée des données de test

Dites-moi ce que vous voulez en priorité !
