import Scan from "../models/Scan.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * CHECK SCAN ELIGIBILITY
 * Verify if user can scan based on 24-hour limit
 */
export const checkScanEligibility = async (req, res) => {
  try {
    const { deviceFingerprint } = req.body;

    if (!deviceFingerprint) {
      return res.status(400).json({ 
        eligible: false,
        message: "Device identifier is required." 
      });
    }

    // Find the most recent APPROVED scan for this device (only successful verifications count)
    const recentScan = await Scan.findOne({ 
      deviceFingerprint,
      verificationStatus: "approved"
    })
      .sort({ scannedAt: -1 })
      .limit(1);

    if (!recentScan) {
      // No previous approved scan - eligible
      return res.json({
        eligible: true,
        message: "You can proceed with scanning."
      });
    }

    const now = new Date();
    const nextAvailable = recentScan.nextScanAvailableAt;

    if (nextAvailable && nextAvailable > now) {
      // Still within 24-hour cooldown from last successful verification
      const remainingMs = nextAvailable - now;
      const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
      const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

      return res.json({
        eligible: false,
        message: "Scan limit reached. Try again later.",
        nextAvailableAt: nextAvailable,
        remainingTime: {
          hours: remainingHours,
          minutes: remainingMinutes
        }
      });
    }

    // 24 hours passed - eligible
    return res.json({
      eligible: true,
      message: "You can proceed with scanning."
    });

  } catch (error) {
    console.error("Scan eligibility check error:", error);
    return res.status(500).json({ 
      eligible: false,
      message: "Failed to check scan eligibility." 
    });
  }
};

/**
 * UPLOAD PLATE IMAGE
 * Handle image upload and create/update scan record
 */
export const uploadPlateImage = async (req, res) => {
  try {
    const { scanId, deviceFingerprint, shopId, itemId, restaurantId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded." });
    }

    if (!deviceFingerprint) {
      return res.status(400).json({ message: "Device identifier is required." });
    }

    // Check 24-hour limit (only count approved scans)
    const recentScan = await Scan.findOne({ 
      deviceFingerprint,
      verificationStatus: "approved"
    })
      .sort({ scannedAt: -1 })
      .limit(1);

    const now = new Date();
    if (recentScan && recentScan.nextScanAvailableAt && recentScan.nextScanAvailableAt > now) {
      return res.status(429).json({ 
        message: "Scan limit reached. You can only scan once every 24 hours.",
        nextAvailableAt: recentScan.nextScanAvailableAt
      });
    }

    // Store relative path for the uploaded image
    const plateImageUrl = `/uploads/${req.file.filename}`;
    
    // Don't set nextScanAvailableAt here - only set it after successful verification

    let scan;

    if (scanId) {
      // Update existing scan
      scan = await Scan.findByIdAndUpdate(
        scanId,
        {
          plateImageUrl,
          verificationStatus: "pending",
          deviceFingerprint,
          scannedAt: now
        },
        { new: true }
      );
    } else {
      // Create new scan (shop, item, restaurant info are optional for standalone verification)
      scan = await Scan.create({
        restaurant: restaurantId || null,
        shop: shopId || null,
        item: itemId || null,
        originalPrice: 0,
        discountedPrice: 0,
        discountAmount: 0,
        plateImageUrl,
        verificationStatus: "pending",
        deviceFingerprint,
        nextScanAvailableAt: null, // Will be set only if verification succeeds
        scannedAt: now
      });
    }

    return res.status(200).json({
      message: "Image uploaded successfully. Verification in progress...",
      scan: {
        id: scan._id,
        plateImageUrl: scan.plateImageUrl,
        verificationStatus: scan.verificationStatus,
        nextScanAvailableAt: scan.nextScanAvailableAt
      }
    });

  } catch (error) {
    console.error("Plate image upload error:", error);
    return res.status(500).json({ message: "Failed to upload image." });
  }
};

/**
 * VERIFY PLATE
 * Placeholder for AI-based verification
 * Currently uses basic logic (filename contains "clean")
 * Structure ready for future ML model integration
 */
export const verifyPlate = async (req, res) => {
  try {
    const { scanId } = req.params;

    const scan = await Scan.findById(scanId);
    if (!scan) {
      return res.status(404).json({ message: "Scan not found." });
    }

    if (!scan.plateImageUrl) {
      return res.status(400).json({ message: "No plate image uploaded." });
    }

    // PLACEHOLDER VERIFICATION LOGIC
    // TODO: Replace with actual AI model integration
    const isClean = await performPlateVerification(scan.plateImageUrl);

    const verificationStatus = isClean ? "approved" : "rejected";
    const rewardUnlocked = isClean;

    // Update scan record
    scan.verificationStatus = verificationStatus;
    scan.rewardUnlocked = rewardUnlocked;
    scan.verifiedAt = new Date();
    
    // Only set 24-hour cooldown if verification is successful
    if (isClean) {
      const now = new Date();
      scan.nextScanAvailableAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
    
    await scan.save();

    return res.json({
      message: isClean 
        ? "Plate verified! Your reward is unlocked." 
        : "Plate verification failed. Food leftovers detected.",
      scan: {
        id: scan._id,
        verificationStatus: scan.verificationStatus,
        rewardUnlocked: scan.rewardUnlocked
      }
    });

  } catch (error) {
    console.error("Plate verification error:", error);
    return res.status(500).json({ message: "Verification failed." });
  }
};

/**
 * PERFORM PLATE VERIFICATION (Internal Helper)
 * Placeholder for AI model
 * Returns: boolean (true = clean plate, false = food remains)
 */
async function performPlateVerification(imageUrl) {
  // TEMPORARY: Auto-approve all plates until AI model is integrated
  // In production, this would call an AI model API to analyze the image
  
  // Extract filename from path
  const filename = path.basename(imageUrl).toLowerCase();
  
  // Simulate verification delay (realistic processing time)
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // TEMPORARY LOGIC: Auto-approve all plates for testing
  // TODO: Replace with actual AI vision model
  const isClean = true; // Accept all plates for now
  
  console.log(`[PLATE VERIFICATION] Image: ${filename} | Result: ${isClean ? "APPROVED - CLEAN PLATE" : "REJECTED - FOOD DETECTED"}`);
  
  return isClean;
  
  /* 
   * FUTURE AI INTEGRATION EXAMPLE:
   * 
   * const aiResponse = await fetch('https://your-ai-model-api.com/verify', {
   *   method: 'POST',
   *   body: JSON.stringify({ imageUrl }),
   *   headers: { 'Content-Type': 'application/json' }
   * });
   * const result = await aiResponse.json();
   * return result.isClean;
   * 
   * OR for testing rejection scenarios:
   * const isClean = !filename.includes("food") && !filename.includes("leftovers");
   */
}

/**
 * GET SCAN STATUS
 * Retrieve current scan status for a user
 */
export const getScanStatus = async (req, res) => {
  try {
    const { scanId } = req.params;

    const scan = await Scan.findById(scanId)
      .populate("shop", "name")
      .populate("item", "name price")
      .populate("restaurant", "name");

    if (!scan) {
      return res.status(404).json({ message: "Scan not found." });
    }

    return res.json({
      scan: {
        id: scan._id,
        plateImageUrl: scan.plateImageUrl,
        verificationStatus: scan.verificationStatus,
        rewardUnlocked: scan.rewardUnlocked,
        nextScanAvailableAt: scan.nextScanAvailableAt,
        shop: scan.shop,
        item: scan.item,
        restaurant: scan.restaurant,
        scannedAt: scan.scannedAt,
        verifiedAt: scan.verifiedAt
      }
    });

  } catch (error) {
    console.error("Get scan status error:", error);
    return res.status(500).json({ message: "Failed to retrieve scan status." });
  }
};
