# 🍽️ FWRS - Food Waste Reduction System

A comprehensive web application designed to reduce food waste by connecting restaurants and shops with customers through a QR-based discount system. The platform enables businesses to offer time-sensitive discounts on surplus food, helping reduce waste while providing value to customers.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Developer Contact](#developer-contact)

## ✨ Features

### Customer Features
- 🔍 Browse available offers from local restaurants and shops
- 📱 QR code-based plate verification system
- 💰 Access exclusive discounts on surplus food
- 📧 Newsletter subscription for updates
- 🌓 Dark/Light theme toggle
- 📄 Terms & Conditions and Privacy Policy

### Shopkeeper Features
- 🏪 Manage shop profile and information
- 📦 Add, edit, and delete food items
- 💲 Set dynamic discount prices
- 📊 View scan analytics and order history
- 🔐 Secure authentication system
- 🎨 Modern, responsive dashboard

### Admin Features
- 👥 Manage shopkeepers and their shops
- 🍔 Oversee all food items across the platform
- 📈 Monitor system-wide analytics
- 🔍 QR code scan tracking
- 🛡️ Complete administrative control
- 📱 Responsive admin panel

## 🛠️ Tech Stack

**Frontend:**
- React 18.x with Vite
- Tailwind CSS
- React Router DOM
- Axios for API calls
- QRCode.react for QR generation

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- CORS enabled

**Development Tools:**
- ESLint
- PostCSS
- Vite Dev Server

## 📁 Project Structure

```
FWRS-Project/
│
├── admin-panel/              # Admin Dashboard Application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── AdminLayout.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── pages/            # Admin pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Shopkeepers.jsx
│   │   │   ├── Shops.jsx
│   │   │   ├── Items.jsx
│   │   │   └── Scans.jsx
│   │   ├── services/         # API service layer
│   │   │   └── api.js
│   │   ├── styles/           # CSS files
│   │   │   └── index.css
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.cjs
│
├── client/                   # Customer-Facing Application
│   ├── public/               # Static assets (includes logo.jpeg)
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Landing/      # Landing page components
│   │   │   │   ├── BonyadLanding.jsx
│   │   │   │   ├── ContactUs.jsx
│   │   │   │   ├── TermsAndConditions.jsx
│   │   │   │   └── PrivacyPolicy.jsx
│   │   │   ├── QR/           # QR-related pages
│   │   │   │   ├── PlateVerification.jsx
│   │   │   │   ├── QRDiscountListing.jsx
│   │   │   │   └── QRConfirmation.jsx
│   │   │   └── ShopDetails.jsx
│   │   ├── routes/           # Route configurations
│   │   ├── services/         # API services
│   │   │   └── api.js
│   │   ├── shopkeeper/       # Shopkeeper auth pages
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.cjs
│
├── shopkeeper-panel/         # Shopkeeper Dashboard Application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ShopkeeperLayout.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── pages/            # Shopkeeper pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ItemsPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                   # Backend API Server
│   ├── config/
│   │   └── multerConfig.js   # File upload configuration
│   ├── controllers/          # Request handlers
│   │   ├── adminAuthController.js
│   │   ├── guestController.js
│   │   ├── itemController.js
│   │   ├── plateVerificationController.js
│   │   ├── restaurantController.js
│   │   ├── scanController.js
│   │   ├── shopController.js
│   │   ├── shopkeeperAuthController.js
│   │   ├── shopkeeperController.js
│   │   ├── shopkeeperItemController.js
│   │   └── shopkeeperProfileController.js
│   ├── middleware/           # Auth middleware
│   │   ├── adminAuth.js
│   │   └── shopkeeperAuth.js
│   ├── models/               # MongoDB schemas
│   │   ├── Admin.js
│   │   ├── Item.js
│   │   ├── Order.js
│   │   ├── Restaurant.js
│   │   ├── Scan.js
│   │   ├── Shop.js
│   │   └── Shopkeeper.js
│   ├── routes/               # API routes
│   │   ├── adminAuth.js
│   │   ├── adminItems.js
│   │   ├── adminRestaurant.js
│   │   ├── adminScans.js
│   │   ├── adminShopkeepers.js
│   │   ├── adminShops.js
│   │   ├── contact.js
│   │   ├── guest.js
│   │   ├── orders.js
│   │   ├── plateVerification.js
│   │   ├── shopkeeperAuth.js
│   │   ├── shopkeeperItems.js
│   │   └── shopkeeperProfile.js
│   ├── scripts/              # Utility scripts
│   │   ├── cleanupScans.js
│   │   ├── resetAdmin.js
│   │   └── verifyAdmin.js
│   ├── services/
│   │   └── qrService.js      # QR code generation service
│   ├── uploads/              # Uploaded images
│   ├── server.js             # Entry point
│   └── package.json
│
├── Documentation Files
│   ├── ADMIN_PANEL_SETUP.md
│   ├── BACKEND_MASTER_SETUP_GUIDE.md
│   ├── COMPLETE_BACKEND_CODE.md
│   ├── DOCUMENTATION_ROADMAP.md
│   ├── MONGODB_URI_FIX.md
│   ├── PLATE_VERIFICATION_GUIDE.md
│   ├── QR_IMPLEMENTATION_SUMMARY.md
│   ├── QR_SETUP_GUIDE.md
│   ├── QR_TESTING_GUIDE.md
│   ├── QUICK_START_5_MINUTES.md
│   └── SHOPKEEPER_PANEL_SETUP.md
│
└── README.md                 # This file
```

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd FWRS-Project
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies

**Client Application:**
```bash
cd ../client
npm install
```

**Admin Panel:**
```bash
cd ../admin-panel
npm install
```

**Shopkeeper Panel:**
```bash
cd ../shopkeeper-panel
npm install
```

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/fwrs
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fwrs

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Admin Credentials (Initial Setup)
ADMIN_EMAIL=admin@bonyad.com
ADMIN_PASSWORD=admin123

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Client Application:**
```bash
cd client
npm run dev
# Client runs on http://localhost:5182
```

**Terminal 3 - Admin Panel:**
```bash
cd admin-panel
npm run dev
# Admin panel runs on http://localhost:5178
```

**Terminal 4 - Shopkeeper Panel:**
```bash
cd shopkeeper-panel
npm run dev
# Shopkeeper panel runs on http://localhost:5183
```

### Production Build

**Backend:**
```bash
cd server
npm start
```

**Frontend Applications:**
```bash
# Build all frontend apps
cd client && npm run build
cd ../admin-panel && npm run build
cd ../shopkeeper-panel && npm run build
```

## 🔌 API Endpoints

### Guest Routes
- `GET /api/guest/offers` - Get all available offers
- `POST /api/guest/verify-plate` - Verify plate number

### Shopkeeper Routes
- `POST /api/shopkeeper/auth/register` - Register new shopkeeper
- `POST /api/shopkeeper/auth/login` - Shopkeeper login
- `GET /api/shopkeeper/items` - Get shopkeeper items
- `POST /api/shopkeeper/items` - Add new item
- `PUT /api/shopkeeper/items/:id` - Update item
- `DELETE /api/shopkeeper/items/:id` - Delete item

### Admin Routes
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/shopkeepers` - Get all shopkeepers
- `GET /api/admin/shops` - Get all shops
- `GET /api/admin/items` - Get all items
- `GET /api/admin/scans` - Get scan analytics

### Contact
- `POST /api/contact` - Submit contact form / Newsletter subscription

## 📱 Application Access

- **Customer Interface:** http://localhost:5182
- **Admin Panel:** http://localhost:5178
- **Shopkeeper Panel:** http://localhost:5183
- **API Server:** http://localhost:5000

### Default Admin Credentials
- **Email:** admin@bonyad.com
- **Password:** admin123

## 🎨 Features Highlights

### Theme System
All applications support dark/light mode with persistent theme preferences using localStorage.

### Session Management
Guest sessions are persisted for 24 hours, allowing users to resume their shopping experience.

### QR Code System
Dynamic QR code generation for plate verification with real-time discount validation.

### Responsive Design
Fully responsive layouts optimized for desktop, tablet, and mobile devices.

## 📧 Developer Contact

**Developer:** Ihtisham Sajjad  
**Email:** ihtishamsajjad670@gmail.com  
**Phone:** +92 308 9005419

For any queries, bug reports, or feature requests, please feel free to reach out via email or phone.

## 📄 License

This project is developed for Bonyad Food Waste Reduction Initiative.

## 🙏 Acknowledgments

Special thanks to all contributors and the Bonyad team for their support in making this food waste reduction platform a reality.

---

**© 2026 Bonyad. All rights reserved.**

*Together, we can make a difference in reducing food waste and creating a sustainable future.*