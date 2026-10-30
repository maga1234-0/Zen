# ⚡ DÉPLOIEMENT - FACTURE PAR CLIENT

## 🎯 OBJECTIF
Permettre de voir et payer TOUS les achats d'un client (restaurant + spa + chambre) en une seule facture.

---

## 📦 BACKEND - 3 FICHIERS À DÉPLOYER

### Méthode: GitHub Web Editor

1. **Ouvrir**: https://github.dev/maga1234-0/zen_backend-

2. **Fichier 1** - Créer `src/controllers/guestInvoiceController.ts`
   - Copier depuis: `c:\Users\aubin\Downloads\kiro1\zen_backend\src\controllers\guestInvoiceController.ts`
   - ✅ 316 lignes

3. **Fichier 2** - Créer `src/routes/guestInvoiceRoutes.ts`
   - Copier depuis: `c:\Users\aubin\Downloads\kiro1\zen_backend\src\routes\guestInvoiceRoutes.ts`
   - ✅ 20 lignes

4. **Fichier 3** - Modifier `src/routes/index.ts`
   
   **AJOUTER** après ligne 9:
   ```typescript
   import guestInvoiceRoutes from './guestInvoiceRoutes';
   ```
   
   **AJOUTER** après ligne 25:
   ```typescript
   router.use('/guest-invoices', guestInvoiceRoutes);
   ```

5. **Commit & Push**
   - Message: `Add guest invoice system - all purchases per client`
   - ✅ Cliquer "Commit & Push"

6. **Vérifier déploiement Render**
   - URL: https://dashboard.render.com
   - Service: `zen-backend-jzjh`
   - Attendre: 3-5 minutes → "Live"

---

## 🎨 FRONTEND - 1 FICHIER À DÉPLOYER

### Méthode: GitHub Web Editor

1. **Ouvrir**: https://github.dev/maga1234-0/Zen

2. **Créer** `src/components/GuestInvoiceModal.tsx`
   - Copier depuis: `c:\Users\aubin\Downloads\kiro1\client\src\components\GuestInvoiceModal.tsx`
   - ✅ 742 lignes

3. **Commit & Push**
   - Message: `Add guest invoice modal component`
   - ✅ Cliquer "Commit & Push"

4. **Vérifier déploiement Vercel**
   - Le déploiement commence automatiquement
   - Attendre: 2-3 minutes

---

## 🧪 TEST API

Après déploiement backend, tester:

```
https://zen-backend-jzjh.onrender.com/api/guest-invoices/unpaid
```

**Résultat attendu**: Liste JSON des clients avec solde impayé

**Si 404**: Le backend n'est pas encore déployé, attendre encore 2-3 min

**Si JSON `[]`**: API fonctionne, mais aucun client avec solde impayé (normal si nouvelle base)

---

## 📊 ROUTES API CRÉÉES

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/guest-invoices/unpaid` | GET | Liste des clients avec solde |
| `/api/guest-invoices/:guestId` | GET | Facture complète d'un client |
| `/api/guest-invoices/:guestId/pay` | POST | Enregistrer un paiement |

---

## ✅ RÉSULTAT

Après déploiement:

✅ API backend fonctionnelle pour factures par client
✅ Modal frontend créé (prêt à être utilisé)
❌ Interface pas encore intégrée (à faire ensuite dans Payments.tsx)

---

## 🔄 PROCHAINE ÉTAPE

Pour utiliser dans l'interface, il faudra:
1. Modifier `client/src/pages/Payments.tsx`
2. Ajouter onglet "Factures Par Client"
3. Importer et utiliser `GuestInvoiceModal`

**Voulez-vous que je le fasse maintenant?**
