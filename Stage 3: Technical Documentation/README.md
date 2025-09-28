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
- **Backend:** Node.js (Express) — handles requests and business logic.  
- **Database:** MongoDB (to store users, profiles, requests, and contracts).  
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

# 5. API Specifications
### 5.1 List of external APIs
### 5.2 Table of internal API endpoints
# 6. SCM and QA Plans
### 6.1 SCM strategy
### 6.2 QA strategy

