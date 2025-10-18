# Backend 

## Overview
This folder contains the **backend** of the **Aruma** project — a platform that connects artisans with clients to send requests and manage contracts.  
The first version (MVP) is built with **FastAPI** and uses a simple **JSON file** as storage.

---

- Python 3.11+  
- pip (Python package manager)  
- Virtual environment (recommended: `venv`)  

---

## Project Structure
```
backend/
│── db.json                # Simple database (MVP)
│── main.py                # FastAPI entry point
│
├── core/
│   ├── config.py          # Project settings (SECRET_KEY, etc.)
│   └── security.py        # Encryption + JWT
│
├── storage/
│   └── json_repo.py       # CRUD functions for db.json
│
├── routers/
│   ├── auth.py            # Authentication routes (artisan + client)
│   ├── artisans.py        # Artisan management (profile, update)
│   ├── clients.py         # Client management (send requests)
│   ├── requests.py        # Request routes (send, accept/reject)
│   └── contracts.py       # Contract routes (terms, confirm, complete)
│
└── schemas/
    ├── users.py           # Schemas for Artisan + Client + Token
    ├── requests.py        # Schemas for Requests
    └── contracts.py       # Schemas for Contracts
```

---

## Installation & Setup

1. Clone the repository and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv .venv
   ```

3. Activate the environment:
   - On Windows (PowerShell):
     ```bash
     .venv\Scripts\Activate
     ```
   - On macOS/Linux:
     ```bash
     source .venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install fastapi "uvicorn[standard]" pydantic python-dotenv passlib[bcrypt] PyJWT
   ```

5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

---

## API Documentation
Once the server is running, you can access:
- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)  
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)  

---

## Features (MVP)

### Authentication
- Artisan register/login  
- Client register/login  
- JWT-based authentication  

### Artisan Management
- Public artisan profile  
- Update artisan profile (protected)  
- Track completed work count  

### Client Management
- Send requests to artisans  
- (Future) Get client profile  

### Requests
- Client sends request → Artisan accepts/rejects  
- Request status: `pending`, `accepted`, `rejected`  

### Contracts
- Artisan sets cost + timeframe when accepting a request  
- Client accepts/rejects terms  
- Artisan marks contract as completed  

### Storage Layer
- **MVP:** JSON file (`db.json`)  
- **Future:** MongoDB / PostgreSQL  

---
