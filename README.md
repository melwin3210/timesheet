# Timesheet Management System

A modern web application for task assignment and timesheet tracking built with Next.js, Redux Toolkit, and JSON Server.

## 🚀 Features

- **Role-based Authentication**: Manager and Associate roles with different permissions
- **Task Management**: Managers can create and assign tasks to associates
- **Timesheet Tracking**: Associates can log hours against assigned tasks
- **Real-time Updates**: Live data synchronization using Redux state management
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Form Validation**: Client-side validation using Formik and Zod

## 🏗️ System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **State Management**: Redux Toolkit for global state
- **Styling**: Tailwind CSS for responsive design
- **Forms**: Formik with Zod validation
- **Testing**: Jest with React Testing Library

### Backend Architecture
- **Mock API**: JSON Server for development
- **Data Storage**: JSON file-based database
- **Authentication**: Simple credential-based auth


## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd timesheet
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the JSON Server (Backend)
```bash
npm run json-server
```
This starts the mock API server on `http://localhost:3001`

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser

### 5. Build for Production
```bash
npm run build
npm start
```

## 👥 User Accounts

### Manager Account
- **Username**: `manager`
- **Password**: `manager123`
- **Permissions**: Create tasks, assign to associates, view all timesheets

### Associate Accounts
- **Username**: `associate1` | **Password**: `associate123`
- **Username**: `associate2` | **Password**: `associate123`
- **Username**: `melwin` | **Password**: `123123`
- **Permissions**: View assigned tasks, submit timesheets

### New User Registration
Associates can create new accounts through the signup form.

## 🔄 User Flows

### Manager Workflow
1. **Login** → Enter manager credentials
2. **Dashboard** → Redirected to task assignment page
3. **Create Task** → Fill task details (description, hours, assignee, date)
4. **Manage Tasks** → View all created tasks
5. **Review Timesheets** → Monitor associate time submissions

### Associate Workflow
1. **Login/Signup** → Authenticate or create account
2. **Dashboard** → View assigned tasks and timesheet summary
3. **Submit Timesheet** → Log actual hours for completed tasks
4. **Track Progress** → Monitor submitted vs pending timesheets

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📱 API Endpoints

The JSON Server provides RESTful endpoints:

- `GET/POST /users` - User management
- `GET/POST /tasks` - Task operations
- `GET/POST /timesheets` - Timesheet tracking

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time input validation

## 🔧 Configuration Files

- `next.config.mjs` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS setup
- `jest.config.js` - Testing configuration
- `eslint.config.mjs` - Code linting rules

## 📦 Dependencies

### Core Dependencies
- `next` - React framework
- `react` & `react-dom` - UI library
- `@reduxjs/toolkit` - State management
- `react-redux` - React-Redux bindings
- `formik` - Form handling
- `zod` - Schema validation

### Development Dependencies
- `tailwindcss` - CSS framework
- `jest` - Testing framework
- `eslint` - Code linting
- `json-server` - Mock API server



## 📄 License

This project is for educational/demonstration purposes.


