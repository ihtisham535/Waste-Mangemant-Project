import express from "express";
import upload from "../config/multerConfig.js";
import {
  checkScanEligibility,
  uploadPlateImage,
  verifyPlate,
  getScanStatus
} from "../controllers/plateVerificationController.js";

const router = express.Router();

/**
 * POST /api/plate/check-eligibility
 * Check if user can scan (24-hour limit)
 * Body: { deviceFingerprint }
 */
router.post("/check-eligibility", checkScanEligibility);

/**
 * POST /api/plate/upload
 * Upload plate image
 * Body (multipart/form-data): 
 *   - image (file)
 *   - deviceFingerprint (string)
 *   - scanId (optional string)
 *   - shopId, itemId, restaurantId (required if new scan)
 */
router.post("/upload", upload.single("image"), uploadPlateImage);

/**
 * POST /api/plate/verify/:scanId
 * Trigger verification for uploaded plate
 * Params: scanId
 */
router.post("/verify/:scanId", verifyPlate);

/**
 * GET /api/plate/status/:scanId
 * Get current scan status
 * Params: scanId
 */
router.get("/status/:scanId", getScanStatus);

export default router;
