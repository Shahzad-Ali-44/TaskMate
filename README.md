# TaskMate

A modern, beautiful productivity app designed to help you stay organized and accomplish your goals. Built with React, TypeScript, and MongoDB for real-time task management with secure user authentication.

![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.0.4-purple?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0.3-green?style=for-the-badge&logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.18.2-black?style=for-the-badge&logo=express)

##  Features

### **Core Functionality**
- **User Authentication**: Secure signup and login with JWT tokens
- **Task Management**: Create, edit, and delete tasks with ease
- **Progress Tracking**: Real-time progress visualization with beautiful charts
- **Task Completion**: Mark tasks as complete with smooth animations
- **Statistics Dashboard**: View total tasks, completed tasks, and progress percentage

### **User Experience**
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful UI**: Modern gradient backgrounds and smooth animations
- **Real-time Updates**: Instant updates with custom API
- **Toast Notifications**: Interactive notifications for all user actions

### **Technical Features**
- **TypeScript**: Full type safety and better development experience
- **Custom Backend**: Express.js API with MongoDB database
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Modern Stack**: React 19, Vite, Tailwind CSS 4
- **PWA Ready**: Progressive Web App capabilities
- **SEO Optimized**: Meta tags and structured data for better discoverability

##  Tech Stack

### **Frontend**
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **React Router DOM** - Client-side routing

### **Backend & Database**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### **UI Components**
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful component library
- **Class Variance Authority** - Component variant management

### **Development Tools**
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Nodemon** - Development server auto-restart

##  Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shahzad-Ali-44/TaskMate
   cd TaskMate
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

4. **Environment Variables**
   
   **Frontend** - Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
   
   **Backend** - Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskmate
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   API_URL=http://localhost:5000
   ```

5. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

6. **Start the frontend development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173`

##  Usage

### **Authentication**
- **Sign Up**: Create a new account with your name, email and password
- **Sign In**: Login with your existing credentials
- **Forgot Password**: Reset your password 
- **Logout**: Securely logout from your account
- **User Isolation**: Each user can only access their own tasks

### **Adding Tasks**
- Type your task in the input field
- Press Enter or click "Add Task"
- Tasks are automatically saved to your personal database

### **Managing Tasks**
- **Complete**: Click the circle button next to any task
- **Delete**: Click the trash icon to remove a task
- **Progress**: View your completion percentage in real-time
- **Scrollable List**: Scroll through tasks when you have many

### **Theme Switching**
- Click the theme toggle button in the top-right corner
- Choose between light, dark, or system preference


##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT [LICENSE](LICENSE).

##  Author

**Shahzad Ali**
- Portfolio: [shahzadali.vercel.app](https://shahzadali.vercel.app)
- LinkedIn: [Shahzad Ali](https://www.linkedin.com/in/shahzad-ali-8817632ab)



**TaskMate** - Stay organized, stay productive! 🎯