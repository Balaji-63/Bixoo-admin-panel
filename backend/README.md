# BIXOO Production Backend

This is the backend for the BIXOO project, written in FastAPI.

## Tech Stack
- Python 3
- FastAPI
- SQLAlchemy
- PyMySQL / AioMySQL
- Pydantic
- JWT (bcrypt + python-jose)
- Alembic (Migrations)
- Pytest (Testing)

## Getting Started

1. Set up a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # or venv\\Scripts\\activate on Windows
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Setup environment variables:
   Copy `.env.example` to `.env` and fill in your details.
   *(Make sure MySQL is running on localhost or update DATABASE_URL)*

4. Create the database:
   Import `schema.sql` into your MySQL server or just run `python seed.py` which will initialize and seed data for local testing.
   ```bash
   python seed.py
   ```

5. Run the server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## Development
- API documentation can be found at `http://localhost:8000/docs`.
- Check `API_DOCUMENTATION.md` for endpoint specifics.
- Check `DATABASE.md` for database schema specifics.

## Authentication
Super Admin User: `ops@bixoo.com`  Admin User: admin@bixoo.com
Password: `password`
