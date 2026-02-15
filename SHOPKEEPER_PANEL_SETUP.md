# FWRS Shopkeeper Panel Setup

## Folder structure

- shopkeeper-panel/ (standalone shopkeeper frontend)
- server/ (backend with shopkeeper APIs)

Shopkeeper API entrypoints (server):
- POST /shopkeeper/auth/login
- POST /shopkeeper/auth/logout
- GET /shopkeeper/me
- GET /shopkeeper/items
- POST /shopkeeper/items
- PUT /shopkeeper/items/:id
- DELETE /shopkeeper/items/:id

Shopkeeper panel routes:
- /login
- /
- /items

## Environment variables

Server (.env):
- MONGO_URI=your_mongodb_uri
- SHOPKEEPER_JWT_SECRET=strong_random_string

Shopkeeper panel (.env in shopkeeper-panel):
- VITE_SHOPKEEPER_API_BASE_URL=http://localhost:5000

## Create shopkeeper credentials

Use the admin panel to create a shopkeeper account and assign a shop. The shopkeeper login uses the email and password created by admin.

## Run locally

1) Install server dependencies:
- cd server
- npm install
- npm run dev

2) Install shopkeeper panel dependencies:
- cd shopkeeper-panel
- npm install
- npm run dev

The shopkeeper panel runs on http://localhost:5176

## Notes

- Shopkeeper panel is isolated from the user website in its own folder and port.
- Shopkeeper routes are protected with JWT middleware.
- Items CRUD is restricted to the authenticated shopkeeper's shop only.
