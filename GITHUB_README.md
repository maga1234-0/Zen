# 🏨 Hotel PMS - Complete Property Management System

A modern, full-stack Hotel Property Management System built with React, Node.js, Express, and PostgreSQL.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## ✨ Features

### Core Functionality
- 🔐 **Authentication & Authorization** - JWT-based with 6 user roles
- 🏠 **Room Management** - Complete CRUD with status tracking
- 📅 **Booking System** - Overlap prevention, quick booking, status management
- 👥 **Guest Management** - Profile management with duplicate prevention
- 💰 **Payment Processing** - Multiple payment methods, duplicate prevention
- 🔔 **Real-time Notifications** - Role-based notification system
- 🧹 **Housekeeping** - Room cleaning workflow management
- 🔧 **Maintenance Tracking** - Reason-based maintenance with urgency flags
- 📊 **Dashboard Analytics** - Revenue, occupancy, and booking trends
- 👨‍💼 **Staff Management** - User roles and permissions

### Advanced Features
- 🌙 **Dark Mode** - System-wide theme support
- 🌍 **Multi-language** - English, French, Spanish
- 📱 **Responsive Design** - Mobile, tablet, and desktop
- ⚡ **Real-time Updates** - Auto-refresh and live data
- 🎨 **Custom UI Components** - Toast notifications, confirmation dialogs
- 🤖 **Automated Jobs** - Auto-checkout, scheduled notifications
- 🔒 **Security** - Helmet, CORS, JWT authentication
- 📈 **Analytics** - Charts, trends, and reports

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/maga1234-0/zenith1.git
cd zenith1
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Setup Database**
```bash
# Create database in PostgreSQL
createdb hotel_pms

# Run schema
psql -d hotel_pms -f database/schema.sql

# Run seed data
psql -d hotel_pms -f database/seed.sql

# Run migrations
psql -d hotel_pms -f database/update-guests-phone-optional.sql
psql -d hotel_pms -f database/fix-room-status-constraint.sql
psql -d hotel_pms -f database/add-maintenance-fields.sql
psql -d hotel_pms -f database/update-notifications-table.sql
```

4. **Configure Environment Variables**
```bash
# Copy example env file
cd server
cp .env.example .env

# Edit .env with your settings
# Update database credentials, JWT secret, etc.
```

5. **Start the Application**
```bash
# Start backend (from server directory)
npm run dev

# Start frontend (from client directory, in new terminal)
cd ../client
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:5174
- Backend API: http://localhost:5000

## 🔑 Default Login Credentials

### Admin Account
- **Email**: admin@hotel.com
- **Password**: admin123

### Manager Account
- **Email**: manager@hotel.com
- **Password**: password123

### Receptionist Account
- **Email**: receptionist@hotel.com
- **Password**: password123

## 📁 Project Structure

```
zenith1/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   ├── hooks/         # Custom hooks
│   │   ├── i18n/          # Translations
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── routes/       # API routes
│   │   └── services/     # Business logic
│   └── package.json
│
├── database/             # SQL scripts
│   ├── schema.sql       # Database schema
│   ├── seed.sql         # Sample data
│   └── *.sql            # Migration scripts
│
└── docs/                # Documentation
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Query** - Data fetching
- **Zustand** - State management
- **Framer Motion** - Animations
- **i18next** - Internationalization

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **node-cron** - Scheduled jobs

## 📊 Database Schema

The system uses PostgreSQL with 11 main tables:
- users
- hotels
- room_types
- rooms
- guests
- bookings
- payments
- invoices
- notifications
- audit_logs
- user_settings

See `database/schema.sql` for complete schema.

## 🎨 Color Scheme

- **Seafoam Teal**: #20B2AA (Primary)
- **Yellow Gold**: #FFD700 (Accent)
- **Grey Brown**: #8B7D6B (Secondary)
- **Mint Light**: #F0FFF4 (Background)
- **Dark Mode**: Charcoal Slate + Blue-grey Slate

## 🔐 User Roles & Permissions

1. **Admin** - Full system access
2. **Manager** - Management operations
3. **Receptionist** - Front desk operations
4. **Housekeeping** - Room cleaning
5. **Maintenance** - Maintenance tasks
6. **Accountant** - Financial operations

## 📱 Pages

- Login
- Dashboard (role-based views)
- Rooms
- Bookings
- Guests
- Payments
- Notifications
- Housekeeping
- Maintenance
- Staff
- Reports
- Front Desk
- Settings
- Profile

## 🔄 Automated Features

- **Auto-checkout** - Runs hourly, checks out guests when checkout date arrives
- **Auto-checkin notifications** - Identifies bookings ready for check-in
- **Room status updates** - Automatically marks rooms as "dirty" after checkout
- **Notification refresh** - Updates unread count every 30 seconds

## 🌍 Internationalization

Supported languages:
- English (en)
- French (fr)
- Spanish (es)

Add more languages by creating translation files in `client/src/i18n/locales/`

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 📝 API Documentation

API documentation is available at `/api/docs` when running the server.

Key endpoints:
- `POST /api/auth/login` - User login
- `GET /api/rooms` - Get all rooms
- `POST /api/bookings` - Create booking
- `GET /api/dashboard/stats` - Dashboard statistics

See `API_DOCUMENTATION.md` for complete API reference.

## 🚀 Deployment

### Backend (Node.js)
- Deploy to Heroku, Railway, or Render
- Set environment variables
- Connect to PostgreSQL database

### Frontend (React)
- Deploy to Vercel, Netlify, or Cloudflare Pages
- Update API URL in environment variables

See `DEPLOYMENT.md` for detailed deployment instructions.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@maga1234-0](https://github.com/maga1234-0)

## 🙏 Acknowledgments

- React team for the amazing framework
- TailwindCSS for the utility-first CSS
- PostgreSQL for the robust database
- All contributors and users

## 📞 Support

For support, email your.email@example.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Online booking portal
- [ ] Payment gateway integration
- [ ] Advanced reporting
- [ ] Multi-property support
- [ ] Channel manager integration

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Rooms Management
![Rooms](screenshots/rooms.png)

### Bookings
![Bookings](screenshots/bookings.png)

---

**Made with ❤️ for the hospitality industry**
