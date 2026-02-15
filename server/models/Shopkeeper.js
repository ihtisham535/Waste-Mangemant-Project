import mongoose from "mongoose";

const shopkeeperSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Shopkeeper = mongoose.model("Shopkeeper", shopkeeperSchema);

export default Shopkeeper;
