# 🏗️ Hotel PMS - System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React + TypeScript + Vite                  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  UI Components (Tailwind + Framer Motion)        │  │ │
│  │  │  - Sidebar, Navbar, Cards, Buttons, Charts       │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Pages (Dashboard, Rooms, Bookings, Guests)      │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  State Management (Zustand + React Query)        │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │ (Axios)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         SERVER LAYER                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Node.js + Express + TypeScript                │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Middleware (Auth, CORS, Helmet, Morgan)         │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Routes (Auth, Dashboard, Rooms, Bookings)       │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Controllers (Business Logic)                    │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Queries
                              │ (pg - node-postgres)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    PostgreSQL 14+                       │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Tables: users, hotels, rooms, bookings,         │  │ │
│  │  │  guests, payments, invoices, notifications       │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Component Hierarchy

```
App
├── BrowserRouter
│   ├── Routes
│   │   ├── /login → Login Page
│   │   └── /dashboard → Protected Layout
│   │       ├── Sidebar
│   │       │   └── Navigation Menu
│   │       ├── Navbar
│   │       │   ├── Dark Mode Toggle
│   │       │   ├── Notifications
│   │       │   └── Profile Dropdown
│   │       └── Main Content
│   │           ├── Dashboard
│   │           │   ├── StatCard (x4)
│   │           │   ├── BookingTrendsChart
│   │           │   ├── RevenueChart
│   │           │   ├── OccupancyPieChart
│   │           │   └── RecentActivities
│   │           ├── Rooms (Future)
│   │           ├── Bookings (Future)
│   │           └── Guests (Future)
```

### Backend Route Structure

```
/api
├── /auth
│   ├── POST /login
│   └── GET /profile
├── /dashboard
│   ├── GET /stats
│   ├── GET /booking-trends
│   ├── GET /revenue-analytics
│   └── GET /recent-activities
├── /rooms
│   ├── GET /
│   ├── POST /
│   ├── PUT /:id
│   └── DELETE /:id
├── /bookings
│   ├── GET /
│   ├── POST /
│   └── PATCH /:id/status
└── /guests
    ├── GET /
    ├── POST /
    └── GET /:id/bookings
```

## Data Flow

### Authentication Flow
```
1. User enters credentials → Login Component
2. POST /api/auth/login → Backend
3. Backend validates → PostgreSQL
4. JWT token generated → Response
5. Token stored → localStorage + Zustand
6. Redirect to Dashboard
```

### Dashboard Data Flow
```
1. Dashboard mounts → React Query
2. Multiple API calls (parallel):
   - GET /dashboard/stats
   - GET /dashboard/booking-trends
   - GET /dashboard/revenue-analytics
   - GET /dashboard/recent-activities
3. Backend queries → PostgreSQL
4. Data transformed → JSON Response
5. React Query caches → State Update
6. Components re-render → Charts display
```

### Booking Creation Flow
```
1. User fills form → Booking Component
2. POST /api/bookings → Backend
3. Transaction begins → PostgreSQL
4. Check room availability
5. Create booking record
6. Update room status
7. Transaction commits
8. Response → Frontend
9. React Query invalidates cache
10. Dashboard refreshes
```

## Security Architecture

### Authentication & Authorization

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ 1. Login Request
       ▼
┌─────────────┐
│   Server    │
└──────┬──────┘
       │ 2. Validate Credentials
       ▼
┌─────────────┐
│  Database   │
└──────┬──────┘
       │ 3. User Found
       ▼
┌─────────────┐
│   Server    │ 4. Generate JWT
└──────┬──────┘    (id, email, role)
       │
       ▼
┌─────────────┐
│   Client    │ 5. Store Token
└──────┬──────┘    (localStorage)
       │
       │ 6. Subsequent Requests
       │    (Authorization: Bearer <token>)
       ▼
┌─────────────┐
│   Server    │ 7. Verify JWT
└──────┬──────┘    8. Check Role
       │
       ▼
┌─────────────┐
│  Protected  │ 9. Access Granted
│  Resource   │
└─────────────┘
```

### Middleware Stack

```
Request
  │
  ├─→ Helmet (Security Headers)
  │
  ├─→ CORS (Cross-Origin)
  │
  ├─→ Morgan (Logging)
  │
  ├─→ Body Parser (JSON)
  │
  ├─→ JWT Verification
  │
  ├─→ Role Authorization
  │
  └─→ Route Handler
       │
       └─→ Response
```

## Database Schema Relationships

```
┌──────────┐
│  hotels  │
└────┬─────┘
     │
     ├─────────────┬─────────────┬──────────────┐
     │             │             │              │
     ▼             ▼             ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  rooms   │  │room_types│  │ bookings │  │  users   │
└────┬─────┘  └──────────┘  └────┬─────┘  └──────────┘
     │                            │
     │                            ├──────────┐
     │                            │          │
     ▼                            ▼          ▼
┌──────────┐                 ┌──────────┐ ┌──────────┐
│ bookings │                 │  guests  │ │ payments │
└──────────┘                 └──────────┘ └────┬─────┘
                                               │
                                               ▼
                                          ┌──────────┐
                                          │ invoices │
                                          └──────────┘
```

## State Management

### Zustand Store (Auth)
```typescript
{
  user: User | null,
  token: string | null,
  setAuth: (user, token) => void,
  logout: () => void
}
```

### React Query Cache
```
Query Keys:
- ['dashboard-stats']
- ['booking-trends']
- ['revenue-analytics']
- ['recent-activities']
- ['rooms']
- ['bookings']
- ['guests']
```

## Performance Optimizations

### Frontend
- Code splitting with React.lazy()
- React Query caching (5 min stale time)
- Debounced search inputs
- Virtualized lists for large datasets
- Optimistic updates
- Memoized components

### Backend
- Database connection pooling (max 20)
- Indexed queries (dates, status, foreign keys)
- Prepared statements (SQL injection prevention)
- Response compression
- Rate limiting (future)

### Database
- Indexes on frequently queried columns
- Triggers for updated_at timestamps
- Foreign key constraints
- Transaction management
- Query optimization

## Scalability Considerations

### Horizontal Scaling
```
┌─────────────┐
│ Load        │
│ Balancer    │
└──────┬──────┘
       │
   ┌───┴───┬───────┬───────┐
   │       │       │       │
   ▼       ▼       ▼       ▼
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ API │ │ API │ │ API │ │ API │
│ #1  │ │ #2  │ │ #3  │ │ #4  │
└──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘
   │       │       │       │
   └───┬───┴───┬───┴───┬───┘
       │       │       │
       ▼       ▼       ▼
   ┌─────────────────────┐
   │   PostgreSQL        │
   │   (Primary/Replica) │
   └─────────────────────┘
```

### Multi-Hotel Support (SaaS)
- Hotel ID in all queries
- Tenant isolation
- Separate databases per hotel (optional)
- Shared schema with hotel_id filtering

## Deployment Architecture

### Production Setup
```
┌──────────────────────────────────────┐
│           CDN (CloudFront)           │
│         (Static Assets)              │
└────────────────┬─────────────────────┘
                 │
┌────────────────▼─────────────────────┐
│         Frontend (Vercel)            │
│      React Build (Static)            │
└────────────────┬─────────────────────┘
                 │
                 │ API Calls
                 │
┌────────────────▼─────────────────────┐
│      Backend (AWS EC2/Heroku)        │
│      Node.js + Express               │
└────────────────┬─────────────────────┘
                 │
┌────────────────▼─────────────────────┐
│    Database (AWS RDS/Heroku)         │
│         PostgreSQL                   │
└──────────────────────────────────────┘
```

## Technology Decisions

### Why React?
- Component reusability
- Large ecosystem
- TypeScript support
- Performance (Virtual DOM)

### Why Node.js + Express?
- JavaScript full-stack
- Non-blocking I/O
- Large package ecosystem
- Easy to scale

### Why PostgreSQL?
- ACID compliance
- Complex queries support
- JSON support (JSONB)
- Mature and reliable
- Great for relational data

### Why JWT?
- Stateless authentication
- Scalable (no server sessions)
- Mobile-friendly
- Industry standard

### Why Tailwind CSS?
- Utility-first approach
- Fast development
- Consistent design
- Small bundle size
- Easy customization

## Future Enhancements

### Phase 2
- Real-time notifications (WebSockets)
- Advanced search and filters
- Bulk operations
- Export to PDF/Excel

### Phase 3
- Mobile app (React Native)
- Email/SMS notifications
- Payment gateway integration
- Multi-language support

### Phase 4
- AI-powered pricing
- Predictive analytics
- Chatbot support
- IoT integration (smart rooms)

---

This architecture is designed to be:
- ✅ Scalable
- ✅ Maintainable
- ✅ Secure
- ✅ Performant
- ✅ Production-ready
