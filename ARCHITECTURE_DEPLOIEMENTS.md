# 🏗️ ARCHITECTURE & DÉPLOIEMENTS

**Date**: 30 octobre 2026  
**Status**: ✅ DÉPLOYÉ (sauf SQL)

---

## 📐 ARCHITECTURE GLOBALE

```
┌─────────────────────────────────────────────────────────────────┐
│                         UTILISATEUR                              │
│                     (Navigateur Web)                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                       │
│                   https://zen-lyart.vercel.app                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • Dashboard (Design minimaliste) ✅                     │  │
│  │  • Spa Module (Fix page blanche) ✅                      │  │
│  │  • Restaurant, Chambres, Réservations, etc.             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                    Déployé sur: VERCEL                           │
│              Repo: https://github.com/maga1234-0/Zen            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ API REST
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND (Node.js + Express + TypeScript)            │
│            https://zen-backend-jzjh.onrender.com                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • API REST Endpoints                                    │  │
│  │  • Système d'alertes chambres ✅                        │  │
│  │  • Job planifié (30 min) ✅                             │  │
│  │  • Controllers, Routes, Services                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                    Déployé sur: RENDER                           │
│       Repo: https://github.com/maga1234-0/zen_backend-          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ PostgreSQL
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  DATABASE (PostgreSQL)                           │
│                        Supabase                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Tables:                                                 │  │
│  │  • rooms (+ status_changed_at) ⚠️                       │  │
│  │  • room_types                                            │  │
│  │  • bookings, guests, payments                            │  │
│  │  • spa_services, spa_bookings, spa_therapists           │  │
│  │  • restaurant_orders, menu_items                         │  │
│  │  • users, roles, notifications                           │  │
│  │                                                           │  │
│  │  Vues SQL (à créer):                                     │  │
│  │  • dirty_rooms_overdue ⚠️                               │  │
│  │  • cleaning_alerts_summary ⚠️                           │  │
│  │                                                           │  │
│  │  Triggers (à créer):                                     │  │
│  │  • update_room_status_changed_at ⚠️                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│              Hébergé sur: SUPABASE                               │
│         ⚠️ SQL à exécuter manuellement                          │
└─────────────────────────────────────────────────────────────────┘

Légende:
✅ = Déployé et fonctionnel
⚠️ = Action manuelle requise
```

---

## 🔄 FLUX DE DONNÉES - SYSTÈME D'ALERTES

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUX ALERTES CHAMBRES                         │
└─────────────────────────────────────────────────────────────────┘

Étape 1: Changement statut chambre
─────────────────────────────────
┌──────────────┐
│  Réceptionniste │  Marque chambre "dirty"
│  Check-out      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│   UPDATE rooms              │
│   SET status = 'dirty'      │  ← Déclenche trigger SQL
│   WHERE room_number = 'X'   │
└────────┬────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│   TRIGGER: update_room_status_changed  │
│   SET status_changed_at = NOW()        │  ⚠️ À CRÉER
└────────┬───────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│   Colonne status_changed_at    │
│   mis à jour automatiquement   │  ⚠️ À CRÉER
└────────────────────────────────┘


Étape 2: Détection automatique (job planifié)
──────────────────────────────────────────────
         │
         ▼ (toutes les 30 minutes)
┌─────────────────────────────────────────┐
│   BACKEND: Scheduled Job                │
│   scheduledJobs.ts                      │  ✅ DÉPLOYÉ
│   Intervalle: 30 minutes                │
└────────┬────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│   SELECT * FROM dirty_rooms_overdue     │  ⚠️ Vue SQL à créer
│   WHERE (NOW() - status_changed_at)     │
│         > INTERVAL '2 hours'            │
└────────┬─────────────────────────────────┘
         │
         ▼ Si chambres trouvées
┌──────────────────────────────────────────┐
│   Création notification automatique     │
│   notificationService.create()          │  ✅ DÉPLOYÉ
│   Type: 'room_cleaning_alert'           │
│   Destinataires: Housekeeping staff     │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│   INSERT INTO notifications             │
│   Notification visible dans l'app       │
└──────────────────────────────────────────┘


Étape 3: Consultation par utilisateur
──────────────────────────────────────
         │
         ▼ (à la demande)
┌──────────────────────────────────────────┐
│   GET /api/room-alerts                  │  ✅ DÉPLOYÉ
│   Controller: roomAlertController       │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│   Retourne JSON:                        │
│   {                                     │
│     room_number: "101",                 │
│     room_type: "Standard",              │
│     hours_overdue: 3.5,                 │
│     status_changed_at: "2026-10-30..."  │
│   }                                     │
└──────────────────────────────────────────┘
```

---

## 🚀 DÉPLOIEMENTS RÉALISÉS

### Frontend (Vercel)

```
┌─────────────────────────────────────────┐
│   REPOSITORY: Zen (Frontend)            │
│   https://github.com/maga1234-0/Zen     │
└─────────────────────────────────────────┘
         │
         │ git push origin main
         ▼
┌─────────────────────────────────────────┐
│   VERCEL (Auto-deploy)                  │
│   • Détecte push GitHub                 │
│   • Build: npm run build                │
│   • Deploy: 2-3 minutes                 │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   ✅ LIVE                                │
│   https://zen-lyart.vercel.app          │
│                                         │
│   Commits déployés:                     │
│   • 84deceb (dashboard initial)         │
│   • 79bdbfd (fix import dashboard)      │
│   • 5296dc8 (fix spa modal) ⬅️ DERNIER │
└─────────────────────────────────────────┘
```

### Backend (Render)

```
┌─────────────────────────────────────────┐
│   REPOSITORY: zen_backend-              │
│   https://github.com/maga1234-0/        │
│               zen_backend-              │
└─────────────────────────────────────────┘
         │
         │ git push origin main
         ▼
┌─────────────────────────────────────────┐
│   RENDER (Auto-deploy)                  │
│   • Détecte push GitHub                 │
│   • Build: npm install                  │
│   • Deploy: 3-5 minutes                 │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   ✅ LIVE                                │
│   https://zen-backend-jzjh.onrender.com │
│                                         │
│   Commits déployés:                     │
│   • 652f49f (alertes initial)           │
│   • de81744 (fix room_type_id) ⬅️ DERNIER│
└─────────────────────────────────────────┘
```

### Database (Supabase)

```
┌─────────────────────────────────────────┐
│   SUPABASE PROJECT                      │
│   PostgreSQL Database                   │
└─────────────────────────────────────────┘
         │
         │ ⚠️ Action manuelle requise
         ▼
┌─────────────────────────────────────────┐
│   SQL EDITOR                            │
│   • Copier script SQL                   │
│   • Coller dans New Query               │
│   • Run                                 │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│   ⚠️ FICHIER À EXÉCUTER                 │
│   database/                             │
│   ADD_ROOM_CLEANING_ALERT_SYSTEM_       │
│   FIXED.sql                             │
│                                         │
│   Contenu:                              │
│   • ALTER TABLE rooms                   │
│   • CREATE TRIGGER                      │
│   • CREATE VIEW dirty_rooms_overdue     │
│   • CREATE VIEW cleaning_alerts_summary │
│   • CREATE FUNCTION                     │
└─────────────────────────────────────────┘
```

---

## 📊 STATUT COMPOSANTS

| Composant | Status | URL/Fichier | Action |
|-----------|--------|-------------|--------|
| **Frontend** | ✅ Déployé | https://zen-lyart.vercel.app | Tester |
| Dashboard minimaliste | ✅ Déployé | `/dashboard` | Tester |
| Fix spa modal | ✅ Déployé | `/spa` | Tester |
| **Backend** | ✅ Déployé | https://zen-backend-jzjh.onrender.com | Tester |
| API alertes | ✅ Déployé | `/api/room-alerts` | Tester après SQL |
| Job planifié | ✅ Actif | Toutes les 30 min | Auto |
| **Database** | ⚠️ SQL à exécuter | Supabase | **FAIRE** |
| Script SQL | ⚠️ À exécuter | `database/ADD_ROOM_CLEANING_ALERT_SYSTEM_FIXED.sql` | **FAIRE** |

---

## 🔗 CONNEXIONS & ENDPOINTS

### Frontend → Backend

```
┌────────────────────────────────────────┐
│  Frontend (React)                      │
│  https://zen-lyart.vercel.app          │
└────────────────┬───────────────────────┘
                 │
                 │ API Calls (axios)
                 │ Base URL: VITE_API_URL
                 ▼
┌────────────────────────────────────────┐
│  Backend (Express)                     │
│  https://zen-backend-jzjh.onrender.com │
│                                        │
│  Endpoints principaux:                 │
│  • GET  /api/room-alerts               │ ✅
│  • GET  /api/room-alerts/summary       │ ✅
│  • POST /api/room-alerts/test          │ ✅
│  • POST /api/room-alerts/send-notif... │ ✅
│  • GET  /api/spa/bookings              │ ✅
│  • POST /api/spa/bookings              │ ✅
│  • GET  /api/dashboard/stats           │ ✅
└────────────────┬───────────────────────┘
                 │
                 │ SQL Queries (pg)
                 │ Connection string
                 ▼
┌────────────────────────────────────────┐
│  Database (PostgreSQL)                 │
│  Supabase                              │
│                                        │
│  Tables & Views:                       │
│  • rooms ✅                            │
│  • dirty_rooms_overdue ⚠️              │
│  • cleaning_alerts_summary ⚠️          │
│  • spa_bookings ✅                     │
│  • notifications ✅                    │
└────────────────────────────────────────┘
```

---

## ⚙️ CONFIGURATION ENVIRONNEMENT

### Frontend (.env)
```bash
VITE_API_URL=https://zen-backend-jzjh.onrender.com
```

### Backend (.env sur Render)
```bash
DATABASE_URL=postgresql://[SUPABASE_CONNECTION_STRING]
NODE_ENV=production
PORT=3000
```

### Database (Supabase)
```
Host: [project].supabase.co
Database: postgres
Port: 5432
SSL: Required
```

---

## 🔐 SÉCURITÉ & ACCÈS

### Frontend (Public)
- Accessible publiquement
- Authentification requise pour accès app
- JWT tokens pour sessions

### Backend (API)
- Routes protégées par JWT middleware
- CORS configuré pour frontend Vercel
- Rate limiting activé

### Database (Privé)
- Accès direct uniquement via backend
- Connection string sécurisée (variables env)
- Row Level Security (RLS) activée

---

## 📈 MONITORING & LOGS

### Vercel (Frontend)
```
Dashboard: https://vercel.com/dashboard
• Logs temps réel
• Métriques performance
• Historique déploiements
```

### Render (Backend)
```
Dashboard: https://dashboard.render.com
• Logs applications
• Métriques CPU/RAM
• Historique déploiements
```

### Supabase (Database)
```
Dashboard: https://supabase.com
• Logs SQL
• Métriques connexions
• Monitoring performance
```

---

## 🧪 ENDPOINTS DE TEST

### Frontend
```bash
# Test dashboard
https://zen-lyart.vercel.app/dashboard

# Test spa modal
https://zen-lyart.vercel.app/spa
```

### Backend
```bash
# Test API alertes (après SQL)
curl https://zen-backend-jzjh.onrender.com/api/room-alerts

# Test API summary
curl https://zen-backend-jzjh.onrender.com/api/room-alerts/summary
```

### Database
```sql
-- Test vue alertes (après SQL)
SELECT * FROM dirty_rooms_overdue;

-- Test summary
SELECT * FROM cleaning_alerts_summary;
```

---

## 📋 CHECKLIST VALIDATION

### Infrastructure
- [x] Frontend déployé sur Vercel
- [x] Backend déployé sur Render
- [ ] ⚠️ Script SQL exécuté sur Supabase

### Fonctionnalités
- [x] Dashboard minimaliste développé
- [x] Fix spa modal développé
- [x] Système alertes développé
- [ ] Tests utilisateur effectués

### Connexions
- [x] Frontend ↔ Backend
- [x] Backend ↔ Database
- [ ] ⚠️ Vues SQL disponibles (après exécution)

---

## 🎯 PROCHAINE ACTION

### ⚠️ CRITIQUE: Exécuter SQL
1. Ouvrir Supabase SQL Editor
2. Copier `database/ADD_ROOM_CLEANING_ALERT_SYSTEM_FIXED.sql`
3. Exécuter
4. ✅ Confirmer succès
5. Tester endpoints alertes

---

**Architecture complète déployée et fonctionnelle !**  
**Il ne manque que l'exécution du script SQL pour activer les alertes.**

---

**Date**: 30 octobre 2026  
**Status**: ✅ INFRASTRUCTURE PRÊTE
