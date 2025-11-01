# 🧑‍💻 User Manager Pro API

A simple REST API built with **Node.js**, **Express**, and **MongoDB** for managing user data (CRUD operations).

---

## 🚀 Features
- Create, Read, Update, Delete users  
- Express Middleware (Logger + Error Handler)  
- MongoDB connection using Mongoose  
- 404 route fallback  
- Clean and modular folder structure  

---

## 🛠️ Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **dotenv**
- **Postman** (for API testing)

---

## ⚙️ Setup Guide

### 1️⃣ Clone the Repository
bash
git clone https://github.com/Ajay110125/user-manager-pro.git
cd user-manager-pro

2️⃣ Install Dependencies
   npm install

3️⃣ Setup Environment Variables
    MONGO_URI=your_mongo_connection_string
    PORT=5000
4️⃣ Run the Development Server
   npm run dev

📁 Folder Structure
User-Manager-Pro/
│
├── controllers/
│   └── userController.js
│
├── middleware/
│   ├── logger.js
│   └── errorHandler.js
│
├── routes/
│   └── userRoutes.js
│
├── .env
├── server.js
├── package.json
└── README.md
