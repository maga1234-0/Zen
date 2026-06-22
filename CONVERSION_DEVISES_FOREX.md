# 💱 CONVERSION AUTOMATIQUE DES DEVISES (FOREX)

---

## 🎯 FONCTIONNEMENT

Le système convertit **automatiquement** tous les prix selon les taux de change Forex en temps réel.

### Principe:
1. ✅ **Tous les prix dans la base de données sont stockés en USD** (devise de référence)
2. ✅ **À l'affichage**, les prix sont convertis dans la devise sélectionnée par l'utilisateur
3. ✅ **Taux de change en temps réel** via API exchangerate-api.com
4. ✅ **Taux de secours** stockés dans la base de données si l'API est indisponible

---

## 📊 EXEMPLE

### Dans la base de données:
```sql
-- Chambre Standard
base_price = 100.00 USD  ← Toujours en USD
```

### À l'affichage (utilisateur a sélectionné CDF):
```
Prix affiché: FC 280 000  ← Converti automatiquement
Taux utilisé: 1 USD = 2800 CDF
```

### À l'affichage (utilisateur a sélectionné EUR):
```
Prix affiché: € 92.00  ← Converti automatiquement
Taux utilisé: 1 USD = 0.92 EUR
```

---

## 🔄 API DE TAUX DE CHANGE

### API Utilisée: **exchangerate-api.com**
- ✅ **Gratuit**: 1500 requêtes/mois
- ✅ **Taux en temps réel**: Mis à jour toutes les heures
- ✅ **Fiable**: Taux officiels Forex
- ✅ **Cache**: Les taux sont mis en cache pendant 1 heure

### Taux Disponibles:
| Devise | Taux Approximatif | Exemple: 100 USD = |
|--------|-------------------|-------------------|
| 💵 USD | 1.0 | 100 USD |
| 🇨🇩 CDF | 2800 | 280 000 FC |
| 💶 EUR | 0.92 | 92 € |
| 🇬🇧 GBP | 0.79 | 79 £ |
| 🇿🇦 ZAR | 18.50 | 1 850 R |
| 🌍 XAF | 605 | 60 500 FCFA |

---

## ✅ CE QUI A ÉTÉ FAIT

### 1. Service de Conversion (`client/src/services/currencyService.ts`) ✅
```typescript
// Récupère les taux de change en temps réel
await getExchangeRates();

// Convertit de USD vers n'importe quelle devise
await convertFromUSD(100, 'CDF');  // → 280000

// Convertit entre deux devises
await convertCurrency(100, 'EUR', 'GBP');
```

### 2. Utilitaire de Formatage Mis à Jour (`client/src/utils/currency.ts`) ✅
```typescript
const { formatPrice } = useCurrencyFormat();

// Convertit automatiquement de USD vers la devise sélectionnée
formatPrice(100);  // Si devise = CDF → "FC 280 000"
                   // Si devise = EUR → "€ 92.00"
```

### 3. SQL pour Taux de Secours (`database/ADD_EXCHANGE_RATES_TO_CURRENCIES.sql`) ✅
```sql
-- Fonction SQL pour convertir entre devises
SELECT convert_currency(100, 'USD', 'CDF');  -- → 280000

-- Formater avec conversion
SELECT format_currency_converted(100, 'EUR');  -- → "€ 92.00"
```

---

## 🚀 DÉPLOIEMENT

### Étape 1: Exécuter les SQL ⏳

**1. Exécute d'abord le script principal** (si pas encore fait):
```
database/ADD_MULTI_CURRENCY_SYSTEM.sql
```

**2. Puis exécute le script de taux de change**:
```
database/ADD_EXCHANGE_RATES_TO_CURRENCIES.sql
```

### Étape 2: Push le Code ⏳

Le code avec conversion automatique sera pushé maintenant.

---

## 🧪 TESTER

### 1. Teste la Conversion:
```javascript
// Console du navigateur (F12)
import { convertFromUSD } from '@/services/currencyService';

// Convertir 100 USD en CDF
await convertFromUSD(100, 'CDF');  // → ~280000

// Convertir 100 USD en EUR
await convertFromUSD(100, 'EUR');  // → ~92
```

### 2. Teste dans l'Application:
1. Va dans **Settings** → Change devise à **CDF**
2. Va dans **Rooms** → Vérifie qu'une chambre à 100 USD s'affiche **"FC 280 000"**
3. Change devise à **EUR** → Vérifie que ça s'affiche **"€ 92.00"**

---

## 📋 COMMENT ÇA MARCHE

### Frontend (React):
```typescript
// 1. Le composant utilise le hook
const { formatPrice } = useCurrencyFormat();

// 2. Le hook charge les taux de change au démarrage
useEffect(() => {
  getExchangeRates().then(setExchangeRates);
}, [currency]);

// 3. formatPrice() convertit automatiquement
formatPrice(100);  // USD 100 → CDF 280000 → "FC 280 000"
```

### Backend (SQL):
```sql
-- Les prix sont toujours en USD dans la base
INSERT INTO room_types (name, base_price) VALUES 
('Standard', 100.00);  -- ← En USD

-- Pour afficher en CDF dans un rapport:
SELECT 
  name,
  format_currency_converted(base_price, 'CDF') as price_cdf
FROM room_types;
-- Résultat: Standard | FC 280,000
```

---

## ⚠️ POINTS IMPORTANTS

### 1. Devise de Référence: USD
- **Tous les prix** dans la base de données sont en USD
- **Ne jamais stocker** des prix dans une autre devise
- La conversion se fait **uniquement à l'affichage**

### 2. Taux de Change
- **Mis à jour automatiquement** toutes les heures
- **Cache** pendant 1 heure pour performance
- **Taux de secours** en base de données si API indisponible

### 3. Transactions
- Les **paiements** sont enregistrés en USD dans la base
- L'affichage peut être dans n'importe quelle devise
- Les **rapports** peuvent convertir les montants à la demande

---

## 🔧 MAINTENANCE

### Mettre à Jour les Taux de Secours:
```sql
-- Manuellement dans Supabase si besoin
UPDATE currencies SET 
  exchange_rate_to_usd = 0.000350,  -- Nouveau taux
  last_updated = CURRENT_TIMESTAMP
WHERE code = 'CDF';
```

### Ajouter une Nouvelle Devise:
```sql
INSERT INTO currencies (code, name, symbol, decimal_places, exchange_rate_to_usd) VALUES
('JPY', 'Yen Japonais', '¥', 0, 0.0067);  -- 1 JPY ≈ 0.0067 USD
```

---

## 📊 FLUX DE DONNÉES

```
┌─────────────────────────────────────────────────────┐
│ BASE DE DONNÉES (Supabase)                         │
│                                                     │
│ room_types:                                         │
│   base_price = 100.00 USD  ← Toujours USD          │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ API TAUX DE CHANGE (exchangerate-api.com)          │
│                                                     │
│ Taux actuels:                                       │
│   1 USD = 2800 CDF                                  │
│   1 USD = 0.92 EUR                                  │
│   1 USD = 0.79 GBP                                  │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ SERVICE CONVERSION (currencyService.ts)             │
│                                                     │
│ convertFromUSD(100, 'CDF')                          │
│   = 100 × 2800 = 280,000                            │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ FORMATAGE (currency.ts)                             │
│                                                     │
│ formatPrice(280000, 'CDF', 'FC', 'before')          │
│   = "FC 280 000"  ← 0 décimales, séparateurs        │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ AFFICHAGE (UI)                                      │
│                                                     │
│ Prix de la chambre: FC 280 000 /nuit               │
└─────────────────────────────────────────────────────┘
```

---

## 🎉 RÉSULTAT FINAL

Maintenant, quand un utilisateur:
1. ✅ Change sa devise dans **Settings** à **CDF**
2. ✅ Les **prix** partout dans l'app sont **automatiquement convertis** de USD vers CDF
3. ✅ Les **taux de change sont en temps réel** (mise à jour toutes les heures)
4. ✅ Le **formatage est correct** (FC 280 000 avec 0 décimales, séparateurs d'espaces)
5. ✅ Tout est **automatique**, pas besoin de calculer manuellement!

---

**Date**: 22 juin 2026  
**API**: exchangerate-api.com (gratuit, 1500 req/mois)  
**Devise de référence**: USD  
**Conversion**: Automatique en temps réel  
