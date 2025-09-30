<p align="center">
  <img src="https://github.com/user-attachments/assets/83d1e099-42dc-4a9c-8aeb-91e27b3ed662" width="300" />
</p>

---

# 1. User Stories
### User Stories (As an artisan)
- As an artisan, I want to register, so that I can create a profile and use the platform.
- As an artisan, I want to login, so that I can manage my profile and receive request from clients.
- As an artisan, I want to create and update my profile with details and images, so that clients can view my work.
- As an artisan, I want to accept or reject client requests, so that I can control my work.
- As an artisan, I want to create a contract when accepting a request, so that the client knows the conditions.
- As an artisan, I want to know if the client accepts the contract, so that I can start working on the request.
- As an artisan, I want to know if the client rejects the contract, so that I can accept a new request.
- As an artisan, I want to inform the client that the request has been completed, so that I can receive the client feedback.
- As an artisan, I want to receive feedback, so that I can improve my services and gain more credibility.
- As an artisan, I want completed requests to appear on my profile, so that I can build credibility with clients.

### User Stories (As a client)
- As a client, I want to register, so that I can create a profile and use the platform.
- As a client, I want to login, so that I can browse artisans’ profile.
- As a client, I want to browse artisans’ profile, so that I can discover products, workshops, and live shows.
- As a client, I want to view artisan completed requests, so that I can evaluate their work.
- As a client, I want to send a request to an artisan, so that I can buy a product or schedule a workshop or live show.
- As a client, I want to know if the artisan rejects my request, so that I can find another artisan to complete my request.
- As a client, I want to know if the artisan accepts my request, so that I can accept or reject the contract.
- As a client, I want to the artisan’s contract, so that we both agree on a clear condition.
- As a client, I want to know if the artisan completes my request, so that I can review the artisan work.
- As a client, I want to leave reviews and ratings on artisan profiles, so that I can share my experience with others.

## Must Have (MVP)

### 1. User Registration & Login
- As an **artisan**, I want to register and log in, so that I can manage my profile.  
- As a **client**, I want to register and log in, so that I can browse artisans and send requests.  

**MVP Scope:**  
Basic authentication with email and password. No social logins or advanced security required at this stage.  

**Acceptance Criteria:**  
1. Given a new user submits valid registration info  
2. When they confirm the form  
3. Then the system saves their account and redirects them to login.  

**User type page:** 
<p align="center">
<img width="800" alt="User type page" src="https://github.com/maram-ra/Aruma/blob/main/Stage%203%3A%20Technical%20Documentation/Mockups/user%20type.png" />
</p>

**Register and Login pages for artisan:** 
<p align="center">
<img width="800" alt="Register page for artisan" src="https://github.com/maram-ra/Aruma/blob/main/Stage%203%3A%20Technical%20Documentation/Mockups/artisan/Register%20Page%20for%20artisans.png" />
<img width="800" alt="Login page for artisan" src="https://github.com/maram-ra/Aruma/blob/main/Stage%203%3A%20Technical%20Documentation/Mockups/artisan/Login%20Page.png" />
</p>

**Register and Login pages for client:**  
<p align="center">
<img width="800" alt="Register page for client" src="https://github.com/maram-ra/Aruma/blob/main/Stage%203%3A%20Technical%20Documentation/Mockups/client/Register%20Page%20for%20client.png" />
<img width="800" alt="Login page for client" src="https://github.com/maram-ra/Aruma/blob/main/Stage%203%3A%20Technical%20Documentation/Mockups/client/Login%20Page.png" />
</p>

### 2. Artisan Profile
- As an **artisan**, I want to create and update my profile with details and images, so that clients can view my work.  
- As a **client**, I want to view artisan profiles, so that I can evaluate their work.  

**MVP Scope:**  
Profile includes name, bio, craft type, and images. No advanced customization or categories.  

**Acceptance Criteria:**  
1. Given an artisan logs in  
2. When they update their profile details  
3. Then the system saves the changes and updates their public profile.  

**Artisan Profile page (for artisan):**
<p align="center"><img width="800" alt="Artisan Profile page" src="https://github.com/maram-ra/Aruma/blob/main/Stage%203%3A%20Technical%20Documentation/Mockups/artisan/profilePage.png" /></p>

---

### 3. Marketplace Browsing
- As a **client**, I want to browse artisans in a marketplace, so that I can discover products, workshops, and live shows.    

**MVP Scope:**  
Simple list/grid of artisans with name, short bio, and one featured image. No filters or advanced search.  

**Acceptance Criteria:**  
1. Given I am on the marketplace page  
2. When I scroll through the list  
3. Then I can view artisan profiles with minimal details.  

**Marketplace Browsing page (for client):**
<p align="center"><img width="800" alt="Marketplace Browsing page" src="https://github.com/maram-ra/Aruma/blob/main/Stage%203%3A%20Technical%20Documentation/Mockups/client/landing%20page.png" /></p>

---

### 4. Requests
- As a **client**, I want to send a request to an artisan, so that I can collaborate with them.  
- As an **artisan**, I want to accept or reject client requests, so that I can control my work.  

**MVP Scope:**  
Request form includes type (product/workshop/live show) and a message. Artisans can accept or reject only. No messaging or chat.  

**Acceptance Criteria:**  
1. Given a client sends a request  
2. When the artisan reviews it  
3. Then they can accept or reject the request with one click.  

**Requests page (for artisan):**
<p align="center"><img width="800" alt="Requests page" src="https://github.com/maram-ra/Aruma/blob/main/Stage%203%3A%20Technical%20Documentation/Mockups/artisan/RequestsPage.png" /></p>
---

### 5. Basic Contract Flow
- As an **artisan**, I want to specify cost and timeframe when accepting a request, so that the client knows the conditions.  
- As a **client**, I want to confirm the artisan’s terms, so that we both agree on a clear contract.  
- As a **system**, I want to track request status (pending, accepted, rejected, completed).  

**MVP Scope:**  
Simple status tracking only. No legal documents or payment integration.  

**Acceptance Criteria:**  
1. Given a request is accepted  
2. When the artisan enters cost and timeframe  
3. Then the client can confirm, and the system updates the contract status.  

---

### 6. Profile Enhancement
- As an **artisan**, I want completed requests to appear on my profile, so that I can build credibility with clients.  

**MVP Scope:**  
Show a list of completed requests in the artisan profile. No ratings or reviews.  

**Acceptance Criteria:**  
1. Given an artisan marks a request as completed  
2. When the contract is closed  
3. Then the system adds this request to the artisan’s profile under “Completed Work.”  

  
---

## Notes
- **Adapt to the MVP:** Stories are scoped to the simplest working version.  
- **Collaborate Actively:** Each story is owned by one team member but reviewed collectively.  
- **Keep it Clear and Simple:** Features are described in plain language with clear acceptance criteria.


---
# 2. System Architecture

### Purpose
To illustrate how the MVP components (frontend, backend, database, and external services) interact with each other, and how data flows between them.

---

### Proposed Tech Stack for Aruma
- **Frontend:** HTML, CSS, JavaScript (basic web pages for the MVP).  
- **Backend:** Python (FastAPI) — handles API endpoints and business logic  
- **Database:** JSON file (db.json) for MVP data storage 
- **External APIs:** Not required for the MVP (future integrations may include payment gateways or identity verification).  

---

## High-Level diagrams
<p align="center">
<img alt="High-Level Architecture" src="https://github.com/user-attachments/assets/bb5a2676-9f47-4604-98b8-3e86b5089c66" />
</p>

## Flow diagrams 
<p align="center"><img alt="FlowD" src="https://github.com/maram-ra/Aruma/blob/main/Stage%203%3A%20Technical%20Documentation/Diagrams/flow%20digram.png" /></p>


## 3. Classes, and Database Design:

### 3.1.1 Artisan Class
**Purpose:** Represent artisan and handle authentication and profile management.

**Attributes:**
- `artisan_id` (int, PK)
- `name` (string)
- `email` (string, unique)
- `password` (string)
- `bio: string`
- `craftType: string`
- `images: string[]`
- `offersWorkshop: boolean`
- `offersLiveShow: boolean`
- `completedWorkCount: number`
  
**Methods:**
- `register()` – Save new user to database.
- `login()` – Authenticate user credentials.
- `update_profile()` – Update user details.
- `get_profile()` – Retrieve public profile info.

---

### 3.1.2 Client Class
**Purpose:** Represent client and handle authentication and profile management.

**Attributes:**
- `client_id` (int, PK)
- `name` (string)
- `email` (string, unique)
- `password` (string)

**Methods:**
- `register()` – Save new user to database.
- `login()` – Authenticate user credentials.
- `update_profile()` – Update user details.
- `get_profile()` – Retrieve public profile info.

---

### 3.1.3 Request Class
**Purpose:** Handle requests from clients to artisans.

**Attributes:**
- `request_id` (int, PK)
- `client_id` (int, FK to User.user_id)
- `artisan_id` (int, FK to User.user_id)
- `request_type` (enum: "product", "workshop", "live_show")
- `message` (text)
- `status` (enum: "pending", "accepted", "rejected")
- `cost` (decimal, optional)
- `timeframe` (string, optional)
- `created_at`, `updated_at` (datetime)

**Methods:**
- `create_request()`
- `update_status(new_status)`
- `set_terms(cost, timeframe)`

---

### 3.1.4 Contract Class
**Purpose:** Track accepted collaboration agreements.

**Attributes:**
- `contract_id` (int, PK)
- `request_id` (int, FK to Request.request_id)
- `status` (enum: "pending", "confirmed", "completed")
- `cost` (decimal)
- `timeframe` (string)
- `created_at`, `updated_at` (datetime)

**Methods:**
- `confirm_contract()`
- `complete_contract()`

## 3.2 ER diagrams 
<p align="center"><img  alt="ERD" src="https://github.com/maram-ra/Aruma/blob/main/Stage%203%3A%20Technical%20Documentation/Diagrams/ER%20diagram-Aruma.png" /></p>

## 3.3 database schema
<p align="center">
<img alt="database schema" src="https://github.com/maram-ra/Aruma/blob/main/Stage%203%3A%20Technical%20Documentation/Diagrams/DATABASE_digram.png" /></p>

# 4. Sequence Diagrams
### 4.2 Artisan Registration
<p align="center"><img  alt="Artisan Registration" src="https://github.com/maram-ra/Aruma/blob/main/Stage%203%3A%20Technical%20Documentation/Diagrams/Artisan%20Registration%20Process.png" /></p>

### 4.2 Send a request 
<p align="center"><img  alt="Send a request" src="https://github.com/maram-ra/Aruma/blob/main/Stage%203%3A%20Technical%20Documentation/Diagrams/Client%20Sends%20Request%20to%20Artisan.png" /></p>

### 4.3 Request to contract
<p align="center"><img  alt="Request to contract" src="https://github.com/maram-ra/Aruma/blob/main/Stage%203%3A%20Technical%20Documentation/Diagrams/Request%20to%20Contract%20Flow.png" /></p>

# S1 
# 5. API Specifications

##  External APIs  

Currently, no external APIs are used in the MVP version of the project.  


##  Internal API Endpoints

###  Base URL:
```
http://localhost:3000/api/v1
```

---

###  Artisan Endpoints

| Endpoint                          | Method | Input Format | Output Format | Description                                         |
|----------------------------------|--------|---------------|----------------|-----------------------------------------------------|
| `/auth/artisan/register`         | POST   | JSON          | JSON           | Artisan registration                                |
| `/auth/artisan/login`            | POST   | JSON          | JSON + Token   | Artisan login                                       |
| `/artisan/:id`                   | GET    | URL param     | JSON           | Get artisan public profile                          |
| `/artisan/:id`                   | PUT    | JSON          | JSON           | Update artisan profile                              |
| `/artisan/:id/requests`          | GET    | URL param     | JSON           | Get all requests sent to this artisan               |
| `/artisan/:id/requests/:rid`     | PUT    | JSON          | JSON           | Accept or reject a request                          |
| `/artisan/:id/contracts/:cid`    | PUT    | JSON          | JSON           | Mark contract as complete                           |
| `/artisan/:id/completed-work`    | GET    | URL param     | JSON           | Retrieve completed work for portfolio display       |

---

###  Client Endpoints

| Endpoint                          | Method | Input Format | Output Format | Description                                         |
|----------------------------------|--------|---------------|----------------|-----------------------------------------------------|
| `/auth/client/register`          | POST   | JSON          | JSON           | Client registration                                 |
| `/auth/client/login`             | POST   | JSON          | JSON + Token   | Client login                                        |
| `/client/:id`                    | GET    | URL param     | JSON           | Get client profile                                  |
| `/client/:id/requests`           | POST   | JSON          | JSON           | Send request to artisan                             |
| `/client/:id/contracts/:cid`     | PUT    | JSON          | JSON           | Accept or reject contract terms                     |
| `/client/:id/reviews`            | POST   | JSON          | JSON           | Submit review after contract completion             |

---

###  Requests & Contracts

| Endpoint                          | Method | Input Format | Output Format | Description                                         |
|----------------------------------|--------|---------------|----------------|-----------------------------------------------------|
| `/requests/:id`                  | GET    | URL param     | JSON           | View specific request                               |
| `/requests/:id/status`           | PUT    | JSON          | JSON           | Update request status (accept/reject)               |
| `/contracts/:id`                 | GET    | URL param     | JSON           | View contract details                               |
| `/contracts/:id/terms`           | PUT    | JSON          | JSON           | Artisan sets terms (cost + timeframe)               |
| `/contracts/:id/confirm`         | PUT    | JSON          | JSON           | Client confirms contract                            |
| `/contracts/:id/complete`        | PUT    | JSON          | JSON           | Artisan marks contract as completed                 |

---

##  Sample Request/Response Formats

###  Artisan Registration

**POST** `/auth/artisan/register`

```json
Request:
{
  "name": "Nour AlSami",
  "email": "nour@crafts.com",
  "password": "secure123"
}

Response:
{
  "message": "Artisan registered successfully",
  "artisan_id": "art123"
}
```

---

###  Send a Request

**POST** `/client/cli123/requests`

```json
Request:
{
  "artisan_id": "art456",
  "request_type": "workshop",
  "message": "I would like to schedule a clay workshop for 3 people."
}

Response:
{
  "request_id": "req789",
  "status": "pending"
}
```

---

### Set Contract Terms

**PUT** `/contracts/req789/terms`

```json
Request:
{
  "cost": 250,
  "timeframe": "3 days"
}

Response:
{
  "message": "Contract terms set",
  "status": "awaiting_client_confirmation"
}
```

---

##  Notes on API Design

- **Authentication**: Token-based (JWT), returned upon successful login.
- **Input/Output Format**: All APIs use `application/json`.
- **Status Codes**: Standard HTTP codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found).

 ---
# Development & QA Strategy 

## 1. Source Code Management (SCM)

- **Version Control Tool:** Git (GitHub repository).  
- **Branching Strategy:**
  - `main`: Stable production-ready code.  
  - `development`: Integration branch for all new features.  
  - `feature/*`: Each new feature or task has its own branch (e.g., `feature/user-auth`).  
- **Workflow:**
  - Developers create feature branches from `development`.  
  - Regular commits with clear, descriptive messages.  
  - Pull Requests (PRs) are required before merging.  
  - All PRs must be reviewed by at least one team member before merge.  

---

## 2. Quality Assurance (QA)

- **Testing Strategy:**
  - **Unit Tests:** Cover core logic and API endpoints.  
  - **Integration Tests:** Validate interactions between services (e.g., API + database).  

- **Testing Tools:**
  - **Jest:** Unit and integration testing for backend logic.  
  - **Postman:** API testing and collection sharing for team validation.  

- **Deployment Pipeline:**
  - **Staging Environment:** New features deployed for internal QA validation.  
  - **Production Environment:** Only code from `main` branch, after passing QA approval.  
  - CI/CD with GitHub Actions to automate build, test, and deploy processes.  

---

## Deliverables

- **SCM Strategy:**  
  - Git with branching model (`main`, `development`, `feature/*`).  
  - Code reviews and PR approval required before merge.  

- **QA Strategy:**  
  - Testing layers (unit, integration).  
  - Tools: Jest, Postman.  
  - Deployment pipeline with staging and production environments.  

# S2 

# API Documentation - Aruma Platform
## 1. External APIs
### MVP Status
**No external APIs required for MVP implementation.** The platform will function as a self-contained system during the initial release.
### Future Integration Plan (Post-MVP)
| API Service | Purpose | Integration Phase | Rationale |
|-------------|---------|-------------------|-----------|
| **Stripe API** | Payment processing | Phase 2 | Industry standard for secure transactions |
| **Cloudinary API** | Image storage & optimization | Phase 2 | Free tier available, easy integration |
| **Twilio API** | SMS notifications | Phase 3 | Reliable delivery, competitive pricing |
| **Google Maps API** | Location-based services | Phase 3 | Comprehensive mapping features |
---
## 2. Internal API Endpoints
### Base Information
- **Base URL:** `https://api.aruma.com/v1`
- **Authentication:** JWT Bearer Token
- **Content-Type:** `application/json`
- **Response Format:** Standard JSON structure
### Standard Response Structure
```json
{
  "success": boolean,
  "message": "string",
  "data": { ... },
  "timestamp": "ISO8601"
}
```
### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```
---
## Authentication Endpoints
### 1. Register Artisan
- **URL:** `POST /api/artisans/register`
- **Purpose:** Create new artisan account
- **Authentication:** None required
- **Input:**
```json
{
  "name": "Ahmed Al-Farsi",
  "email": "ahmed@pottery.com",
  "password": "SecurePass123!",
  "craftType": "pottery",
  "bio": "Traditional Saudi pottery artist with 15 years experience",
  "offersWorkshop": true,
  "offersLiveShow": false
}
```
- **Output:**
```json
{
  "success": true,
  "message": "Artisan registered successfully",
  "data": {
    "artisan": {
      "_id": "65a1b2c3d4e5f67890123456",
      "name": "Ahmed Al-Farsi",
      "email": "ahmed@pottery.com",
      "craftType": "pottery",
      "offersWorkshop": true,
      "offersLiveShow": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```
### 2. Register Client
- **URL:** `POST /api/clients/register`
- **Purpose:** Create new client account
- **Authentication:** None required
- **Input:**
```json
{
  "name": "Fatima Al-Rashid",
  "email": "fatima@client.com",
  "password": "ClientPass123!"
}
```
- **Output:**
```json
{
  "success": true,
  "message": "Client registered successfully",
  "data": {
    "client": {
      "_id": "65a1b2c3d4e5f67890123457",
      "name": "Fatima Al-Rashid",
      "email": "fatima@client.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```
### 3. User Login
- **URL:** `POST /api/auth/login`
- **Purpose:** Authenticate user (artisan or client)
- **Authentication:** None required
- **Input:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Output:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userType": "artisan",
    "user": {
      "_id": "65a1b2c3d4e5f67890123456",
      "name": "Ahmed Al-Farsi",
      "email": "ahmed@pottery.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```
---
## Artisan Endpoints
### 4. Get All Artisans (Marketplace)
- **URL:** `GET /api/artisans`
- **Purpose:** Browse artisans for marketplace
- **Authentication:** Optional (for enhanced features)
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 12)
  - `craftType` (string, optional)
- **Output:**
```json
{
  "success": true,
  "message": "Artisans retrieved successfully",
  "data": {
    "artisans": [
      {
        "_id": "65a1b2c3d4e5f67890123456",
        "name": "Ahmed Al-Farsi",
        "craftType": "pottery",
        "bio": "Traditional Saudi pottery artist...",
        "images": ["pottery1.jpg", "pottery2.jpg"],
        "offersWorkshop": true,
        "offersLiveShow": false,
        "completedWorkCount": 23
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 45,
      "pages": 4
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```
### 5. Get Artisan Profile
- **URL:** `GET /api/artisans/:artisanId`
- **Purpose:** View detailed artisan profile
- **Authentication:** None required
- **Output:**
```json
{
  "success": true,
  "message": "Artisan profile retrieved",
  "data": {
    "artisan": {
      "_id": "65a1b2c3d4e5f67890123456",
      "name": "Ahmed Al-Farsi",
      "email": "ahmed@pottery.com",
      "craftType": "pottery",
      "bio": "Traditional Saudi pottery artist with 15 years experience...",
      "images": ["pottery1.jpg", "pottery2.jpg", "pottery3.jpg"],
      "offersWorkshop": true,
      "offersLiveShow": false,
      "completedWorkCount": 23,
      "createdAt": "2024-01-10T08:00:00Z",
      "updatedAt": "2024-01-15T09:00:00Z"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```
### 6. Update Artisan Profile
- **URL:** `PUT /api/artisans/:artisanId`
- **Purpose:** Update artisan profile information
- **Authentication:** Required (Artisan only)
- **Input:**
```json
{
  "bio": "Updated biography with new achievements...",
  "craftType": "ceramic pottery",
  "images": ["new-image1.jpg", "new-image2.jpg"],
  "offersWorkshop": true,
  "offersLiveShow": true
}
```
- **Output:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "artisan": {
      "_id": "65a1b2c3d4e5f67890123456",
      "name": "Ahmed Al-Farsi",
      "craftType": "ceramic pottery",
      "bio": "Updated biography...",
      "offersWorkshop": true,
      "offersLiveShow": true,
      "updatedAt": "2024-01-15T10:35:00Z"
    }
  },
  "timestamp": "2024-01-15T10:35:00Z"
}
```
---
## Request Management Endpoints
### 7. Create Collaboration Request
- **URL:** `POST /api/requests`
- **Purpose:** Client sends request to artisan
- **Authentication:** Required (Client only)
- **Input:**
```json
{
  "artisanId": "65a1b2c3d4e5f67890123456",
  "requestType": "workshop",
  "message": "I would like to book a pottery workshop for my family. We are beginners and would prefer weekend timing."
}
```
- **Output:**
```json
{
  "success": true,
  "message": "Request sent successfully",
  "data": {
    "request": {
      "_id": "65b2c3d4e5f6789012345678",
      "clientId": "65a1b2c3d4e5f67890123457",
      "artisanId": "65a1b2c3d4e5f67890123456",
      "requestType": "workshop",
      "message": "I would like to book a pottery workshop...",
      "status": "pending",
      "createdAt": "2024-01-15T10:40:00Z",
      "updatedAt": "2024-01-15T10:40:00Z"
    }
  },
  "timestamp": "2024-01-15T10:40:00Z"
}
```
### 8. Get Artisan's Requests
- **URL:** `GET /api/artisans/requests`
- **Purpose:** Artisan views incoming requests
- **Authentication:** Required (Artisan only)
- **Query Parameters:**
  - `status` (string: pending/accepted/rejected/completed)
- **Output:**
```json
{
  "success": true,
  "message": "Requests retrieved successfully",
  "data": {
    "requests": [
      {
        "_id": "65b2c3d4e5f6789012345678",
        "clientId": "65a1b2c3d4e5f67890123457",
        "clientName": "Fatima Al-Rashid",
        "requestType": "workshop",
        "message": "I would like to book a pottery workshop...",
        "status": "pending",
        "createdAt": "2024-01-15T10:40:00Z"
      }
    ]
  },
  "timestamp": "2024-01-15T10:45:00Z"
}
```
### 9. Accept Request
- **URL:** `PUT /api/requests/:requestId/accept`
- **Purpose:** Artisan accepts request and sets terms
- **Authentication:** Required (Artisan only)
- **Input:**
```json
{
  "cost": 500.00,
  "timeframe": "2 weeks",
  "additionalNotes": "Materials included in the price"
}
```
- **Output:**
```json
{
  "success": true,
  "message": "Request accepted successfully",
  "data": {
    "request": {
      "_id": "65b2c3d4e5f6789012345678",
      "status": "accepted",
      "cost": 500.00,
      "timeframe": "2 weeks",
      "updatedAt": "2024-01-15T10:50:00Z"
    },
    "contract": {
      "_id": "65c3d4e5f678901234567890",
      "requestId": "65b2c3d4e5f6789012345678",
      "status": "confirmed",
      "cost": 500.00,
      "timeframe": "2 weeks",
      "createdAt": "2024-01-15T10:50:00Z"
    }
  },
  "timestamp": "2024-01-15T10:50:00Z"
}
```
### 10. Reject Request
- **URL:** `PUT /api/requests/:requestId/reject`
- **Purpose:** Artisan rejects request
- **Authentication:** Required (Artisan only)
- **Input:**
```json
{
  "reason": "Fully booked for the requested timeframe"
}
```
- **Output:**
```json
{
  "success": true,
  "message": "Request rejected successfully",
  "data": {
    "request": {
      "_id": "65b2c3d4e5f6789012345678",
      "status": "rejected",
      "updatedAt": "2024-01-15T10:55:00Z"
    }
  },
  "timestamp": "2024-01-15T10:55:00Z"
}
```
---
## Contract Management Endpoints
### 11. Get User Contracts
- **URL:** `GET /api/contracts`
- **Purpose:** User views their contracts
- **Authentication:** Required
- **Output:**
```json
{
  "success": true,
  "message": "Contracts retrieved successfully",
  "data": {
    "contracts": [
      {
        "_id": "65c3d4e5f678901234567890",
        "requestId": "65b2c3d4e5f6789012345678",
        "artisanName": "Ahmed Al-Farsi",
        "clientName": "Fatima Al-Rashid",
        "requestType": "workshop",
        "cost": 500.00,
        "timeframe": "2 weeks",
        "status": "confirmed",
        "createdAt": "2024-01-15T10:50:00Z"
      }
    ]
  },
  "timestamp": "2024-01-15T11:00:00Z"
}
```
### 12. Complete Contract
- **URL:** `PUT /api/contracts/:contractId/complete`
- **Purpose:** Mark contract as completed
- **Authentication:** Required (Artisan only)
- **Output:**
```json
{
  "success": true,
  "message": "Contract completed successfully",
  "data": {
    "contract": {
      "_id": "65c3d4e5f678901234567890",
      "status": "completed",
      "completedAt": "2024-01-15T11:05:00Z"
    },
    "artisan": {
      "_id": "65a1b2c3d4e5f67890123456",
      "completedWorkCount": 24
    }
  },
  "timestamp": "2024-01-15T11:05:00Z"
}
```
---
## Client-Specific Endpoints
### 13. Get Client's Requests
- **URL:** `GET /api/clients/requests`
- **Purpose:** Client views their sent requests
- **Authentication:** Required (Client only)
- **Output:**
```json
{
  "success": true,
  "message": "Client requests retrieved",
  "data": {
    "requests": [
      {
        "_id": "65b2c3d4e5f6789012345678",
        "artisanId": "65a1b2c3d4e5f67890123456",
        "artisanName": "Ahmed Al-Farsi",
        "requestType": "workshop",
        "message": "I would like to book a pottery workshop...",
        "status": "accepted",
        "cost": 500.00,
        "timeframe": "2 weeks",
        "createdAt": "2024-01-15T10:40:00Z"
      }
    ]
  },
  "timestamp": "2024-01-15T11:10:00Z"
}
```
---
## HTTP Status Codes Summary
| Code | Meaning | Usage |
|------|---------|-------|
| `200` | OK | Successful GET requests |
| `201` | Created | Successful resource creation |
| `400` | Bad Request | Validation errors, invalid input |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Authenticated but insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Resource conflict (e.g., duplicate email) |
| `500` | Internal Server Error | Server-side errors |
---
## Error Code Examples
### Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```
### Authentication Error
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": null
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```
### Resource Not Found
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND", 
    "message": "Artisan not found",
    "details": {
      "artisanId": "65a1b2c3d4e5f67890123456"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```
This API documentation fully aligns with our MongoDB database structure, MVP requirements, and provides comprehensive details for implementation.
