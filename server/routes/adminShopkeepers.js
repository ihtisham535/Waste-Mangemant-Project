import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { listShopkeepers, createShopkeeper, updateShopkeeper, deleteShopkeeper } from "../controllers/shopkeeperController.js";

const router = express.Router();

router.get("/", adminAuth, listShopkeepers);
router.post("/", adminAuth, createShopkeeper);
router.put("/:id", adminAuth, updateShopkeeper);
router.delete("/:id", adminAuth, deleteShopkeeper);

export default router;
