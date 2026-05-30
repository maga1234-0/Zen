# 🚀 Guide de déploiement - Module de Réservation en Ligne

## ⚡ Installation rapide (5 minutes)

### Étape 1: Base de données (Supabase) 📊

1. **Connectez-vous à Supabase**
   - Allez sur https://supabase.com
   - Ouvrez votre projet

2. **Exécutez le script SQL**
   - Cliquez sur "SQL Editor" dans le menu de gauche
   - Cliquez sur "New Query"
   - Copiez tout le contenu de `database/online-booking-module.sql`
   - Collez dans l'éditeur
   - Cliquez sur "Run" (ou F5)

3. **Vérifiez l'installation**
   ```sql
   -- Vérifier que les tables sont créées
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name LIKE '%online%';
   
   -- Devrait retourner:
   -- online_booking_settings
   -- online_bookings
   -- room_availability_overrides
   -- promo_codes
   -- public_reviews
   -- booking_faqs
   ```

4. **Vérifier les données initiales**
   ```sql
   -- Vérifier les codes promo
   SELECT code, description, discount_value FROM promo_codes;
   
   -- Vérifier les paramètres
   SELECT is_enabled, deposit_percentage FROM online_booking_settings;
   ```

✅ **Base de données prête !**

---

### Étape 2: Backend (Render) 🔧

1. **Le code est déjà pushé sur GitHub**
   - Commit: `4df6cb0`
   - Tous les fichiers backend sont inclus

2. **Redéployer sur Render**
   - Allez sur https://dashboard.render.com
   - Trouvez votre service backend
   - Cliquez sur "Manual Deploy" → "Deploy latest commit"
   - Attendez que le déploiement se termine (2-3 minutes)

3. **Vérifier que ça fonctionne**
   ```bash
   # Tester l'endpoint de disponibilité
   curl "https://votre-backend.onrender.com/api/online-booking/public/settings"
   
   # Devrait retourner les paramètres de réservation
   ```

✅ **Backend déployé !**

---

### Étape 3: Frontend (Vercel) 🎨

1. **Le code est déjà pushé sur GitHub**
   - La page `/book` est créée
   - Les traductions sont ajoutées
   - Le routing est configuré

2. **Redéployer sur Vercel**
   - Allez sur https://vercel.com/dashboard
   - Trouvez votre projet
   - Vercel devrait déployer automatiquement
   - Ou cliquez sur "Redeploy" si nécessaire

3. **Vérifier que ça fonctionne**
   - Ouvrez `https://votre-app.vercel.app/book`
   - Vous devriez voir la page de réservation

✅ **Frontend déployé !**

---

### Étape 4: Test complet 🧪

1. **Tester la page de réservation**
   - Allez sur `/book`
   - Sélectionnez des dates (ex: demain → dans 3 jours)
   - Cliquez sur "Rechercher les disponibilités"
   - Vous devriez voir les chambres disponibles

2. **Tester une réservation complète**
   - Sélectionnez une chambre
   - Remplissez les informations:
     - Prénom: Test
     - Nom: User
     - Email: test@example.com
     - Téléphone: +33612345678
   - Essayez un code promo: `WELCOME10`
   - Cliquez sur "Confirmer la réservation"
   - Vous devriez recevoir une référence (ex: REF-20260530-1234)

3. **Vérifier dans Supabase**
   ```sql
   -- Voir la réservation créée
   SELECT * FROM online_bookings 
   ORDER BY created_at DESC 
   LIMIT 1;
   ```

✅ **Tout fonctionne !**

---

## 🎯 Configuration avancée (optionnel)

### Personnaliser les paramètres

```sql
-- Modifier les paramètres de réservation
UPDATE online_booking_settings SET
  min_advance_days = 2,           -- Réserver minimum 2 jours à l'avance
  deposit_percentage = 50.00,     -- Acompte de 50%
  cancellation_hours = 48;        -- Annulation gratuite 48h avant

-- Désactiver temporairement les réservations
UPDATE online_booking_settings SET is_enabled = false;

-- Réactiver
UPDATE online_booking_settings SET is_enabled = true;
```

### Créer de nouveaux codes promo

```sql
-- Code promo pour Noël 2026
INSERT INTO promo_codes (
  code, 
  description, 
  discount_type, 
  discount_value, 
  min_nights, 
  valid_from, 
  valid_until,
  max_uses
) VALUES (
  'NOEL2026',
  'Promotion de Noël',
  'percentage',
  25.00,
  3,
  '2026-12-01',
  '2026-12-31',
  100
);

-- Code promo montant fixe
INSERT INTO promo_codes (
  code, 
  description, 
  discount_type, 
  discount_value, 
  min_nights, 
  valid_from, 
  valid_until
) VALUES (
  'SAVE50',
  'Réduction de 50€',
  'fixed_amount',
  50.00,
  2,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '6 months'
);
```

### Ajouter des FAQs

```sql
INSERT INTO booking_faqs (
  question_fr,
  question_en,
  answer_fr,
  answer_en,
  category,
  display_order,
  is_published
) VALUES (
  'Acceptez-vous les cartes de crédit ?',
  'Do you accept credit cards?',
  'Oui, nous acceptons Visa, Mastercard et American Express.',
  'Yes, we accept Visa, Mastercard and American Express.',
  'payment',
  4,
  true
);
```

### Gérer les disponibilités personnalisées

```sql
-- Bloquer des chambres pour un événement
INSERT INTO room_availability_overrides (
  room_type,
  date,
  available_rooms,
  reason
) VALUES 
  ('Suite', '2026-12-25', 0, 'Réservé pour événement privé'),
  ('Suite', '2026-12-26', 0, 'Réservé pour événement privé');

-- Prix spécial pour la haute saison
INSERT INTO room_availability_overrides (
  room_type,
  date,
  available_rooms,
  custom_price,
  reason
) VALUES 
  ('Double', '2026-08-15', 10, 180.00, 'Haute saison été');
```

---

## 📊 Monitoring et statistiques

### Voir les réservations en ligne

```sql
-- Toutes les réservations
SELECT * FROM v_online_bookings_summary
ORDER BY created_at DESC;

-- Réservations en attente
SELECT * FROM online_bookings 
WHERE status = 'pending'
ORDER BY created_at DESC;

-- Réservations confirmées
SELECT * FROM online_bookings 
WHERE status = 'confirmed'
ORDER BY check_in_date;
```

### Statistiques

```sql
-- Statistiques des 30 derniers jours
SELECT * FROM v_online_booking_stats;

-- Revenus par mois
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as bookings,
  SUM(total_amount) as revenue
FROM online_bookings
WHERE status IN ('confirmed', 'converted')
GROUP BY month
ORDER BY month DESC;

-- Codes promo les plus utilisés
SELECT 
  code,
  description,
  current_uses,
  max_uses
FROM promo_codes
ORDER BY current_uses DESC;
```

---

## 🔧 Dépannage

### Problème: "No rooms available"

**Solution:**
```sql
-- Vérifier qu'il y a des chambres dans la base
SELECT type, COUNT(*) FROM rooms GROUP BY type;

-- Vérifier les réservations existantes
SELECT * FROM bookings 
WHERE check_in_date <= '2026-06-05' 
AND check_out_date >= '2026-06-01';
```

### Problème: "Booking settings not found"

**Solution:**
```sql
-- Vérifier que les paramètres existent
SELECT * FROM online_booking_settings;

-- Si vide, réexécuter le script SQL
```

### Problème: Code promo ne fonctionne pas

**Solution:**
```sql
-- Vérifier le code promo
SELECT * FROM promo_codes WHERE code = 'WELCOME10';

-- Vérifier qu'il est actif et valide
SELECT 
  code,
  is_active,
  valid_from,
  valid_until,
  current_uses,
  max_uses
FROM promo_codes
WHERE code = 'WELCOME10';
```

### Problème: Page /book ne s'affiche pas

**Solutions:**
1. Vérifier que le frontend est déployé
2. Vider le cache du navigateur (Ctrl+Shift+R)
3. Vérifier la console du navigateur pour les erreurs
4. Vérifier que l'API backend est accessible

---

## 🎨 Personnalisation du design

### Modifier les couleurs

Éditez `client/src/pages/PublicBooking.tsx`:

```typescript
// Remplacer les classes Tailwind
"bg-seafoam-500" → "bg-blue-500"      // Couleur primaire
"from-seafoam-50" → "from-blue-50"    // Dégradé
"text-seafoam-600" → "text-blue-600"  // Texte
```

### Modifier les textes

Éditez `client/src/i18n/locales/fr.json`:

```json
{
  "onlineBooking": {
    "title": "Votre nouveau titre",
    "subtitle": "Votre nouveau sous-titre"
  }
}
```

---

## 📧 Prochaine étape: Emails automatiques

Pour envoyer des emails de confirmation automatiques, vous devrez:

1. **Configurer un service d'email** (SendGrid, Mailgun, etc.)
2. **Ajouter les variables d'environnement** dans Render
3. **Créer un service d'email** dans le backend
4. **Appeler le service** après création de réservation

Exemple avec SendGrid:
```typescript
// server/src/services/emailService.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendBookingConfirmation = async (booking: any) => {
  const msg = {
    to: booking.guest_email,
    from: 'noreply@votre-hotel.com',
    subject: `Confirmation de réservation ${booking.booking_reference}`,
    html: `
      <h1>Réservation confirmée !</h1>
      <p>Référence: ${booking.booking_reference}</p>
      <p>Arrivée: ${booking.check_in_date}</p>
      <p>Départ: ${booking.check_out_date}</p>
    `
  };
  
  await sgMail.send(msg);
};
```

---

## ✅ Checklist finale

- [ ] Base de données: Script SQL exécuté
- [ ] Base de données: Tables créées et vérifiées
- [ ] Base de données: Données initiales présentes
- [ ] Backend: Redéployé sur Render
- [ ] Backend: Endpoints testés et fonctionnels
- [ ] Frontend: Redéployé sur Vercel
- [ ] Frontend: Page /book accessible
- [ ] Test: Recherche de disponibilité fonctionne
- [ ] Test: Sélection de chambre fonctionne
- [ ] Test: Formulaire client fonctionne
- [ ] Test: Code promo fonctionne
- [ ] Test: Création de réservation fonctionne
- [ ] Test: Réservation visible dans Supabase

---

## 🎉 C'est terminé !

Votre système de réservation en ligne est maintenant **100% opérationnel** !

Les clients peuvent réserver directement sur: `https://votre-app.vercel.app/book`

**Besoin d'aide ?** Consultez `ONLINE_BOOKING_MODULE.md` pour la documentation complète.

---

**Date**: 30 Mai 2026  
**Version**: 1.0.0  
**Statut**: ✅ PRODUCTION READY
