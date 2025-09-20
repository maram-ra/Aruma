# User Stories

## Must Have (MVP)

### 1. User Registration & Login
- As an **artisan**, I want to register and log in, so that I can manage my profile.  
- As a **client**, I want to register and log in, so that I can browse artisans and send requests.  

**MVP Scope:**  
Basic authentication with email and password. No social logins or advanced security required at this stage.  

**Acceptance Criteria:**  
- Given a new user submits valid registration info  
- When they confirm the form  
- Then the system saves their account and redirects them to login.  

---

### 2. Artisan Profile
- As an **artisan**, I want to create and update my profile with details and images, so that clients can view my work.  
- As a **client**, I want to view artisan profiles, so that I can evaluate their work.  

**MVP Scope:**  
Profile includes name, bio, craft type, and images. No advanced customization or categories.  

**Acceptance Criteria:**  
- Given an artisan logs in  
- When they update their profile details  
- Then the system saves the changes and updates their public profile.  

---

### 3. Marketplace Browsing
- As a **client**, I want to browse artisans in a marketplace, so that I can discover products, workshops, and live shows.  
- As an **anonymous visitor**, I want to preview the marketplace, so that I can see artisans before registering.  

**MVP Scope:**  
Simple list/grid of artisans with name, short bio, and one featured image. No filters or advanced search.  

**Acceptance Criteria:**  
- Given I am on the marketplace page  
- When I scroll through the list  
- Then I can view artisan profiles with minimal details.  

---

### 4. Collaboration Requests
- As a **client**, I want to send a request to an artisan, so that I can collaborate with them.  
- As an **artisan**, I want to accept or reject client requests, so that I can control my work.  

**MVP Scope:**  
Request form includes type (product/workshop/live show) and a message. Artisans can accept or reject only. No messaging or chat.  

**Acceptance Criteria:**  
- Given a client sends a request  
- When the artisan reviews it  
- Then they can accept or reject the request with one click.  

---

### 5. Basic Contract Flow
- As an **artisan**, I want to specify cost and timeframe when accepting a request, so that the client knows the conditions.  
- As a **client**, I want to confirm the artisan’s terms, so that we both agree on a clear contract.  
- As a **system**, I want to track request status (pending, accepted, rejected, completed).  

**MVP Scope:**  
Simple status tracking only. No legal documents or payment integration.  

**Acceptance Criteria:**  
- Given a request is accepted  
- When the artisan enters cost and timeframe  
- Then the client can confirm, and the system updates the contract status.  

---

### 6. Profile Enhancement
- As an **artisan**, I want completed requests to appear on my profile, so that I can build credibility with clients.  

**MVP Scope:**  
Show a list of completed requests in the artisan profile. No ratings or reviews.  

**Acceptance Criteria:**  
- Given an artisan marks a request as completed  
- When the contract is closed  
- Then the system adds this request to the artisan’s profile under “Completed Work.”  

---

## Future Features

1. **Payment Integration**  
   Secure online payments for products, workshops, and live shows.  

2. **User Reviews & Ratings**  
   Clients can rate artisans and leave feedback.  

3. **Service Verification**  
   Verified badges for artisans to build more trust.  

---

## Notes
- **Adapt to the MVP:** Stories are scoped to the simplest working version.  
- **Collaborate Actively:** Each story is owned by one team member but reviewed collectively.  
- **Keep it Clear and Simple:** Features are described in plain language with clear acceptance criteria.  
