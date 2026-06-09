import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import { prisma } from "../config/prisma";
import { extractTextFromBuffer, parseResumeText } from "../services/resume.service";

// POST /api/resume/upload
export const upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // user set by auth middleware, payload contains userId
    const user = (req as any).user;
    if (!user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    // multer puts the file buffer on req.file
    const file = (req as any).file;
    if (!file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }

    // Upload to Cloudinary using upload_stream (supports buffer)
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      stream.end(file.buffer);
    });

    // Save resume record
    const resume = await prisma.resume.create({
      data: {
        fileUrl: uploadResult.secure_url,
        user: { connect: { id: user.userId } },
      },
    });

    res.status(201).json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

// POST /api/resume/parse/:resumeId
export const parseResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const resumeId = Array.isArray(req.params.resumeId)
      ? req.params.resumeId[0]
      : (req.params.resumeId as string | undefined);
    if (!resumeId) {
      res.status(400).json({ success: false, message: "Resume ID is required." });
      return;
    }
    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume || resume.userId !== user.userId) {
      res.status(404).json({ success: false, message: "Resume not found." });
      return;
    }

    const response = await fetch(resume.fileUrl);
    if (!response.ok) {
      throw new Error("Failed to download resume for parsing.");
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const extractedText = await extractTextFromBuffer(buffer, resume.fileUrl);
    const parsed = parseResumeText(extractedText);

    const updated = await prisma.resume.update({
      where: { id: resumeId },
      data: { extractedText },
    });

    res.status(200).json({ success: true, resume: updated, parsed });
  } catch (error) {
    next(error);
  }
};

// GET /api/resume/me - fetch current user's resume (first one)
export const getMyResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const resume = await prisma.resume.findFirst({ where: { userId: user.userId } });
    if (!resume) {
      res.status(404).json({ success: false, message: "Resume not found" });
      return;
    }
    res.status(200).json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};
