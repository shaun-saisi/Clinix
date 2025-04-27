# Clinix - Health Information Management System

![Clinix Dashboard](frontend/public/images/clinix-preview.png)

Clinix is a comprehensive Health Management System (HMS) designed to streamline patient management and health program tracking. Built with Django REST Framework (backend) and React (frontend), the system empowers healthcare professionals to efficiently manage client data and program enrollments.

**Live Application**: http://143.198.21.25/  
**API Documentation**: http://143.198.21.25/swagger/  
**GitHub Repository**: https://github.com/shaun-saisi/Clinix  
**Base API URL**: http://127.0.0.1:8000/api

## Application Screenshots and Features

### 1. Clinix Landing Page
![Landing Page](Screenshot%20from%202025-04-27%2018-02-34.png)
- Professional introduction to the HMS
- Clear value proposition for healthcare professionals

### 2. Doctor Dashboard
![Dashboard](Screenshot%20from%202025-04-27%2018-03-27.png)
- Personalized welcome with doctor's specialization
- Quick statistics overview

### 3. Client Management
![Client Management](Screenshot%20from%202025-04-27%2018-03-44.png)
- Search functionality for clients
- List view with key client information

### 4. Client Profile
![Client Profile](Screenshot%20from%202025-04-27%2018-03-59.png)
- Detailed personal information
- Program enrollment management

### 5. Health Programs
![Programs List](Screenshot%20from%202025-04-27%2018-04-10.png)
- Searchable list of health programs
- Program cards with essential details

### 6. Program Detail View
![Program Details](Screenshot%20from%202025-04-27%2018-04-25.png)
- Complete program information
- Enrolled client management

## Complete API Endpoints

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/token/` | POST | Obtain JWT tokens |
| `/doctor/register/` | POST | Register new doctor |

### Clients
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/clients/` | GET | List all clients |
| `/clients/` | POST | Create new client |
| `/clients/{id}/` | GET | Get client details |
| `/clients/{id}/` | PUT | Update client |
| `/clients/{id}/` | PATCH | Partial client update |
| `/clients/{id}/` | DELETE | Delete client |
| `/clients/{id}/profile/` | GET | Get full client profile |

### Doctors
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/doctor/me/` | GET | Get current doctor profile |
| `/doctors/` | GET | List all doctors |
| `/doctors/` | POST | Create new doctor |
| `/doctors/{id}/` | GET | Get doctor details |
| `/doctors/{id}/` | PUT | Update doctor |
| `/doctors/{id}/` | PATCH | Partial doctor update |
| `/doctors/{id}/` | DELETE | Delete doctor |

### Programs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/programs/` | GET | List all programs |
| `/programs/` | POST | Create new program |
| `/programs/{id}/` | GET | Get program details |
| `/programs/{id}/` | PUT | Update program |
| `/programs/{id}/` | PATCH | Partial program update |
| `/programs/{id}/` | DELETE | Delete program |

### Enrollments
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/enrollments/` | GET | List all enrollments |
| `/enrollments/` | POST | Create new enrollment |
| `/enrollments/{id}/` | GET | Get enrollment details |
| `/enrollments/{id}/` | PUT | Update enrollment |
| `/enrollments/{id}/` | PATCH | Partial enrollment update |
| `/enrollments/{id}/` | DELETE | Delete enrollment |

## Technology Stack

### Backend
- **Framework**: Django 4.1 + Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **API Docs**: drf-yasg (Swagger/OpenAPI)

### Frontend
- **Framework**: React 18
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context API

## Installation Guide

```bash
# Backend
git clone https://github.com/shaun-saisi/Clinix.git
cd Clinix/backend
pipenv install
python manage.py migrate
python manage.py runserver

# Frontend
cd ../frontend
npm install
npm start
Deployment
Current production deployment:

Ubuntu 20.04 server

Nginx web server

Gunicorn application server

Accessible at: http://143.198.21.25/

License
MIT License

Contact
Shaun Saisi
GitHub: @shaun-saisi
Email: your-email@example.com