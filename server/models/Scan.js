import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: false, default: null },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: false, default: null },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: false, default: null },
    originalPrice: { type: Number, default: 0, min: 0 },
    discountedPrice: { type: Number, default: 0, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    guestName: { type: String, trim: true },
    scannedAt: { type: Date, default: Date.now },
    
    // Plate Verification Fields
    plateImageUrl: { type: String, default: null },
    verificationStatus: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" 
    },
    rewardUnlocked: { type: Boolean, default: false },
    nextScanAvailableAt: { type: Date, default: null },
    deviceFingerprint: { type: String, default: null }, // To track unique users
    verifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Index for faster lookups on device fingerprint and scan time
scanSchema.index({ deviceFingerprint: 1, scannedAt: -1 });

const Scan = mongoose.model("Scan", scanSchema);

export default Scan;
