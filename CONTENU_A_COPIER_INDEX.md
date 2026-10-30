# 📝 CONTENU EXACT À COPIER POUR index.ts

## ⚠️ NE PAS REMPLACER TOUT LE FICHIER

Vous devez **SEULEMENT** ajouter 2 lignes dans le fichier existant `src/routes/index.ts`.

---

## LIGNE 9 - Ajouter cet import

Après la ligne:
```typescript
import paymentRoutes from './paymentRoutes';
```

**AJOUTER**:
```typescript
import invoiceRoutes from './invoiceRoutes';
```

---

## LIGNE 25 - Ajouter cette route

Après la ligne:
```typescript
router.use('/payments', paymentRoutes);
```

**AJOUTER**:
```typescript
router.use('/invoices', invoiceRoutes);
```

---

## ✅ FICHIER COMPLET FINAL

Votre fichier `src/routes/index.ts` doit ressembler à ceci:

```typescript
import { Router } from 'express';
import authRoutes from './authRoutes';
import dashboardRoutes from './dashboardRoutes';
import hotelRoutes from './hotelRoutes';
import roomRoutes from './roomRoutes';
import bookingRoutes from './bookingRoutes';
import guestRoutes from './guestRoutes';
import userRoutes from './userRoutes';
import paymentRoutes from './paymentRoutes';
import invoiceRoutes from './invoiceRoutes';          // ← AJOUTER CETTE LIGNE
import notificationRoutes from './notificationRoutes';
import aiRoutes from './aiRoutes';
import restaurantRoutes from './restaurantRoutes';
import onlineBookingRoutes from './onlineBookingRoutes';
import spaRoutes from './spaRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/hotels', hotelRoutes);
router.use('/rooms', roomRoutes);
router.use('/bookings', bookingRoutes);
router.use('/guests', guestRoutes);
router.use('/users', userRoutes);
router.use('/payments', paymentRoutes);
router.use('/invoices', invoiceRoutes);               // ← AJOUTER CETTE LIGNE
router.use('/notifications', notificationRoutes);
router.use('/ai', aiRoutes);
router.use('/restaurant', restaurantRoutes);
router.use('/online-booking', onlineBookingRoutes);
router.use('/spa', spaRoutes);

export default router;
```

---

## 🎯 RÉCAPITULATIF

1. ✅ Ouvrir `src/routes/index.ts` dans GitHub Web Editor
2. ✅ Ajouter ligne 9: `import invoiceRoutes from './invoiceRoutes';`
3. ✅ Ajouter ligne 25: `router.use('/invoices', invoiceRoutes);`
4. ✅ Sauvegarder et Commit

C'est tout ! Pas besoin de copier tout le fichier.
