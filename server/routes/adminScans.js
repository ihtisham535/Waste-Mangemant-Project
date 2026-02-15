import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { listScans, dashboardMetrics } from "../controllers/scanController.js";

const router = express.Router();

router.get("/", adminAuth, listScans);
router.get("/metrics", adminAuth, dashboardMetrics);

export default router;
