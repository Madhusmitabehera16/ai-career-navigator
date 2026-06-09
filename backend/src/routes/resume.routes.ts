import { Router } from "express";
import * as resumeController from "../controllers/resume.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// Protect all resume routes
router.post("/upload", authenticate, upload.single("file"), resumeController.upload);
router.get("/me", authenticate, resumeController.getMyResume);
router.post("/parse/:resumeId", authenticate, resumeController.parseResume);

export default router;
