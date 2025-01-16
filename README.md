# Status Page Application

Status-Page-App is a web application designed to provide real-time status updates and monitor the performance of various services. The application allows users to view the current status, historical data, and any incidents affecting the services. 

## Purpose

The main purpose of this project is to offer an easy-to-use platform for tracking the uptime and reliability of services. It aims to help organizations and developers quickly identify and address issues, improving overall service reliability and user experience.

## Background

Monitoring the status of services is crucial for maintaining high availability and performance. Status-Page-App simplifies this process by providing a centralized dashboard to track multiple services, display outages, and communicate with users about ongoing issues.

![Status Page Screenshot](https://github.com/user-attachments/assets/f6cf4e86-0de8-4687-92e9-e64e43767273)


## Features

- 🔐 **User Authentication**: Secure login and registration system
- 🚦 **Service Management**: Create, update, and delete services with real-time status updates
- 🔍 **Incident Tracking**: Create and manage incidents tied to specific services
- ⚡ **Real-time Updates**: WebSocket integration for live status changes
- 🌐 **Public Status Page**: View system status without authentication
- 📧 **Email Notifications**: Subscribe to status updates
- 📊 **Uptime Monitoring**: Track and display service uptime metrics
- 🔄 **REST API**: External status check endpoints

## Tech Stack

### Frontend
- React
- Vite
- TailwindCSS
- ShadcnUI
- Socket.io Client
- Recharts

### Backend
- Python Flask
- Flask-SQLAlchemy
- Flask-Security
- Flask-SocketIO
- Flask-Mail
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js
- Python 3.8+
- PostgreSQL/SQLite

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kkaushal777/Status-Page-App.git
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

3. Configure environment variables:
Create a `.env` file in the backend directory:
```env
DATABASE_URL=sqlite:///db.sqlite3 #for simplicity
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

4. Set up the frontend:
```bash
cd frontend
npm install
```

### Application View
<img width="574" alt="dashboard" src="https://github.com/user-attachments/assets/64757218-f6c0-4fa5-8844-87fa59fa1c68" />
<img width="565" alt="service_mgm" src="https://github.com/user-attachments/assets/406bec5d-42d7-4347-8ee6-997ed1f0d785" />

### Running the Application

1. Start the backend server:
```bash
cd backend
flask run


```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

## API Documentation

### Public Endpoints

- `GET /api/v1/health`: Health check endpoint
- `GET /api/v1/services/status`: Get all services status
- `GET /api/v1/services/{id}/status`: Get specific service status

### Protected Endpoints (requires authentication)

- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
- `GET /api/services`: Get all services
- `POST /api/services`: Create new service
- `PUT /api/services/{id}`: Update service
- `DELETE /api/services/{id}`: Delete service

### Important Links

- **Check out our live demo**: [Status Page App Demo](https://status-page-ead5m5fip-kaushal-kishores-projects-b81830f3.vercel.app/)
```bash
Note: It might take 1-2 minutes for the application to load data, as the free server may need to restart if it has been inactive. Kindly refresh it.
```
- **Dummy Login**
```bash
Username : admin1@plivo.com
password : plivo123
```
- **Video Demo**: [Watch it](https://drive.google.com/drive/folders/1yeZNQtB6N2Ks4MlAiWVbFLE7E5GXc5RF)


## Acknowledgments

- ShadcnUI for the component library
- Flask for the backend framework
