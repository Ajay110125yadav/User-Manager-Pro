# 🚀 User-Manager-Pro  
A powerful production-ready backend system built using **Node.js**, **Express.js**, **MongoDB**, **JWT Authentication**, **Redis Caching**, **Role-Based Access**, **Advanced Security**, **Logging**, and **Clean Modular Architecture**.

This project includes Authentication, Authorization, Posts, Comments, Courses, Enrollments, Admin Controls, File Uploads, Email Sending, and more.

---

# 📁 Folder Structure

```
user-manager-pro/

│── config/
│   ├── config.js
│   ├── db.js
│
│── controllers/
│   ├── authController.js
│   ├── commentController.js
│   ├── postController.js
│   ├── userController.js
│
│── middleware/
│   ├── authMiddleware.js
│   ├── cache.js
│   ├── errorHandler.js
│   ├── isAdmin.js
│   ├── logger.js
│   ├── roleMiddleware.js
│   ├── upload.js
│
│── models/
│   ├── Comment.js
│   ├── Course.js
│   ├── Enrollement.js
│   ├── Post.js
│   ├── Student.js
│   ├── UserModel.js
│
│── routes/
│   ├── AdminRoutes.js
│   ├── authRoutes.js
│   ├── commentRoutes.js
│   ├── enrollmentRoutes.js
│   ├── postRoutes.js
│   ├── uploadRotes.js
│   ├── userRoutes.js
│
│── uploads/
│
│── utils/
│   ├── logger.js
│   ├── redis.js
│   ├── sendEmail.js
│
│── access.log
│── combined.log
│── error.log
│── seedAdmin.js
│── server.js
│── package.json
│── package-lock.json
│── .env
```

---

# 🔥 Features Included (Day 1–19 + Advanced)

### ✔ 1. Node.js Basic Server Setup  
### ✔ 2. Express Routes + Middleware  
### ✔ 3. REST API CRUD (Users / Posts / Comments / Courses / Enrollments)  
### ✔ 4. MVC Controller Architecture  
### ✔ 5. MongoDB Connection + Schema Modeling  
### ✔ 6. Mongoose Validation & Hooks  
### ✔ 7. Advanced Error Handling  
### ✔ 8. JWT Authentication  
### ✔ 9. Role-Based Access (Admin/User/Teacher/Student)  
### ✔ 10. File Uploads (multer)  
### ✔ 11. Pagination & Sorting  
### ✔ 12. Database Relations (populate)  
### ✔ 13. Admin Features (seed admin + admin routes)  
### ✔ 14. Password Reset via Email (sendEmail.js)  
### ✔ 15. Security: Helmet, CORS, XSS Clean, Rate Limiting  
### ✔ 16. Redis Caching (+ Cache Invalidation)  
### ✔ 17. Deployment Basics (Render, Vercel, Railway)  
### ✔ 18. Logging System (Morgan + Winston)  
### ✔ 19. Environment Setup (.env + config.js)  

---

# 🔐 Authentication (JWT)

### **Register**
```
POST /api/auth/register
```

### **Login**
```
POST /api/auth/login
```

### Returns:
- JWT Token  
- User Info  
- Role  
- Email  

---

# 👤 User Routes
| Method | Route | Description |
|--------|--------|-------------|
| GET | `/api/users/me` | Get logged-in user |
| PATCH | `/api/users/update` | Update profile |
| GET | `/api/users/` | Admin only: Get all users |

---

# 📝 Post Routes
| Method | Route | Description |
|--------|--------|-------------|
| POST | `/api/posts` | Create Post |
| GET | `/api/posts` | Get All Posts (Redis Cached) |
| GET | `/api/posts/:id` | Get Single Post |
| PATCH | `/api/posts/:id` | Update Post |
| DELETE | `/api/posts/:id` | Delete Post |

---

# 💬 Comment Routes
| Method | Route | Description |
|--------|--------|-------------|
| POST | `/api/comments/:postId` | Add Comment |
| DELETE | `/api/comments/:id` | Delete Comment |

---

# 🎓 Course & Enrollment Routes
| Method | Route | Description |
|--------|--------|-------------|
| POST | `/api/courses` | Admin: create course |
| GET | `/api/courses` | Get all courses |
| POST | `/api/enrollment/:courseId` | Student enroll |
| GET | `/api/enrollment/my` | My enrolled courses |

---

# 📤 Upload Routes
| Method | Route | Description |
|--------|--------|-------------|
| POST | `/api/upload/avatar` | Upload profile image |
| POST | `/api/upload/file` | Upload file/document |

---

# ✉ Email Support
`utils/sendEmail.js` supports:

✔ OTP  
✔ Password Reset  
✔ Admin Notifications  

---

# 🚨 Security Features

| Feature | Purpose |
|---------|----------|
| Helmet | Set secure headers |
| CORS | Allow API access |
| XSS Clean | Sanitize input |
| Rate limiter | Prevent spam/DoS |
| JWT | Secure auth |
| bcrypt | Password hashing |

---

# 📊 Logging System (Morgan + Winston)

### **access.log**
All requests

### **combined.log**
Info logs

### **error.log**
Errors + crashed routes

---

# ⚙️ `.env` File Example

```
MONGO_URI=mongodb://localhost:27017/user-manager-pro
PORT=5000
JWT_REFRESH_SECRET=myrefreshsecretkey123
NODE_ENV=development
JWT_SECRET=secret123
CLIENT_URL=http://localhost:3000
```

---

# 🚀 Run Locally

### 1️⃣ Install dependencies  
```
npm install
```

### 2️⃣ Run server  
```
npm run dev
```

Server:  
```
http://localhost:5000
```

---

Just tell me bhai! 🙌

