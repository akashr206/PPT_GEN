import { Router } from "express";
import { generatePPT, getStatus, getPPTById, getAllPPTs, deletePPT, updateTemplate, searchImages, searchIcons, streamPPT, convertPPT, editSlide } from "../controllers/ppt.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.use(authMiddleware)
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

router.post("/", generatePPT);
router.post("/edit-slide", editSlide);
router.get("/", getAllPPTs);
router.get("/images/search", searchImages);
router.get("/icons/search", searchIcons);
router.get("/stream/:ppt_id", streamPPT);
router.post("/convert", convertPPT);
router.get("/:ppt_id", getPPTById);
router.delete("/:ppt_id", deletePPT);
router.patch("/:ppt_id", updateTemplate);
router.get("/status/:ppt_id", getStatus);


export default router;
