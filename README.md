# ResumeFlow — Fullstack ATS Resume Builder

> ResumeFlow is a modern full-stack web application designed to help job seekers create, manage, tailor, and export ATS-friendly resumes and job application assets with live styling and multiple export options.

---

## Key Features

- **Modern Frontend Experience**: Built with Angular 13, Angular Material custom theming (Dark Teal & Mint), responsive layouts, and interactive micro-animations.
- **Secure Authentication**: JWT-based session auth with route guards (`AuthGuard`, `NoAuthGuard`), protected workspace routes, OTP-based password reset, and password visibility toggles.
- **Interactive Resume Editor**:
  - Drag-and-drop section and bullet item reordering using Angular CDK.
  - Live document management (Sections, Bullet items, Sidebar items).
  - Version history snapshots and public shareable link generation (`/r/:slug`).
- **Multi-Format Exporting**:
  - **PDF Export**: Pixel-perfect server-side rendering using `wkhtmltopdf`.
  - **DOCX Export**: Structured Word document generation via `html-to-docx`.
- **Relational Database Architecture**: 9+ interrelated models managed with Sequelize ORM (Users, Documents, Sections, Items, Templates, Versions, Shares, Applications, Exports).

---

## Repository Architecture (Monorepo)

```text
ResumeFlow/
├── frontend/                     # Angular Single Page Application
│   ├── projects/web/src/
│   │   ├── app/
│   │   │   ├── auth/             # Login, Signup, Guards & AuthService
│   │   │   ├── dashboard/        # Metrics, Recent Resumes & Quick Actions
│   │   │   ├── workspace/        # Resume Editor, Documents, Templates, Shares, Exports
│   │   │   ├── shared/           # Header, Footer, Reusable UI
│   │   │   └── home/             # Landing page (Hero, Templates, Features, FAQ, etc.)
│   │   └── styles.scss           # Custom Material Theme & Design Tokens
│   ├── angular.json
│   └── package.json
│
├── backend/                      # Node.js + Express REST API
│   ├── config/                   # Sequelize Database configuration
│   ├── controllers/              # Business logic (Auth, Documents, Sections, Export, etc.)
│   ├── middleware/               # JWT Auth & Validation middlewares
│   ├── migrations/               # Database schema migrations
│   ├── models/                   # Sequelize data models & associations
│   ├── routes/                   # Resource-based modular routing
│   ├── utils/                    # Nodemailer helper utilities
│   ├── app.js                    # Express application entry point
│   ├── .env.example              # Environment variable template
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Tech Stack

### Frontend
- **Framework**: Angular 13 (TypeScript)
- **UI & Styling**: Angular Material, CDK Drag-and-Drop, SCSS (Custom Dark Teal/Mint theme)
- **State & Routing**: RxJS, Angular Reactive Forms, Angular Router with Guards

### Backend
- **Runtime & Server**: Node.js, Express.js
- **ORM & Database**: Sequelize ORM, MySQL
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcrypt` password hashing
- **File Export**: `wkhtmltopdf` (PDF generation), `html-to-docx` (Word generation)
- **Email Service**: `nodemailer` (OTP password reset)

---

## Getting Started & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/GAURAVNEGI33/ResumeFlow.git
cd ResumeFlow
```

---

### 2. Backend Setup (backend/)

1. **Navigate to backend**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file from the example template:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your MySQL database credentials and secrets:
   ```env
   PORT=4000
   DATABASE_USER=root
   DATABASE_PASSWORD=your_mysql_password
   DATABASE_NAME=resume
   DATABASE_HOST=127.0.0.1
   MY_SQL_PORT=3306
   JWT_SECRET=your_jwt_secret_key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_gmail_app_password
   SMTP_FROM=your_email@gmail.com
   ```

4. **Run Database Migrations**:
   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Install wkhtmltopdf (Required for PDF export)**:
   - **Windows**: Download installer from [wkhtmltopdf.org](https://wkhtmltopdf.org/downloads.html) and add to PATH.
   - **Linux/Ubuntu**: `sudo apt-get install wkhtmltopdf`
   - **macOS**: `brew install wkhtmltopdf`

6. **Start the Backend Server**:
   ```bash
   npm run dev
   # Server runs on http://localhost:4000
   ```

---

### 3. Frontend Setup (frontend/)

1. **Navigate to frontend**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm start
   # Or: ng serve
   ```
4. Open your browser at: `http://localhost:4200`

---

## API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login user and return JWT | No |
| `POST` | `/api/auth/forgot-password` | Request password reset OTP | No |
| `POST` | `/api/auth/reset-password` | Reset password using OTP | No |
| `GET` | `/api/dashboard` | Fetch dashboard metrics and documents | Yes |
| `GET` | `/api/documents` | Get all user resumes | Yes |
| `POST` | `/api/documents` | Create a new resume document | Yes |
| `POST` | `/api/sections` | Add section to resume | Yes |
| `POST` | `/api/items` | Add bullet point detail | Yes |
| `POST` | `/api/shares` | Generate public share link | Yes |
| `POST` | `/api/export/pdf` | Generate and download PDF resume | Yes |
| `POST` | `/api/export/docx` | Generate and download DOCX resume | Yes |

---

## Author

**Gaurav Negi**  
Full-Stack Web Developer  
- GitHub: [@GAURAVNEGI33](https://github.com/GAURAVNEGI33)
