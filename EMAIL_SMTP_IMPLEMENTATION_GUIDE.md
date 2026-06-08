# 📧 Guide d'Implémentation - Email SMTP

## 🎯 Ce que nous allons créer

Un système d'email complet avec:
- ✅ Envoi automatique d'emails (confirmations, factures, rappels)
- ✅ Templates professionnels en français
- ✅ Pièces jointes (PDF)
- ✅ Logs des emails
- ✅ Interface UI pour tester les emails
- ✅ Automatisation complète

---

## 📦 Étape 1: Installation des Dépendances

### Backend
```bash
cd zen_backend
npm install nodemailer @types/nodemailer handlebars
```

### Ce que font ces packages:
- **nodemailer**: Envoi d'emails via SMTP
- **handlebars**: Templates HTML pour emails
- **@types/nodemailer**: Types TypeScript

---

## ⚙️ Étape 2: Configuration SMTP (Gmail)

### Option A: Gmail Personnel

1. **Activer l'authentification à 2 facteurs**:
   - Aller sur https://myaccount.google.com/security
   - Activer la validation en 2 étapes

2. **Créer un mot de passe d'application**:
   - https://myaccount.google.com/apppasswords
   - Nom: "Hotel PMS"
   - Copier le mot de passe généré (16 caractères)

3. **Ajouter dans `.env`**:
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
EMAIL_FROM=noreply@hotel.com
EMAIL_FROM_NAME=Grand Hôtel Seafoam
```

### Option B: SendGrid (Alternative)

1. Créer compte sur https://sendgrid.com (gratuit: 100 emails/jour)
2. Créer une API Key
3. Configuration `.env`:
```env
SENDGRID_API_KEY=votre_api_key
EMAIL_FROM=noreply@votrehotel.com
EMAIL_FROM_NAME=Grand Hôtel Seafoam
```

---

## 📊 Étape 3: Structure Database

### Table pour logs d'emails

**Fichier**: `database/add-email-logs.sql`

```sql
-- Table pour tracker les emails envoyés
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
  guest_id INTEGER REFERENCES guests(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL, -- booking_confirmation, invoice, reminder, password_reset, welcome
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  subject VARCHAR(500) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed
  error_message TEXT,
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  metadata JSONB, -- Informations supplémentaires
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour recherches rapides
CREATE INDEX idx_email_logs_user ON email_logs(user_id);
CREATE INDEX idx_email_logs_booking ON email_logs(booking_id);
CREATE INDEX idx_email_logs_type ON email_logs(type);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_created ON email_logs(created_at DESC);

-- Table pour templates d'emails (optionnel, pour admin)
CREATE TABLE email_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL, -- booking_confirmation, invoice, etc.
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB, -- Liste des variables disponibles: {{guestName}}, {{bookingRef}}, etc.
  is_active BOOLEAN DEFAULT true,
  language VARCHAR(10) DEFAULT 'fr',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Templates de base
INSERT INTO email_templates (name, code, subject, html_content, variables) VALUES
('Confirmation de Réservation', 'booking_confirmation', 
 'Confirmation de votre réservation #{{bookingRef}}',
 '<html><!-- template html --></html>',
 '["guestName", "bookingRef", "roomNumber", "checkInDate", "checkOutDate", "totalAmount"]'::jsonb),
 
('Rappel Check-in', 'checkin_reminder',
 'Rappel: Votre arrivée demain au {{hotelName}}',
 '<html><!-- template html --></html>',
 '["guestName", "bookingRef", "checkInDate", "roomNumber"]'::jsonb);

-- Fonction pour mettre à jour timestamp
CREATE OR REPLACE FUNCTION update_email_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER email_logs_updated_at
BEFORE UPDATE ON email_logs
FOR EACH ROW
EXECUTE FUNCTION update_email_logs_updated_at();
```

---

## 🗂️ Étape 4: Structure des Fichiers Backend

### Arborescence
```
zen_backend/
├── src/
│   ├── services/
│   │   └── emailService.ts          ← Service principal
│   ├── utils/
│   │   └── emailTemplates/          ← Templates Handlebars
│   │       ├── bookingConfirmation.hbs
│   │       ├── checkinReminder.hbs
│   │       ├── invoiceEmail.hbs
│   │       ├── passwordReset.hbs
│   │       └── welcome.hbs
│   ├── controllers/
│   │   └── emailController.ts       ← API pour tests
│   └── routes/
│       └── emailRoutes.ts           ← Routes email
```

---

## 🎨 Étape 5: Templates d'Emails

### Types d'emails à implémenter:

1. **Confirmation de Réservation**
   - Envoyé automatiquement à la création
   - Détails complets de la réservation
   - QR code pour check-in (optionnel)

2. **Rappel Check-in** (24h avant)
   - Rappel automatique
   - Informations pratiques
   - Lien vers directions

3. **Facture par Email**
   - PDF attaché
   - Récapitulatif du séjour
   - Merci + invitation retour

4. **Reset Mot de Passe**
   - Lien sécurisé
   - Expire en 1 heure

5. **Bienvenue Nouveau Client**
   - Premier séjour
   - Présentation hôtel
   - Programme fidélité

---

## 🧪 Étape 6: Tests

### Test Manuel
- Interface UI avec bouton "Envoyer Test Email"
- Formulaire: destinataire, type, données

### Test Automatique
- Mock Nodemailer en dev
- Vérifier templates compilent
- Vérifier logs créés

---

## 📝 Checklist d'Implémentation

### Backend (Jour 1-2)
- [ ] Installer nodemailer + handlebars
- [ ] Créer emailService.ts
- [ ] Créer 5 templates Handlebars
- [ ] Créer routes API
- [ ] Tester envoi email basique
- [ ] Ajouter logs database

### Automatisation (Jour 2-3)
- [ ] Hook: Nouvelle réservation → Email confirmation
- [ ] Hook: Paiement complété → Email facture
- [ ] Cron job: Rappels check-in
- [ ] Tests complets

### UI Frontend (Jour 3)
- [ ] Bouton "Envoyer par email" dans Bookings
- [ ] Bouton "Renvoyer confirmation"
- [ ] Page test emails (admin only)
- [ ] Logs emails dans UI

---

## 🚀 Prochaines Actions

Je vais maintenant créer:

1. ✅ **Script SQL** pour tables email_logs
2. ✅ **emailService.ts** - Service principal
3. ✅ **5 Templates Handlebars** - Emails professionnels
4. ✅ **emailController.ts** - API endpoints
5. ✅ **emailRoutes.ts** - Routes
6. ✅ **Intégration** - Hooks automatiques
7. ✅ **Tests** - Interface UI

**Temps estimé**: 3 jours  
**Provider recommandé**: Gmail (gratuit, simple)

Prêt à commencer! 🚀

