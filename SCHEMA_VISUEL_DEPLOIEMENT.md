# 🎨 SCHÉMA VISUEL - DÉPLOIEMENT

## 📊 VUE D'ENSEMBLE

```
┌─────────────────────────────────────────────────────────────┐
│                      VOUS ÊTES ICI                          │
│                    PC Local Windows                         │
│                                                             │
│   C:\Users\aubin\Downloads\kiro1\zen_backend\              │
│   └── src/                                                  │
│       ├── controllers/                                      │
│       │   └── invoiceController.ts  ← Fichier prêt        │
│       └── routes/                                           │
│           ├── invoiceRoutes.ts      ← Fichier prêt        │
│           └── index.ts              ← À modifier           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ COPIER-COLLER
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   GITHUB WEB EDITOR                         │
│          https://github.dev/maga1234-0/zen_backend-        │
│                                                             │
│   Interface VS Code dans le navigateur                     │
│   ├── 1. Créer invoiceController.ts                       │
│   ├── 2. Créer invoiceRoutes.ts                          │
│   └── 3. Modifier index.ts                                │
│                                                             │
│   Puis: Commit & Push                                      │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ AUTO-DEPLOY
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    RENDER.COM                               │
│          https://dashboard.render.com                       │
│                                                             │
│   Service: zen_backend                                      │
│   Status: Deploying... ⏳ (3-5 min)                        │
│           ↓                                                 │
│   Status: Live ✅                                          │
│                                                             │
│   URL: https://zen-backend-jzjh.onrender.com              │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ BACKEND READY
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                        │
│          https://zen-lyart.vercel.app                       │
│                                                             │
│   ✅ Déjà déployé avec nouvelle interface                 │
│   Connexion: aubinmaga@gmail.com / admin123                │
│                                                             │
│   Page: Paiements & Factures                               │
│   Onglet: "Factures Consolidées" (NOUVEAU)                │
│                                                             │
│   Maintenant connecté au backend → FONCTIONNE !           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 LES 3 FICHIERS EN DÉTAIL

### 1️⃣ invoiceController.ts
```
Rôle: Logique métier pour les factures
Contenu: 250 lignes de code
Fonctions:
  • getBookingInvoice()    → Récupère facture d'une réservation
  • payBookingInvoice()    → Enregistre un paiement
  • getUnpaidInvoices()    → Liste toutes les factures impayées
```

### 2️⃣ invoiceRoutes.ts
```
Rôle: Définit les routes API
Contenu: 20 lignes de code
Routes:
  • GET  /api/invoices/unpaid
  • GET  /api/invoices/booking/:bookingId
  • POST /api/invoices/booking/:bookingId/pay
```

### 3️⃣ index.ts (modification)
```
Rôle: Router principal qui combine toutes les routes
Action: Ajouter 2 lignes
  • Ligne 1: import invoiceRoutes from './invoiceRoutes';
  • Ligne 2: router.use('/invoices', invoiceRoutes);
```

---

## 🔄 FLUX DE DONNÉES

```
┌──────────────┐
│   CLIENT     │  Click "Voir & Payer" sur une facture
│  (Frontend)  │
└──────┬───────┘
       │
       │ GET /api/invoices/booking/123
       ▼
┌──────────────┐
│   BACKEND    │  invoiceController.getBookingInvoice()
│   (Render)   │
└──────┬───────┘
       │
       │ SQL Query
       ▼
┌──────────────┐
│   DATABASE   │  Récupère:
│  (Supabase)  │  • bookings (réservation)
└──────────────┘  • payments (paiements)
       │          • restaurant_orders (commandes)
       │          • spa_bookings (spa)
       │
       │ Données JSON
       ▼
┌──────────────┐
│   BACKEND    │  Calcule totaux et solde
│              │
└──────┬───────┘
       │
       │ Response JSON
       ▼
┌──────────────┐
│   FRONTEND   │  InvoiceModal affiche:
│              │  • Détails charges
└──────────────┘  • Formulaire paiement
```

---

## 📱 CE QUE VOUS VERREZ

### Avant (Maintenant)
```
┌─────────────────────────────────────┐
│  Page: Paiements & Factures        │
├─────────────────────────────────────┤
│  [Paiements] [Factures Consolidées]│
│                ↑                     │
│           Onglet vide ou erreur     │
└─────────────────────────────────────┘
```

### Après (Dans 5 minutes)
```
┌─────────────────────────────────────────────────┐
│  Page: Paiements & Factures                    │
├─────────────────────────────────────────────────┤
│  [Paiements] [Factures Consolidées (2)]        │
│               Badge rouge avec nombre          │
├─────────────────────────────────────────────────┤
│  Client      | Chambre | Hébergement | Resto   │
│  John Doe    | 301     | 500€        | 150€    │
│  Jane Smith  | 205     | 300€        | 80€     │
│                                                  │
│  [Voir & Payer] ← Click pour ouvrir modal      │
└─────────────────────────────────────────────────┘
```

### Modal Facture Détaillée
```
┌────────────────────────────────────────────────┐
│  Facture Consolidée           [X]              │
├────────────────────────────────────────────────┤
│                                                 │
│  CLIENT: John Doe                              │
│  CHAMBRE: 301 - Suite Deluxe                  │
│  SÉJOUR: 01/01/2025 - 03/01/2025             │
│                                                 │
│  CHARGES:                                      │
│  🏨 Hébergement         500.00€               │
│  🍽️ Restaurant          150.00€               │
│  💆 Spa                 80.00€                │
│  ─────────────────────────────                │
│  TOTAL                  730.00€               │
│  DÉJÀ PAYÉ            -200.00€               │
│  ─────────────────────────────                │
│  SOLDE À PAYER         530.00€               │
│                                                 │
│  [💵 Cash] [💳 Carte] [🏦 Virement]          │
│                                                 │
│  [Payer Maintenant - 530.00€]                │
└────────────────────────────────────────────────┘
```

---

## ⏱️ TIMELINE

```
T+0 min   Vous: Ouvrir GitHub Web Editor
T+2 min   Vous: Créer 2 fichiers + modifier 1 fichier
T+3 min   Vous: Commit & Push
          ✅ Fichiers envoyés vers GitHub

T+3 min   Render: Détecte le changement
T+3-8 min Render: Build + Deploy (automatique)
          Status: "Deploying..."
          
T+8 min   Render: Déploiement terminé
          Status: "Live" ✅
          
T+9 min   Vous: Testez l'application
          ✅ Tout fonctionne !
```

---

## 🆘 POINTS D'ATTENTION

### ⚠️ Si GitHub Web ne charge pas
→ Essayez en navigation privée (Ctrl+Shift+N)
→ Ou utilisez un autre navigateur

### ⚠️ Si Render reste en "Deploying" plus de 10 min
→ Vérifiez les logs dans Render dashboard
→ Cherchez les erreurs en rouge

### ⚠️ Si erreur 404 sur /api/invoices/unpaid
→ Attendez encore 1-2 minutes
→ Render n'a pas fini de redémarrer

### ⚠️ Si frontend affiche erreur
→ Ouvrez Console (F12)
→ Regardez l'onglet "Console" pour voir l'erreur exacte
→ Envoyez-moi l'erreur

---

**READY ? Commencez par ouvrir:**
```
https://github.dev/maga1234-0/zen_backend-
```

**Et suivez le guide `GUIDE_DEPLOIEMENT_ETAPE_PAR_ETAPE.md`** 📖
