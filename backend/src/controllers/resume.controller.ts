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
    console.log("STEP 1: File received:", file.originalname);
    

const uploadResult = await new Promise<any>((resolve, reject) => {    
      const stream = cloudinary.uploader.upload_stream(
  {
    resource_type: "raw",
    type: "upload",
    access_mode: "public",
    use_filename: true,
    unique_filename: true,
  }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      stream.end(file.buffer);
    });
console.log("STEP 2: Cloudinary upload success");
console.log("Cloudinary URL:", uploadResult.secure_url);
    // Save resume record
    console.log("STEP 3: Saving resume to database");
    const resume = await prisma.resume.create({
      data: {
        fileUrl: uploadResult.secure_url,
        extractedText: file.originalname,
        user: { connect: { id: user.userId } },
      },
    });
    console.log("STEP 4: Resume saved:", resume.id);
    

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
console.log("Resume URL:", resume.fileUrl);
console.log("STEP 5: Downloading resume from Cloudinary");
   const response = await fetch(resume.fileUrl);

console.log("Cloudinary Status:", response.status);
console.log("Cloudinary Status Text:", response.statusText);
console.log("Cloudinary Headers:", Object.fromEntries(response.headers.entries()));

if (!response.ok) {
  throw new Error(`Failed to download resume. Status: ${response.status}`);
}
    console.log("STEP 6: Download successful");
    
    const buffer = Buffer.from(await response.arrayBuffer());
    console.log("Buffer size:", buffer.length);
console.log("First 20 bytes:", buffer.subarray(0, 20).toString());
    console.log("Buffer size:", buffer.length);
console.log("First 20 bytes:", buffer.subarray(0, 20).toString());
    const extractedText = await extractTextFromBuffer(
  buffer,
  "resume.pdf"
);

console.log(
  "Extracted text:",
  extractedText.substring(0, 500)
);
    const parsed = parseResumeText(extractedText);
    console.log("PARSED DATA:");
console.log(JSON.stringify(parsed, null, 2));

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
