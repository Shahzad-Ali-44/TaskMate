# TaskMate

A modern, feature-rich productivity app designed to help you stay organized and accomplish your goals. Built with React 19, TypeScript, and MongoDB for real-time task management with secure user authentication, drag-and-drop functionality, and advanced task organization.

![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.0.4-purple?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0.3-green?style=for-the-badge&logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.18.2-black?style=for-the-badge&logo=express)

##  Features

### **Core Functionality**
- **User Authentication**: Secure signup, login, and password reset with JWT tokens
- **Advanced Task Management**: Create, edit, delete, and organize tasks with drag-and-drop
- **Task Status Management**: Three-column Kanban board (Pending, Ongoing, Completed)
- **Real-time Progress Tracking**: Live progress visualization with circular progress indicators
- **Task Search**: Search functionality within each task column
- **Statistics Dashboard**: Comprehensive overview of total, completed tasks, and progress percentage

### **Advanced Task Organization**
- **Drag & Drop Interface**: Intuitive drag-and-drop for task reordering and status changes
- **Task Status Transitions**: Seamlessly move tasks between Pending, Ongoing, and Completed states
- **Visual Task Indicators**: Color-coded borders and icons for different task statuses
- **Task Priority System**: Support for high, medium, and low priority tasks with visual indicators
- **Responsive Task Cards**: Beautiful, interactive task cards with hover effects

### **User Experience**
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, gradient backgrounds with smooth animations and transitions
- **Real-time Updates**: Instant updates with custom REST API
- **Interactive Notifications**: Toast notifications for all user actions with custom styling
- **Loading States**: Beautiful loading indicators and disabled states

### **Authentication & Security**
- **Secure Registration**: User signup with email validation and password confirmation
- **JWT Authentication**: Token-based authentication with 7-day expiration
- **Password Reset**: Secure password reset functionality with email verification
- **User Isolation**: Each user can only access their own tasks
- **Password Hashing**: Bcrypt with salt rounds for secure password storage

### **Technical Features**
- **TypeScript**: Full type safety and enhanced development experience
- **Custom Backend API**: Express.js REST API with MongoDB database
- **Modern React Patterns**: React 19 with hooks, context, and functional components
- **State Management**: React Context for authentication and global state
- **API Client**: Centralized API client with error handling and token management
- **Component Library**: Custom UI components built with Radix UI primitives

##  Tech Stack

### **Frontend**
- **React 19.1.0** - Latest React with concurrent features and hooks
- **TypeScript 5.8.3** - Type-safe development with strict mode
- **Vite 7.0.4** - Fast build tool and development server
- **Tailwind CSS 4.1.11** - Utility-first CSS framework with modern features
- **Lucide React 0.536.0** - Beautiful, customizable icons
- **React Hot Toast 2.5.2** - Toast notifications with custom styling
- **React Router DOM 7.9.4** - Client-side routing and navigation

### **Drag & Drop & UI Interactions**
- **@dnd-kit/core 6.3.1** - Accessible drag and drop functionality
- **@dnd-kit/sortable 10.0.0** - Sortable list components
- **@dnd-kit/utilities 3.2.2** - Utility functions for drag and drop

### **Backend & Database**
- **Node.js** - JavaScript runtime environment
- **Express.js 4.18.2** - Web application framework
- **MongoDB 8.0.3** - NoSQL document database
- **Mongoose 8.0.3** - MongoDB object modeling for Node.js
- **JWT 9.0.2** - JSON Web Tokens for secure authentication
- **Bcryptjs 2.4.3** - Password hashing with salt rounds
- **CORS 2.8.5** - Cross-origin resource sharing middleware

### **UI Components & Styling**
- **Radix UI** - Accessible, unstyled component primitives
  - @radix-ui/react-dropdown-menu 2.1.15
  - @radix-ui/react-progress 1.1.7
  - @radix-ui/react-slot 1.2.3
- **Class Variance Authority 0.7.1** - Component variant management
- **clsx 2.1.1** - Utility for constructing className strings
- **tailwind-merge 3.3.1** - Merge Tailwind CSS classes without conflicts

### **Development Tools**
- **ESLint 9.30.1** - Code linting and quality assurance
- **TypeScript ESLint 8.35.1** - TypeScript-specific linting rules
- **Nodemon 3.0.2** - Development server auto-restart
- **tw-animate-css 1.3.6** - Tailwind CSS animation utilities

##  Getting Started

### Prerequisites
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **npm or yarn** - Package manager (npm comes with Node.js)
- **MongoDB** - Local installation or MongoDB Atlas cloud database

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
   
   **Backend** - Create a `.env` file in the `server` directory (copy from `env.example`):
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
   The server will start on `http://localhost:5000`

6. **Start the frontend development server** (in a new terminal)
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

7. **Open your browser**
   Navigate to `http://localhost:5173` and start using TaskMate!



##  Contributing

We welcome contributions to TaskMate! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and test thoroughly
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request** with a detailed description



##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Author

**Shahzad Ali**
-  Portfolio: [shahzadali.vercel.app](https://shahzadali.vercel.app)
-  LinkedIn: [Shahzad Ali](https://www.linkedin.com/in/shahzad-ali-8817632ab)


**TaskMate** - Stay organized, stay productive! 
