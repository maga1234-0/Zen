# 💱 APPLIQUER LA DEVISE PARTOUT DANS LE SYSTÈME

---

## 🎯 OBJECTIF

Remplacer tous les affichages de prix statiques (`$...`, `...€`) par le système de devise dynamique qui respecte la sélection de l'utilisateur dans les paramètres.

---

## ✅ CE QUI A ÉTÉ CRÉÉ

### 1. Utilitaire de Formatage (`client/src/utils/currency.ts`) ✅

**Hook React `useCurrencyFormat()`**:
```typescript
const { formatPrice, getCurrencySymbol, getCurrencyCode } = useCurrencyFormat();

// Exemple:
formatPrice(1250.50) → "$ 1250.50" ou "FC 1250" selon la devise
```

**Fonction Standalone `formatCurrency()`**:
```typescript
formatCurrency(1250.50, 'CDF', 'FC', 'before') → "FC 1250"
```

### 2. Composant Réutilisable (`client/src/components/ui/CurrencyDisplay.tsx`) ✅

```typescript
<CurrencyDisplay amount={1250.50} className="text-xl font-bold" />
// Affiche: "$ 1250.50" ou "FC 1250" selon les paramètres
```

---

## 📋 PAGES À METTRE À JOUR

### 🏨 Pages Hôtel

#### 1. **Dashboard** (`client/src/pages/Dashboard.tsx`)

**Lignes à modifier**:

| Ligne | Ancien Code | Nouveau Code |
|-------|-------------|--------------|
| ~212 | `` `$${stats?.revenue?.toFixed(2) \|\| 0}` `` | `` <CurrencyDisplay amount={stats?.revenue \|\| 0} /> `` |
| ~526 | `` `${parseFloat(restaurantStats?.orders?.total_revenue \|\| 0).toFixed(2)}€` `` | `` <CurrencyDisplay amount={parseFloat(restaurantStats?.orders?.total_revenue \|\| 0)} /> `` |
| ~599 | `` `{order.total_amount}€` `` | `` <CurrencyDisplay amount={order.total_amount} /> `` |
| ~659 | `` `${parseFloat(restaurantStats?.orders?.total_revenue \|\| 0).toFixed(2)}€` `` | `` <CurrencyDisplay amount={parseFloat(restaurantStats?.orders?.total_revenue \|\| 0)} /> `` |
| ~748 | `` `${parseFloat(restaurantStats?.orders?.total_revenue \|\| 0).toFixed(2)}€` `` | `` <CurrencyDisplay amount={parseFloat(restaurantStats?.orders?.total_revenue \|\| 0)} /> `` |
| ~771 | `` `{restaurantStats?.orders?.average_order_value \|\| '0.00'}€` `` | `` <CurrencyDisplay amount={parseFloat(restaurantStats?.orders?.average_order_value \|\| 0)} /> `` |
| ~1069 | `` `$${stats?.hotel?.revenue?.toFixed(2) \|\| 0}` `` | `` <CurrencyDisplay amount={stats?.hotel?.revenue \|\| 0} /> `` |
| ~1090 | `` `${parseFloat(stats?.restaurant?.revenue \|\| 0).toFixed(2)}€` `` | `` <CurrencyDisplay amount={parseFloat(stats?.restaurant?.revenue \|\| 0)} /> `` |
| ~1111 | `` `${parseFloat(stats?.spa?.revenue \|\| 0).toFixed(2)}€` `` | `` <CurrencyDisplay amount={parseFloat(stats?.spa?.revenue \|\| 0)} /> `` |

**Import à ajouter en haut**:
```typescript
import { CurrencyDisplay } from '@/components/ui/CurrencyDisplay';
```

---

#### 2. **Rooms** (`client/src/pages/Rooms.tsx`)

**Lignes à modifier**:

| Ligne | Ancien Code | Nouveau Code |
|-------|-------------|--------------|
| ~404 | `` `${room.base_price}/night` `` | `` `<CurrencyDisplay amount={room.base_price} />/night` `` |
| ~657 | `` `${selectedRoom.base_price}` `` | `` `<CurrencyDisplay amount={selectedRoom.base_price} />` `` |
| ~1004 | `` `${selectedRoom.base_price}/night` `` | `` `<CurrencyDisplay amount={selectedRoom.base_price} />/night` `` |

---

#### 3. **Bookings** (`client/src/pages/Bookings.tsx`)

**Lignes à modifier**:

| Ligne | Ancien Code | Nouveau Code |
|-------|-------------|--------------|
| ~440 | `` `Room {room.room_number} - {room.type_name} (${room.base_price}/night)` `` | `` `Room {room.room_number} - {room.type_name} ({formatPrice(room.base_price)}/night)` `` |
| ~539 | `` `${roomPrice}` `` | `` `{formatPrice(roomPrice)}` `` |
| ~544 | `` `${extraCharges}` `` | `` `{formatPrice(extraCharges)}` `` |
| ~549 | `` `${calculateTotalPrice()}` `` | `` `{formatPrice(calculateTotalPrice())}` `` |
| ~Colonnes | `` `$${booking.total_amount}` `` | `` `<CurrencyDisplay amount={booking.total_amount} />` `` |

---

#### 4. **Payments** (`client/src/pages/Payments.tsx`)

**Rechercher tous les**:
- `` `$${payment.amount}` ``
- `` `€{payment.amount}` ``

**Remplacer par**:
```typescript
<CurrencyDisplay amount={payment.amount} />
```

---

#### 5. **FrontDesk** (`client/src/pages/FrontDesk.tsx`)

**Rechercher tous les affichages de prix et remplacer par** `<CurrencyDisplay>`.

---

### 🍽️ Pages Restaurant

#### 6. **Restaurant** (`client/src/pages/Restaurant.tsx`)

**Lignes à modifier**:

| Rechercher | Remplacer |
|------------|-----------|
| Tous les `` `${price}€` `` | `` <CurrencyDisplay amount={price} /> `` |
| Tous les `{item.price}€` | `<CurrencyDisplay amount={item.price} />` |
| Tous les `{order.total_amount}€` | `<CurrencyDisplay amount={order.total_amount} />` |

---

### 💆 Pages Spa

#### 7. **Spa** (`client/src/pages/Spa.tsx`)

**Rechercher tous les**:
- `{service.price}€`
- `{booking.total_amount}€`
- Affichages de prix dans les stats

**Remplacer par**:
```typescript
<CurrencyDisplay amount={service.price} />
<CurrencyDisplay amount={booking.total_amount} />
```

---

## 🔧 MÉTHODE D'APPLICATION

### Méthode 1: Utiliser le Hook (Recommandé pour les composants)

```typescript
import { useCurrencyFormat } from '@/utils/currency';

const MyComponent = () => {
  const { formatPrice } = useCurrencyFormat();
  
  return (
    <div>
      {/* Dans du texte */}
      <p>Prix: {formatPrice(1250.50)}</p>
      
      {/* Dans une chaîne interpolée */}
      <option>{`Room 101 - ${formatPrice(roomPrice)}/night`}</option>
    </div>
  );
};
```

### Méthode 2: Utiliser le Composant (Recommandé pour l'affichage simple)

```typescript
import { CurrencyDisplay } from '@/components/ui/CurrencyDisplay';

const MyComponent = () => {
  return (
    <div>
      {/* Affichage simple */}
      <CurrencyDisplay amount={1250.50} />
      
      {/* Avec des classes CSS */}
      <CurrencyDisplay 
        amount={1250.50} 
        className="text-2xl font-bold text-green-600" 
      />
    </div>
  );
};
```

---

## 📊 STATISTIQUES

### Pages à Mettre à Jour:
- ✅ `client/src/utils/currency.ts` - CRÉÉ
- ✅ `client/src/components/ui/CurrencyDisplay.tsx` - CRÉÉ
- ⏳ `client/src/pages/Dashboard.tsx` - ~20 occurrences
- ⏳ `client/src/pages/Rooms.tsx` - ~5 occurrences
- ⏳ `client/src/pages/Bookings.tsx` - ~10 occurrences
- ⏳ `client/src/pages/Payments.tsx` - ~15 occurrences
- ⏳ `client/src/pages/FrontDesk.tsx` - ~5 occurrences
- ⏳ `client/src/pages/Restaurant.tsx` - ~25 occurrences
- ⏳ `client/src/pages/Spa.tsx` - ~15 occurrences
- ⏳ `client/src/pages/Reports.tsx` - ~10 occurrences

**Total estimé**: ~105 remplacements

---

## 🚀 PLAN D'EXÉCUTION

### Phase 1: Créer les Utilitaires ✅ TERMINÉ
- ✅ Créer `currency.ts`
- ✅ Créer `CurrencyDisplay.tsx`

### Phase 2: Mettre à Jour les Pages Principales (EN COURS)
1. Dashboard (admin/manager voient tout)
2. Bookings (réservations avec prix)
3. Rooms (prix par nuit)
4. Payments (tous les paiements)

### Phase 3: Mettre à Jour les Modules Restaurant & Spa
1. Restaurant (commandes, menu, prix)
2. Spa (services, réservations, prix)

### Phase 4: Mettre à Jour les Pages Secondaires
1. FrontDesk (check-in/check-out avec prix)
2. Reports (rapports financiers)
3. Autres pages avec affichage de prix

---

## 🧪 TESTS

Après chaque mise à jour:

1. **Changer la devise dans Settings**:
   - USD → CDF → EUR → GBP → ZAR → XAF

2. **Vérifier les pages**:
   - Les symboles changent (`$` → `FC` → `€` → `£` → `R` → `FCFA`)
   - Les décimales sont correctes (CDF/XAF = 0, autres = 2)
   - La position du symbole est respectée (avant/après)

3. **Tester les calculs**:
   - Total des réservations
   - Total des commandes restaurant
   - Rapports financiers

---

## ❗ POINTS D'ATTENTION

1. **Décimales**:
   - CDF et XAF: 0 décimales (FC 1250, FCFA 1250)
   - Autres: 2 décimales ($ 1250.50, € 1250.50)

2. **Position du Symbole**:
   - Avant: `$ 1250.50`
   - Après: `1250.50 €`

3. **Séparateur de Milliers**:
   - Utiliser des espaces: `$ 1 250 000.50`

4. **Valeurs Nulles**:
   - Si `amount === null` ou `undefined`, afficher `-`

---

## 🔄 PROCHAINES ÉTAPES

1. ⏳ Mettre à jour Dashboard.tsx avec CurrencyDisplay
2. ⏳ Mettre à jour Bookings.tsx avec formatPrice
3. ⏳ Mettre à jour Rooms.tsx
4. ⏳ Mettre à jour Payments.tsx
5. ⏳ Mettre à jour Restaurant.tsx
6. ⏳ Mettre à jour Spa.tsx
7. ✅ Push tout et déployer
8. ✅ Tester en production

---

**Date**: 22 juin 2026  
**Objectif**: Système multi-devises respecté partout  
**Priorité**: 🔴 HAUTE  
**Temps estimé**: 2-3 heures  
