# FWRS Admin Panel Setup

## Folder structure

- admin-panel/ (standalone admin frontend)
- server/ (existing backend, now with admin APIs)

Admin API entrypoints (server):
- POST /admin/auth/login
- POST /admin/auth/logout
- GET /admin/scans/metrics
- GET /admin/scans
- GET /admin/restaurant
- POST /admin/restaurant
- GET /admin/shops
- POST /admin/shops
- PUT /admin/shops/:id
- DELETE /admin/shops/:id
- GET /admin/shopkeepers
- POST /admin/shopkeepers
- PUT /admin/shopkeepers/:id
- DELETE /admin/shopkeepers/:id
- GET /admin/items
- PUT /admin/items/:id

Admin panel routes:
- /login
- /
- /restaurant
- /shops
- /shopkeepers
- /items
- /scans

## Environment variables

Server (.env):
- MONGO_URI=your_mongodb_uri
- ADMIN_JWT_SECRET=strong_random_string
- QR_BASE_URL=http://localhost:5173

Admin panel (.env in admin-panel):
- VITE_ADMIN_API_BASE_URL=http://localhost:5000

## Seeded admin account (auto)

On server startup, the backend auto-creates a single admin account if none exists.

Default testing credentials:
- Username: admin
- Password: Admin123!

Override defaults in server/.env:
- ADMIN_SEED_USERNAME=your_admin_user
- ADMIN_SEED_PASSWORD=your_strong_password

## Run locally

1) Install server dependencies:
- cd server
- npm install
- npm run dev

2) Install admin panel dependencies:
- cd admin-panel
- npm install
- npm run dev

The admin panel runs on http://localhost:5174

## Notes

- Admin panel is isolated from the user website in its own folder and port.
- Admin routes are protected by JWT middleware.
- Scan data is automatically recorded when the order payload includes a scan object.
- Update the scan payload in the QR flow to include restaurant, shop, and item IDs.
