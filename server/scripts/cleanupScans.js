import mongoose from "mongoose";
import dotenv from "dotenv";
import Scan from "../models/Scan.js";

dotenv.config();

/**
 * Cleanup Script for Scan Records
 * Removes nextScanAvailableAt from rejected/pending scans
 * Only approved scans should have the 24-hour cooldown
 */
async function cleanupScans() {
  try {
    console.log("🔧 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB Atlas\n");

    // Find all scans that are NOT approved but have nextScanAvailableAt set
    const result = await Scan.updateMany(
      {
        verificationStatus: { $ne: "approved" },
        nextScanAvailableAt: { $ne: null }
      },
      {
        $set: { nextScanAvailableAt: null }
      }
    );

    console.log(`✓ Cleanup complete!`);
    console.log(`  - Scans updated: ${result.modifiedCount}`);
    console.log(`  - These scans had their 24-hour cooldown removed`);
    console.log(`  - Users can now retry failed verifications\n`);

    // Show summary of scan statuses
    const approved = await Scan.countDocuments({ verificationStatus: "approved" });
    const pending = await Scan.countDocuments({ verificationStatus: "pending" });
    const rejected = await Scan.countDocuments({ verificationStatus: "rejected" });

    console.log("📊 Scan Summary:");
    console.log(`  - Approved: ${approved}`);
    console.log(`  - Pending: ${pending}`);
    console.log(`  - Rejected: ${rejected}`);
    console.log(`  - Total: ${approved + pending + rejected}\n`);

    await mongoose.connection.close();
    console.log("✓ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  }
}

cleanupScans();
