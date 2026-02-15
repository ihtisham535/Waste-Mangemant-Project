import mongoose from "mongoose";

// Order schema defines the data structure for each order
const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    items: { type: [String], required: true },
    total: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
