import express from "express";
import shopkeeperAuth from "../middleware/shopkeeperAuth.js";
import { getShopkeeperProfile } from "../controllers/shopkeeperProfileController.js";

const router = express.Router();

router.get("/me", shopkeeperAuth, getShopkeeperProfile);

export default router;
