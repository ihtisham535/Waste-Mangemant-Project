import express from "express";
import Order from "../models/Order.js";
import Scan from "../models/Scan.js";

const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  try {
    const order = await Order.create(req.body);

    if (req.body.scan) {
      const scanPayload = {
        restaurant: req.body.scan.restaurantId || req.body.restaurant,
        shop: req.body.scan.shopId,
        item: req.body.scan.itemId,
        originalPrice: req.body.scan.originalPrice,
        discountedPrice: req.body.scan.discountedPrice,
        discountAmount: req.body.scan.discountAmount,
        guestName: req.body.scan.guestName,
      };

      const requiredFields = [
        "restaurant",
        "shop",
        "item",
        "originalPrice",
        "discountedPrice",
        "discountAmount",
      ];

      const hasAllRequired = requiredFields.every((field) =>
        scanPayload[field] !== undefined && scanPayload[field] !== null
      );

      if (hasAllRequired) {
        await Scan.create(scanPayload);
      }
    }
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an order by ID
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an order by ID
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
