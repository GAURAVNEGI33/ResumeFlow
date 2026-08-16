> This repository contains my backend learning progress, where each feature is implemented step by step with meaningful Git commits.

# 📄 Resume API

A backend project built with **Node.js** and **Express.js** to learn REST APIs, routing, controllers, models, and middleware using an industry-style project structure. Currently, it integrates **Sequelize** as an ORM to manage relational data efficiently.

> 🚀 This project is being developed step by step during my backend learning journey.

---

## 📂 Project Structure Explained

```text
resume-api/
│
├── backup/                  # Contains earlier rudimentary CRUD implementations (e.g., using local data.json). Preserved for learning reference and comparison.
├── models copy/             # A backup of initial/older models before running the Sequelize CLI generators. Used to compare manual models vs CLI-generated models.
├── config/                  # Database connection settings for Sequelize.
├── migrations/              # Database migration files defining the schema and associations (foreign keys, cascading updates/deletes).
├── models/                  # Sequelize Data Access Layer (contains Users, Documents, Sections, Items, Templates, Applications, etc.).
├── controllers/             # Request handling logic linking Routes to Models.
├── middleware/              # Custom Express middleware (e.g., validators).
├── routes/                  # API route definitions separated by resource.
├── app.js                   # Application entry point.
├── package.json
└── .gitignore
```

### Why do we have `backup/` and `models copy/`?

As a learning repository, it is valuable to keep a history of how the code evolved.

- **`backup/`**: Before integrating a real database like MySQL/PostgreSQL, the API relied on a simple filesystem or hardcoded JSON for CRUD operations. That old logic is stored here to see the "before and after".
- **`models copy/`**: Before using the powerful `sequelize-cli model:generate` commands, models were likely drafted by hand. Keeping a copy allows us to reference those early drafts and understand exactly how Sequelize expects models to be structured.

---

## ✨ Features

- Express server setup
- Modular folder structure & route separation
- Controller architecture
- **Advanced Database Schema** (9 interrelated tables with foreign key constraints)
- **Sequelize ORM Integration & Migrations**
- JSON request parsing
- REST API foundation

---

## 🛠️ Tech Stack

- **Node.js & Express.js**
- **Sequelize ORM & Sequelize-CLI**
- **Database:** Relational DB (e.g., MySQL / PostgreSQL)
- **Git & GitHub**

---

## 📚 Learning Objectives

- Understand Express architecture and request routing.
- Separate business logic using controllers.
- Master **Relational Database Design** (One-to-Many, Foreign Keys, Constraints).
- Use **Sequelize ORM** to automate schema migrations and query generation.
- Build a scalable backend structure.

---

## 📖 API Documentation

The complete API documentation, including request bodies and example responses, is published via Postman. 
**Note:** Currently, only the **Authentication** and **Document** APIs have been created. The remaining APIs for Sections, Templates, Items, Versions, and Applications will be built soon!

👉 [View the Postman API Documentation here](https://documenter.getpostman.com/view/56589029/2sBY4SMJa5)

---

## 📌 Current Progress

- ✅ Project initialized & Express server setup
- ✅ Folder structure created (Controllers, Routes, Models)
- ✅ Document routes & controller added
- ✅ **Database Schema Designed & Migrated** (Users, Documents, Sections, Items, etc.)
- ✅ **Sequelize Associations implemented** (Foreign Key References, Cascading Rules)
- ✅ Refactored Controllers to use new Models
- ⏳ Complete all CRUD operations for the new tables
- ⏳ Middleware implementation & Validation
- ⏳ Authentication
- ⏳ API Testing

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/GAURAVNEGI33/resume-api
```

### Install Dependencies

```bash
npm install
```

### Setup Database

Ensure your database is running, verify credentials in `config/config.js`, and run migrations:

```bash
npx sequelize-cli db:migrate
```

### Start Server

```bash
node app.js
```

---

## 📖 Learning Notes

This project is focused on understanding backend development concepts such as:

- **Express Application Lifecycle** (Request & Response)
- **Database Migrations** (Creating and rolling back tables with `sequelize-cli`)
- **Model Relationships** (Foreign Keys, Cascading deletes to prevent orphaned data)
- **REST API Principles**

---

## 📌 Future Improvements

- Fully functional APIs for all 9 database tables.
- File-based storage (e.g., Exporting PDFs).
- Custom error handling and validation middleware.
- Authentication (JWT / bcrypt) linked to the Users table.

---

## 👨‍💻 Author

**Gaurav Negi**

Learning Backend Development with Node.js & Express as a full-stack web development intern.
