# NexusEvent - Smart Event Management System

An ultra-fast, offline-first digital event management terminal designed for Hackathons and massive conferences. Features zero-lag gate entry, automatic load-balancing seat allocation, food quota controls, and behavioral credit gamification.

## 🌟 Key Features

* **Instant Check-in Matrix:** Supports ultra-fast QR Code scanning and Offline NFC tag interactions for robust crowd flow.
* **Automated Scalable Seating:** Seats are locked dynamically in linear rows (e.g., A-1.. A-10) preventing grid gaps or peer arguments.
* **Smart Food Allocation (Swag Batches):** Real-time meal batch paging ensures food is isolated from the crowd. Triple-scan block algorithms prevent wastage and duplicates.
* **Gamified Credit Engine:** Actions like early entry generate EXP. Penalties applied for food queue hoarding.
* **EHSAAS Portal:** Anonymous mentoring queue for students to ask questions safely from the system grid.

## ⚙️ Tech Stack

* **Frontend Engine:** React, Vite, Tailwind CSS, html5-qrcode
* **Server Authority:** Node.js, Express, Socket.io
* **Data Layer:** PostgreSQL (Supabase poolers)
* **Security & Testing:** Helmet.js, Rate-Limiters, Jest API test suite
* **Deploy Target:** Google Cloud Run (Serverless Edge)

## 🚀 Deployment Instructions

### Local Development
1. Configure `.env` in `backend` with `DATABASE_URL`
2. Start server `cd backend && npm install && npm run start`
3. Launch client `cd frontend && npm install && npm run dev`

### Production Metrics
* Security passes >99% strict headers via Helmet
* Event APIs process O(1) constraints
