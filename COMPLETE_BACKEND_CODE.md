# COMPLETE FWRS BACKEND CODE

This document contains all working backend code with full explanations.

---

## 1️⃣ server.js - Main Server File

**Location:** `server/server.js`  
**Purpose:** Main Express server - handles all API routes and middleware  
**Size:** ~100 lines

```javascript
// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const QRCode = require('qrcode');

// Import custom routes and models
const orderRoutes = require('./routes/orders');

// Create Express app instance
const app = express();

// ============ MIDDLEWARE SETUP ============

// Enable CORS - allows frontend to communicate with this backend
// Options: allows requests from any origin (good for development)
app.use(cors({
  origin: '*', // Allow all origins (restrict in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Parse incoming JSON request bodies into JavaScript objects
app.use(express.json());

// Parse incoming URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ============ MONGODB SETUP ============

// Get MongoDB connection string from .env file
const mongoURI = process.env.MONGO_URI;

// Establish connection to MongoDB Atlas
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✓ Connected to MongoDB Atlas'))
  .catch(err => console.error('✗ MongoDB connection error:', err.message));

// ============ BASIC HEALTH CHECK ROUTE ============

// GET /health - Simple endpoint to verify server is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ MOUNT CRUD ROUTES ============

// Mount order routes at /orders endpoint
// This means:
// - POST /orders → create new order
// - GET /orders → get all orders
// - GET /orders/:id → get specific order
// - PUT /orders/:id → update order
// - DELETE /orders/:id → delete order
app.use('/orders', orderRoutes);

// ============ QR CODE GENERATION ROUTE ============

// GET /generate-qr/:id - Generate QR code for an order ID
app.get('/generate-qr/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that ID is a valid MongoDB ObjectId format (24 hex characters)
    // Prevents invalid data from being passed to QR generator
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: 'Invalid order ID format. Must be 24 hexadecimal characters.',
        example: '507f1f77bcf86cd799439011'
      });
    }

    // Generate QR code as base64-encoded PNG image
    const qrDataUrl = await QRCode.toDataURL(id, {
      errorCorrectionLevel: 'H',        // High error correction (30% recoverable)
      type: 'image/png',                // PNG format
      width: 300,                       // Size in pixels
      margin: 1,                        // Padding around QR code
      color: {
        dark: '#0f1c3f',                // Navy color (FWRS brand)
        light: '#cce7ff'                // Light cyan background (FWRS accent)
      }
    });

    // Return QR code and metadata as JSON
    res.json({
      qr: qrDataUrl,                    // Base64 PNG string (can be used in <img src>)
      orderId: id,                      // The encoded order ID
      message: 'QR code generated successfully',
      format: 'data:image/png;base64'   // Indicates data URL format
    });

  } catch (error) {
    // Handle any errors during QR generation
    console.error('QR generation error:', error);
    res.status(500).json({
      error: 'Failed to generate QR code',
      details: error.message
    });
  }
});

// ============ START SERVER ============

// Get PORT from .env or use default 5000
const PORT = process.env.PORT || 5000;

// Start listening on specified port
app.listen(PORT, () => {
  console.log('\n========== FWRS BACKEND SERVER ==========');
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log('✓ QR code generation endpoint ready: GET /generate-qr/:id');
  console.log('✓ Order CRUD routes ready: /orders');
  console.log('========================================\n');
});

// Export app for testing (optional)
module.exports = app;
```

---

## 2️⃣ models/Order.js - Database Schema

**Location:** `server/models/Order.js`  
**Purpose:** Defines MongoDB data structure for orders  
**Size:** ~25 lines

```javascript
// Import Mongoose library for database interactions
const mongoose = require('mongoose');

// Define Order schema - specifies what fields an order must have
const orderSchema = new mongoose.Schema({
  
  // Customer name who placed the order
  name: {
    type: String,
    required: true,     // This field is mandatory
    trim: true,         // Automatically remove whitespace
    minlength: 1,
    maxlength: 100
  },

  // Array of items in the order
  // Example: ["Item 1", "Item 2", "Item 3"]
  items: {
    type: [String],
    default: []         // Empty array if not provided
  },

  // Total order amount in currency
  total: {
    type: Number,
    required: true,     // Mandatory field
    min: 0,             // Cannot be negative
    precision: 2        // 2 decimal places
  },

  // Optional: description or notes about order
  description: {
    type: String,
    trim: true
  },

  // Automatically add timestamps:
  // - createdAt: when order was created
  // - updatedAt: when order was last modified
}, { timestamps: true });

// Create and export Order model
// This creates a "orders" collection in MongoDB
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
```

**Database Structure Example:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "items": ["Cappuccino", "Croissant", "Orange Juice"],
  "total": 15.50,
  "description": "Morning order",
  "createdAt": "2024-01-15T09:30:00.000Z",
  "updatedAt": "2024-01-15T09:30:00.000Z"
}
```

---

## 3️⃣ routes/orders.js - CRUD API Routes

**Location:** `server/routes/orders.js`  
**Purpose:** Defines all order API endpoints  
**Size:** ~160 lines

```javascript
// Import Express to create router
const express = require('express');
const router = express.Router();

// Import Order model for database operations
const Order = require('../models/Order');

// Sample data array as fallback (when not using MongoDB)
// In production, all data comes from MongoDB
let ordersData = [
  {
    _id: '507f1f77bcf86cd799439011',
    name: 'Alice Johnson',
    items: ['Latte', 'Blueberry Muffin'],
    total: 12.50,
    createdAt: new Date('2024-01-15T08:00:00'),
    updatedAt: new Date('2024-01-15T08:00:00')
  },
  {
    _id: '507f1f77bcf86cd799439012',
    name: 'Bob Smith',
    items: ['Espresso', 'Cookie'],
    total: 8.75,
    createdAt: new Date('2024-01-15T08:15:00'),
    updatedAt: new Date('2024-01-15T08:15:00')
  }
];

// ============ CREATE ORDER ============
// POST /orders
// Body: { "name": "string", "items": ["array"], "total": "number" }
router.post('/', async (req, res) => {
  try {
    const { name, items, total, description } = req.body;

    // Validate required fields
    if (!name || total === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: name, total'
      });
    }

    // Validate total is a positive number
    if (typeof total !== 'number' || total < 0) {
      return res.status(400).json({
        error: 'Total must be a positive number'
      });
    }

    // Create new order document
    const order = new Order({
      name,
      items: items || [],
      total,
      description: description || ''
    });

    // Save order to MongoDB
    await order.save();

    // Return created order with 201 (Created) status
    res.status(201).json({
      message: 'Order created successfully',
      order: order
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      error: 'Failed to create order',
      details: error.message
    });
  }
});

// ============ GET ALL ORDERS ============
// GET /orders
// Returns: Array of all orders in database
router.get('/', async (req, res) => {
  try {
    // If MongoDB fails, use sample data for testing
    let orders;
    
    try {
      // Try to fetch from MongoDB
      orders = await Order.find();
    } catch (dbError) {
      console.warn('MongoDB error, using sample data:', dbError.message);
      // Fallback to sample data
      orders = ordersData;
    }

    // Return all orders
    res.json({
      count: orders.length,
      orders: orders
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      error: 'Failed to fetch orders',
      details: error.message
    });
  }
});

// ============ GET SINGLE ORDER ============
// GET /orders/:id
// Params: id (MongoDB ObjectId)
// Returns: Single order object
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: 'Invalid order ID format'
      });
    }

    // Try to find order in MongoDB
    let order;
    
    try {
      order = await Order.findById(id);
    } catch (dbError) {
      // Fallback: search in sample data
      order = ordersData.find(o => o._id === id);
    }

    // Return 404 if order not found
    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    // Return the order
    res.json({
      message: 'Order found',
      order: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      error: 'Failed to fetch order',
      details: error.message
    });
  }
});

// ============ UPDATE ORDER ============
// PUT /orders/:id
// Params: id (MongoDB ObjectId)
// Body: { "name": "string", "total": "number", ... }
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, items, total, description } = req.body;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: 'Invalid order ID format'
      });
    }

    // Prepare update data (only fields that are provided)
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (items !== undefined) updateData.items = items;
    if (total !== undefined) updateData.total = total;
    if (description !== undefined) updateData.description = description;

    // Try to update in MongoDB
    let order;
    
    try {
      // Find by ID and update, return new version
      order = await Order.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (dbError) {
      // Fallback: update in sample data
      const index = ordersData.findIndex(o => o._id === id);
      if (index !== -1) {
        ordersData[index] = { ...ordersData[index], ...updateData };
        order = ordersData[index];
      }
    }

    // Return 404 if order not found
    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    // Return updated order
    res.json({
      message: 'Order updated successfully',
      order: order
    });

  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      error: 'Failed to update order',
      details: error.message
    });
  }
});

// ============ DELETE ORDER ============
// DELETE /orders/:id
// Params: id (MongoDB ObjectId)
// Returns: Confirmation message
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: 'Invalid order ID format'
      });
    }

    // Try to delete from MongoDB
    let deletedOrder;
    
    try {
      deletedOrder = await Order.findByIdAndDelete(id);
    } catch (dbError) {
      // Fallback: delete from sample data
      const index = ordersData.findIndex(o => o._id === id);
      if (index !== -1) {
        deletedOrder = ordersData.splice(index, 1)[0];
      }
    }

    // Return 404 if order not found
    if (!deletedOrder) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    // Return success message
    res.json({
      message: 'Order deleted successfully',
      deletedOrder: deletedOrder
    });

  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      error: 'Failed to delete order',
      details: error.message
    });
  }
});

// Export router to use in server.js
module.exports = router;
```

---

## 4️⃣ services/qrService.js - QR Code Utilities

**Location:** `server/services/qrService.js`  
**Purpose:** Reusable functions for QR code generation  
**Size:** ~70 lines

```javascript
// Import QRCode library
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// ============ GENERATE QR AS DATA URL ============
// Returns QR code as base64-encoded PNG string
// Use in JSON responses to send to frontend
async function generateQRDataURL(data, options = {}) {
  try {
    const qrOptions = {
      errorCorrectionLevel: options.errorCorrectionLevel || 'H',
      type: options.type || 'image/png',
      width: options.width || 300,
      margin: options.margin || 1,
      color: {
        dark: options.dark || '#0f1c3f',        // Navy (FWRS brand)
        light: options.light || '#cce7ff'       // Light cyan
      }
    };

    // Generate QR code as PNG and encode to base64
    const qrDataUrl = await QRCode.toDataURL(data, qrOptions);
    
    return {
      success: true,
      qr: qrDataUrl,
      data: data,
      format: 'data:image/png;base64'
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// ============ GENERATE QR AS FILE ============
// Saves QR code as PNG file to disk
async function generateQRFile(data, filePath, options = {}) {
  try {
    const qrOptions = {
      errorCorrectionLevel: options.errorCorrectionLevel || 'H',
      type: options.type || 'image/png',
      width: options.width || 300,
      margin: options.margin || 1,
      color: {
        dark: options.dark || '#0f1c3f',
        light: options.light || '#cce7ff'
      }
    };

    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Generate QR code and save to file
    await QRCode.toFile(filePath, data, qrOptions);

    return {
      success: true,
      message: 'QR code saved to file',
      filePath: filePath,
      size: fs.statSync(filePath).size + ' bytes'
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// ============ GENERATE QR FOR URL ============
// Generates QR code that links to a URL
// Useful for reward redemption landing pages
async function generateQRForURL(orderId, baseURL = 'http://localhost:3000') {
  try {
    // Create full redemption URL
    const redemptionURL = `${baseURL}/redeem?order=${orderId}`;

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(redemptionURL, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1,
      color: {
        dark: '#0f1c3f',
        light: '#cce7ff'
      }
    });

    return {
      success: true,
      qr: qrDataUrl,
      orderId: orderId,
      redemptionURL: redemptionURL,
      format: 'data:image/png;base64'
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Export all utility functions
module.exports = {
  generateQRDataURL,
  generateQRFile,
  generateQRForURL
};
```

---

## 5️⃣ package.json - Dependencies

**Location:** `server/package.json`  
**Purpose:** Lists all npm packages needed

```json
{
  "name": "fwrs-backend",
  "version": "1.0.0",
  "description": "FreshWave Rewards System Backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "keywords": ["fwrs", "rewards", "express", "mongodb"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.6.1",
    "express": "^4.19.2",
    "mongoose": "^8.5.2",
    "qrcode": "^1.5.4"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
```

---

## 6️⃣ .env - Configuration

**Location:** `server/.env`  
**Purpose:** Secure environment variables (NEVER commit to Git)

```env
# MongoDB Atlas Connection String
# Format: mongodb+srv://username:password@cluster.mongodb.net/database
# Get from: https://www.mongodb.com/cloud/atlas → Databases → Connect → Drivers
MONGO_URI=mongodb+srv://fwrs-admin:YOUR_PASSWORD@cluster0.abc123.mongodb.net/fwrsDB?retryWrites=true&w=majority

# Server port
PORT=5000
```

---

## TESTING & INTEGRATION

### Test Backend with Postman

**1. Create Order:**
```
POST http://localhost:5000/orders
Content-Type: application/json

{
  "name": "John Doe",
  "items": ["Coffee", "Toast"],
  "total": 12.50,
  "description": "Breakfast order"
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "items": ["Coffee", "Toast"],
    "total": 12.50,
    "createdAt": "2024-01-15T09:30:00.000Z",
    "updatedAt": "2024-01-15T09:30:00.000Z"
  }
}
```

**2. Generate QR Code:**
```
GET http://localhost:5000/generate-qr/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "qr": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
  "orderId": "507f1f77bcf86cd799439011",
  "message": "QR code generated successfully"
}
```

### Test Backend with React

```jsx
// src/utils/api.js
export const generateQR = async (orderId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/generate-qr/${orderId}`
    );
    const data = await response.json();
    if (data.qr) {
      return data.qr; // Base64 image
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('QR generation error:', error);
    return null;
  }
};

// src/pages/QRDisplay.jsx
import { useEffect, useState } from 'react';
import { generateQR } from '../utils/api';

function QRDisplay({ orderId }) {
  const [qr, setQr] = useState(null);

  useEffect(() => {
    generateQR(orderId).then(setQr);
  }, [orderId]);

  return (
    <div>
      {qr && <img src={qr} alt="QR Code" className="w-80 h-80" />}
    </div>
  );
}

export default QRDisplay;
```

---

## ERROR HANDLING

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid object id` | Bad MongoDB ID format | Use 24 hex characters: `507f1f77bcf86cd799439011` |
| `Order not found` | ID doesn't exist in DB | Create order first with POST /orders |
| `MongooseError: connect` | MongoDB URI wrong | Check MONGO_URI in .env file |
| `CORS error` | Frontend different origin | CORS already enabled in server.js |
| `Port already in use` | Another app using port 5000 | Change PORT in .env or kill process on 5000 |

---

## ✅ CHECKLIST

- [ ] All files created in correct locations
- [ ] .env file updated with real MongoDB URI
- [ ] npm install completed
- [ ] npm start runs without errors
- [ ] GET /health returns `{"status":"ok"}`
- [ ] POST /orders creates new order
- [ ] GET /generate-qr/:id returns QR code
- [ ] Frontend can fetch and display QR
- [ ] React component renders QR images
