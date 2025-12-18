# 🌐 DoraWi – Premium AI Translator

![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-Backend-success)
![React](https://img.shields.io/badge/React-Frontend-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![AI Powered](https://img.shields.io/badge/AI-Powered-purple)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

> **Production-ready AI Translation Platform**  
> Fast • Secure • Scalable • Developer-Friendly

---

## Introduction

**DoraWi** is a full-stack **AI-powered translation platform** designed to deliver accurate, contextual translations for both text and documents. Built with modern web technologies, DoraWi follows best practices for scalability, security, and maintainability.

Perfect for:
- SaaS-style AI products
- Portfolio & real-world demonstrations
- Production-ready deployments

---

## ✨ Key Features

### 🤖 AI Translation
- Context-aware, high-quality translations
- Multi-language support
- Optimized for speed and accuracy

### 📄 Document Translation
- PDF document upload and translation
- Automatic text extraction
- Secure file handling

### 👤 User Accounts
- User registration and login
- JWT-based authentication
- Password hashing and protected routes

### ⭐ User Experience
- Translation history tracking
- Favorite translations
- Personalized user data

### 🧩 Developer-Friendly Architecture
- Clean separation of frontend and backend
- Modular REST API
- Environment-based configuration
- Graceful fallback mechanisms

---

## 🛠️ Technology Stack

### Frontend
- React (TypeScript)
- Vite
- Tailwind CSS
- ESLint

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- PDF parsing utilities

> 🔐 Sensitive credentials are never committed and are managed using environment variables.

---

## 📂 Project Structure

```text
DoraWi/
├── frontend/              # Client application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── vite.config.ts
│
├── backend/               # Server application
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── store.js           # In-memory fallback store
│   └── index.js
│
└── README.md





