import express from "express";
import { loginShopkeeper, logoutShopkeeper } from "../controllers/shopkeeperAuthController.js";

const router = express.Router();

router.post("/login", loginShopkeeper);
router.post("/logout", logoutShopkeeper);

export default router;
