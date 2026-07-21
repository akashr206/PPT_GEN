import { Router } from "express";
import { getSharedPPT } from "../controllers/ppt.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Apply rate limiting to public endpoints to prevent abuse
router.use(apiLimiter);

// GET /api/share/:ppt_id - Retrieves a presentation if it is marked as shared
router.get("/:ppt_id", getSharedPPT);

export default router;
