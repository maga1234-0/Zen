# 🚀 Plan d'Implémentation - Nouvelles Fonctionnalités

## 📋 Vue d'Ensemble

4 nouvelles fonctionnalités à implémenter dans le système:

1. ✅ **Notifications Push** - Notifications temps réel dans le navigateur
2. ✅ **Export PDF Avancé** - Génération de PDF professionnels
3. ✅ **Intégration Email (SMTP)** - Envoi automatique d'emails
4. ✅ **Calendrier Visuel des Réservations** - Vue calendrier interactive

---

## 1️⃣ NOTIFICATIONS PUSH

### 🎯 Objectif
Envoyer des notifications push dans le navigateur pour alerter les utilisateurs en temps réel (nouvelles réservations, paiements, maintenance, etc.)

### 🔧 Technologies
- **Service Workers** - Pour les notifications hors ligne
- **Web Push API** - API native du navigateur
- **VAPID Keys** - Pour l'authentification
- **Backend**: Node.js avec `web-push` library

### 📦 Fonctionnalités
- ✅ Demander la permission aux utilisateurs
- ✅ S'abonner aux notifications push
- ✅ Envoyer des notifications depuis le backend
- ✅ Gérer les préférences utilisateur (activer/désactiver)
- ✅ Notifications avec icône, titre, message, actions

### 🗂️ Fichiers à Créer/Modifier

#### Frontend:
- `client/public/sw.js` - Service Worker
- `client/src/utils/pushNotifications.ts` - Logique push
- `client/src/components/NotificationPermission.tsx` - Demande permission
- `client/src/pages/Settings.tsx` - Ajouter toggle notifications push

#### Backend:
- `zen_backend/src/services/pushNotificationService.ts` - Service push
- `zen_backend/src/routes/pushRoutes.ts` - Routes API
- `zen_backend/src/controllers/pushController.ts` - Controllers

#### Database:
- `database/add-push-subscriptions.sql` - Table pour subscriptions

### 📊 Structure Database

```sql
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### ⚙️ Configuration Requise

**Variables d'environnement** (`.env`):
```env
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_SUBJECT=mailto:admin@hotel.com
```

### 🧪 Tests
1. Demander permission sur navigateur
2. S'abonner aux notifications
3. Créer une nouvelle réservation → notification reçue
4. Tester sur mobile et desktop
5. Tester notifications hors ligne

### 📝 Notes
- Fonctionne sur Chrome, Firefox, Edge, Safari 16.4+
- Nécessite HTTPS en production
- Limite de notifications par jour (configurable)

---

## 2️⃣ EXPORT PDF AVANCÉ

### 🎯 Objectif
Générer des PDF professionnels pour factures, rapports, réservations avec logo, signature, mise en page élégante

### 🔧 Technologies
- **jsPDF** - Génération PDF côté client
- **jsPDF-AutoTable** - Tables automatiques
- **PDFKit** (Backend alternative) - Génération côté serveur
- **html2canvas** - Capture écran pour PDF

### 📦 Fonctionnalités
- ✅ **Factures PDF** avec logo et signature
- ✅ **Rapports PDF** (revenus, occupation, etc.)
- ✅ **Réservations PDF** (confirmation, reçu)
- ✅ **Bordereaux de réception** (check-in/check-out)
- ✅ **Fiches clients** avec historique
- ✅ Téléchargement direct ou envoi par email

### 🗂️ Fichiers à Créer/Modifier

#### Frontend:
- `client/src/utils/pdfGenerator.ts` - Générateur PDF
- `client/src/utils/pdfTemplates/` - Templates
  - `invoiceTemplate.ts` - Facture
  - `reportTemplate.ts` - Rapport
  - `bookingTemplate.ts` - Réservation
  - `receiptTemplate.ts` - Reçu
- `client/src/components/PDFPreview.tsx` - Aperçu avant téléchargement

#### Backend:
- `zen_backend/src/services/pdfService.ts` - Génération PDF serveur
- `zen_backend/src/utils/pdfTemplates/` - Templates serveur

### 📊 Types de PDF

#### 1. Facture (Invoice)
```
┌────────────────────────────────────┐
│  [LOGO HOTEL]                      │
│  Grand Hôtel Seafoam               │
│  123 Luxury Avenue                 │
├────────────────────────────────────┤
│  FACTURE #INV-2026-001             │
│  Date: 7 juin 2026                 │
│                                    │
│  Client: Jean Dupont               │
│  Email: jean@example.com           │
│                                    │
│  Description         Montant       │
│  ─────────────────────────────     │
│  Chambre 101 (3 nuits)  300€       │
│  Restaurant              50€       │
│  Spa                     80€       │
│  ─────────────────────────────     │
│  Sous-total             430€       │
│  TVA (10%)               43€       │
│  TOTAL                  473€       │
│                                    │
│  [SIGNATURE]                       │
│                                    │
│  Merci de votre visite!            │
└────────────────────────────────────┘
```

#### 2. Rapport (Report)
- Revenus par période
- Taux d'occupation
- Top chambres/clients
- Graphiques et statistiques

#### 3. Confirmation Réservation
- Détails réservation
- QR code pour check-in
- Informations hôtel
- Conditions d'annulation

### 📦 Installation

```bash
npm install jspdf jspdf-autotable html2canvas
```

### 🧪 Tests
1. Générer facture avec logo et signature
2. Télécharger PDF
3. Vérifier qualité et mise en page
4. Tester sur mobile
5. Tester envoi par email

### 📝 Notes
- Supporte logo PNG/JPG
- Signature en base64
- Multi-pages automatique
- Watermark optionnel (brouillon, payé, etc.)

---

## 3️⃣ INTÉGRATION EMAIL (SMTP)

### 🎯 Objectif
Envoyer des emails automatiques (confirmations, factures, rappels) via SMTP avec templates professionnels

### 🔧 Technologies
- **Nodemailer** - Envoi email Node.js
- **Handlebars** - Templates email
- **MJML** (optionnel) - Templates responsive
- **Gmail SMTP / SendGrid / AWS SES**

### 📦 Fonctionnalités
- ✅ **Emails transactionnels**:
  - Confirmation réservation
  - Facture par email
  - Rappel check-in (24h avant)
  - Rappel check-out
  - Confirmation paiement
  - Reset mot de passe
  - Bienvenue nouveau client
- ✅ **Templates personnalisables**
- ✅ **Pièces jointes** (PDF, etc.)
- ✅ **Queue d'emails** (pour gros volumes)
- ✅ **Tracking** (envoyé, ouvert, cliqué)

### 🗂️ Fichiers à Créer/Modifier

#### Backend:
- `zen_backend/src/services/emailService.ts` - Service email principal
- `zen_backend/src/utils/emailTemplates/` - Templates Handlebars
  - `bookingConfirmation.hbs`
  - `invoice.hbs`
  - `checkInReminder.hbs`
  - `passwordReset.hbs`
  - `welcome.hbs`
- `zen_backend/src/queues/emailQueue.ts` - Queue Bull
- `zen_backend/src/controllers/emailController.ts` - Test emails

#### Database:
- `database/add-email-logs.sql` - Table logs emails

### 📊 Structure Database

```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id INTEGER REFERENCES users(id),
  booking_id INTEGER REFERENCES bookings(id),
  type VARCHAR(50) NOT NULL, -- booking_confirmation, invoice, reminder
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed
  error_message TEXT,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE email_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  variables JSONB, -- Liste des variables disponibles
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### ⚙️ Configuration SMTP

**Variables d'environnement**:
```env
# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SendGrid (Alternative)
SENDGRID_API_KEY=your_sendgrid_key

# Configuration
EMAIL_FROM=noreply@hotel.com
EMAIL_FROM_NAME=Grand Hôtel Seafoam
```

### 📧 Template Exemple

**Confirmation Réservation** (`bookingConfirmation.hbs`):
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4a9d9c; color: white; padding: 20px; }
    .content { padding: 20px; background: #f9f9f9; }
    .footer { text-align: center; padding: 20px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Confirmation de Réservation</h1>
    </div>
    <div class="content">
      <p>Bonjour {{guestName}},</p>
      <p>Votre réservation est confirmée!</p>
      
      <h3>Détails de votre séjour:</h3>
      <ul>
        <li><strong>Numéro de réservation:</strong> {{bookingRef}}</li>
        <li><strong>Chambre:</strong> {{roomNumber}} - {{roomType}}</li>
        <li><strong>Arrivée:</strong> {{checkInDate}}</li>
        <li><strong>Départ:</strong> {{checkOutDate}}</li>
        <li><strong>Nombre de nuits:</strong> {{nights}}</li>
        <li><strong>Montant total:</strong> {{totalAmount}}€</li>
      </ul>
      
      <p>Nous avons hâte de vous accueillir!</p>
    </div>
    <div class="footer">
      <p>Grand Hôtel Seafoam<br>
      123 Luxury Avenue<br>
      +1 (555) 123-4567</p>
    </div>
  </div>
</body>
</html>
```

### 📦 Installation

```bash
npm install nodemailer handlebars bull ioredis
npm install @types/nodemailer @types/bull -D
```

### 🧪 Tests
1. Envoyer email de test
2. Vérifier réception
3. Tester tous les templates
4. Tester pièces jointes
5. Tester queue avec volume

### 📝 Notes
- Gmail limite: 500 emails/jour (compte gratuit)
- SendGrid: 100 emails/jour gratuit
- AWS SES: Production recommandé
- Bull Queue nécessite Redis

---

## 4️⃣ CALENDRIER VISUEL DES RÉSERVATIONS

### 🎯 Objectif
Vue calendrier interactive pour visualiser et gérer les réservations par chambre et par date

### 🔧 Technologies
- **FullCalendar** - Librairie calendrier complète
- **React Big Calendar** (Alternative)
- **Date-fns** - Manipulation de dates
- **Drag & Drop** - Déplacer réservations

### 📦 Fonctionnalités
- ✅ **Vue mensuelle** avec réservations colorées
- ✅ **Vue hebdomadaire** détaillée
- ✅ **Vue par chambre** (timeline)
- ✅ **Drag & Drop** pour modifier dates
- ✅ **Filtres** (type chambre, statut, client)
- ✅ **Légende** des couleurs
- ✅ **Clique sur réservation** → Détails/Modifier
- ✅ **Créer réservation** depuis calendrier
- ✅ **Export calendrier** (iCal, Google Calendar)
- ✅ **Vue occupation** par chambre

### 🗂️ Fichiers à Créer

#### Frontend:
- `client/src/pages/Calendar.tsx` - Page principale calendrier
- `client/src/components/calendar/` - Composants calendrier
  - `BookingCalendar.tsx` - Calendrier principal
  - `RoomTimeline.tsx` - Vue timeline par chambre
  - `CalendarFilters.tsx` - Filtres
  - `BookingEventDetails.tsx` - Popup détails
  - `CalendarLegend.tsx` - Légende couleurs
- `client/src/utils/calendarHelpers.ts` - Helpers
- `client/src/types/calendar.ts` - Types TypeScript

### 📊 Interface Visuelle

```
┌─────────────────────────────────────────────────────────┐
│  📅 Calendrier des Réservations          [Mois ▼]       │
├─────────────────────────────────────────────────────────┤
│  [Filtres: Toutes chambres ▼] [Tous statuts ▼]  [📊]   │
├─────────────────────────────────────────────────────────┤
│        Juin 2026                                        │
│  Lun   Mar   Mer   Jeu   Ven   Sam   Dim               │
│  ───────────────────────────────────────────────        │
│   1     2     3     4     5     6     7                 │
│                                                         │
│   8     9    10    11    12    13    14                │
│  [Réservation: Dupont - Ch.101]  [Dupont]              │
│                                                         │
│  15    16    17    18    19    20    21                │
│        [Martin - Ch.102]                                │
│                                                         │
│  22    23    24    25    26    27    28                │
│                     [Leroux - Ch.103]                   │
│                                                         │
│  29    30                                               │
├─────────────────────────────────────────────────────────┤
│  Légende:                                               │
│  🟢 Confirmé  🟡 En attente  🔵 Check-in  🟣 Séjour    │
└─────────────────────────────────────────────────────────┘
```

### 📊 Vue Timeline (par Chambre)

```
┌──────────────────────────────────────────────────────────┐
│  📊 Vue Timeline par Chambre                             │
├──────────────────────────────────────────────────────────┤
│           1 Jun    5 Jun    10 Jun   15 Jun   20 Jun     │
│  ───────────────────────────────────────────────────     │
│  Ch.101  [═══Dupont═══]                [══Martin══]     │
│  Ch.102          [════Leroux════]                        │
│  Ch.103  [Martin]         [═══════Dupont═══════]        │
│  Ch.201              [Short]    [═══Bernard═══]         │
│  Ch.202  [═══════════Vacation═══════════]               │
└──────────────────────────────────────────────────────────┘
```

### 🎨 Couleurs par Statut

```typescript
const statusColors = {
  pending: '#fbbf24',      // Jaune - En attente
  confirmed: '#10b981',    // Vert - Confirmé
  checked_in: '#3b82f6',   // Bleu - Arrivé
  checked_out: '#6b7280',  // Gris - Parti
  cancelled: '#ef4444',    // Rouge - Annulé
};
```

### 📦 Installation

```bash
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/resource-timeline
npm install date-fns
```

### 🔧 Fonctionnalités Avancées

#### 1. Drag & Drop
- Déplacer une réservation → Change dates automatiquement
- Validation: Chambre disponible aux nouvelles dates
- Confirmation avant modification

#### 2. Filtres
- Par type de chambre (Single, Double, Suite)
- Par statut (Confirmé, En attente, etc.)
- Par étage
- Par plage de prix

#### 3. Export
- Export au format `.ics` (iCalendar)
- Synchronisation Google Calendar
- Export PDF du calendrier

#### 4. Statistiques Rapides
- Taux d'occupation par jour
- Revenus prévisionnels
- Chambres les plus demandées
- Périodes creuses/pleines

### 🧪 Tests
1. Afficher calendrier avec réservations
2. Cliquer sur réservation → Détails
3. Drag & Drop réservation
4. Créer nouvelle réservation depuis calendrier
5. Filtrer par chambre/statut
6. Changer de vue (mois/semaine/timeline)
7. Export iCal

### 📝 Notes
- Responsive mobile/desktop
- Mise à jour temps réel (WebSocket optionnel)
- Cache pour performance
- Pagination pour gros volumes

---

## 📊 PLAN D'IMPLÉMENTATION PAR PRIORITÉ

### Phase 1: Fondations (Semaine 1)
1. **Calendrier Visuel** (3 jours)
   - Vue mensuelle basique
   - Affichage réservations
   - Clique pour détails
   
2. **Export PDF Basique** (2 jours)
   - Template facture simple
   - Téléchargement PDF

### Phase 2: Email & PDF Avancé (Semaine 2)
3. **Intégration Email SMTP** (3 jours)
   - Configuration Nodemailer
   - Templates de base (confirmation, facture)
   - Envoi manuel depuis UI
   
4. **Export PDF Avancé** (2 jours)
   - Templates multiples
   - Logo et signature
   - Rapports

### Phase 3: Notifications & Optimisations (Semaine 3)
5. **Notifications Push** (4 jours)
   - Service Worker
   - Abonnement utilisateurs
   - Intégration backend
   
6. **Optimisations Calendrier** (1 jour)
   - Drag & Drop
   - Filtres avancés
   - Timeline view

### Phase 4: Automatisation (Semaine 4)
7. **Automatisation Emails** (2 jours)
   - Envoi automatique à événements
   - Queue emails
   - Tracking
   
8. **Polish & Tests** (3 jours)
   - Tests complets
   - Documentation
   - Déploiement

---

## 📦 DÉPENDANCES À INSTALLER

### Frontend
```json
{
  "dependencies": {
    "@fullcalendar/react": "^6.1.10",
    "@fullcalendar/daygrid": "^6.1.10",
    "@fullcalendar/timegrid": "^6.1.10",
    "@fullcalendar/interaction": "^6.1.10",
    "@fullcalendar/resource-timeline": "^6.1.10",
    "jspdf": "^2.5.1",
    "jspdf-autotable": "^3.8.2",
    "html2canvas": "^1.4.1",
    "date-fns": "^3.3.1"
  }
}
```

### Backend
```json
{
  "dependencies": {
    "nodemailer": "^6.9.9",
    "handlebars": "^4.7.8",
    "web-push": "^3.6.7",
    "bull": "^4.12.2",
    "ioredis": "^5.3.2",
    "pdfkit": "^0.14.0"
  },
  "devDependencies": {
    "@types/nodemailer": "^6.4.14",
    "@types/bull": "^4.10.0"
  }
}
```

---

## ⚙️ CONFIGURATION REQUISE

### Services Externes

#### 1. Redis (pour Bull Queue)
```bash
# Installation locale
# Windows: https://github.com/microsoftarchive/redis/releases
# Linux: sudo apt install redis-server
# Mac: brew install redis

# Ou utiliser Redis Cloud (gratuit)
# https://redis.com/try-free/
```

#### 2. SMTP Provider
**Options**:
- Gmail (limite 500/jour)
- SendGrid (100/jour gratuit)
- AWS SES (0.10€ pour 1000 emails)
- Mailgun (5000/mois gratuit)

#### 3. Variables d'Environnement

**Frontend** (`.env`):
```env
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key
VITE_API_URL=https://zen-backend-jzjh.onrender.com
```

**Backend** (`.env`):
```env
# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@hotel.com

# Push Notifications
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_SUBJECT=mailto:admin@hotel.com

# Redis
REDIS_URL=redis://localhost:6379

# PDF
PDF_LOGO_URL=https://your-logo-url.com/logo.png
```

---

## 🧪 CRITÈRES DE SUCCÈS

### Calendrier Visuel ✅
- [ ] Affiche toutes les réservations
- [ ] Vue mois/semaine/timeline
- [ ] Clique sur événement → détails
- [ ] Filtres fonctionnels
- [ ] Responsive mobile

### Export PDF ✅
- [ ] Génère facture avec logo
- [ ] Inclut signature
- [ ] Téléchargement fonctionne
- [ ] Qualité professionnelle
- [ ] Multi-pages si nécessaire

### Email SMTP ✅
- [ ] Envoie confirmations réservation
- [ ] Envoie factures par email
- [ ] Templates personnalisables
- [ ] Pièces jointes (PDF)
- [ ] Logs des emails

### Notifications Push ✅
- [ ] Demande permission
- [ ] Enregistre subscription
- [ ] Envoie notifications depuis backend
- [ ] Fonctionne hors ligne
- [ ] Toggle dans paramètres

---

## 📝 PROCHAINES ÉTAPES

### Immédiat:
1. **Valider les priorités** avec vous
2. **Choisir SMTP provider** (Gmail, SendGrid, etc.)
3. **Installer Redis** (pour queue emails)
4. **Commencer Phase 1**: Calendrier Visuel

### Questions:
1. **SMTP Provider**: Préférez-vous Gmail, SendGrid, ou autre?
2. **Redis**: Besoin d'aide pour l'installation?
3. **Priorité**: Quelle fonctionnalité voulez-vous en premier?
4. **Budget**: Limite pour services externes (SendGrid, AWS SES)?

---

**Date**: 7 juin 2026  
**Statut**: 📋 Plan créé, prêt à commencer  
**Durée estimée**: 4 semaines (1 fonctionnalité par semaine)  
**Complexité**: Moyenne à Élevée
