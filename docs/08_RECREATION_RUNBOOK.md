# AuraLMS — Complete System Recreation Runbook
**Version:** 2.0  
**Target Environment:** Development & Production Self-Hosting  
**Architecture:** Decoupled Full-Stack (Express 5 REST API + React 19 SPA + Prisma ORM + SQLite)  

---

## 1. Prerequisites & Environment Requirements

Before beginning the recreation process, ensure the target host machine meets the following minimum prerequisites:

| Requirement | Minimum Version | Recommended Version | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.18.0` | `v20.x` or `v22.x` LTS | Required for Express 5 & React 19 |
| **npm** | `v9.0.0` | `v10.x+` | Package manager |
| **Git** | `v2.30+` | Latest | Version control |
| **Operating System**| Any (POSIX / Win) | Windows 10/11, Ubuntu 22.04+, macOS 13+ | Cross-platform compatibility |
| **Disk Space** | 1.5 GB | 3.0 GB | Includes `node_modules`, SQLite file, and build artifacts |

---

## 2. Directory Tree Blueprint

Recreate or verify the following top-level repository folder structure:

```text
LMS/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Complete 22-model Prisma schema
│   │   ├── seed.ts              # Idempotent database seeder
│   │   └── dev.db               # SQLite database file (generated)
│   ├── src/
│   │   ├── config/              # Environment & timeout constants
│   │   ├── controllers/         # 13 Express route controllers
│   │   ├── middlewares/         # Auth, RBAC, Maintenance, Upload
│   │   ├── routes/              # Express router definitions
│   │   ├── services/            # Audit logger, Webhook handlers
│   │   ├── prisma.ts            # Singleton PrismaClient instance
│   │   └── server.ts            # Main application bootstrap
│   ├── uploads/secure/          # Stored doubt attachments / files
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/
│   ├── public/                  # Favicons, logo assets
│   ├── src/
│   │   ├── components/          # Reusable UI components (Navbar, OtpInputBoxes, PointerLight, etc.)
│   │   ├── contexts/            # AuthContext, ThemeContext
│   │   ├── pages/               # 26 page views (Auth, Student, Mentor, Admin, etc.)
│   │   ├── App.tsx              # Router & layout provider
│   │   ├── main.tsx             # DOM mount point
│   │   └── index.css            # Tailwind CSS v4 directives
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── docs/                        # Architecture, PRD, diagrams, runbooks, and page views
└── scratch/                     # Automated end-to-end verification scripts
```

---

## 3. Backend Setup & Database Migration

### 3.1 Install Backend Dependencies
Navigate to the `backend/` directory and install the exact dependencies:

```bash
cd backend
npm install
```

#### `backend/package.json` Dependencies Reference:
- **Core Dependencies**:
  - `express`: `^5.3.0`
  - `@prisma/client`: `^6.19.3`
  - `bcryptjs`: `^3.0.3`
  - `jsonwebtoken`: `^9.0.3`
  - `cors`: `^2.8.6`
  - `cookie-parser`: `^1.4.7`
  - `dotenv`: `^18.0.8`
  - `express-rate-limit`: `^8.7.1`
  - `multer`: `^2.4.0`
- **Development Dependencies**:
  - `prisma`: `^6.19.3`
  - `typescript`: `^6.0.3`
  - `ts-node`: `^10.9.2`
  - `nodemon`: `^3.1.14`
  - Type definitions: `@types/express`, `@types/node`, `@types/jsonwebtoken`, `@types/bcryptjs`, `@types/cors`, `@types/cookie-parser`, `@types/multer`

### 3.2 Backend Configuration (`backend/.env`)
Create `backend/.env` with the following variables:

```ini
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="lms_secure_super_secret_jwt_key_2026_xyz"
SESSION_TIMEOUT_MINUTES=120
ADMIN_REGISTRATION_KEY="ADMIN_MASTER_KEY_2026"
```

### 3.3 TypeScript Configuration (`backend/tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*", "prisma/**/*"]
}
```

### 3.4 Prisma Schema & Database Initialization
Generate the Prisma Client and synchronize the SQLite database schema:

```bash
# 1. Generate Prisma Client TypeScript types
npx prisma generate

# 2. Push schema to dev.db (creates all 22 tables and foreign keys)
npx prisma db push

# 3. Seed demo accounts, courses, quizzes, FAQs, doubts, and certificates
npm run seed
```

---

## 4. Frontend Setup & Build

### 4.1 Install Frontend Dependencies
Navigate to the `frontend/` directory and install the packages:

```bash
cd ../frontend
npm install
```

#### `frontend/package.json` Dependencies Reference:
- **Core Dependencies**:
  - `react`: `^19.3.1`
  - `react-dom`: `^19.3.1`
  - `react-router-dom`: `^7.18.4`
  - `axios`: `^1.20.0`
  - `lucide-react`: `^1.60.0`
  - `canvas-confetti`: `^1.9.4`
- **Development Dependencies**:
  - `vite`: `^8.3.4`
  - `@vitejs/plugin-react`: `^6.1.2`
  - `tailwindcss`: `^4.3.3`
  - `@tailwindcss/vite`: `^4.3.3`
  - `typescript`: `~6.0.3`

### 4.2 Vite Configuration (`frontend/vite.config.ts`)
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
});
```

### 4.3 CSS & Tailwind v4 (`frontend/src/index.css`)
```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@layer base {
  html.dark {
    color-scheme: dark;
  }
  body {
    @apply bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col transition-colors duration-200;
  }
  html.dark body {
    @apply bg-slate-950 text-slate-100;
  }
}
```

---

## 5. Starting the Development Servers

To start the system in local development mode:

### Terminal 1: Backend API
```bash
cd backend
npm run dev
# Server listening at http://localhost:5000
```

### Terminal 2: Frontend SPA
```bash
cd frontend
npm run dev
# Vite dev server running at http://localhost:3000
```

Open browser at `http://localhost:3000` to interact with AuraLMS.

---

## 6. Seeded Test Accounts

The seed script (`prisma/seed.ts`) populates the system with 6 distinct role accounts. All seeded accounts share the default development password:

> **Default Password:** `Password123!`

| Role | Username / Identifier | Email | Mobile | Key Permissions / Dashboard |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `admin@lms.local` | `+10000000001` | Full Access, Users, Maintenance, Audit Logs, Webhooks |
| **Student** | `john_student` | `student@lms.local` | `+10000000002` | Enrolled in CS101 & WEB201, Player, Quizzes, Doubts, Receipts |
| **Mentor** | `prof_alan` | `mentor@lms.local` | `+10000000003` | Doubt Answering, Live Class Scheduling, Student Doubts |
| **Content Manager**| `content_sarah` | `content@lms.local` | `+10000000004` | Course Creation, Module/Lesson Editor, Pricing, Resources |
| **Finance Support**| `finance_rachel`| `finance@lms.local` | `+10000000005` | Transaction Ledger, Manual Refund Processing, Revenue Stats |
| **Moderator** | `mod_mark` | `moderator@lms.local`| `+10000000006` | Forum Moderation, Flagged Doubts, Content Reports |

---

## 7. Automated Test & Health Verification Suite

To verify all 6 roles and system flows in under 10 seconds:

```bash
cd LMS
node scratch/test_full_platform.cjs
```

### What this script verifies:
1. **Public APIs**: Status healthcheck, course catalogue fetch, certificate verification (`CERT-2026-CS101-JOHN`).
2. **Auth & Challenges**: Login for all 6 roles, invalid password rejection, JWT issuance.
3. **Student Flow**: Dashboard fetch, enrolled courses, lesson progress update, quiz submission & auto-grading, doubt creation.
4. **Mentor Flow**: Doubt ticket retrieval, answering student doubt, status transition to `RESOLVED`.
5. **Content Manager Flow**: Course listing, module updates, draft toggling.
6. **Finance Support Flow**: Transaction ledger retrieval, refund approval/rejection.
7. **Moderator Flow**: Moderation queue inspection, report status updates.
8. **Super Admin Flow**: User audit listing, audit log inspection, webhook test firing, maintenance mode toggle & bypass.

---

## 8. Production Build & Deployment Guide

### 8.1 Backend Production Build
```bash
cd backend
npm run build
npm start
# Runs compiled TypeScript from dist/src/server.js
```

### 8.2 Frontend Production Build
```bash
cd frontend
npm run build
# Compiles optimized static assets into frontend/dist/
```

### 8.3 Nginx Reverse Proxy Configuration (Sample)
```nginx
server {
    listen 80;
    server_name lms.yourdomain.com;

    # Frontend Single Page App
    location / {
        root /var/www/lms/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend REST API
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 9. Troubleshooting & FAQ

### Q1: `Error: Cannot find module '@prisma/client'`
**Cause**: Prisma Client has not been generated for the current node environment.  
**Fix**: Run `npx prisma generate` inside the `backend/` directory.

### Q2: `SqliteError: database is locked`
**Cause**: Multiple processes trying to write concurrently to SQLite during heavy concurrent testing.  
**Fix**: Ensure `prisma.$disconnect()` is called on exit or restart the dev server to release file handles.

### Q3: How to test the Razorpay / Stripe Webhook simulation?
**Fix**:
1. Log in as Super Admin (`admin@lms.local`).
2. Navigate to `/admin/webhooks`.
3. Select event type `payment.captured` or `payment.failed`, enter an Order ID (e.g. `order_cs101_seed`), and click **Simulate Webhook**.
4. Check the live response inspector to view transaction status update.

### Q4: How to recover if Maintenance Mode is enabled and locked out?
**Fix**:
- Super Admin accounts (`SUPER_ADMIN` role) bypass maintenance mode automatically upon authentication.
- For emergency recovery via API, pass header: `x-maintenance-bypass: lms-emergency-override-token`.
