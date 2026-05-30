# 📱 Module de Réservation en Ligne

## Vue d'ensemble

Le module de réservation en ligne permet aux clients de réserver des chambres directement via le site web sans authentification. C'est un système public complet avec gestion des disponibilités, codes promo, et conversion en réservations internes.

## ✅ Fonctionnalités implémentées

### 1. **Base de données** ✅
- ✅ Table `online_booking_settings` - Paramètres du système
- ✅ Table `online_bookings` - Réservations en ligne
- ✅ Table `room_availability_overrides` - Disponibilités personnalisées
- ✅ Table `promo_codes` - Codes promotionnels
- ✅ Table `public_reviews` - Avis clients publics
- ✅ Table `booking_faqs` - Questions fréquentes
- ✅ Fonction `generate_booking_reference()` - Génération de références uniques
- ✅ Fonction `get_room_availability()` - Calcul de disponibilité
- ✅ Vues `v_online_bookings_summary` et `v_online_booking_stats`

### 2. **Backend API** ✅

#### Endpoints publics (sans authentification)
- ✅ `GET /api/online-booking/public/availability` - Chambres disponibles
- ✅ `GET /api/online-booking/public/settings` - Paramètres de réservation
- ✅ `POST /api/online-booking/public/validate-promo` - Valider un code promo
- ✅ `POST /api/online-booking/public/bookings` - Créer une réservation
- ✅ `GET /api/online-booking/public/bookings/:reference` - Consulter une réservation
- ✅ `POST /api/online-booking/public/bookings/:reference/cancel` - Annuler
- ✅ `GET /api/online-booking/public/reviews` - Avis publics
- ✅ `GET /api/online-booking/public/faqs` - Questions fréquentes

#### Endpoints admin (authentification requise)
- ✅ `GET /api/online-booking/admin/bookings` - Liste des réservations
- ✅ `GET /api/online-booking/admin/stats` - Statistiques
- ✅ `POST /api/online-booking/admin/bookings/:id/convert` - Convertir en réservation interne

### 3. **Frontend** ✅
- ✅ Page publique `/book` - Interface de réservation en 4 étapes
- ✅ Sélection des dates et recherche de disponibilité
- ✅ Choix du type de chambre
- ✅ Formulaire d'informations client
- ✅ Application de codes promo
- ✅ Calcul automatique des taxes et acomptes
- ✅ Confirmation avec référence de réservation
- ✅ Design responsive et moderne
- ✅ Traductions françaises complètes

## 📋 Structure de la base de données

### Table: online_booking_settings

```sql
- is_enabled: Activer/désactiver les réservations en ligne
- min_advance_days: Jours minimum à l'avance (défaut: 1)
- max_advance_days: Jours maximum à l'avance (défaut: 365)
- min_stay_nights: Séjour minimum (défaut: 1)
- max_stay_nights: Séjour maximum (défaut: 30)
- require_deposit: Acompte requis (défaut: true)
- deposit_percentage: Pourcentage d'acompte (défaut: 30%)
- cancellation_hours: Heures avant annulation gratuite (défaut: 24h)
```

### Table: online_bookings
```sql
- booking_reference: REF-YYYYMMDD-XXXX (unique)
- Informations client: nom, email, téléphone, adresse
- Détails réservation: type chambre, dates, nombre de personnes
- Tarification: prix, taxes, total, acompte
- Statut: pending, confirmed, cancelled, expired, converted
- Paiement: payment_status, payment_method, payment_intent_id
- Conversion: converted_to_booking_id, converted_at, converted_by
```

### Table: promo_codes
```sql
- code: Code promo (unique, ex: SUMMER2026)
- discount_type: percentage ou fixed_amount
- discount_value: Valeur de la réduction
- min_nights: Nombre minimum de nuits
- min_amount: Montant minimum de réservation
- applicable_room_types: Types de chambres éligibles
- valid_from / valid_until: Période de validité
- max_uses / current_uses: Limite d'utilisation
```

## 🚀 Utilisation

### Pour les clients (Frontend)

1. **Accéder à la page de réservation**
   ```
   https://votre-domaine.com/book
   ```

2. **Étape 1: Sélectionner les dates**
   - Choisir date d'arrivée et de départ
   - Indiquer le nombre de personnes
   - Cliquer sur "Rechercher les disponibilités"

3. **Étape 2: Choisir une chambre**
   - Voir les chambres disponibles avec prix
   - Sélectionner le type de chambre souhaité

4. **Étape 3: Remplir les informations**
   - Prénom, nom, email, téléphone (obligatoires)
   - Adresse, ville, pays (optionnels)
   - Demandes spéciales
   - Code promo (optionnel)
   - Voir le récapitulatif avec taxes et acompte

5. **Étape 4: Confirmation**
   - Recevoir la référence de réservation
   - Email de confirmation automatique

### Pour les administrateurs (Backend)

1. **Consulter les réservations en ligne**
   ```typescript
   GET /api/online-booking/admin/bookings
   // Filtres: status, date_from, date_to
   ```

2. **Voir les statistiques**
   ```typescript
   GET /api/online-booking/admin/stats
   // Retourne: total, confirmées, en attente, revenus, etc.
   ```

3. **Convertir en réservation interne**
   ```typescript
   POST /api/online-booking/admin/bookings/:id/convert
   // Crée automatiquement le client et la réservation
   // Assigne une chambre disponible
   ```

## 🔧 Configuration

### 1. Activer le module dans Supabase
```sql
-- Exécuter le fichier SQL
\i database/online-booking-module.sql
```

### 2. Configurer les paramètres
```sql
UPDATE online_booking_settings SET
  is_enabled = true,
  min_advance_days = 1,
  deposit_percentage = 30.00,
  cancellation_hours = 24;
```

### 3. Créer des codes promo
```sql
INSERT INTO promo_codes (code, description, discount_type, discount_value, min_nights, valid_from, valid_until)
VALUES ('WELCOME10', 'Réduction de bienvenue', 'percentage', 10.00, 2, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year');
```

## 📊 Exemples d'utilisation API

### Vérifier la disponibilité
```typescript
const response = await fetch('/api/online-booking/public/availability?check_in=2026-06-01&check_out=2026-06-05');
const rooms = await response.json();
// [{type: 'Double', price: 120, available: 5, capacity: {min: 2, max: 2}}]
```

### Créer une réservation
```typescript
const booking = await fetch('/api/online-booking/public/bookings', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    guest_first_name: 'Jean',
    guest_last_name: 'Dupont',
    guest_email: 'jean@example.com',
    guest_phone: '+33612345678',
    room_type: 'Double',
    check_in_date: '2026-06-01',
    check_out_date: '2026-06-05',
    number_of_guests: 2,
    promo_code: 'WELCOME10'
  })
});
```

### Valider un code promo
```typescript
const promo = await fetch('/api/online-booking/public/validate-promo', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    code: 'SUMMER2026',
    room_type: 'Suite',
    check_in: '2026-07-01',
    check_out: '2026-07-05',
    total_amount: 600
  })
});
// {valid: true, discount_amount: 90, new_total: 510}
```

## 🎨 Personnalisation

### Modifier les couleurs
Le design utilise les couleurs du thème Seafoam:
- Primary: `seafoam-500` (#10b981)
- Background: `mint-50` (#f0fdf4)
- Gradient: `from-seafoam-50 to-mint-100`

### Ajouter des langues
Ajouter les traductions dans `client/src/i18n/locales/[lang].json`:
```json
{
  "onlineBooking": {
    "title": "Online Booking",
    "subtitle": "Book your room in a few clicks",
    ...
  }
}
```

## 📧 Notifications email

Les templates d'email sont stockés dans `online_booking_settings`:
- `confirmation_email_template`: Email de confirmation
- `cancellation_email_template`: Email d'annulation

Variables disponibles:
- `{{guest_name}}`: Nom du client
- `{{booking_reference}}`: Référence de réservation
- `{{check_in_date}}`: Date d'arrivée
- `{{check_out_date}}`: Date de départ
- `{{room_type}}`: Type de chambre
- `{{total_amount}}`: Montant total

## 🔐 Sécurité

- ✅ Endpoints publics sans authentification (par design)
- ✅ Validation des données côté serveur
- ✅ Protection contre les réservations multiples
- ✅ Expiration automatique des réservations non confirmées (30 min)
- ✅ Vérification de disponibilité en temps réel
- ✅ Endpoints admin protégés par authentification

## 📱 Responsive Design

L'interface est entièrement responsive:
- Mobile: Design vertical, boutons pleine largeur
- Tablet: Grille 2 colonnes pour les formulaires
- Desktop: Layout optimisé avec max-width 4xl

## 🚀 Prochaines étapes (optionnelles)

- [ ] Intégration paiement Stripe/PayPal
- [ ] Envoi automatique d'emails de confirmation
- [ ] Widget de réservation embeddable
- [ ] Calendrier de disponibilité visuel
- [ ] Multi-chambres dans une réservation
- [ ] Programme de fidélité
- [ ] Gestion des avis clients
- [ ] Chat en direct avec l'hôtel

## 📝 Notes importantes

1. **Conversion en réservation interne**: Les réservations en ligne peuvent être converties en réservations internes par les administrateurs. Cela crée automatiquement le client dans la base de données et assigne une chambre disponible.

2. **Gestion des disponibilités**: Le système vérifie à la fois les réservations internes et les réservations en ligne pour calculer la disponibilité réelle.

3. **Codes promo**: Les codes promo peuvent être limités par nombre d'utilisations, montant minimum, nombre de nuits, et types de chambres.

4. **Expiration**: Les réservations non confirmées expirent automatiquement après 30 minutes.

## 🎯 Fichiers modifiés/créés

### Backend
- ✅ `database/online-booking-module.sql`
- ✅ `server/src/controllers/onlineBookingController.ts`
- ✅ `server/src/routes/onlineBookingRoutes.ts`
- ✅ `server/src/routes/index.ts` (ajout de la route)

### Frontend
- ✅ `client/src/pages/PublicBooking.tsx`
- ✅ `client/src/App.tsx` (ajout de la route /book)
- ✅ `client/src/i18n/locales/fr.json` (traductions)

### Documentation
- ✅ `ONLINE_BOOKING_MODULE.md`

---

**Module créé le**: 30 Mai 2026  
**Statut**: ✅ Complet et fonctionnel  
**Version**: 1.0.0
