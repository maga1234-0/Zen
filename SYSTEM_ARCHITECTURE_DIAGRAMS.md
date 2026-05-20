# 🎨 Hotel PMS - System Architecture Diagrams

## 1. 🏗️ System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React App<br/>Vercel]
        style A fill:#667eea,stroke:#764ba2,stroke-width:3px,color:#fff
    end
    
    subgraph "API Layer"
        B[Express Server<br/>Render]
        style B fill:#f093fb,stroke:#f5576c,stroke-width:3px,color:#fff
    end
    
    subgraph "AI Services"
        C[Gemini AI<br/>Google]
        style C fill:#4facfe,stroke:#00f2fe,stroke-width:3px,color:#fff
    end
    
    subgraph "Database Layer"
        D[PostgreSQL<br/>Supabase]
        style D fill:#43e97b,stroke:#38f9d7,stroke-width:3px,color:#fff
    end
    
    subgraph "External Services"
        E[Authentication<br/>JWT]
        F[File Storage<br/>Cloud]
        style E fill:#fa709a,stroke:#fee140,stroke-width:3px,color:#fff
        style F fill:#30cfd0,stroke:#330867,stroke-width:3px,color:#fff
    end
    
    A -->|HTTPS API Calls| B
    B -->|SQL Queries| D
    B -->|AI Requests| C
    B -->|Token Validation| E
    B -->|Upload/Download| F
    
    classDef default fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
```

---

## 2. 🔄 Booking Workflow

```mermaid
graph LR
    subgraph "Guest Journey"
        A[🔍 Search<br/>Rooms]
        B[📅 Select<br/>Dates]
        C[💳 Payment]
        D[✅ Confirmed]
        E[🏨 Check-in]
        F[🛏️ Stay]
        G[👋 Check-out]
    end
    
    A --> B --> C --> D --> E --> F --> G
    
    style A fill:#667eea,stroke:#764ba2,stroke-width:3px,color:#fff
    style B fill:#f093fb,stroke:#f5576c,stroke-width:3px,color:#fff
    style C fill:#4facfe,stroke:#00f2fe,stroke-width:3px,color:#fff
    style D fill:#43e97b,stroke:#38f9d7,stroke-width:3px,color:#fff
    style E fill:#fa709a,stroke:#fee140,stroke-width:3px,color:#fff
    style F fill:#30cfd0,stroke:#330867,stroke-width:3px,color:#fff
    style G fill:#a8edea,stroke:#fed6e3,stroke-width:3px,color:#333
```

---

## 3. 🎯 User Roles & Permissions

```mermaid
graph TD
    A[👑 Admin]
    B[👔 Manager]
    C[🎫 Receptionist]
    D[🧹 Housekeeping]
    E[🔧 Maintenance]
    F[💰 Accountant]
    
    A -->|Full Access| B
    A -->|Full Access| C
    A -->|Full Access| D
    A -->|Full Access| E
    A -->|Full Access| F
    
    B -->|Supervise| C
    B -->|Supervise| D
    B -->|Supervise| E
    
    C -->|Create| G[Bookings]
    C -->|Manage| H[Check-ins]
    D -->|Update| I[Room Status]
    E -->|Handle| J[Repairs]
    F -->|Process| K[Payments]
    
    style A fill:#ff6b6b,stroke:#c92a2a,stroke-width:4px,color:#fff
    style B fill:#4ecdc4,stroke:#0a9396,stroke-width:3px,color:#fff
    style C fill:#45b7d1,stroke:#0077b6,stroke-width:3px,color:#fff
    style D fill:#96ceb4,stroke:#52b788,stroke-width:3px,color:#fff
    style E fill:#ffeaa7,stroke:#fdcb6e,stroke-width:3px,color:#333
    style F fill:#a29bfe,stroke:#6c5ce7,stroke-width:3px,color:#fff
    style G fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff
    style H fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff
    style I fill:#55efc4,stroke:#00b894,stroke-width:2px,color:#fff
    style J fill:#fab1a0,stroke:#e17055,stroke-width:2px,color:#fff
    style K fill:#fd79a8,stroke:#e84393,stroke-width:2px,color:#fff
```

---

## 4. 🤖 AI Features Flow

```mermaid
graph TB
    subgraph "AI Services"
        A[🤖 AI Hub]
        style A fill:#667eea,stroke:#764ba2,stroke-width:4px,color:#fff
    end
    
    A --> B[💬 Chatbot]
    A --> C[🎯 Room<br/>Recommendations]
    A --> D[📧 Message<br/>Generator]
    A --> E[😊 Sentiment<br/>Analysis]
    A --> F[📊 Predictive<br/>Analytics]
    
    B --> G[Guest Inquiries]
    C --> H[Upselling]
    D --> I[Automated Emails]
    E --> J[Review Analysis]
    F --> K[Booking Trends]
    
    style B fill:#4facfe,stroke:#00f2fe,stroke-width:3px,color:#fff
    style C fill:#43e97b,stroke:#38f9d7,stroke-width:3px,color:#fff
    style D fill:#fa709a,stroke:#fee140,stroke-width:3px,color:#fff
    style E fill:#f093fb,stroke:#f5576c,stroke-width:3px,color:#fff
    style F fill:#30cfd0,stroke:#330867,stroke-width:3px,color:#fff
    
    style G fill:#a8edea,stroke:#fed6e3,stroke-width:2px,color:#333
    style H fill:#a8edea,stroke:#fed6e3,stroke-width:2px,color:#333
    style I fill:#a8edea,stroke:#fed6e3,stroke-width:2px,color:#333
    style J fill:#a8edea,stroke:#fed6e3,stroke-width:2px,color:#333
    style K fill:#a8edea,stroke:#fed6e3,stroke-width:2px,color:#333
```

---

## 5. 🗄️ Database Schema

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : creates
    USERS ||--o{ NOTIFICATIONS : receives
    GUESTS ||--o{ BOOKINGS : makes
    ROOMS ||--o{ BOOKINGS : has
    BOOKINGS ||--o{ PAYMENTS : requires
    BOOKINGS ||--|| INVOICES : generates
    GUESTS ||--o{ REVIEWS : writes
    
    USERS {
        uuid id PK
        string email
        string role
        string name
        boolean is_active
    }
    
    GUESTS {
        uuid id PK
        string name
        string email
        string phone
        string id_number
    }
    
    ROOMS {
        uuid id PK
        string room_number
        string status
        decimal price
        string room_type
    }
    
    BOOKINGS {
        uuid id PK
        uuid guest_id FK
        uuid room_id FK
        date check_in
        date check_out
        string status
        decimal total_amount
    }
    
    PAYMENTS {
        uuid id PK
        uuid booking_id FK
        decimal amount
        string method
        string status
    }
    
    REVIEWS {
        uuid id PK
        uuid guest_id FK
        text review_text
        string sentiment
        int sentiment_score
    }
```

---

## 6. 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as 🖥️ Frontend
    participant A as 🔐 Auth API
    participant D as 🗄️ Database
    participant T as 🎫 JWT Service
    
    U->>F: Enter Credentials
    F->>A: POST /api/auth/login
    A->>D: Verify User
    D-->>A: User Data
    A->>T: Generate Token
    T-->>A: JWT Token
    A-->>F: Token + User Info
    F->>F: Store Token
    F-->>U: Redirect to Dashboard
    
    Note over F,A: All subsequent requests<br/>include JWT token
    
    U->>F: Access Protected Route
    F->>A: Request + JWT Token
    A->>T: Validate Token
    T-->>A: Token Valid
    A-->>F: Protected Data
    F-->>U: Display Data
```

---

## 7. 🏨 Room Status Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Available: Room Ready
    Available --> Occupied: Guest Check-in
    Occupied --> Dirty: Guest Check-out
    Dirty --> Cleaning: Housekeeping Assigned
    Cleaning --> Available: Cleaning Complete
    Available --> Maintenance: Issue Reported
    Occupied --> Maintenance: Urgent Repair
    Maintenance --> Available: Repair Complete
    Maintenance --> Cleaning: Repair + Clean Needed
    
    state Available {
        [*] --> Ready
        Ready --> Reserved: Booking Made
        Reserved --> Ready: Booking Cancelled
    }
    
    state Maintenance {
        [*] --> Pending
        Pending --> InProgress: Staff Assigned
        InProgress --> Completed: Work Done
    }
```

---

## 8. 💳 Payment Processing

```mermaid
graph TB
    A[🛒 Booking Created]
    B{Payment<br/>Method?}
    C[💵 Cash]
    D[💳 Card]
    E[📱 Mobile Money]
    F[🏦 Bank Transfer]
    
    G[Process Payment]
    H{Payment<br/>Success?}
    I[✅ Confirmed]
    J[❌ Failed]
    K[🔄 Retry]
    L[📧 Send Receipt]
    M[📊 Update Records]
    
    A --> B
    B --> C
    B --> D
    B --> E
    B --> F
    
    C --> G
    D --> G
    E --> G
    F --> G
    
    G --> H
    H -->|Yes| I
    H -->|No| J
    J --> K
    K --> G
    
    I --> L
    L --> M
    
    style A fill:#667eea,stroke:#764ba2,stroke-width:3px,color:#fff
    style B fill:#f093fb,stroke:#f5576c,stroke-width:3px,color:#fff
    style C fill:#43e97b,stroke:#38f9d7,stroke-width:2px,color:#fff
    style D fill:#43e97b,stroke:#38f9d7,stroke-width:2px,color:#fff
    style E fill:#43e97b,stroke:#38f9d7,stroke-width:2px,color:#fff
    style F fill:#43e97b,stroke:#38f9d7,stroke-width:2px,color:#fff
    style G fill:#4facfe,stroke:#00f2fe,stroke-width:3px,color:#fff
    style H fill:#fa709a,stroke:#fee140,stroke-width:3px,color:#fff
    style I fill:#43e97b,stroke:#38f9d7,stroke-width:3px,color:#fff
    style J fill:#ff6b6b,stroke:#c92a2a,stroke-width:3px,color:#fff
    style K fill:#ffeaa7,stroke:#fdcb6e,stroke-width:2px,color:#333
    style L fill:#a29bfe,stroke:#6c5ce7,stroke-width:2px,color:#fff
    style M fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff
```

---

## 9. 📊 Dashboard Data Flow

```mermaid
graph LR
    subgraph "Data Sources"
        A[(Bookings)]
        B[(Rooms)]
        C[(Payments)]
        D[(Guests)]
        E[(Reviews)]
    end
    
    subgraph "Analytics Engine"
        F[Data Aggregator]
        G[AI Predictor]
    end
    
    subgraph "Dashboard Widgets"
        H[📈 Revenue]
        I[🏨 Occupancy]
        J[👥 Guests]
        K[⭐ Reviews]
        L[🔮 Predictions]
    end
    
    A --> F
    B --> F
    C --> F
    D --> F
    E --> F
    
    F --> G
    
    F --> H
    F --> I
    F --> J
    F --> K
    G --> L
    
    style A fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style B fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style C fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style D fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style E fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style F fill:#4facfe,stroke:#00f2fe,stroke-width:3px,color:#fff
    style G fill:#f093fb,stroke:#f5576c,stroke-width:3px,color:#fff
    style H fill:#43e97b,stroke:#38f9d7,stroke-width:3px,color:#fff
    style I fill:#fa709a,stroke:#fee140,stroke-width:3px,color:#fff
    style J fill:#30cfd0,stroke:#330867,stroke-width:3px,color:#fff
    style K fill:#ffeaa7,stroke:#fdcb6e,stroke-width:3px,color:#333
    style L fill:#a29bfe,stroke:#6c5ce7,stroke-width:3px,color:#fff
```

---

## 10. 🔔 Notification System

```mermaid
graph TB
    subgraph "Trigger Events"
        A[New Booking]
        B[Payment Received]
        C[Check-in Due]
        D[Maintenance Request]
        E[Review Posted]
    end
    
    F[Notification Service]
    
    subgraph "Notification Types"
        G[📧 Email]
        H[🔔 In-App]
        I[📱 Push]
        J[💬 SMS]
    end
    
    subgraph "Recipients"
        K[👤 Staff]
        L[👥 Guests]
        M[👔 Managers]
    end
    
    A --> F
    B --> F
    C --> F
    D --> F
    E --> F
    
    F --> G
    F --> H
    F --> I
    F --> J
    
    G --> K
    G --> L
    G --> M
    H --> K
    H --> M
    I --> L
    J --> L
    
    style A fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style B fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style C fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style D fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style E fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style F fill:#f093fb,stroke:#f5576c,stroke-width:4px,color:#fff
    style G fill:#4facfe,stroke:#00f2fe,stroke-width:2px,color:#fff
    style H fill:#4facfe,stroke:#00f2fe,stroke-width:2px,color:#fff
    style I fill:#4facfe,stroke:#00f2fe,stroke-width:2px,color:#fff
    style J fill:#4facfe,stroke:#00f2fe,stroke-width:2px,color:#fff
    style K fill:#43e97b,stroke:#38f9d7,stroke-width:2px,color:#fff
    style L fill:#43e97b,stroke:#38f9d7,stroke-width:2px,color:#fff
    style M fill:#43e97b,stroke:#38f9d7,stroke-width:2px,color:#fff
```

---

## 11. 🌐 Deployment Architecture

```mermaid
graph TB
    subgraph "Users"
        A[🌍 Internet Users]
    end
    
    subgraph "CDN & Frontend"
        B[Vercel CDN]
        C[React App]
    end
    
    subgraph "Backend Services"
        D[Render Server]
        E[Express API]
        F[Node.js Runtime]
    end
    
    subgraph "External APIs"
        G[Gemini AI]
        H[Payment Gateway]
    end
    
    subgraph "Database"
        I[Supabase]
        J[PostgreSQL]
    end
    
    subgraph "Monitoring"
        K[Logs]
        L[Analytics]
    end
    
    A -->|HTTPS| B
    B --> C
    C -->|API Calls| D
    D --> E
    E --> F
    F -->|AI Requests| G
    F -->|Payments| H
    F -->|Queries| I
    I --> J
    E --> K
    E --> L
    
    style A fill:#667eea,stroke:#764ba2,stroke-width:3px,color:#fff
    style B fill:#4facfe,stroke:#00f2fe,stroke-width:3px,color:#fff
    style C fill:#4facfe,stroke:#00f2fe,stroke-width:2px,color:#fff
    style D fill:#f093fb,stroke:#f5576c,stroke-width:3px,color:#fff
    style E fill:#f093fb,stroke:#f5576c,stroke-width:2px,color:#fff
    style F fill:#f093fb,stroke:#f5576c,stroke-width:2px,color:#fff
    style G fill:#43e97b,stroke:#38f9d7,stroke-width:2px,color:#fff
    style H fill:#43e97b,stroke:#38f9d7,stroke-width:2px,color:#fff
    style I fill:#fa709a,stroke:#fee140,stroke-width:3px,color:#fff
    style J fill:#fa709a,stroke:#fee140,stroke-width:2px,color:#fff
    style K fill:#30cfd0,stroke:#330867,stroke-width:2px,color:#fff
    style L fill:#30cfd0,stroke:#330867,stroke-width:2px,color:#fff
```

---

## 12. 📱 Mobile-First Design

```mermaid
graph LR
    subgraph "Responsive Breakpoints"
        A[📱 Mobile<br/>320-768px]
        B[📱 Tablet<br/>768-1024px]
        C[💻 Desktop<br/>1024-1440px]
        D[🖥️ Large<br/>1440px+]
    end
    
    E[Tailwind CSS]
    F[Responsive Components]
    
    A --> E
    B --> E
    C --> E
    D --> E
    
    E --> F
    
    F --> G[Navigation]
    F --> H[Dashboard]
    F --> I[Forms]
    F --> J[Tables]
    
    style A fill:#667eea,stroke:#764ba2,stroke-width:3px,color:#fff
    style B fill:#4facfe,stroke:#00f2fe,stroke-width:3px,color:#fff
    style C fill:#43e97b,stroke:#38f9d7,stroke-width:3px,color:#fff
    style D fill:#f093fb,stroke:#f5576c,stroke-width:3px,color:#fff
    style E fill:#fa709a,stroke:#fee140,stroke-width:4px,color:#fff
    style F fill:#30cfd0,stroke:#330867,stroke-width:3px,color:#fff
    style G fill:#a8edea,stroke:#fed6e3,stroke-width:2px,color:#333
    style H fill:#a8edea,stroke:#fed6e3,stroke-width:2px,color:#333
    style I fill:#a8edea,stroke:#fed6e3,stroke-width:2px,color:#333
    style J fill:#a8edea,stroke:#fed6e3,stroke-width:2px,color:#333
```

---

## Color Palette Reference

### Primary Colors
- 🔵 **Blue Gradient**: `#667eea → #764ba2` (Main Actions)
- 🟣 **Purple Gradient**: `#f093fb → #f5576c` (Secondary)
- 🔷 **Cyan Gradient**: `#4facfe → #00f2fe` (Info)
- 🟢 **Green Gradient**: `#43e97b → #38f9d7` (Success)
- 🔴 **Pink Gradient**: `#fa709a → #fee140` (Warnings)
- 🌊 **Teal Gradient**: `#30cfd0 → #330867` (Accent)

### Usage Guidelines
- **Admin/Critical**: Red tones
- **Success/Complete**: Green tones
- **Info/Data**: Blue/Cyan tones
- **Warnings**: Yellow/Orange tones
- **AI Features**: Purple/Pink tones
- **User Actions**: Teal/Cyan tones

---

**View these diagrams in:**
- GitHub (automatic rendering)
- VS Code (with Mermaid extension)
- Online: https://mermaid.live/

**Last Updated:** May 20, 2026
