import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { getRestaurant, upsertRestaurant } from "../controllers/restaurantController.js";

const router = express.Router();

router.get("/", adminAuth, getRestaurant);
router.post("/", adminAuth, upsertRestaurant);
router.put("/", adminAuth, upsertRestaurant);

export default router;
