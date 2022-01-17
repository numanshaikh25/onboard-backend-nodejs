import express from "express";
const router = express.Router();

import { getEmployees } from "../controllers/employeeController";
import { protect } from "../middleware/authMiddleware.js";

router.route("/getemployees").get(protect, getEmployees);

export default router;
