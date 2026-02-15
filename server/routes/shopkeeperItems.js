import express from "express";
import shopkeeperAuth from "../middleware/shopkeeperAuth.js";
import {
  listShopItems,
  createShopItem,
  updateShopItem,
  deleteShopItem,
} from "../controllers/shopkeeperItemController.js";

const router = express.Router();

router.get("/", shopkeeperAuth, listShopItems);
router.post("/", shopkeeperAuth, createShopItem);
router.put("/:id", shopkeeperAuth, updateShopItem);
router.delete("/:id", shopkeeperAuth, deleteShopItem);

export default router;
