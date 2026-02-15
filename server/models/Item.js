import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, min: 0 },
    originalPrice: { type: Number, min: 0, default: 0 },
    discountedPrice: { type: Number, min: 0, default: 0 },
    quantityAvailable: { type: Number, min: 0, default: 0 },
    discountActive: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;
