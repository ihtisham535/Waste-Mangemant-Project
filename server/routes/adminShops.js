import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { listShops, createShop, updateShop, deleteShop } from "../controllers/shopController.js";

const router = express.Router();

router.get("/", adminAuth, listShops);
router.post("/", adminAuth, createShop);
router.put("/:id", adminAuth, updateShop);
router.delete("/:id", adminAuth, deleteShop);

export default router;
