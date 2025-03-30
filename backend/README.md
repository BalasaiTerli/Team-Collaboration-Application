# 🎯 Backend for Task Management Application

Welcome to the **Task Management API**! This is the backend of a task management application that allows users to authenticate, create, update, and manage their tasks efficiently. Built with **Node.js, Express, and MongoDB**, it ensures **secure** and **smooth** operations. 🚀

---

## ✨ Features

✔️ **User Authentication**: Secure login & registration with password hashing and JWT authentication. 🔒
✔️ **Task Management**: Perform CRUD operations on tasks with filtering & sorting. 📝
✔️ **Database Integration**: MongoDB with Mongoose for schema modeling. 🛢️
✔️ **Input Validation**: Ensures proper data entry with validation checks. ✅
✔️ **Security Measures**: Password encryption and environment variable management. 🔐

---

## 📥 Installation

### 1️⃣ Clone the repository:
```bash
 git clone <repository-url>
 cd Backend
```

### 2️⃣ Install dependencies:
```bash
npm install
```

### 3️⃣ Set up environment variables:
Create a `.env` file in the root directory and add the following:
```ini
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=8000
```

---

## 🔗 API Endpoints

### 🔐 Authentication Routes (`/auth`)

#### ✅ **POST** `/auth/register` - Register a new user
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "role": "member"
}
```

#### 🔑 **POST** `/auth/login` - Login an existing user
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

---

### 📌 Task Routes (`/tasks`)

#### ➕ **POST** `/tasks/add` - Add a new task
**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2023-12-31",
  "userId": "user-id"
}
```

#### 📋 **GET** `/tasks` - Get all tasks with filtering & sorting
**Query Parameters:**
- `status` (optional) → Filter by task status (`pending`, `in-progress`, `completed`)
- `priority` (optional) → Filter by priority (`low`, `medium`, `high`)
- `sortBy` (optional) → Sort by `dueDate` or `priority`

#### 👤 **GET** `/tasks/:userId` - Get tasks for a specific user

#### ✏️ **PUT** `/tasks/:id` - Update a task by ID
**Request Body:**
```json
{
  "title": "Updated Task Title",
  "description": "Updated Task Description",
  "status": "completed",
  "priority": "high",
  "dueDate": "2023-12-31"
}
```

#### ❌ **DELETE** `/tasks/:id` - Delete a task by ID

---

## 🛠️ Dependencies

📦 **Express** - Web framework for building APIs.
📦 **Mongoose** - MongoDB object modeling.
📦 **bcryptjs** - Password hashing.
📦 **jsonwebtoken** - JWT authentication.
📦 **dotenv** - Manage environment variables.
📦 **cors** - Enable cross-origin resource sharing.

---

## 💡 Contributing
Got ideas? Found a bug? Feel free to contribute! 🤝

📬 **Contact**: balasaiterli754@gmail.com



