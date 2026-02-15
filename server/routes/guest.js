import express from "express";
import {
  getDiscountOffers,
  createScanReward,
  generateRestaurantQR
} from "../controllers/guestController.js";

const router = express.Router();

/**
 * GET /api/guest/offers
 * Fetch all available discount offers (shops and items)
 * Query params: ?restaurantId=xxx (optional)
 */
router.get("/offers", getDiscountOffers);

/**
 * POST /api/guest/scan
 * Create a scan record when guest selects an item
 * Body: { restaurantId, shopId, item Id, guestName, deviceFingerprint }
 */
router.post("/scan", createScanReward);

/**
 * GET /api/guest/qr/:restaurantId
 * Generate QR code for a restaurant (admin use)
 */
router.get("/qr/:restaurantId", generateRestaurantQR);

export default router;
