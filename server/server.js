import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import orderRoutes from "./routes/orders.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import adminRestaurantRoutes from "./routes/adminRestaurant.js";
import adminShopRoutes from "./routes/adminShops.js";
import adminShopkeeperRoutes from "./routes/adminShopkeepers.js";
import adminItemRoutes from "./routes/adminItems.js";
import adminScanRoutes from "./routes/adminScans.js";
import shopkeeperAuthRoutes from "./routes/shopkeeperAuth.js";
import shopkeeperProfileRoutes from "./routes/shopkeeperProfile.js";
import shopkeeperItemRoutes from "./routes/shopkeeperItems.js";
import contactRoutes from "./routes/contact.js";
import plateVerificationRoutes from "./routes/plateVerification.js";
import guestRoutes from "./routes/guest.js";
import Admin from "./models/Admin.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Simple health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Order routes
app.use("/orders", orderRoutes);

// Admin routes
app.use("/admin/auth", adminAuthRoutes);
app.use("/admin/restaurant", adminRestaurantRoutes);
app.use("/admin/shops", adminShopRoutes);
app.use("/admin/shopkeepers", adminShopkeeperRoutes);
app.use("/admin/items", adminItemRoutes);
app.use("/admin/scans", adminScanRoutes);

// Shopkeeper routes
app.use("/shopkeeper/auth", shopkeeperAuthRoutes);
app.use("/shopkeeper", shopkeeperProfileRoutes);
app.use("/shopkeeper/items", shopkeeperItemRoutes);

// Contact route
app.use("/contact", contactRoutes);

// Plate verification routes
app.use("/api/plate", plateVerificationRoutes);

// Guest routes (QR scan and rewards)
app.use("/api/guest", guestRoutes);

/**
 * QR CODE GENERATION ROUTE
 * Endpoint: GET /generate-qr/:id
 * Purpose: Generate a QR code as a Data URL for a specific order
 * How it works:
 * 1. Accepts an order ID in the URL parameter
 * 2. Validates that the ID format is correct for MongoDB
 * 3. Generates a QR code containing the order ID
 * 4. Returns the QR code as a Data URL (base64 encoded PNG image)
 * Frontend usage: Fetch this endpoint and display with <img src={qrDataUrl} />
 * Example: fetch('/generate-qr/507f1f77bcf86cd799439011').then(res => res.json()).then(data => showImage(data.qr))
 */
app.get("/generate-qr/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that the ID is a valid MongoDB ObjectId format (24 hex characters)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Invalid order ID format. Expected 24-character MongoDB ObjectId.",
      });
    }

    const qrBaseUrl = process.env.QR_BASE_URL || "http://localhost:5173";
    const normalizedBaseUrl = qrBaseUrl.replace(/\/+$/, "");
    const qrTargetUrl = `${normalizedBaseUrl}/qr/${id}`;

    // Generate QR code as Data URL (base64 encoded PNG)
    // The QR code encodes the frontend URL which can be scanned on mobile
    const qrDataUrl = await QRCode.toDataURL(qrTargetUrl, {
      errorCorrectionLevel: "H", // High error correction (up to 30% damaged data recoverable)
      type: "image/png",
      width: 300, // Size in pixels
      margin: 1, // Quiet zone around QR code
      color: {
        dark: "#0f1c3f", // Navy blue (FWRS brand color)
        light: "#cce7ff", // Light accent (FWRS brand color)
      },
    });

    // Return the QR code Data URL and order ID
    res.json({
      qr: qrDataUrl,
      url: qrTargetUrl,
      orderId: id,
      message: "QR code generated successfully",
    });
  } catch (error) {
    console.error("QR generation error:", error.message);
    // Server continues running even if QR generation fails
    res.status(500).json({
      error: "Failed to generate QR code",
      details: error.message,
    });
  }
});

const mongoUri = process.env.MONGO_URI;
const adminJwtSecret = process.env.ADMIN_JWT_SECRET;
const shopkeeperJwtSecret = process.env.SHOPKEEPER_JWT_SECRET;

if (!mongoUri) {
  console.error("✗ MONGO_URI is not set. Create server/.env and add MONGO_URI.");
  process.exit(1);
}

if (!adminJwtSecret) {
  console.error("✗ ADMIN_JWT_SECRET is not set. Create server/.env and add ADMIN_JWT_SECRET.");
  process.exit(1);
}

if (!shopkeeperJwtSecret) {
  console.error("✗ SHOPKEEPER_JWT_SECRET is not set. Create server/.env and add SHOPKEEPER_JWT_SECRET.");
  process.exit(1);
}

const seedAdminIfMissing = async () => {
  const existing = await Admin.findOne();
  if (existing) {
    console.log("! Admin already exists. Skipping seed.");
    return;
  }

  const rawUsername = process.env.ADMIN_SEED_USERNAME;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!rawUsername || !password) {
    console.warn("! No admin seeded. Use /admin/register to create the first admin.");
    return;
  }

  const username = String(rawUsername).trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);

  await Admin.create({
    username,
    passwordHash,
    displayName: "Super Admin",
  });

  console.log(`✓ Admin seeded. Username: ${username}`);
};

mongoose.connection.on("error", (error) => {
  console.error("✗ MongoDB connection error:", error.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("! MongoDB disconnected");
});

// Connect to MongoDB Atlas
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("\n✓ Connected to MongoDB Atlas");
    console.log("✓ QR code generation endpoint ready: GET /generate-qr/:id");
    console.log("✓ Order CRUD routes ready: /orders");
    seedAdminIfMissing().then(() => {
      app.listen(PORT, () => {
        console.log(`✓ Server running on http://localhost:${PORT}\n`);
      });
    });
  })
  .catch((error) => {
    console.error("✗ MongoDB connection failed:", error.message);
    process.exit(1);
  });