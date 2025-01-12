# Status Page Application

A simplified status page application similar to StatusPage or Cachet, built with React, Flask, and WebSockets. This application allows administrators to manage services and their statuses while providing a public-facing page for users to view current system status.

## Features

- **User Authentication**: Secure login and registration system
- **Service Management**: CRUD operations for services with real-time status updates
- **Incident Tracking**: Create and manage incidents tied to specific services
- **Real-time Updates**: WebSocket integration for live status changes
- **Public Status Page**: View system status without authentication
- **Email Notifications**: Subscribe to status updates
- **Uptime Monitoring**: Track and display service uptime metrics
- **REST API**: External status check endpoints

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

- **Live Demo**: [Status Page App Demo](https://status-page-ead5m5fip-kaushal-kishores-projects-b81830f3.vercel.app/)
- **Video Demo**: [Watch it](https://drive.google.com/drive/folders/1yeZNQtB6N2Ks4MlAiWVbFLE7E5GXc5RF)

## License

MIT License


## Acknowledgments

- ShadcnUI for the component library
- Flask for the backend framework
