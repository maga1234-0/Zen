# Hotel PMS - Project Architecture

## Tech Stack
- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS + ShadCN UI
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- Auth: JWT
- Charts: Recharts

## Color Palette
- Seafoam Teal: #20B2AA (primary)
- Grey Brown: #8B7D6B (secondary)
- Yellow Gold: #FFD700 (accent)
- Mint Light: #F0FFF4 (background)

## Folder Structure

```
hotel-pms/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/        # ShadCN components
│   │   │   ├── layout/    # Layout components
│   │   │   ├── dashboard/ # Dashboard widgets
│   │   │   ├── rooms/     # Room management
│   │   │   ├── bookings/  # Booking components
│   │   │   ├── guests/    # Guest management
│   │   │   └── staff/     # Staff management
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/      # API calls
│   │   ├── store/         # State management
│   │   ├── types/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── config/       # DB, JWT config
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth, validation
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Helpers
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
└── database/
    ├── schema.sql
    └── seed.sql
```
