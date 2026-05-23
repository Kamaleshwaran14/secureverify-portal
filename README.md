# SecureVerify Portal

SecureVerify Portal is a role-based employee verification application built using Angular and Node.js.

The project includes authentication, dashboard records, admin user management, REST API integration, and async loading simulation.

---

## Tech Stack

### Frontend
- Angular
- TypeScript
- Tailwind CSS
- Angular Material

### Backend
- Node.js
- Express.js
- TypeScript

### Storage
- JSON based dummy database

---

## Features

- Login with role selection
- Admin and General User access
- Protected dashboard routes
- Verification records table
- Async API delay simulation
- Admin user management
- Add/Delete users
- Responsive UI
- Snackbar notifications

---

## Demo Credentials

### Admin

| Field | Value |
|---|---|
| User ID | admin@mploychek.com |
| Password | password123 |
| Role | Admin |

---

### General User

| Field | Value |
|---|---|
| User ID | user@mploychek.com |
| Password | password123 |
| Role | General User |

---

# Run Project

## 1. Clone Repository

```bash
git clone https://github.com/Kamaleshwaran14/secureverify-portal.git
```

---

## 2. Run Backend

Open terminal:

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

## 3. Run Frontend

Open another terminal:

```bash
cd frontend
npm install
ng serve
```

Frontend runs on:

```txt
http://localhost:4200
```

---

## 4. Open Application

Open browser:

```txt
http://localhost:4200
```

---

## API Endpoints

| Method | Endpoint |
|---|---|
| POST | `/api/login` |
| GET | `/api/records` |
| GET | `/api/users` |
| POST | `/api/users` |
| DELETE | `/api/users/:id` |

---

## Project Structure

```txt
secureverify-portal
│
├── frontend
├── backend
└── README.md
```

---

## Author

Kamaleshwaran S