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






# 🌟 Frontend for Task Management Application

This is the **frontend** of a task management application. It provides a user-friendly interface for managing tasks, including authentication, task creation, and task visualization in both list and calendar views. Built with **React**, **Tailwind CSS**, and **React Router**, it ensures a seamless user experience. 🚀

---

## ✨ Features

✅ **User Authentication**: Login and registration functionality. 🔑  
✅ **Task Management**: Add, edit, delete, and view tasks in list or calendar views. 📝  
✅ **Responsive Design**: Built with Tailwind CSS for a modern and responsive UI. 📱  
✅ **Role-Based Access**: Supports roles like `admin` and `member`. 🏷️  
✅ **API Integration**: Communicates with the backend for real-time task updates. 🔄  

## 📥 Installation

### 1️⃣ Clone the repository:
```bash
 git clone <repository-url>
 cd frontend
```

### 2️⃣ Install dependencies:
```bash
 npm install
```

### 3️⃣ Start the development server:
```bash
 npm start
```

The application will be available at: **[http://localhost:3000](http://localhost:3000)** 🌍

---

## 🌐 API Integration

The frontend communicates with the backend API hosted at:
```bash
 BASE_URL = http://localhost:8000
```

---

## 📜 Pages Overview

### 🔑 **Login Page (`/`)**  
✔️ Allows users to log in with their credentials.  
✔️ Stores the JWT token and user ID in local storage.  

### 📝 **Register Page (`/register`)**  
✔️ Enables new users to create an account.  

### 📋 **Dashboard Page (`/dashboard`)**  
✔️ Displays tasks in list view or calendar view.  
✔️ Allows users to:  
  🔹 Add new tasks.  
  🔹 Edit or delete existing tasks.  
  🔹 Switch between list and calendar views.  

---

## 🛠️ Dependencies

📦 **React** - JavaScript library for building user interfaces.  
📦 **React Router** - For routing and navigation.  
📦 **Axios** - For making HTTP requests to the backend API.  
📦 **Tailwind CSS** - For styling the application.  
📦 **React Big Calendar** - For calendar-based task visualization.  
📦 **Date-FNS** - For date manipulation.  

---

## 🎨 Styling

🎨 The application uses **Tailwind CSS** for styling. You can customize the styles in the `tailwind.config.js` file.  

---

## 🤝 Contributing

👨‍💻 Feel free to contribute to this project by submitting **issues** or **pull requests**.  

---

## 📬 Contact
📧 **Email:** [balasaiterli754@gmail.com](mailto:balasaiterli754@gmail.com)  

