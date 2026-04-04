# Roomie - PRD and Project Tracker

Single source of truth for product requirements, scope, milestones, and day-to-day tracking.

## 1) Product Requirements Document (PRD)

### 1.1 Product Name
Roomie

### 1.2 Product Vision
Roomie helps people find compatible flatmates by combining profile details, lifestyle preferences, swipe-based discovery, matching, and chat in one mobile-first experience.

### 1.3 Problem Statement
Finding a flatmate is fragmented and risky. Users need a faster way to discover compatible people based on budget, habits, and room preferences, then connect safely.

### 1.4 Target Users
- Students moving to new cities
- Young professionals sharing rent
- People relocating for work

### 1.5 Goals (MVP)
- OTP login and secure sessions
- Complete user profile with images and preferences
- Swipe feed with mutual match logic
- Real-time chat for matched users
- Basic filtering (budget, lifestyle, distance)

### 1.6 Non-Goals (MVP)
- Payments
- In-app calling/video
- Social feed features
- Admin analytics dashboard

### 1.7 Core Features
1. Authentication: OTP login + JWT + protected routes
2. Profile Management: create/edit profile, preferences, media
3. Swipe and Match: like/pass, mutual like match creation
4. Chat: real-time messaging with history
5. Feed and Filters: nearby users, exclusions, compatibility sorting

### 1.8 Success Metrics
- Account activation rate >= 70%
- Profile completion rate >= 60%
- Match rate >= 15% of active users
- First message sent within 24h by >= 40% of matched users
- Crash-free session rate >= 99%

### 1.9 Team and Ownership

#### Backend Developer
- Stack: Node.js, Express, Database
- Owns: APIs, DB schema, matching logic, chat backend, security

#### Frontend Developer (Adarsha)
- Stack: Kotlin, Android, MVVM
- Owns: UI/UX, API integration, state management, real-time client

## 2) Delivery Plan (Phases and Subphases)

### Backend Roadmap

#### Phase B1: Setup and Auth
- B1.1 Project Initialization
	- Initialize project
	- Install core dependencies
	- Finalize modular folder structure
	- Bring up base server
- B1.2 Database Setup
	- Finalize DB choice (MongoDB/PostgreSQL)
	- Add connection and env config
	- Create user model and indexes (`email`, `phone`)
- B1.3 Authentication
	- OTP flow (mock/Firebase)
	- Login endpoint
	- JWT token issue/verify
	- Auth middleware + protected routes

#### Phase B2: Profile System
- B2.1 Profile APIs
	- `POST /profile`
	- `PUT /profile`
	- `GET /profile/:id`
- B2.2 Media Handling
	- Upload service (Cloudinary/local)
	- Store image URLs
	- Categorize image types
- B2.3 Preferences
	- Preferences schema
	- Lifestyle answers
	- Link user <-> preferences

#### Phase B3: Swipe and Matching
- B3.1 Swipe Logic
	- `POST /swipe`
	- Like/pass persistence
	- Duplicate swipe prevention
- B3.2 Match Detection
	- Mutual-like check
	- Match record create
	- Match response payload
- B3.3 Match Retrieval
	- Get all matches API
	- Include matched user summary

#### Phase B4: Chat System
- B4.1 Socket Setup
	- Socket.io server
	- Connection lifecycle handlers
- B4.2 Messaging
	- Send/receive events
	- Message persistence
- B4.3 Chat Features
	- Chat history API
	- Timestamps
	- Seen/delivered (optional)

#### Phase B5: Feed and Filtering
- B5.1 Feed
	- Nearby users API
	- Exclude self and swiped users
- B5.2 Filters
	- Budget, lifestyle, distance
- B5.3 Matching Score
	- Compatibility scoring
	- Sorted feed by score

#### Phase B6: Optimization (Optional)
- B6.1 Performance: Redis cache, query optimization
- B6.2 Security: rate limiting, input validation, abuse protection

### Frontend Roadmap (Kotlin - Adarsha)

#### Phase F1: Setup
- F1.1 Android project setup and MVVM structure
- F1.2 Retrofit, navigation, ViewModel state handling

#### Phase F2: Auth UI
- F2.1 Login and OTP screens
- F2.2 Auth API integration and state handling

#### Phase F3: Profile Setup UI
- F3.1 Multi-step profile form + validation
- F3.2 Image picker and upload preview
- F3.3 Submit profile flow and response handling

#### Phase F4: Home Swipe UI
- F4.1 Card UI and profile snippets
- F4.2 Swipe gestures and like/reject actions
- F4.3 Feed and swipe API integration

#### Phase F5: Match and Chat
- F5.1 Match popup and match list
- F5.2 Chat screen and bubbles
- F5.3 WebSocket send/receive integration

#### Phase F6: Profile and Room Details
- F6.1 View and edit profile
- F6.2 Room info and gallery

### Integration Roadmap

#### Phase I1: API Integration
- Contract alignment for request/response
- Endpoint wiring across all features

#### Phase I2: Error Handling
- Loading and retry states
- API/server error rendering

#### Phase I3: QA and Stabilization
- End-to-end test passes
- Bug fixing and regression checks

## 3) Tracking Board (Jira Style)

Status flow: TODO -> IN PROGRESS -> DONE

### 3.1 Active Sprint Tracker

| ID | Title | Owner | Type | Label | Status | Priority | Notes |
|---|---|---|---|---|---|---|---|
| B1-1 | Initialize backend project structure | Backend | Task | backend | TODO | High | Base setup |
| B1-2 | Implement OTP login API | Backend | Feature | backend | TODO | High | Mock/Firebase |
| B2-1 | Create profile APIs | Backend | Feature | backend | TODO | High | POST/PUT/GET |
| F2-1 | Build login and OTP screens | Adarsha | Feature | frontend | TODO | High | Auth flow |
| F4-1 | Implement swipe card UI | Adarsha | Feature | frontend | TODO | Medium | Gesture UX |
| I1-1 | Align API contracts | Both | Task | enhancement | TODO | High | Request/response sync |

### 3.2 Milestone Checklist

#### MVP Scope
- [ ] Auth complete
- [ ] Profile complete
- [ ] Swipe complete
- [ ] Match complete
- [ ] Chat complete

#### Quality Gates
- [ ] Backend lint passes
- [ ] Frontend build passes
- [ ] Basic end-to-end flow tested
- [ ] No P0 or P1 open bugs

## 4) Daily Execution Rules

- Pick only 2-3 tasks per day
- Move each task: TODO -> IN PROGRESS -> DONE
- Keep tasks small and shippable
- Push code daily
- Test before marking DONE

## 5) Task Template

Use this for every new task ticket:

```md
Title: Implement Swipe API
Description: Store user swipe and check match
Type: Feature
Label: backend
Status: TODO
Priority: High
Owner: Backend
```

## 6) Labels

- backend
- frontend
- bug
- enhancement

## 7) Immediate Next Tasks

1. Finalize DB decision (MongoDB or PostgreSQL)
2. Close Phase B1.1 setup tasks
3. Start OTP auth flow end-to-end (backend + Android)

