import { Router } from "express";
import * as resumeController from "../controllers/resume.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import cloudinary from "../config/cloudinary";

import app from "../app";

const router = Router();


router.get("/cloudinary-test", async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Protect all resume routes
router.post("/upload", authenticate, upload.single("file"), resumeController.upload);
router.get("/me", authenticate, resumeController.getMyResume);
router.post("/parse/:resumeId", authenticate, resumeController.parseResume);

export default router;
