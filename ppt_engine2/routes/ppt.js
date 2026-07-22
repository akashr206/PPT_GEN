import { Router } from "express";
import Joi from "joi";
import { generatePPT, getStatus, getPPTById, getAllPPTs, deletePPT, updateTemplate, searchImages, searchIcons, streamPPT, convertPPT, editSlide, toggleShare } from "../controllers/ppt.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateSchema } from "../middleware/validate.js";
import { apiLimiter, generateLimiter } from "../middleware/rateLimiter.js";
const router = Router();

const generateSchema = Joi.object({
    prompt: Joi.string().max(10000).required(),
    tone: Joi.string().max(50).required(),
    slidesCount: Joi.number().min(1).max(15).required(),
    layoutStyle: Joi.string().max(50).optional(),
    thinking: Joi.string().max(50).optional()
});

const streamSchema = Joi.object({
    generating: Joi.string().optional(),
    prompt: Joi.string().max(10000).required(),
    tone: Joi.string().max(50).required(),
    slidesCount: Joi.number().min(1).max(15).required(),
    layoutStyle: Joi.string().max(50).optional(),
    thinking: Joi.string().max(50).optional()
});

const editSlideSchema = Joi.object({
    slide: Joi.object().required(),
    prompt: Joi.string().max(10000).required(),
    presentationTitle: Joi.string().allow('', null).optional(),
    slideTitles: Joi.array().items(Joi.string().allow('', null)).optional(),
    slideIndex: Joi.number().allow(null).optional()
});

// Public media search routes (rate limited)
router.get("/images/search", apiLimiter, searchImages);
router.get("/icons/search", apiLimiter, searchIcons);

router.use(authMiddleware);
router.use(apiLimiter);
// /api/ppt/ - POST: generates ppt content
// /api/ppt/ - GET: gets all the ppt
// /api/ppt/images/search - GET: searches matching images from Pixabay
// /api/ppt/icons/search - GET: searches matching icons from Supabase
// /api/ppt/convert - POST: converts slides array to pptx and streams it to client
// /api/ppt/stream/ppt_id - GET: streams generated slides content (SSE)
// /api/ppt/ppt_id - GET: gets ppt of sent id
// /api/ppt/ppt_id - DELETE: deletes the ppt of sent id
// /api/ppt/ppt_id - PATCH: Updates theme or slides array
// /api/ppt/status/ppt_id: Gets status of that ppt_id
// /api/ppt/ppt_id/share - POST: Updates sharing status

router.post("/", generateLimiter, validateSchema(generateSchema, 'body'), generatePPT);
router.post("/edit-slide", generateLimiter, validateSchema(editSlideSchema, 'body'), editSlide);
router.get("/", getAllPPTs);
router.get("/stream/:ppt_id", generateLimiter, validateSchema(streamSchema, 'query'), streamPPT);
router.post("/convert", convertPPT);
router.get("/:ppt_id", getPPTById);
router.delete("/:ppt_id", deletePPT);
router.patch("/:ppt_id", updateTemplate);
router.get("/status/:ppt_id", getStatus);
router.post("/:ppt_id/share", toggleShare);

export default router;
