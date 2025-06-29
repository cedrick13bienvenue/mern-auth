# MERN Auth App 🔐

A full-stack authentication system built with the MERN stack (MongoDB, Express, React, Node.js) that supports user registration, login, logout, protected routes, and JWT-based authentication. Includes Swagger API docs and email verification.

---

## 🌐 Live URLs

- **Frontend** (Vercel): [https://authentic-mern.vercel.app](https://authentic-mern.vercel.app)
- **Backend** (Render): [https://mern-auth-3rp7.onrender.com](https://mern-auth-3rp7.onrender.com)
- **API Docs** (Swagger): [https://mern-auth-3rp7.onrender.com/documentation](https://mern-auth-3rp7.onrender.com/documentation)

---

## 🛠️ Tech Stack

| Layer    | Tech                                 |
| -------- | ------------------------------------ |
| Frontend | React + Vite                         |
| Backend  | Express.js + Node.js                 |
| Auth     | JWT + Cookies                        |
| Database | MongoDB Atlas                        |
| Email    | Nodemailer (SMTP via Brevo)          |
| Hosting  | Vercel (frontend) + Render (backend) |

---

## 📦 Features

- ✅ User registration & login
- ✅ JWT + HTTP-only cookies
- ✅ Email verification via SMTP (Brevo)
- ✅ Password reset via OTP
- ✅ Swagger API documentation
- ✅ CORS and environment-based configuration
- ✅ Full deployment on Vercel & Render

---

## 📁 Project Structure

```
mern-auth-app/
├── client/                 # Frontend (React + Vite)
│   └── ...
├── server/                 # Backend (Express.js)
│   ├── config/
│   │   └── mongodb.js
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── utils/
│   ├── server.js
│   └── .env
└── README.md
```

---

## 🔐 Environment Variables

### Backend (`server/.env`)

```env
PORT=4000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret

SMTP_USER=your_brevo_user
SMTP_PASS=your_brevo_password
SENDER_EMAIL=your_verified_sender_email
```

### Frontend (`client/.env`)

```env
VITE_BACKEND_URL=https://mern-auth-3rp7.onrender.com
```

---

## 🚀 Local Development

### Prerequisites:

- Node.js v18+
- MongoDB Atlas account
- Brevo SMTP account

### Backend

```bash
cd server
npm install
npm run serve
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 📤 Deployment

### Backend (Render)

- Create a new Web Service
- Set build command: `npm install`
- Set start command: `node server.js`
- Add environment variables from `.env`

### Frontend (Vercel)

- Set framework: Vite
- Set `VITE_BACKEND_URL` in project settings
- Add a `vercel.json` file:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🧪 API Documentation

Swagger UI is available at:
📄 `/documentation`

---

## ✨ Credits

Built by **Bienvenue Cedrick**  
💼 Student Software Engineer | Backend & DevOps Enthusiast

---

## 📜 License

This project is open-source and available under the MIT License.
