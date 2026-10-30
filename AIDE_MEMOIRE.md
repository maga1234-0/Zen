# 📋 AIDE-MÉMOIRE - DÉPLOIEMENT FACTURES PAR CLIENT

## 🎯 EN BREF
Système permettant de voir et payer TOUS les achats d'un client (restaurant + spa + chambre) en une seule facture.

---

## ⚡ DÉPLOIEMENT RAPIDE

### Backend (5 min)
```
1. https://github.dev/maga1234-0/zen_backend-
2. Copier 3 fichiers:
   - src/controllers/guestInvoiceController.ts (316 lignes)
   - src/routes/guestInvoiceRoutes.ts (20 lignes)
   - src/routes/index.ts (+2 lignes)
3. Commit: "Add guest invoice system"
```

### Frontend (5 min)
```
1. https://github.dev/maga1234-0/Zen
2. Copier 2 fichiers:
   - src/components/GuestInvoiceModal.tsx (742 lignes)
   - src/pages/Payments.tsx (remplacer tout)
3. Commit: "Add guest invoice tab"
```

---

## ✅ VÉRIFICATION

### API Backend
```
https://zen-backend-jzjh.onrender.com/api/guest-invoices/unpaid
→ Doit retourner: [] ou [{...}]
```

### Interface
```
1. https://zen-lyart.vercel.app
2. Login: aubinmaga@gmail.com / admin123
3. Payments → 3 onglets visibles
4. Cliquer: "Factures Par Client"
```

---

## 📚 GUIDES

| Guide | Utilisation |
|-------|-------------|
| `START_DEPLOY.md` | ⭐ Démarrer ici |
| `DEPLOIEMENT_COMPLET_MAINTENANT.md` | Guide complet |
| `RESUME_COMPLET_FINAL.md` | Vue d'ensemble |
| `INDEX_DEPLOIEMENT_FACTURES.md` | Navigation |

---

## 🔧 ENDPOINTS API

```
GET  /api/guest-invoices/unpaid
GET  /api/guest-invoices/:guestId
POST /api/guest-invoices/:guestId/pay
```

---

## 💡 FONCTIONNALITÉS

✅ Vue de tous les achats par client
✅ Support clients sans chambre
✅ Paiements partiels ou complets
✅ Historique complet visible
✅ Interface intuitive avec 3 onglets

---

## 🆘 PROBLÈME?

**API 404**: Attendre 5 min après push  
**Interface vide**: Vider cache (Ctrl+Shift+R)  
**Onglet manquant**: Vérifier Payments.tsx remplacé

---

## 📞 FICHIERS LOCAUX

```
Backend:
c:\Users\aubin\Downloads\kiro1\zen_backend\src\controllers\guestInvoiceController.ts
c:\Users\aubin\Downloads\kiro1\zen_backend\src\routes\guestInvoiceRoutes.ts
c:\Users\aubin\Downloads\kiro1\zen_backend\src\routes\index.ts

Frontend:
c:\Users\aubin\Downloads\kiro1\client\src\components\GuestInvoiceModal.tsx
c:\Users\aubin\Downloads\kiro1\client\src\pages\Payments.tsx
```

---

## ⏱️ TEMPS

- Déploiement: 10-15 min
- Attente Render/Vercel: 3-5 min
- Test: 2 min
- **Total**: 15-20 min

---

**🚀 Ouvrir `START_DEPLOY.md` pour commencer !**
