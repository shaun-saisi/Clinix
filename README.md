# Clinix Health Management System
*A full-stack healthcare management solution*

## Features
- Doctor registration and authentication
- Patient (client) management
- Health program creation
- Patient enrollment tracking
- Responsive React frontend
- RESTful Django backend

## Technology Stack
- **Frontend**: React, React Router, Axios
- **Backend**: Django REST Framework, JWT Authentication
- **Database**: SQLite (development)

## Project Structure
Clinix/
├── backend/ # Django backend
│ ├── clinix_backend/ # Project root
│ └── requirements.txt # Python dependencies
└── frontend/ # React frontend
└── clinix_frontend/ # React app

## Installation

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# OR venv\Scripts\activate (Windows)

pip install -r requirements.txt
cd clinix_backend
cd health 
pip install -r requirements.txt

python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver


cd frontend/clinix_frontend
npm install
npm start


API Endpoints (Base URL: http://127.0.0.1:8000/api)
Authentication
Endpoint	Method	Description
/token/	POST	Obtain JWT tokens
/doctor/register/	POST	Register new doctor
Doctors
Endpoint	Method	Description
/doctor/me/	GET	Current doctor profile
/doctors/	GET, POST	List/Create doctors
/doctors/{id}/	GET, PUT, PATCH, DELETE	Doctor CRUD
Clients
Endpoint	Method	Description
/clients/	GET, POST	List/Create clients
/clients/{id}/	GET, PUT, PATCH, DELETE	Client CRUD
/clients/{id}/profile/	GET	Client profile
Programs
Endpoint	Method	Description
/programs/	GET, POST	List/Create programs
/programs/{id}/	GET, PUT, PATCH, DELETE	Program CRUD
Enrollments
Endpoint	Method	Description
/enrollments/	GET, POST	List/Create enrollments
/enrollments/{id}/	GET, PUT, PATCH, DELETE	Enrollment CRUD