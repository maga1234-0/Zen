# 📚 GUIDE COMPLET DES OUTILS ET TECHNOLOGIES
# ZENITH - Property Management System

**Date**: 23 juillet 2026  
**Application**: Zenith PMS (Property Management System)  
**Version**: 1.0.0

---

## 📋 TABLE DES MATIÈRES

1. [Frontend Technologies](#frontend-technologies)
2. [Backend Technologies](#backend-technologies)
3. [Base de Données](#base-de-données)
4. [Services Cloud & Déploiement](#services-cloud--déploiement)
5. [Outils de Développement](#outils-de-développement)
6. [Librairies & Packages](#librairies--packages)
7. [Architecture Complète](#architecture-complète)

---

## 🎨 FRONTEND TECHNOLOGIES

### 1. **React** ⚛️
**Version**: 18.x  
**Rôle**: Bibliothèque JavaScript pour construire l'interface utilisateur

**À quoi ça sert**:
- Créer des composants réutilisables (Boutons, Cartes, Formulaires)
- Gérer l'état de l'application (données affichées à l'écran)
- Mettre à jour l'interface en temps réel sans recharger la page
- Créer une Single Page Application (SPA)

**Exemples dans Zenith**:
- Dashboard avec statistiques en temps réel
- Formulaires de réservation interactifs
- Gestion des chambres avec mise à jour instantanée
- Pages Restaurant et Spa avec commandes en direct

**Documentation**: https://react.dev/

---

### 2. **TypeScript** 📘
**Version**: 5.x  
**Rôle**: Sur-ensemble de JavaScript avec typage statique

**À quoi ça sert**:
- Détecter les erreurs avant l'exécution du code
- Améliorer l'autocomplétion dans l'éditeur
- Documenter automatiquement le code
- Rendre le code plus maintenable et sûr

**Exemples dans Zenith**:
```typescript
interface Booking {
  id: string;
  guest_id: string;
  room_id: string;
  check_in_date: Date;
  total_amount: number;
}
```

**Documentation**: https://www.typescriptlang.org/

---

### 3. **Vite** ⚡
**Version**: 5.x  
**Rôle**: Build tool ultra-rapide pour le développement frontend

**À quoi ça sert**:
- Démarrer le serveur de développement en <1 seconde
- Hot Module Replacement (HMR) - voir les changements instantanément
- Builder le projet pour production optimisé
- Support natif de TypeScript et React

**Commandes**:
- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build pour production
- `npm run preview` - Prévisualise le build de production

**Documentation**: https://vitejs.dev/

---

### 4. **Tailwind CSS** 🎨
**Version**: 3.x  
**Rôle**: Framework CSS utility-first

**À quoi ça sert**:
- Styliser rapidement sans écrire de CSS personnalisé
- Classes utilitaires prédéfinies (bg-blue-500, p-4, flex)
- Design responsive automatique
- Dark mode intégré
- Personnalisation via `tailwind.config.js`

**Exemples dans Zenith**:
```tsx
<button className="bg-seafoam-500 hover:bg-seafoam-600 text-white px-4 py-2 rounded-lg">
  Réserver
</button>
```

**Couleurs personnalisées Zenith**:
- `seafoam-400/500/600` - Couleur principale (turquoise)
- `gold-500` - Couleur secondaire (or)
- Support du dark mode complet

**Documentation**: https://tailwindcss.com/

---

### 5. **React Router** 🛣️
**Version**: 6.x  
**Rôle**: Navigation et routing pour React

**À quoi ça sert**:
- Créer différentes pages sans recharger (SPA)
- URLs propres (/dashboard, /bookings, /rooms)
- Navigation avec historique (bouton retour)
- Routes protégées (authentification requise)

**Exemples dans Zenith**:
```typescript
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
<Route path="/restaurant" element={<ProtectedRoute><Restaurant /></ProtectedRoute>} />
```

**Documentation**: https://reactrouter.com/

---

### 6. **Zustand** 🐻
**Version**: 4.x  
**Rôle**: Gestionnaire d'état global léger

**À quoi ça sert**:
- Partager des données entre composants sans prop drilling
- Stocker l'utilisateur connecté globalement
- Gérer les préférences (thème, devise)
- Synchroniser l'état avec localStorage

**Stores dans Zenith**:
- `authStore` - Utilisateur connecté, token JWT
- `settingsStore` - Devise, langue, thème
- `notificationStore` - Notifications en temps réel

**Exemple**:
```typescript
const { user, token, setAuth, logout } = useAuthStore();
```

**Documentation**: https://github.com/pmndrs/zustand

---

### 7. **React Query (TanStack Query)** 🔄
**Version**: 4.x  
**Rôle**: Gestion des requêtes serveur et cache

**À quoi ça sert**:
- Fetcher les données du backend automatiquement
- Cache intelligent (évite requêtes inutiles)
- Refresh automatique en arrière-plan
- Loading/error states gérés automatiquement
- Optimistic updates

**Exemples dans Zenith**:
```typescript
const { data: bookings, isLoading } = useQuery({
  queryKey: ['bookings'],
  queryFn: async () => {
    const res = await api.get('/bookings');
    return res.data;
  },
  refetchInterval: 30000, // Refresh chaque 30s
});
```

**Documentation**: https://tanstack.com/query/

---

### 8. **Framer Motion** 🎭
**Version**: 10.x  
**Rôle**: Animations et transitions fluides

**À quoi ça sert**:
- Animations d'entrée/sortie des modales
- Transitions entre pages
- Animations au scroll
- Gestures (drag, hover, tap)

**Exemples dans Zenith**:
- Modales avec fade-in/fade-out
- Cartes qui s'animent au hover
- Notifications qui slide depuis le haut

**Documentation**: https://www.framer.com/motion/

---

### 9. **Lucide React** 🎯
**Version**: Latest  
**Rôle**: Bibliothèque d'icônes

**À quoi ça sert**:
- Icônes SVG légères et personnalisables
- Plus de 1000 icônes disponibles
- Cohérence visuelle dans l'app

**Icônes utilisées dans Zenith**:
- `Hotel` - Logo et dashboard
- `Calendar` - Réservations
- `Users` - Clients
- `DollarSign` - Paiements
- `Utensils` - Restaurant
- `Sparkles` - Spa

**Documentation**: https://lucide.dev/

---

## 🔧 BACKEND TECHNOLOGIES

### 1. **Node.js** 🟢
**Version**: 20.x LTS  
**Rôle**: Runtime JavaScript côté serveur

**À quoi ça sert**:
- Exécuter du JavaScript en dehors du navigateur
- Créer des API REST
- Gérer les connexions à la base de données
- Traiter les requêtes des clients
- Exécuter des tâches programmées (cron jobs)

**Pourquoi Node.js**:
- Même langage frontend/backend (JavaScript/TypeScript)
- Très performant pour les I/O (requêtes DB, API)
- Écosystème npm énorme

**Documentation**: https://nodejs.org/

---

### 2. **Express.js** 🚂
**Version**: 4.x  
**Rôle**: Framework web minimaliste pour Node.js

**À quoi ça sert**:
- Créer des endpoints API (routes)
- Gérer les requêtes HTTP (GET, POST, PUT, DELETE)
- Middleware (authentification, validation, logging)
- Gestion des erreurs centralisée

**Structure des routes dans Zenith**:
```
/api/auth       - Authentification (login, register)
/api/bookings   - Gestion des réservations
/api/rooms      - Gestion des chambres
/api/guests     - Gestion des clients
/api/payments   - Paiements
/api/restaurant - Restaurant (menu, commandes, tables)
/api/spa        - Spa (services, bookings)
/api/users      - Personnel
```

**Exemple de route**:
```typescript
router.get('/bookings', authenticate, async (req, res) => {
  const bookings = await pool.query('SELECT * FROM bookings');
  res.json(bookings.rows);
});
```

**Documentation**: https://expressjs.com/

---

### 3. **JWT (JSON Web Tokens)** 🔐
**Version**: jsonwebtoken 9.x  
**Rôle**: Authentification sécurisée sans session

**À quoi ça sert**:
- Identifier l'utilisateur connecté
- Token stocké côté client (localStorage)
- Pas besoin de sessions serveur
- Contient les infos utilisateur (id, email, role)

**Flow d'authentification Zenith**:
1. Client envoie email + password
2. Backend vérifie les credentials
3. Backend génère un JWT signé
4. Client stocke le JWT
5. Client envoie le JWT dans chaque requête (Header Authorization)
6. Backend vérifie et décode le JWT

**Structure du JWT Zenith**:
```json
{
  "id": "uuid",
  "email": "user@zenith.com",
  "role": "receptionist",
  "iat": 1234567890,
  "exp": 1234654290
}
```

**Documentation**: https://jwt.io/

---

### 4. **bcrypt** 🔒
**Version**: 5.x  
**Rôle**: Hachage sécurisé des mots de passe

**À quoi ça sert**:
- Hasher les mots de passe avant stockage en DB
- Jamais stocker les mots de passe en clair!
- Comparaison sécurisée lors du login
- Résistant aux attaques par force brute

**Utilisation dans Zenith**:
```typescript
// Lors de l'inscription
const passwordHash = await bcrypt.hash(password, 10);
await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, passwordHash]);

// Lors du login
const isValid = await bcrypt.compare(password, user.password_hash);
```

**Documentation**: https://github.com/kelektiv/node.bcrypt.js

---

### 5. **node-postgres (pg)** 🐘
**Version**: 8.x  
**Rôle**: Driver PostgreSQL pour Node.js

**À quoi ça sert**:
- Se connecter à la base de données PostgreSQL
- Exécuter des requêtes SQL
- Pool de connexions pour performance
- Requêtes préparées (protection SQL injection)

**Configuration Zenith**:
```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
```

**Exemple de requête**:
```typescript
const result = await pool.query(
  'SELECT * FROM bookings WHERE guest_id = $1',
  [guestId]
);
```

**Documentation**: https://node-postgres.com/

---

### 6. **node-cron** ⏰
**Version**: 3.x  
**Rôle**: Tâches programmées (cron jobs)

**À quoi ça sert**:
- Exécuter du code à intervalles réguliers
- Automatisation des tâches récurrentes

**Tâches dans Zenith**:
```typescript
// Checkout automatique à 11h00 chaque jour
cron.schedule('0 11 * * *', autoCheckout);

// Vérifier les réservations tous les jours à minuit
cron.schedule('0 0 * * *', checkUpcomingBookings);

// Envoyer les rappels de paiement chaque lundi à 9h
cron.schedule('0 9 * * 1', sendPaymentReminders);
```

**Documentation**: https://github.com/node-cron/node-cron

---

## 🗄️ BASE DE DONNÉES

### 1. **PostgreSQL** 🐘
**Version**: 15.x  
**Rôle**: Système de gestion de base de données relationnelle

**À quoi ça sert**:
- Stocker toutes les données de l'application
- Relations entre tables (foreign keys)
- Transactions ACID (cohérence des données)
- Triggers et fonctions stockées
- Support JSON avancé
- Extensible et performant

**Pourquoi PostgreSQL**:
- Open source et gratuit
- Très fiable et mature
- Support avancé des types de données
- Excellent pour les applications d'entreprise
- Supabase l'utilise (hébergement gratuit)

**Tables principales dans Zenith**:
- `users` - Personnel
- `guests` - Clients
- `bookings` - Réservations
- `rooms` - Chambres
- `payments` - Paiements
- `menu_items` - Éléments du menu restaurant
- `restaurant_orders` - Commandes restaurant
- `spa_services` - Services spa
- `spa_bookings` - Réservations spa
- `notifications` - Notifications système

**Documentation**: https://www.postgresql.org/

---

### 2. **Supabase** ⚡
**Version**: Hosted PostgreSQL  
**Rôle**: Backend-as-a-Service (hébergement DB)

**À quoi ça sert**:
- Héberger la base de données PostgreSQL gratuitement
- Interface SQL Editor en ligne
- Backups automatiques
- Monitoring et logs
- API REST auto-générée (non utilisée dans Zenith)
- Connection pooling intégré

**Avantages pour Zenith**:
- ✅ Gratuit jusqu'à 500 MB
- ✅ SSL/TLS activé par défaut
- ✅ Interface web pour gérer la DB
- ✅ Pas besoin de serveur PostgreSQL local
- ✅ Connexion directe depuis Render

**Connection String**:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

**Dashboard**: https://supabase.com/dashboard

**Documentation**: https://supabase.com/docs

---

## ☁️ SERVICES CLOUD & DÉPLOIEMENT

### 1. **Vercel** ▲
**Rôle**: Hébergement frontend (React app)

**À quoi ça sert**:
- Déployer le frontend automatiquement depuis GitHub
- CDN global (site rapide partout dans le monde)
- HTTPS automatique
- Prévisualisation des pull requests
- Variables d'environnement sécurisées
- Builds optimisés automatiques

**Configuration Zenith**:
- **Repo**: https://github.com/maga1234-0/Zen
- **URL**: https://zen-lyart.vercel.app
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

**Variables d'environnement**:
```
VITE_API_URL=https://zen-backend-jzjh.onrender.com
```

**Déploiement**:
1. Push sur GitHub → branch `main`
2. Vercel détecte automatiquement
3. Build en 2-3 minutes
4. Déploiement automatique

**Plan**: Free (Hobby)

**Dashboard**: https://vercel.com/dashboard

**Documentation**: https://vercel.com/docs

---

### 2. **Render** 🚀
**Rôle**: Hébergement backend (Node.js API)

**À quoi ça sert**:
- Héberger le serveur Express.js
- Déploiement automatique depuis GitHub
- HTTPS automatique
- Logs en temps réel
- Variables d'environnement sécurisées
- Redémarrages automatiques

**Configuration Zenith**:
- **Repo**: https://github.com/maga1234-0/zen_backend-
- **URL**: https://zen-backend-jzjh.onrender.com
- **Environment**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Variables d'environnement**:
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://zen-lyart.vercel.app
```

**Déploiement**:
1. Push sur GitHub → branch `main`
2. Render détecte automatiquement
3. Build en 3-5 minutes
4. Déploiement automatique

**Important**: Service gratuit dort après 15 min d'inactivité (cold start de 30s au réveil)

**Plan**: Free

**Dashboard**: https://dashboard.render.com

**Documentation**: https://render.com/docs

---

### 3. **GitHub** 🐙
**Rôle**: Hébergement du code source et versioning

**À quoi ça sert**:
- Stocker le code source
- Versioning (historique des modifications)
- Collaboration en équipe
- Déclencheur pour Vercel et Render
- Backup du code

**Repositories Zenith**:
1. **Frontend**: https://github.com/maga1234-0/Zen
2. **Backend**: https://github.com/maga1234-0/zen_backend-

**Workflow**:
```bash
# Développement local
git add .
git commit -m "feat: Add new feature"
git push origin main

# → Vercel détecte et déploie frontend
# → Render détecte et déploie backend
```

**Documentation**: https://docs.github.com

---

## 🛠️ OUTILS DE DÉVELOPPEMENT

### 1. **Git** 📦
**Version**: 2.x  
**Rôle**: Système de contrôle de version

**À quoi ça sert**:
- Suivre l'historique des modifications
- Créer des branches pour nouvelles features
- Revenir en arrière si erreur
- Collaborer sans conflits

**Commandes principales**:
```bash
git status              # Voir les fichiers modifiés
git add .               # Ajouter tous les fichiers
git commit -m "message" # Créer un commit
git push origin main    # Pousser vers GitHub
git pull                # Récupérer les changements
```

**Documentation**: https://git-scm.com/

---

### 2. **npm (Node Package Manager)** 📦
**Version**: 10.x  
**Rôle**: Gestionnaire de packages JavaScript

**À quoi ça sert**:
- Installer des librairies tierces
- Gérer les dépendances du projet
- Scripts de build et développement

**Commandes principales**:
```bash
npm install            # Installer toutes les dépendances
npm install axios      # Installer un package
npm run dev            # Lancer le dev server
npm run build          # Builder pour production
npm start              # Démarrer le serveur
```

**Fichiers importants**:
- `package.json` - Liste des dépendances et scripts
- `package-lock.json` - Versions exactes verrouillées
- `node_modules/` - Dossier avec tous les packages (ignoré par git)

**Documentation**: https://docs.npmjs.com/

---

### 3. **VS Code** 💻
**Rôle**: Éditeur de code recommandé

**Extensions recommandées pour Zenith**:
- ESLint - Linting JavaScript/TypeScript
- Prettier - Formatage automatique du code
- Tailwind CSS IntelliSense - Autocomplétion Tailwind
- ES7+ React/Redux/React-Native snippets
- GitLens - Améliorations Git
- Thunder Client - Tester les API

**Documentation**: https://code.visualstudio.com/docs

---

## 📚 LIBRAIRIES & PACKAGES

### Frontend (`client/package.json`)

```json
{
  "axios": "^1.6.0",              // Requêtes HTTP
  "react": "^18.2.0",              // UI Library
  "react-dom": "^18.2.0",          // React pour le DOM
  "react-router-dom": "^6.20.0",   // Routing
  "zustand": "^4.4.7",             // State management
  "@tanstack/react-query": "^5.0", // Server state
  "framer-motion": "^10.16",       // Animations
  "lucide-react": "^0.300",        // Icônes
  "date-fns": "^3.0.0",            // Manipulation de dates
  "recharts": "^2.10.0",           // Graphiques
  "react-signature-canvas": "^1.0" // Signature digitale
}
```

### Backend (`zen_backend/package.json`)

```json
{
  "express": "^4.18.0",      // Framework web
  "pg": "^8.11.0",           // PostgreSQL driver
  "bcryptjs": "^2.4.3",      // Hachage mots de passe
  "jsonwebtoken": "^9.0.0",  // JWT auth
  "cors": "^2.8.5",          // CORS middleware
  "dotenv": "^16.3.0",       // Variables d'environnement
  "node-cron": "^3.0.0",     // Tâches programmées
  "typescript": "^5.0.0"     // TypeScript
}
```

---

## 🏗️ ARCHITECTURE COMPLÈTE

### Architecture 3-tiers

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT (Navigateur)                     │
│                                                                  │
│  React + TypeScript + Tailwind                                  │
│  ├── Pages (Dashboard, Bookings, Restaurant, etc.)              │
│  ├── Components (Buttons, Cards, Forms)                         │
│  ├── Services (API calls via Axios)                             │
│  ├── Stores (Zustand - auth, settings)                          │
│  └── Router (React Router)                                      │
│                                                                  │
│  Hébergé sur: Vercel                                            │
│  URL: https://zen-lyart.vercel.app                              │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           │ HTTPS (API Calls)
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                        SERVEUR API (Backend)                      │
│                                                                  │
│  Node.js + Express + TypeScript                                 │
│  ├── Routes (/api/bookings, /api/rooms, etc.)                  │
│  ├── Controllers (Business logic)                               │
│  ├── Middleware (Auth, CORS, Error handling)                    │
│  ├── Services (Email, Notifications, Cron jobs)                 │
│  └── Config (Database connection, JWT secret)                   │
│                                                                  │
│  Hébergé sur: Render                                            │
│  URL: https://zen-backend-jzjh.onrender.com                     │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           │ PostgreSQL Protocol (SQL queries)
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                    BASE DE DONNÉES (PostgreSQL)                   │
│                                                                  │
│  Tables:                                                         │
│  ├── users (Personnel)                                          │
│  ├── guests (Clients)                                           │
│  ├── bookings (Réservations)                                    │
│  ├── rooms (Chambres)                                           │
│  ├── payments (Paiements)                                       │
│  ├── menu_items (Menu restaurant)                               │
│  ├── restaurant_orders (Commandes)                              │
│  ├── spa_services (Services spa)                                │
│  └── notifications (Notifications)                              │
│                                                                  │
│  Hébergé sur: Supabase                                          │
│  Connection: PostgreSQL 15.x avec SSL                            │
└──────────────────────────────────────────────────────────────────┘
```

---

### Flow d'une requête typique

**Exemple**: Créer une réservation

```
1. CLIENT (React)
   └─> Utilisateur remplit le formulaire de réservation
   └─> Clique sur "Créer la réservation"
   └─> `bookingService.createBooking(data)` 
   └─> Axios POST /api/bookings

2. BACKEND (Express)
   └─> Reçoit la requête POST /api/bookings
   └─> Middleware: Vérifie le JWT token (authentification)
   └─> Controller: `createBooking(req, res)`
   └─> Valide les données (dates, montants, etc.)
   └─> Vérifie disponibilité de la chambre

3. DATABASE (PostgreSQL)
   └─> BEGIN transaction
   └─> INSERT INTO bookings (...)
   └─> UPDATE rooms SET status = 'reserved'
   └─> INSERT INTO payments (deposit)
   └─> INSERT INTO notifications (nouvelle résa)
   └─> COMMIT transaction

4. BACKEND → CLIENT
   └─> Retourne HTTP 201 avec les données de la réservation
   └─> JSON: { id, booking_number, guest, room, dates, amount }

5. CLIENT
   └─> React Query met à jour le cache
   └─> Affiche un toast "Réservation créée!"
   └─> Redirige vers /bookings
   └─> Liste actualisée avec la nouvelle réservation
```

---

## 🔐 SÉCURITÉ

### Mesures implémentées dans Zenith

1. **Authentification JWT**
   - Token signé avec secret
   - Expiration après 7 jours
   - Stocké dans localStorage (client)

2. **Mots de passe**
   - Hachés avec bcrypt (10 rounds)
   - Jamais stockés en clair
   - Minimum 6 caractères

3. **HTTPS**
   - Vercel: HTTPS automatique
   - Render: HTTPS automatique
   - Supabase: SSL/TLS obligatoire

4. **SQL Injection**
   - Requêtes préparées (`$1`, `$2`)
   - Paramètres échappés automatiquement

5. **CORS**
   - Configuration stricte
   - Seul le frontend Vercel autorisé

6. **Variables sensibles**
   - `.env` jamais commité
   - `.gitignore` configuré
   - Variables sur Vercel/Render

7. **Authorization (RBAC)**
   - Rôles: admin, manager, receptionist, housekeeping, etc.
   - Permissions par rôle
   - Vérification côté backend

---

## 📦 STRUCTURE DES PROJETS

### Frontend (`Zen/`)

```
client/
├── public/              # Fichiers statiques (favicon, etc.)
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── ui/         # Composants UI de base
│   │   └── layout/     # Layout (Navbar, Sidebar)
│   ├── pages/          # Pages de l'app
│   │   ├── Dashboard.tsx
│   │   ├── Bookings.tsx
│   │   ├── Restaurant.tsx
│   │   └── ...
│   ├── services/       # API services (axios)
│   ├── store/          # Zustand stores
│   ├── utils/          # Fonctions utilitaires
│   ├── hooks/          # Custom hooks
│   ├── App.tsx         # Composant racine
│   └── main.tsx        # Point d'entrée
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### Backend (`zen_backend/`)

```
src/
├── config/
│   └── database.ts     # Config PostgreSQL
├── controllers/        # Business logic
│   ├── authController.ts
│   ├── bookingController.ts
│   ├── restaurantController.ts
│   └── ...
├── routes/            # Définition des routes
│   ├── authRoutes.ts
│   ├── bookingRoutes.ts
│   └── ...
├── middleware/        # Middleware Express
│   ├── auth.ts       # JWT verification
│   └── errorHandler.ts
├── services/         # Services métier
│   ├── emailService.ts
│   ├── notificationService.ts
│   └── scheduledJobs.ts
├── types/            # Types TypeScript
└── server.ts         # Point d'entrée
```

---

## 🚀 ÉVOLUTION FUTURE: NOTIFICATIONS PUSH

Voir fichier: `PLAN_NOTIFICATIONS_PUSH.md`

---

## 📞 SUPPORT & RESSOURCES

### Documentation officielle

- **React**: https://react.dev/learn
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Express**: https://expressjs.com/en/guide/routing.html
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Supabase**: https://supabase.com/docs

### Communautés

- **Stack Overflow**: https://stackoverflow.com/
- **React Discord**: https://discord.gg/reactiflux
- **Supabase Discord**: https://discord.supabase.com/

---

## 📝 GLOSSAIRE

- **API**: Application Programming Interface - Interface de communication entre applications
- **REST**: Representational State Transfer - Architecture d'API basée sur HTTP
- **JWT**: JSON Web Token - Standard d'authentification
- **CRUD**: Create, Read, Update, Delete - Opérations de base sur les données
- **SPA**: Single Page Application - App web qui ne recharge jamais la page
- **SSR**: Server-Side Rendering - Rendu côté serveur
- **CDN**: Content Delivery Network - Réseau de serveurs pour distribuer le contenu
- **SQL**: Structured Query Language - Langage de requête pour bases de données
- **ORM**: Object-Relational Mapping - Abstraction de la base de données
- **Middleware**: Fonction qui s'exécute entre la requête et la réponse
- **Hook**: Fonction React pour utiliser des features (useState, useEffect)
- **Props**: Propriétés passées à un composant React
- **State**: Données dynamiques dans un composant React

---

**Document créé le**: 23 juillet 2026  
**Pour**: Zenith PMS v1.0.0  
**Auteur**: Documentation technique

---

✅ **Ce guide couvre tous les outils et technologies utilisés dans Zenith Property Management System**
