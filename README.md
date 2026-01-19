# Community Health Volunteer Management System

A comprehensive system for managing Community Health Volunteers (CHVs) across all 47 counties in Kenya. This application empowers CHVs to deliver quality healthcare services to communities through efficient data management, visit tracking, and referral systems.

## Features

### Core Functionality
- **CHV Management**: Register and manage Community Health Volunteers with location tracking
- **Household Management**: Track households with detailed location information
- **Member Management**: Manage community members with health records
- **Facility Management**: Register and manage healthcare facilities
- **Visit Tracking**: Record and track CHV visits to households
- **Pregnancy Tracking**: Monitor pregnancies with ANC visit tracking
- **Referral Management**: Manage referrals to healthcare facilities
- **Reminder System**: Automated reminders for health activities
- **Message Logging**: Track all communications across multiple channels

### Kenyan-Specific Features
- **47 Kenyan Counties**: Full support for all 47 counties with sub-county, ward, and village tracking
- **M-Pesa Integration**: M-Pesa number fields for CHVs, members, and facilities
- **Kenyan Phone Number Validation**: Automatic validation for Kenyan phone numbers
- **Kenyan National ID**: Support for 8-digit Kenyan National ID validation
- **NHIF Integration**: NHIF membership number tracking
- **Kenyan Healthcare Facility Types**: Pre-configured facility types
- **Africa/Nairobi Timezone**: All timestamps use Kenya's timezone

## Technology Stack

### Backend
- **Django 5.0.6**: Python web framework
- **Django REST Framework**: API development
- **SQLite**: Database (can be configured for PostgreSQL in production)
- **JWT Authentication**: Secure API authentication
- **Django CORS Headers**: Cross-origin resource sharing

### Frontend
- **React 18.3.1**: UI framework
- **Material-UI (MUI)**: Component library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Vite**: Build tool

## Project Structure

```
CHV_Assist_App/
├── backend/
│   ├── config/          # Django project settings
│   ├── chv/             # CHV management app
│   │   ├── models.py    # Database models
│   │   ├── views.py     # API views
│   │   ├── serializers.py
│   │   └── admin.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/token/` - Obtain JWT token
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Resources
- `/api/chvs/` - CHV management
- `/api/households/` - Household management
- `/api/members/` - Community members
- `/api/facilities/` - Healthcare facilities
- `/api/visits/` - Visit records
- `/api/pregnancies/` - Pregnancy tracking
- `/api/referrals/` - Referral management
- `/api/reminders/` - Reminder system
- `/api/message-logs/` - Communication logs

## Usage

### Adding a CHV
1. Navigate to CHVs → Add CHV
2. Enter full name, phone number, and location details
3. Optionally add M-Pesa number and email
4. Select county from dropdown
5. Enter sub-county, ward, and service area
6. Click "Create CHV"

### Recording a Visit
1. Navigate to Visits → Record Visit
2. Select CHV, household, and optionally a member
3. Enter visit date and purpose
4. Add observations and recommendations
5. Mark if follow-up is required
6. Click "Record Visit"

### Creating a Referral
1. Navigate to Referrals → Create Referral
2. Select member and facility
3. Enter reason for referral
4. Set priority (routine, urgent, or emergency)
5. Click "Create Referral"

## Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Database

The app uses SQLite by default. For production, configure PostgreSQL in `backend/config/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'chv_db',
        'USER': 'your_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## Development

### Running Tests
```bash
cd backend
python manage.py test
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

Backend:
```bash
cd backend
python manage.py collectstatic
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.

---

**Empowering Community Health Volunteers across all 47 counties in Kenya to deliver quality healthcare services to communities.**
