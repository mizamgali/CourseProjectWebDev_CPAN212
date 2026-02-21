Group Members:
Mirshod Gaybullaev  N01731141
Malika Mizamgaliyeva N01737493
Navjot Singh N01746125
Kirtan Vaghela N01742662
Gurpal Singh N01731742

# Event Ticketing Backend – Phase I

## Overview
This project implements the Phase I backend foundation for an Event Ticketing System.  
It provides core REST API endpoints for managing events and ticket types using an in-memory data store (no database yet).

The backend is built with:

- Node.js
- Express.js
- Modular MVC architecture
- In-memory store
- Role-based auth stub (organizer/admin/attendee)

---

## Phase I Features

- Backend project setup
- Core API routes
- Event creation
- Ticket type management
- Event publishing
- Auth headers validation
- Error handling middleware
- Health check endpoint

---

## Project Structure

```
backend/
  package.json
  .env.example
  src/
    server.js
    app.js
    routes/
    controllers/
    services/
    data/
    middleware/
    utils/
```

---

## Installation & Run

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Server runs at:

```
http://localhost:4000
```

---

## API Testing (Postman)

### Health Check
GET `/api/health`

---

### List Events
GET `/api/events`

---

### Create Event
POST `/api/events`

Headers:

```
x-user-id: u_org_1
x-user-role: organizer
Content-Type: application/json
```

Body:

```json
{
  "title": "Postman Event",
  "description": "Hello",
  "categoryId": "cat_2",
  "venueId": "ven_1",
  "startAt": "2026-03-01T10:00:00.000Z",
  "endAt": "2026-03-01T12:00:00.000Z"
}
```

---

### Add Ticket Type
POST `/api/events/{eventId}/ticket-types`

Headers:

```
x-user-id: u_org_1
x-user-role: organizer
Content-Type: application/json
```

Body:

```json
{
  "name": "General Admission",
  "price": 25,
  "quantityTotal": 100
}
```

---

### Publish Event
POST `/api/events/{eventId}/publish`

Headers:

```
x-user-id: u_org_1
x-user-role: organizer
```

---

## Status

Phase I – Backend Foundation - Complete  
Phase II – MongoDB Integration - Pending  
Phase III – Frontend Integration - Pending