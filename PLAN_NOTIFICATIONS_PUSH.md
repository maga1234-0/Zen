# 📲 PLAN D'IMPLÉMENTATION: NOTIFICATIONS PUSH
# ZENITH - Property Management System

**Date**: 23 juillet 2026  
**Priorité**: Évolution future  
**Complexité**: Moyenne  
**Temps estimé**: 2-3 semaines

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#vue-densemble)
2. [Technologies recommandées](#technologies-recommandées)
3. [Architecture](#architecture)
4. [Implémentation par étapes](#implémentation-par-étapes)
5. [Cas d'usage](#cas-dusage)
6. [Coûts](#coûts)

---

## 🎯 VUE D'ENSEMBLE

### Objectif

Permettre au personnel de Zenith de recevoir des notifications instantanées sur leurs appareils (ordinateurs, tablettes, smartphones) même quand l'application n'est pas ouverte.

### Exemples de notifications

- 🔔 **Nouvelle réservation** - "Nouvelle réservation pour la chambre 205 (Jean Dupont)"
- 🛎️ **Check-in imminent** - "Check-in dans 30 min - Chambre 105"
- 🧹 **Chambre à nettoyer** - "Checkout effectué - Chambre 302 à nettoyer"
- 💰 **Paiement reçu** - "Paiement de 500$ reçu pour la réservation #12345"
- 🍽️ **Nouvelle commande restaurant** - "Nouvelle commande - Table 8 (Plat: Steak)"
- 💆 **Réservation spa** - "Réservation spa à 14h00 (Massage)"
- 🔧 **Maintenance urgente** - "Chambre 410 - Fuite d'eau signalée"
- ⏰ **Rappel** - "3 check-ins prévus dans 1 heure"

### Avantages

✅ **Réactivité** - Personnel informé instantanément  
✅ **Productivité** - Pas besoin de vérifier constamment l'app  
✅ **Expérience client** - Service plus rapide  
✅ **Coordination** - Équipes synchronisées  
✅ **Urgences** - Alertes critiques en temps réel

---

## 🛠️ TECHNOLOGIES RECOMMANDÉES

### Option 1: Firebase Cloud Messaging (FCM) ⭐ RECOMMANDÉ

**Pourquoi FCM**:
- ✅ Gratuit (quota généreux)
- ✅ Support Web, Android, iOS
- ✅ Infrastructure Google fiable
- ✅ Facile à intégrer
- ✅ Analytics intégré

**Composants**:
- **Firebase Admin SDK** (Backend) - Envoyer les notifications
- **Firebase JS SDK** (Frontend) - Recevoir les notifications
- **Service Worker** - Notifications en arrière-plan

**Documentation**: https://firebase.google.com/docs/cloud-messaging

---

### Option 2: OneSignal 🔔

**Pourquoi OneSignal**:
- ✅ Gratuit jusqu'à 10,000 utilisateurs
- ✅ Interface de gestion intuitive
- ✅ Support multiplateforme
- ✅ Segmentation avancée
- ✅ API REST simple
- ✅ Dashboard avec statistiques

**Documentation**: https://documentation.onesignal.com/

---

### Option 3: Web Push API natif 🌐

**Pourquoi Web Push natif**:
- ✅ Aucune dépendance tierce
- ✅ 100% gratuit
- ✅ Contrôle total
- ❌ Plus complexe à implémenter
- ❌ Nécessite serveur VAPID

**Composants**:
- **Web Push Protocol** (RFC 8030)
- **VAPID Keys** (Voluntary Application Server Identification)
- **Service Worker**

**Documentation**: https://web.dev/push-notifications-overview/

---

## 🏗️ ARCHITECTURE

### Vue d'ensemble (avec FCM)

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Navigateur)                       │
│                                                              │
│  1. Demande permission notifications                        │
│  2. Firebase SDK génère un token FCM                        │
│  3. Envoie token au backend                                 │
│  4. Service Worker écoute les notifications                 │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ POST /api/users/fcm-token
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   BACKEND (Node.js)                          │
│                                                              │
│  1. Stocke token FCM + user_id en DB                        │
│  2. Lors d'événements (nouvelle résa, etc.)                 │
│  3. Récupère tokens des utilisateurs concernés              │
│  4. Envoie notification via Firebase Admin SDK              │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Firebase Admin SDK
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  FIREBASE CLOUD MESSAGING                    │
│                                                              │
│  1. Reçoit la notification du backend                       │
│  2. Route vers les appareils concernés                      │
│  3. Gère la livraison et les retries                        │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Push Protocol
                         │
┌────────────────────────▼────────────────────────────────────┐
│               APPAREIL UTILISATEUR                           │
│                                                              │
│  Service Worker reçoit la notification                      │
│  └─> Affiche la notification système                        │
│  └─> Click → Ouvre l'app Zenith                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📝 IMPLÉMENTATION PAR ÉTAPES

### PHASE 1: Configuration Firebase (2-3 jours)

#### Étape 1.1: Créer projet Firebase

1. Aller sur https://console.firebase.google.com
2. Créer un nouveau projet "Zenith PMS"
3. Activer Cloud Messaging
4. Générer clé privée pour Admin SDK
5. Récupérer la configuration Web

**Fichiers à télécharger**:
- `zenith-firebase-adminsdk.json` (pour backend)
- Configuration Web (apiKey, projectId, etc.)

---

#### Étape 1.2: Installer dépendances

**Backend**:
```bash
cd zen_backend
npm install firebase-admin
```

**Frontend**:
```bash
cd client
npm install firebase
```

---

#### Étape 1.3: Configuration backend

**Créer**: `zen_backend/src/config/firebase.ts`

```typescript
import admin from 'firebase-admin';
import serviceAccount from '../../zenith-firebase-adminsdk.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const messaging = admin.messaging();
```

**Ajouter variable d'environnement** (`.env`):
```
FIREBASE_PROJECT_ID=zenith-pms
```

---

#### Étape 1.4: Configuration frontend

**Créer**: `client/src/config/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
```

**Ajouter variables dans** `.env` (frontend):
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

### PHASE 2: Base de données (1 jour)

#### Créer table pour stocker les tokens

**Créer**: `database/ADD_PUSH_NOTIFICATIONS.sql`

```sql
-- Table pour stocker les tokens FCM des utilisateurs
CREATE TABLE IF NOT EXISTS user_fcm_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fcm_token TEXT NOT NULL UNIQUE,
  device_name VARCHAR(255),
  device_type VARCHAR(50), -- 'desktop', 'tablet', 'mobile'
  browser VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour recherche rapide par user_id
CREATE INDEX idx_user_fcm_tokens_user_id ON user_fcm_tokens(user_id);

-- Index pour tokens actifs
CREATE INDEX idx_user_fcm_tokens_active ON user_fcm_tokens(is_active) WHERE is_active = true;

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_user_fcm_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER update_user_fcm_tokens_timestamp
  BEFORE UPDATE ON user_fcm_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_user_fcm_tokens_updated_at();
```

---

### PHASE 3: Backend - Endpoints (2 jours)

#### Endpoint 1: Enregistrer token FCM

**Créer**: `zen_backend/src/routes/pushNotificationRoutes.ts`

```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import pool from '../config/database';

const router = Router();

// Enregistrer/mettre à jour le token FCM
router.post('/register-token', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { fcmToken, deviceName, deviceType, browser } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ message: 'FCM token is required' });
    }

    // Vérifier si le token existe déjà
    const existing = await pool.query(
      'SELECT id FROM user_fcm_tokens WHERE fcm_token = $1',
      [fcmToken]
    );

    if (existing.rows.length > 0) {
      // Mettre à jour
      await pool.query(
        `UPDATE user_fcm_tokens 
         SET user_id = $1, device_name = $2, device_type = $3, 
             browser = $4, is_active = true, last_used_at = CURRENT_TIMESTAMP
         WHERE fcm_token = $5`,
        [userId, deviceName, deviceType, browser, fcmToken]
      );
    } else {
      // Insérer
      await pool.query(
        `INSERT INTO user_fcm_tokens 
         (user_id, fcm_token, device_name, device_type, browser)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, fcmToken, deviceName, deviceType, browser]
      );
    }

    res.json({ message: 'Token registered successfully' });
  } catch (error) {
    console.error('Register FCM token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Désactiver token (logout ou révocation)
router.post('/unregister-token', authenticate, async (req, res) => {
  try {
    const { fcmToken } = req.body;

    await pool.query(
      'UPDATE user_fcm_tokens SET is_active = false WHERE fcm_token = $1',
      [fcmToken]
    );

    res.json({ message: 'Token unregistered successfully' });
  } catch (error) {
    console.error('Unregister FCM token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
```

**Ajouter la route dans** `zen_backend/src/server.ts`:
```typescript
import pushNotificationRoutes from './routes/pushNotificationRoutes';

app.use('/api/push-notifications', pushNotificationRoutes);
```

---

#### Endpoint 2: Service d'envoi de notifications

**Créer**: `zen_backend/src/services/pushNotificationService.ts`

```typescript
import { messaging } from '../config/firebase';
import pool from '../config/database';

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, string>;
  click_action?: string;
}

/**
 * Envoyer notification push à un utilisateur
 */
export async function sendPushToUser(
  userId: string,
  payload: NotificationPayload
) {
  try {
    // Récupérer tous les tokens actifs de l'utilisateur
    const result = await pool.query(
      'SELECT fcm_token FROM user_fcm_tokens WHERE user_id = $1 AND is_active = true',
      [userId]
    );

    if (result.rows.length === 0) {
      console.log(`No active FCM tokens for user ${userId}`);
      return;
    }

    const tokens = result.rows.map(row => row.fcm_token);

    // Préparer le message
    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
        icon: payload.icon || '/logo.png',
      },
      data: payload.data || {},
      webpush: {
        fcmOptions: {
          link: payload.click_action || '/',
        },
      },
      tokens,
    };

    // Envoyer via FCM
    const response = await messaging.sendEachForMulticast(message);

    console.log(`✅ Push sent to user ${userId}: ${response.successCount}/${tokens.length} delivered`);

    // Désactiver les tokens invalides
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const failedToken = tokens[idx];
          pool.query(
            'UPDATE user_fcm_tokens SET is_active = false WHERE fcm_token = $1',
            [failedToken]
          );
          console.log(`Token invalidé: ${failedToken}`);
        }
      });
    }

    return response;
  } catch (error) {
    console.error('Send push notification error:', error);
    throw error;
  }
}

/**
 * Envoyer notification push à plusieurs utilisateurs
 */
export async function sendPushToUsers(
  userIds: string[],
  payload: NotificationPayload
) {
  const promises = userIds.map(userId => sendPushToUser(userId, payload));
  return Promise.allSettled(promises);
}

/**
 * Envoyer notification push à tous les utilisateurs d'un rôle
 */
export async function sendPushToRole(
  role: string,
  payload: NotificationPayload
) {
  try {
    const result = await pool.query(
      `SELECT DISTINCT u.id 
       FROM users u
       INNER JOIN user_fcm_tokens uft ON u.id = uft.user_id
       WHERE u.role = $1 AND uft.is_active = true`,
      [role]
    );

    const userIds = result.rows.map(row => row.id);
    return sendPushToUsers(userIds, payload);
  } catch (error) {
    console.error('Send push to role error:', error);
    throw error;
  }
}
```

---

### PHASE 4: Frontend - Service Worker (2-3 jours)

#### Étape 4.1: Créer Service Worker

**Créer**: `client/public/firebase-messaging-sw.js`

```javascript
// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Configuration Firebase
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

// Gérer les notifications en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/logo.png',
    badge: '/badge.png',
    data: payload.data,
    tag: payload.data.type || 'default',
    requireInteraction: payload.data.priority === 'high',
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  const clickAction = event.notification.data.click_action || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si l'app est déjà ouverte, la focus
        for (const client of clientList) {
          if (client.url.includes(clickAction) && 'focus' in client) {
            return client.focus();
          }
        }
        // Sinon, ouvrir une nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow(clickAction);
        }
      })
  );
});
```

---

#### Étape 4.2: Hook React pour notifications

**Créer**: `client/src/hooks/usePushNotifications.ts`

```typescript
import { useEffect, useState } from 'use';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/config/firebase';
import api from '@/services/api';
import { useToastContext } from '@/App';

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [token, setToken] = useState<string | null>(null);
  const toast = useToastContext();

  // Demander la permission
  const requestPermission = async () => {
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm === 'granted') {
        // Obtenir le token FCM
        const fcmToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        setToken(fcmToken);

        // Enregistrer le token sur le backend
        await api.post('/push-notifications/register-token', {
          fcmToken,
          deviceName: navigator.userAgent,
          deviceType: getDeviceType(),
          browser: getBrowserName(),
        });

        toast.success('Notifications activées!');
      } else {
        toast.error('Permission de notification refusée');
      }
    } catch (error) {
      console.error('Request permission error:', error);
      toast.error('Erreur lors de l\'activation des notifications');
    }
  };

  // Écouter les notifications en premier plan
  useEffect(() => {
    if (permission === 'granted') {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);

        // Afficher notification même si l'app est ouverte
        if (payload.notification) {
          new Notification(payload.notification.title || 'Zenith', {
            body: payload.notification.body,
            icon: payload.notification.icon || '/logo.png',
            data: payload.data,
          });
        }

        // Afficher aussi un toast
        toast.info(payload.notification?.body || 'Nouvelle notification');
      });

      return () => unsubscribe();
    }
  }, [permission]);

  return {
    permission,
    token,
    requestPermission,
  };
};

// Helpers
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

function getBrowserName() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Unknown';
}
```

---

#### Étape 4.3: Intégrer dans Settings

**Modifier**: `client/src/pages/Settings.tsx`

Ajouter section notifications push :

```tsx
import { usePushNotifications } from '@/hooks/usePushNotifications';

export const Settings = () => {
  const { permission, requestPermission } = usePushNotifications();

  return (
    <Card>
      <h3>Notifications Push</h3>
      
      <div className="flex items-center justify-between">
        <div>
          <p>Recevoir des notifications en temps réel</p>
          <p className="text-sm text-gray-500">
            Même quand l'application est fermée
          </p>
        </div>

        {permission === 'default' && (
          <Button onClick={requestPermission}>
            Activer les notifications
          </Button>
        )}

        {permission === 'granted' && (
          <span className="text-green-600">✓ Activées</span>
        )}

        {permission === 'denied' && (
          <span className="text-red-600">
            Bloquées (réactiver dans les paramètres du navigateur)
          </span>
        )}
      </div>
    </Card>
  );
};
```

---

### PHASE 5: Intégration événements (3-4 jours)

#### Intégrer dans les événements existants

**Exemple 1: Nouvelle réservation**

`zen_backend/src/controllers/bookingController.ts`:

```typescript
import { sendPushToRole } from '../services/pushNotificationService';

export const createBooking = async (req: AuthRequest, res: Response) => {
  // ... création de la réservation

  // Envoyer notification push
  await sendPushToRole('receptionist', {
    title: '🔔 Nouvelle réservation',
    body: `${guestName} - Chambre ${roomNumber} - ${checkInDate}`,
    data: {
      type: 'new_booking',
      booking_id: booking.id,
      click_action: '/bookings',
    },
    click_action: '/bookings',
  });

  res.status(201).json(booking);
};
```

**Exemple 2: Checkout (Housekeeping)**

```typescript
export const checkout = async (req: AuthRequest, res: Response) => {
  // ... checkout logic

  // Notifier le personnel de nettoyage
  await sendPushToRole('housekeeping', {
    title: '🧹 Chambre à nettoyer',
    body: `Checkout effectué - Chambre ${roomNumber}`,
    data: {
      type: 'room_dirty',
      room_id: roomId,
      click_action: '/housekeeping',
    },
    click_action: '/housekeeping',
  });
};
```

**Exemple 3: Commande restaurant**

```typescript
export const createOrder = async (req: AuthRequest, res: Response) => {
  // ... création commande

  // Notifier les chefs
  await sendPushToRole('restaurant_chef', {
    title: '🍽️ Nouvelle commande',
    body: `Table ${tableNumber} - ${itemCount} items`,
    data: {
      type: 'new_order',
      order_id: order.id,
      click_action: '/restaurant',
    },
    click_action: '/restaurant',
  });
};
```

---

## 📱 CAS D'USAGE DÉTAILLÉS

### 1. Nouvelle Réservation

**Déclencheur**: POST `/api/bookings`  
**Destinataires**: Réceptionnistes  
**Notification**:
- **Titre**: "🔔 Nouvelle réservation"
- **Corps**: "Jean Dupont - Chambre 205 - Arrivée: 25/07/2026"
- **Action**: Ouvre `/bookings`

---

### 2. Check-in imminent

**Déclencheur**: Cron job (30 min avant check-in)  
**Destinataires**: Réceptionnistes  
**Notification**:
- **Titre**: "⏰ Check-in dans 30 min"
- **Corps**: "Chambre 105 - Marie Martin"
- **Action**: Ouvre `/front-desk`

---

### 3. Chambre sale

**Déclencheur**: Checkout effectué  
**Destinataires**: Housekeeping  
**Notification**:
- **Titre**: "🧹 Chambre à nettoyer"
- **Corps**: "Checkout effectué - Chambre 302"
- **Action**: Ouvre `/housekeeping`

---

### 4. Paiement reçu

**Déclencheur**: POST `/api/payments`  
**Destinataires**: Comptables, Managers  
**Notification**:
- **Titre**: "💰 Paiement reçu"
- **Corps**: "500 USD - Réservation #12345"
- **Action**: Ouvre `/payments`

---

### 5. Maintenance urgente

**Déclencheur**: POST `/api/rooms/:id/maintenance`  
**Destinataires**: Maintenance  
**Notification**:
- **Titre**: "🔧 Maintenance URGENTE"
- **Corps**: "Chambre 410 - Fuite d'eau"
- **Priorité**: Haute
- **Action**: Ouvre `/maintenance`

---

### 6. Commande restaurant

**Déclencheur**: POST `/api/restaurant/orders`  
**Destinataires**: Chefs  
**Notification**:
- **Titre**: "🍽️ Nouvelle commande"
- **Corps**: "Table 8 - 3 plats"
- **Action**: Ouvre `/restaurant`

---

### 7. Réservation spa

**Déclencheur**: POST `/api/spa/bookings`  
**Destinataires**: Personnel spa  
**Notification**:
- **Titre**: "💆 Réservation spa"
- **Corps**: "14h00 - Massage relaxant"
- **Action**: Ouvre `/spa`

---

## 💰 COÛTS

### Firebase Cloud Messaging (FCM)

**Plan gratuit**:
- ✅ Notifications illimitées
- ✅ Aucune limite d'utilisateurs
- ✅ Analytics de base

**Coût**: **0 € / mois** ✅

---

### OneSignal

**Plan gratuit**:
- ✅ 10,000 utilisateurs
- ✅ Notifications illimitées
- ✅ Segmentation basique

**Plan Pro** (si >10k users):
- 💰 9$ / mois pour 10k utilisateurs
- 💰 +0.0009$ par utilisateur supplémentaire

**Pour Zenith**: **0 € / mois** (largement sous 10k) ✅

---

### Web Push natif

**Coût**: **0 € / mois** ✅  
(Pas de service tiers, juste serveur existant)

---

## ✅ CHECKLIST D'IMPLÉMENTATION

### Backend

- [ ] Installer `firebase-admin`
- [ ] Configurer Firebase Admin SDK
- [ ] Créer table `user_fcm_tokens`
- [ ] Endpoint POST `/register-token`
- [ ] Endpoint POST `/unregister-token`
- [ ] Service `pushNotificationService.ts`
- [ ] Intégrer dans événements existants
- [ ] Tester avec Postman
- [ ] Déployer sur Render
- [ ] Ajouter variables d'environnement

### Frontend

- [ ] Installer `firebase`
- [ ] Configurer Firebase SDK
- [ ] Créer Service Worker `firebase-messaging-sw.js`
- [ ] Hook `usePushNotifications.ts`
- [ ] Section dans Settings
- [ ] Tester sur localhost
- [ ] Tester en production
- [ ] Ajouter variables sur Vercel

### Database

- [ ] Exécuter script SQL
- [ ] Vérifier index
- [ ] Tester requêtes

### Tests

- [ ] Permission accordée
- [ ] Permission refusée
- [ ] Token enregistré
- [ ] Notification reçue (foreground)
- [ ] Notification reçue (background)
- [ ] Click sur notification
- [ ] Plusieurs appareils
- [ ] Token invalidé

---

## 🚀 DÉPLOIEMENT

### 1. Backend sur Render

Ajouter variables d'environnement:
```
FIREBASE_PROJECT_ID=zenith-pms
```

Uploader `zenith-firebase-adminsdk.json` (via File Upload ou base64 dans env var)

### 2. Frontend sur Vercel

Ajouter variables:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_VAPID_KEY=...
```

### 3. Tester

1. Ouvrir l'app en production
2. Aller dans Settings
3. Cliquer "Activer les notifications"
4. Autoriser dans le navigateur
5. Créer une réservation
6. Vérifier que la notification arrive

---

## 📚 RESSOURCES

- **Firebase Cloud Messaging**: https://firebase.google.com/docs/cloud-messaging
- **Web Push Protocol**: https://web.dev/push-notifications-overview/
- **OneSignal**: https://documentation.onesignal.com/
- **Service Workers**: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

---

## 🎯 PROCHAINES ÉTAPES RECOMMANDÉES

1. **Phase 1**: Configuration Firebase (Commencer ici)
2. **Phase 2**: Créer table DB
3. **Phase 3**: Endpoints backend
4. **Phase 4**: Service Worker + Hook React
5. **Phase 5**: Intégration événements
6. **Phase 6**: Tests et déploiement

**Temps total estimé**: 2-3 semaines à temps partiel

---

**Document créé le**: 23 juillet 2026  
**Pour**: Zenith PMS - Notifications Push  
**Priorité**: Évolution future

---

✅ **Ce plan couvre tout ce qu'il faut savoir pour implémenter les notifications push dans Zenith**
