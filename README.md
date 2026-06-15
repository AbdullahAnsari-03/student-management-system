# Student Management System

A full-stack Student Management System built using the MERN ecosystem (React.js, Node.js, Express.js) with PostgreSQL as the database. The application allows administrators to manage student records, upload profile photos, track activities, perform searches and filtering, and view analytics through a clean dashboard interface.

## Features

### Student Management

* Add new students with auto-generated admission numbers
* View all student records
* Update student details
* Delete student records with confirmation
* Upload and manage student profile photos

### Search & Filtering

* Search students by name
* Filter students by course
* Filter students by academic year
* Real-time results

### Pagination

* Server-side pagination
* Previous and Next navigation
* Efficient data loading

### Activity Logging

* Logs student creation, updates, and deletions
* Displays recent activities
* Auto-refreshes when changes occur

### Dashboard Analytics

* Total Students
* Total Courses
* Total Activities
* Students by Course
* Gender Distribution
* Registration Trends

### User Interface

* Responsive design using Tailwind CSS
* Modern dashboard layout
* Real-time updates
* Clean and intuitive user experience

---

## Tech Stack

### Frontend

* React.js
* Axios
* Tailwind CSS
* Lucide React

### Backend

* Node.js
* Express.js
* Multer

### Database

* PostgreSQL
* Neon PostgreSQL (Production)

### Deployment

* Frontend: Vercel
* Backend: Render

---

## Project Structure

```text
student-management-system
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── uploads
│   ├── package.json
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── services
│   │   └── assets
│   ├── public
│   └── package.json
│
└── .gitignore
```

---

## Database Schema

### Students Table

| Column           | Type                |
| ---------------- | ------------------- |
| id               | SERIAL PRIMARY KEY  |
| admission_number | VARCHAR(20) UNIQUE  |
| name             | VARCHAR(100)        |
| course           | VARCHAR(100)        |
| year             | INTEGER             |
| dob              | DATE                |
| email            | VARCHAR(100) UNIQUE |
| mobile           | VARCHAR(15)         |
| gender           | VARCHAR(10)         |
| address          | TEXT                |
| photo_url        | TEXT                |
| created_at       | TIMESTAMP           |

### Activity Logs Table

| Column       | Type               |
| ------------ | ------------------ |
| id           | SERIAL PRIMARY KEY |
| action       | VARCHAR(50)        |
| student_name | VARCHAR(100)       |
| created_at   | TIMESTAMP          |

---

## Installation

### Clone Repository

```bash
git clone https://github.com/AbdullahAnsari-03/student-management-system.git
cd student-management-system
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DB_USER=your_username
DB_HOST=localhost
DB_NAME=student_management
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5000
```

Start backend server:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

### Students

| Method | Endpoint      | Description       |
| ------ | ------------- | ----------------- |
| GET    | /students     | Get all students  |
| GET    | /students/:id | Get student by ID |
| POST   | /students     | Create student    |
| PUT    | /students/:id | Update student    |
| DELETE | /students/:id | Delete student    |

### File Upload

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| POST   | /students/upload | Upload student photo |

### Activity Logs

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| GET    | /students/logs | Get activity logs |

---

## Deployment Links

### Frontend

https://student-management-system-zeta-ruddy.vercel.app/

### Backend

https://sms-backend-6rub.onrender.com

---

## Future Enhancements

* Authentication and Authorization
* Export Student Records to Excel/PDF
* Advanced Analytics Dashboard
* Cloud Image Storage (Cloudinary/AWS S3)
* Email Notifications
* Role-Based Access Control
* Student Attendance Module

---

## Screenshots
## Dashboard:
<img width="1917" height="964" alt="image" src="https://github.com/user-attachments/assets/19e7e4e3-79ae-4c28-ac69-6655dce29748" />

## Student Detail Form:
<img width="1914" height="961" alt="image" src="https://github.com/user-attachments/assets/00f2b438-46c4-4575-bc1a-8c55d615881a" />

## Student Directory:
<img width="1911" height="973" alt="image" src="https://github.com/user-attachments/assets/e7368c61-539b-419c-aee2-fd28bbffb4ee" />

## CRUD Operations:
<img width="1916" height="957" alt="image" src="https://github.com/user-attachments/assets/ca96ef4b-247f-4723-902e-6aa97a9f1ef7" />

## Activity Log:
<img width="1917" height="900" alt="image" src="https://github.com/user-attachments/assets/c6ca6895-f370-42fd-abf1-e11ce588efd9" />

---
## Author

**Abdullah Ansari**

GitHub: https://github.com/AbdullahAnsari-03
