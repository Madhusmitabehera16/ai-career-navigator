import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import { prisma } from "../config/prisma";

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
