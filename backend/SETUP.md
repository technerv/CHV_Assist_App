# Backend Setup Guide

## Quick Start

1. **Activate the virtual environment:**
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Run migrations (if needed):**
   ```bash
   python manage.py migrate
   ```

3. **Create a superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

4. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

## Important Notes

- **Always activate the virtual environment** before running Django commands
- The virtual environment is located at `backend/venv/`
- If you see "ImportError: Couldn't import Django", make sure the virtual environment is activated
- The database (SQLite) is automatically created at `backend/db.sqlite3`

## API Endpoints

- Admin: `http://localhost:8000/admin/`
- API Root: `http://localhost:8000/api/`
- Auth Token: `http://localhost:8000/api/auth/token/`

## Troubleshooting

If you encounter issues:
1. Make sure you're in the `backend` directory
2. Activate the virtual environment: `source venv/bin/activate`
3. Verify Django is installed: `python -c "import django; print(django.get_version())"`
