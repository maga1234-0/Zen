# 📋 PLAN: Connecter Restaurant & Spa à la Facturation

## 🎯 Objectif

Permettre de:
1. **Facturer les commandes restaurant** (dine-in, room service, takeaway, bar)
2. **Facturer les réservations spa** (massages, soins, etc.)
3. **Générer des factures** pour restaurant et spa
4. **Enregistrer les paiements** pour restaurant et spa
5. **Associer au guest/booking** si applicable (room service, guest spa)

---

## 📊 ARCHITECTURE

### Tables Existantes

**Restaurant:**
- `restaurant_orders` - Commandes restaurant
- `restaurant_order_items` - Articles de la commande
- `menu_items` - Articles du menu

**Spa:**
- `spa_bookings` - Réservations spa
- `spa_services` - Services spa disponibles

**Facturation:**
- `invoices` - Factures
- `payments` - Paiements
- `bookings` - Réservations chambres

### Modifications Nécessaires

#### 1. Table `invoices` - Ajouter colonnes
```sql
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_type VARCHAR(50) DEFAULT 'room';
-- Types: 'room', 'restaurant', 'spa', 'combined'

ALTER TABLE invoices ADD COLUMN IF NOT EXISTS restaurant_order_id UUID REFERENCES restaurant_orders(id);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS spa_booking_id UUID REFERENCES spa_bookings(id);
```

#### 2. Table `payments` - Déjà bonne structure
```sql
-- Colonnes existantes:
-- booking_id (pour chambres)
-- amount, payment_method, payment_status, payment_date
```

#### 3. Nouvelles tables pour liens

**Option A: Élargir `payments`**
```sql
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) DEFAULT 'room';
-- Types: 'room', 'restaurant', 'spa'

ALTER TABLE payments ADD COLUMN IF NOT EXISTS restaurant_order_id UUID REFERENCES restaurant_orders(id);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS spa_booking_id UUID REFERENCES spa_bookings(id);
```

**Option B: Table de liaison (recommandé)**
```sql
CREATE TABLE IF NOT EXISTS payment_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- 'room', 'restaurant', 'spa'
    item_id UUID NOT NULL, -- booking_id, restaurant_order_id, spa_booking_id
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 IMPLÉMENTATION PAR ÉTAPES

### PHASE 1: Base de Données ✅ (À exécuter dans Supabase)

**Script SQL complet:**
```sql
-- 1. Ajouter colonnes à invoices
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_type VARCHAR(50) DEFAULT 'room';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS restaurant_order_id UUID REFERENCES restaurant_orders(id);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS spa_booking_id UUID REFERENCES spa_bookings(id);

-- 2. Ajouter colonnes à payments
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) DEFAULT 'room';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS restaurant_order_id UUID REFERENCES restaurant_orders(id);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS spa_booking_id UUID REFERENCES spa_bookings(id);

-- 3. Créer table payment_items (pour factures combinées)
CREATE TABLE IF NOT EXISTS payment_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL,
    item_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Créer index pour performance
CREATE INDEX IF NOT EXISTS idx_invoices_restaurant ON invoices(restaurant_order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_spa ON invoices(spa_booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_restaurant ON payments(restaurant_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_spa ON payments(spa_booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_items_payment ON payment_items(payment_id);
```

---

### PHASE 2: Backend API 🔧

#### A. Routes Restaurant Payment

**Fichier: `server/src/routes/restaurantRoutes.ts`**

Ajouter:
```typescript
// Générer facture pour une commande restaurant
router.post('/orders/:orderId/invoice', auth, generateRestaurantInvoice);

// Enregistrer paiement restaurant
router.post('/orders/:orderId/payment', auth, recordRestaurantPayment);

// Obtenir facture restaurant
router.get('/orders/:orderId/invoice', auth, getRestaurantInvoice);
```

#### B. Routes Spa Payment

**Fichier: `server/src/routes/spaRoutes.ts`**

Ajouter:
```typescript
// Générer facture pour réservation spa
router.post('/bookings/:bookingId/invoice', auth, generateSpaInvoice);

// Enregistrer paiement spa
router.post('/bookings/:bookingId/payment', auth, recordSpaPayment);

// Obtenir facture spa
router.get('/bookings/:bookingId/invoice', auth, getSpaInvoice);
```

#### C. Controllers

**Nouveau fichier: `server/src/controllers/restaurantPaymentController.ts`**

```typescript
export const generateRestaurantInvoice = async (req, res) => {
  // 1. Récupérer la commande restaurant
  // 2. Créer une facture dans la table invoices
  // 3. Retourner la facture
};

export const recordRestaurantPayment = async (req, res) => {
  // 1. Récupérer la commande
  // 2. Créer un paiement dans payments
  // 3. Mettre à jour le statut de la commande
  // 4. Mettre à jour payment_status de l'order
};
```

**Nouveau fichier: `server/src/controllers/spaPaymentController.ts`**

```typescript
export const generateSpaInvoice = async (req, res) => {
  // Similaire à restaurant
};

export const recordSpaPayment = async (req, res) => {
  // Similaire à restaurant
};
```

---

### PHASE 3: Frontend UI 🎨

#### A. Page Restaurant - Ajouter boutons paiement

**Fichier: `client/src/pages/Restaurant.tsx`**

Pour chaque commande, ajouter:
```tsx
<button onClick={() => handleGenerateInvoice(order.id)}>
  📄 Générer Facture
</button>

<button onClick={() => handleRecordPayment(order.id)}>
  💳 Enregistrer Paiement
</button>
```

Modal pour paiement:
```tsx
<PaymentModal
  orderType="restaurant"
  orderId={selectedOrderId}
  amount={totalAmount}
  onSuccess={handlePaymentSuccess}
/>
```

#### B. Page Spa - Ajouter boutons paiement

**Fichier: `client/src/pages/Spa.tsx`**

Similaire au restaurant:
```tsx
<button onClick={() => handleGenerateInvoice(booking.id)}>
  📄 Générer Facture
</button>

<button onClick={() => handleRecordPayment(booking.id)}>
  💳 Enregistrer Paiement
</button>
```

#### C. Page Payments - Afficher tous les paiements

**Fichier: `client/src/pages/Payments.tsx`**

Modifier pour afficher:
- Paiements chambres
- Paiements restaurant
- Paiements spa

Filtres:
```tsx
<select onChange={handleFilterChange}>
  <option value="all">Tous les paiements</option>
  <option value="room">Chambres</option>
  <option value="restaurant">Restaurant</option>
  <option value="spa">Spa</option>
</select>
```

#### D. Composant PaymentModal (réutilisable)

**Nouveau fichier: `client/src/components/PaymentModal.tsx`**

```tsx
interface PaymentModalProps {
  type: 'room' | 'restaurant' | 'spa';
  itemId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentModal = ({ type, itemId, amount, onSuccess, onCancel }) => {
  // Formulaire de paiement réutilisable
  // Méthodes: cash, card, mobile money, etc.
  // Appelle l'API appropriée selon le type
};
```

---

### PHASE 4: Facturation PDF 📄

**Fichier: `server/src/utils/invoiceGenerator.ts`**

```typescript
export const generateRestaurantInvoicePDF = async (orderId) => {
  // 1. Récupérer données commande + items
  // 2. Générer PDF avec logo, détails, total
  // 3. Retourner le PDF
};

export const generateSpaInvoicePDF = async (bookingId) => {
  // Similaire
};
```

Utiliser une bibliothèque comme **PDFKit** ou **jsPDF**.

---

## 🎯 WORKFLOW UTILISATEUR

### Restaurant

1. **Créer commande** → Page Restaurant
2. **Commande terminée** → Bouton "Générer Facture" apparaît
3. **Cliquer "Générer Facture"** → Facture créée dans `invoices`
4. **Cliquer "Enregistrer Paiement"** → Modal s'ouvre
5. **Sélectionner méthode** (cash, card, etc.) et montant
6. **Valider** → Paiement enregistré dans `payments`
7. **Statut commande** → "Paid" ✅
8. **Facture téléchargeable** → PDF disponible

### Spa

1. **Créer réservation spa** → Page Spa
2. **Réservation complétée** → Bouton "Générer Facture" apparaît
3. **Cliquer "Générer Facture"** → Facture créée
4. **Cliquer "Enregistrer Paiement"** → Modal s'ouvre
5. **Sélectionner méthode** et montant
6. **Valider** → Paiement enregistré
7. **Statut réservation** → "Paid" ✅
8. **Facture téléchargeable** → PDF disponible

---

## 📊 EXEMPLE DE DONNÉES

### Restaurant Order Payment

```sql
-- Commande restaurant
INSERT INTO restaurant_orders (order_number, order_type, table_number, total_amount, payment_status)
VALUES ('R-001', 'dine_in', 5, 150.00, 'pending');

-- Facture générée
INSERT INTO invoices (invoice_type, restaurant_order_id, total_amount, invoice_status)
VALUES ('restaurant', '<order_id>', 150.00, 'unpaid');

-- Paiement enregistré
INSERT INTO payments (payment_type, restaurant_order_id, amount, payment_method, payment_status)
VALUES ('restaurant', '<order_id>', 150.00, 'card', 'completed');

-- Mettre à jour commande
UPDATE restaurant_orders SET payment_status = 'paid' WHERE id = '<order_id>';
```

### Spa Booking Payment

```sql
-- Réservation spa
INSERT INTO spa_bookings (booking_number, guest_name, service_id, total_price, payment_status)
VALUES ('SPA-001', 'John Doe', '<service_id>', 80.00, 'pending');

-- Facture générée
INSERT INTO invoices (invoice_type, spa_booking_id, total_amount, invoice_status)
VALUES ('spa', '<booking_id>', 80.00, 'unpaid');

-- Paiement enregistré
INSERT INTO payments (payment_type, spa_booking_id, amount, payment_method, payment_status)
VALUES ('spa', '<booking_id>', 80.00, 'cash', 'completed');

-- Mettre à jour réservation
UPDATE spa_bookings SET payment_status = 'paid' WHERE id = '<booking_id>';
```

---

## ✅ CHECKLIST D'IMPLÉMENTATION

### Base de Données
- [ ] Exécuter script SQL Phase 1 dans Supabase
- [ ] Vérifier que les colonnes sont ajoutées
- [ ] Tester les contraintes de clés étrangères

### Backend
- [ ] Créer `restaurantPaymentController.ts`
- [ ] Créer `spaPaymentController.ts`
- [ ] Ajouter routes restaurant payment
- [ ] Ajouter routes spa payment
- [ ] Créer `invoiceGenerator.ts` (PDF)
- [ ] Tester les endpoints avec Postman

### Frontend
- [ ] Créer composant `PaymentModal.tsx`
- [ ] Modifier `Restaurant.tsx` - ajouter boutons paiement
- [ ] Modifier `Spa.tsx` - ajouter boutons paiement
- [ ] Modifier `Payments.tsx` - afficher tous types
- [ ] Créer page `Invoices.tsx` (optionnel)
- [ ] Tester l'UX complète

### Tests
- [ ] Test: Créer commande restaurant → Payer
- [ ] Test: Créer réservation spa → Payer
- [ ] Test: Télécharger facture PDF
- [ ] Test: Voir paiements dans page Payments
- [ ] Test: Dashboard affiche revenus restaurant/spa

---

## ⏱️ ESTIMATION DE TEMPS

- **Phase 1 (Base de données)**: 30 minutes
- **Phase 2 (Backend API)**: 4-6 heures
- **Phase 3 (Frontend UI)**: 6-8 heures
- **Phase 4 (PDF)**: 2-3 heures

**Total**: ~15-20 heures de développement

---

## 🚀 PRIORITÉ

**Quick Win** (1-2 heures):
1. Exécuter script SQL Phase 1
2. Ajouter simplement 2 colonnes dans `payments`: `payment_type` et `description`
3. Dans Restaurant/Spa, ajouter bouton "Enregistrer Paiement Direct"
4. Modal simple pour enregistrer paiement manuel

**Solution complète** (15-20 heures):
- Toutes les phases ci-dessus
- Facturation automatique
- PDF téléchargeables
- Intégration complète

---

## 📝 PROCHAINE ÉTAPE

Voulez-vous:
1. **Quick Win** - Solution simple en 1-2h?
2. **Solution Complète** - Toutes les fonctionnalités?
3. **Phase par Phase** - On fait étape par étape ensemble?

Dites-moi quelle approche vous préférez!
