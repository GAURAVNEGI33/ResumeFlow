# ResumeFlow — Fullstack ATS Resume Builder

> ResumeFlow is a modern full-stack web application designed to help job seekers create, manage, tailor, and export ATS-friendly resumes and job application assets with live styling and multiple export options.

---

## Architecture & Engineering Specifications

Each core feature in ResumeFlow is backed by detailed system architecture specs, Mermaid flowcharts, data models, and API contracts:

| # | Feature Domain | Specification Document | Key Capabilities |
| :---: | :--- | :--- | :--- |
| **01** | **Authentication & Security** | [View Spec →](docs/features/01-authentication-and-security.md) | JWT auth, Angular Route Guards (`AuthGuard`, `NoAuthGuard`), bcrypt hashing, OTP email reset |
| **02** | **Interactive Resume Editor** | [View Spec →](docs/features/02-interactive-resume-editor.md) | CDK Drag-and-drop ordering, Document-Section-Item hierarchy, live preview, version snapshots |
| **03** | **Multi-Format Export Engine** | [View Spec →](docs/features/03-multi-format-export.md) | Server-side `wkhtmltopdf` A4 binary streaming + `html-to-docx` Word generation |
| **04** | **Public Shareable Viewer** | [View Spec →](docs/features/04-public-shareable-viewer.md) | Unauthenticated `/r/:slug` route, relational nested fetch, responsive A4 sheet, print stylesheet |
| **05** | **Job Applications Tracker** | [View Spec →](docs/features/05-applications-tracker.md) | Interactive Kanban board with CDK status transitions, table view, document linking |
| **06** | **Template Gallery & Theming** | [View Spec →](docs/features/06-template-gallery.md) | Design tokens, custom accent color palettes, Google Fonts typography, layout formats |

---

## Repository Architecture (Monorepo)

```text
ResumeFlow/
├── docs/
│   └── features/                 # Detailed Engineering Architecture Specifications
│       ├── 01-authentication-and-security.md
│       ├── 02-interactive-resume-editor.md
│       ├── 03-multi-format-export.md
│       ├── 04-public-shareable-viewer.md
│       ├── 05-applications-tracker.md
│       └── 06-template-gallery.md
│
├── frontend/                     # Angular Single Page Application
│   ├── projects/web/src/
│   │   ├── app/
│   │   │   ├── auth/             # Login, Signup, Guards & AuthService
│   │   │   ├── dashboard/        # Metrics, Recent Resumes & Quick Actions
│   │   │   ├── workspace/        # Resume Editor, Documents, Templates, Shares, Exports
│   │   │   ├── public-resume/    # Public Shareable Resume Viewer (/r/:slug)
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
| `GET` | `/api/shares/public/:slug` | Fetch public shared resume without auth | No |
| `POST` | `/api/export/pdf` | Generate and download PDF resume | Yes |
| `POST` | `/api/export/docx` | Generate and download DOCX resume | Yes |

---

## Author

**Gaurav Negi**  
Full-Stack Web Developer  
- GitHub: [@GAURAVNEGI33](https://github.com/GAURAVNEGI33)
