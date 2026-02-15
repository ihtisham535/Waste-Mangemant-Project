import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { listItems, updateItem } from "../controllers/itemController.js";

const router = express.Router();

router.get("/", adminAuth, listItems);
router.put("/:id", adminAuth, updateItem);

export default router;
