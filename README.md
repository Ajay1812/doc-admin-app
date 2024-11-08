# Doc Admin App

Doc Admin App is a full-stack application designed to help dentists manage patient data, appointments, treatments, and invoices efficiently. The app includes both frontend and backend components, with features such as patient management, appointment scheduling, invoicing, and password reset.

- Production URL: [Doc-admin-app](https://doc-admin.codebomb.co.in/).

## Watch Demo :

https://github.com/user-attachments/assets/e7f19fb6-6681-4786-bf67-87482c881ffb





## Table of Contents

- Project Structure
- Features
- Technologies Used
- Installation and Setup
- Usage
- License

## Project Structure

```
.
├── README.md
├── admin-client                # Frontend (React + Vite)
│   ├── dist                    # Compiled frontend files
│   ├── public                  # Public assets (logos, images)
│   ├── src
│   │   ├── assets              # Images and static assets
│   │   ├── components          # React components
│   │   ├── config.js           # Configuration file
│   │   ├── index.css           # Global styles
│   │   └── main.jsx            # Main React entry point
│   └── vite.config.js          # Vite configuration
├── known_hosts                 # SSH known hosts file for server deployment
└── server                      # Backend (Node.js + Express)
    ├── assets                  # Server-side assets (XRays, invoices)
    ├── db                      # Database configuration and connection
    ├── middlewares             # Middlewares for authentication, file uploads, and validation
    ├── public                  # Static assets served by the backend
    ├── routes                  # Express routes for API endpoints
    └── index.js                # Main server file

```

## Features

- **Patient Management:** Add, edit, and view patient details.
- **Appointment Scheduling:** Create and manage appointments.
- **Treatment Tracking:** Log treatments provided to patients.
- **Invoice Generation:** Generate and store invoices for treatments.
- **File Upload:** Support for uploading patient X-ray images.
- **Authentication:** Secure login and password reset functionality.
- **Admin Dashboard:** Access to key metrics and quick actions for efficient management.

## Technologies Used

- **Frontend:** React, Vite, Material UI
- **Backend:** Node.js, Express
- **Database:** MongoDB (configured in server/db/db.js)
- **Deployment:** AWS EC2, NGINX for reverse proxy
- **Security:** SSL Certificate (generated with Certbot), bcrypt for password hashing
- **Others:** Nodemailer for email-based password reset, Recoil for state management

## Installation and Setup

- Prerequisites
- Node.js and npm
- MongoDB instance
- AWS account (optional for deployment)

### 1. Clone the repository

```
git clone https://github.com/Ajay1812/doc-admin-app
cd doc-admin-app

```

### 2. Install dependencies

For both the frontend (admin-client) and backend (server):

```
# Frontend
cd admin-client
npm install

# Backend
cd ../server
npm install

```

### 3. Configure environment variables

Create a .env file in the server directory to store necessary configuration values, such as the MongoDB URI, JWT secret, email credentials, etc.

Example .env:

```
SECRET=<Your JWT SECRET>
MONGO_USER=<Your Mongo Username>
MONGO_PASSWORD=<Your Mongo password>
GMAIL_USER = <GMAIL_USER> # For Nodemailer to send mails
GMAIL_PASS = <GMAIL_PASS>
```

### 4. Run the Application

#### Frontend

In the admin-client directory, start the development server:

```
npm run dev
```

#### Backend

In the server directory, start the backend server:

```
npm start
```

By default, the backend server will run on port 3000, and the frontend on port 5173.

### 5. Build for Production

To build the frontend for production:

```
cd admin-client
npm run build
```

The production files will be in the dist directory.

### Usage

- Access the frontend at http://localhost:5173.
- Access the backend at http://localhost:3000.

### Key Frontend Components

- **Landing.jsx:** Homepage component for the application.
- **AppointmentsList.jsx:** Displays the list of scheduled appointments.
- **PatientsList.jsx:** Shows patient information with options to add/edit.
- **Dashboard.jsx:** Main admin dashboard with key metrics.
- **ForgotPassword.jsx / PasswordReset.jsx:** Components for password reset functionality.
- **Invoice Components:** Manage and display treatment invoices.

### Key Backend Routes

- **/admin:** Admin management (routes/admin.js)
- **/patients:** Manage patients, including adding and retrieving details.
- **/appointments:** Handle appointment scheduling and status updates.
- **/treatments:** CRUD operations for treatments.
- **/invoices:** Invoice generation and management.
- **/auth:** Authentication routes for login, signup, and password reset.

### License

This project is licensed under the MIT License.
