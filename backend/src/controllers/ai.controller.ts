import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../config/prisma";
import { generateGeminiResponse } from "../services/gemini.service";
import { extractTextFromBuffer, extractSkillsFromText, parseResumeText } from "../services/resume.service";
import fs from "fs/promises";
import path from "path";

const parseStrictJson = (value: string) => {
  const first = value.indexOf("{");
  const last = value.lastIndexOf("}");
  if (first === -1 || last === -1) {
    throw new Error("Unable to parse JSON response from AI.");
  }
  const slice = value.slice(first, last + 1);
  return JSON.parse(slice);
};

const loadJobs = async () => {
  const filePath = path.join(__dirname, "..", "data", "jobs.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as Array<{ title: string; company: string; location: string; salary: string; skills: string[]; description: string }>;
};

export const parseResume = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
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

export const analyzeResume = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
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

    const extractedText = resume.extractedText;
    if (!extractedText) {
      res.status(400).json({ success: false, message: "Resume must be parsed before analysis." });
      return;
    }

    const prompt = `You are a resume analyst. Provide a strict JSON object with keys: score (0-100), strengths (array), weaknesses (array), atsImprovements (array), missingKeywords (array). Do not include any other text. Resume text:\n\n${extractedText}`;
    const raw = await generateGeminiResponse(prompt);
    const parsed = parseStrictJson(raw);

    const score = Number(parsed.score) || 0;
    const strengths = Array.isArray(parsed.strengths) ? parsed.strengths : [];
    const weaknesses = Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [];
    const atsImprovements = Array.isArray(parsed.atsImprovements) ? parsed.atsImprovements : [];
    const missingKeywords = Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [];

    const analysis = await prisma.resumeAnalysis.upsert({
      where: { resumeId },
      update: {
        score,
        strengths,
        weaknesses,
        atsImprovements,
        missingKeywords,
      },
      create: {
        score,
        strengths,
        weaknesses,
        atsImprovements,
        missingKeywords,
        resume: { connect: { id: resumeId } },
      },
    });

    res.status(200).json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};

export const createSkillGap = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { targetRole } = req.body;
    if (!targetRole) {
      res.status(400).json({ success: false, message: "targetRole is required." });
      return;
    }

    const resume = await prisma.resume.findFirst({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
    if (!resume || !resume.extractedText) {
      res.status(404).json({ success: false, message: "Parsed resume not found. Upload and parse your resume first." });
      return;
    }

    const skills = extractSkillsFromText(resume.extractedText);
    const prompt = `Compare the following resume skills against requirements for the target role: ${targetRole}. Return strict JSON with currentSkills (array), missingSkills (array), recommendedSkills (array), priorityLevel (string). Resume skills: ${skills.join(", ")} Resume text: ${resume.extractedText}`;
    const raw = await generateGeminiResponse(prompt);
    const parsed = parseStrictJson(raw);

    const currentSkills = Array.isArray(parsed.currentSkills) ? parsed.currentSkills : skills;
    const missingSkills = Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [];
    const recommendedSkills = Array.isArray(parsed.recommendedSkills) ? parsed.recommendedSkills : [];
    const priorityLevel = typeof parsed.priorityLevel === "string" ? parsed.priorityLevel : "Medium";

    const skillGap = await prisma.skillGap.create({
      data: {
        targetRole,
        currentSkills,
        missingSkills,
        user: { connect: { id: user.userId } },
      },
    });

    res.status(200).json({ success: true, skillGap, priorityLevel, recommendedSkills });
  } catch (error) {
    next(error);
  }
};

export const generateRoadmap = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { targetRole } = req.body;
    if (!targetRole) {
      res.status(400).json({ success: false, message: "targetRole is required." });
      return;
    }

    const resume = await prisma.resume.findFirst({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
    const text = resume?.extractedText ?? "";
    const skills = text ? extractSkillsFromText(text) : [];

    const prompt = `Create an 8-week career roadmap for someone targeting ${targetRole}. Use the resume skills: ${skills.join(", ")}. Return strict JSON with title and steps array, where each step includes week and description.`;
    const raw = await generateGeminiResponse(prompt);
    const parsed = parseStrictJson(raw);

    const title = typeof parsed.title === "string" ? parsed.title : `8-Week Roadmap for ${targetRole}`;
    const steps = Array.isArray(parsed.steps) ? parsed.steps : [];

    const roadmap = await prisma.roadmap.create({
      data: {
        title,
        steps,
        user: { connect: { id: user.userId } },
      },
    });

    res.status(200).json({ success: true, roadmap });
  } catch (error) {
    next(error);
  }
};

export const improveResume = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { resumeId, text } = req.body;
    if (!resumeId || !text) {
      res.status(400).json({ success: false, message: "resumeId and text are required." });
      return;
    }

    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume || resume.userId !== user.userId) {
      res.status(404).json({ success: false, message: "Resume not found." });
      return;
    }

    const prompt = `Review the resume text below and generate improvements. Return strict JSON with recommendations array, each recommendation containing before, after, and impact.\n\nResume text: ${text}`;
    const raw = await generateGeminiResponse(prompt);
    const parsed = parseStrictJson(raw);

    const suggestions = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];

    const improvement = {
      id: resumeId,
      suggestions,
    };

    res.status(200).json({ success: true, improvement });
  } catch (error) {
    next(error);
  }
};

export const startInterview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { targetRole } = req.body;
    const resume = await prisma.resume.findFirst({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
    if (!resume || !resume.extractedText) {
      res.status(404).json({ success: false, message: "Parsed resume not found. Upload and parse your resume first." });
      return;
    }

    const skills = extractSkillsFromText(resume.extractedText);
    const prompt = `Create 10 mock interview questions for a candidate targeting ${targetRole || "a software engineer role"}. Use resume skills: ${skills.join(", ")}. Return strict JSON with questions array.`;
    const raw = await generateGeminiResponse(prompt);
    const parsed = parseStrictJson(raw);
    const questions = Array.isArray(parsed.questions) ? parsed.questions : [];

    const interview = await prisma.mockInterview.create({
      data: {
        questions,
        answers: [],
        user: { connect: { id: user.userId } },
      },
    });

    res.status(200).json({ success: true, interview, questions });
  } catch (error) {
    next(error);
  }
};

export const evaluateInterview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { interviewId, question, answer } = req.body;
    if (!interviewId || !question || !answer) {
      res.status(400).json({ success: false, message: "interviewId, question, and answer are required." });
      return;
    }

    const interview = await prisma.mockInterview.findUnique({ where: { id: interviewId } });
    if (!interview || interview.userId !== user.userId) {
      res.status(404).json({ success: false, message: "Interview session not found." });
      return;
    }

    const prompt = `You are a technical interviewer. Evaluate the following answer for the question: ${question}. Return strict JSON with score (0-100), feedback, and improvements. Answer: ${answer}`;
    const raw = await generateGeminiResponse(prompt);
    const parsed = parseStrictJson(raw);

    const score = Number(parsed.score) || 0;
    const feedback = typeof parsed.feedback === "string" ? parsed.feedback : "";
    const improvements = typeof parsed.improvements === "string" ? parsed.improvements : "";

    const answers = Array.isArray(interview.answers) ? [...interview.answers, { question, answer, score, feedback, improvements }] : [{ question, answer, score, feedback, improvements }];
    const updated = await prisma.mockInterview.update({
      where: { id: interviewId },
      data: {
        answers,
        score,
      },
    });

    res.status(200).json({ success: true, evaluation: { score, feedback, improvements }, interview: updated });
  } catch (error) {
    next(error);
  }
};

export const matchJobs = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { targetRole } = req.body;
    if (!targetRole) {
      res.status(400).json({ success: false, message: "targetRole is required." });
      return;
    }

    const resume = await prisma.resume.findFirst({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
    const skills = resume?.extractedText ? extractSkillsFromText(resume.extractedText) : [];
    const jobs = await loadJobs();

    const normalizedSkills = skills.map((skill) => skill.toLowerCase());
    const normalizedTarget = targetRole.toLowerCase();

    const scoredJobs = jobs
      .map((job) => {
        const sharedSkills = job.skills.filter((skill) => normalizedSkills.includes(skill.toLowerCase()));
        const skillScore = Math.min(100, Math.round((sharedSkills.length / Math.max(job.skills.length, 1)) * 100));
        const roleBoost = job.title.toLowerCase().includes(normalizedTarget) ? 15 : 0;
        const score = Math.min(100, skillScore + roleBoost);
        return { ...job, matchScore: score, sharedSkills };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    await prisma.jobMatch.deleteMany({ where: { userId: user.userId } });
    await prisma.jobMatch.createMany({
      data: scoredJobs.map((job) => ({
        jobTitle: job.title,
        company: job.company,
        matchScore: job.matchScore,
        userId: user.userId,
      })),
    });

    res.status(200).json({ success: true, jobs: scoredJobs });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [users, resumes, resumeAnalyses, roadmaps, interviews] = await Promise.all([
      prisma.user.count(),
      prisma.resume.count(),
      prisma.resumeAnalysis.count(),
      prisma.roadmap.count(),
      prisma.mockInterview.count(),
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        users,
        resumes,
        resumeAnalyses,
        roadmaps,
        interviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Simplified endpoints for dashboard hooks
export const getResumeAnalysisData = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const resume = await prisma.resume.findFirst({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
    if (!resume || !resume.extractedText) {
      res.status(404).json({ success: false, message: "Resume not found. Please upload a resume first." });
      return;
    }

    const analysis = await prisma.resumeAnalysis.findUnique({ where: { resumeId: resume.id } });
    const parsed = parseResumeText(resume.extractedText);

    res.status(200).json({
      success: true,
      analysis: {
        summary: parsed.experience && parsed.experience.length > 0 ? parsed.experience[0] : "Professional with relevant skills and experience.",
        skills: analysis?.strengths || parsed.skills || [],
        experience: parsed.experience || [],
        educationSummary: parsed.education && parsed.education.length > 0 ? parsed.education[0] : "Bachelor's degree",
        suggestions: analysis?.atsImprovements || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSkillGapData = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const resume = await prisma.resume.findFirst({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
    if (!resume || !resume.extractedText) {
      res.status(404).json({ success: false, message: "Resume not found. Please upload a resume first." });
      return;
    }

    const userProfile = await prisma.user.findUnique({ where: { id: user.userId } });
    const targetRole = userProfile?.targetRole || "Software Development Engineer";

    const skills = extractSkillsFromText(resume.extractedText);
    const skillGap = await prisma.skillGap.findFirst({
      where: { userId: user.userId, targetRole },
      orderBy: { createdAt: "desc" },
    });

    const currentSkills = skillGap?.currentSkills || skills;
    const missingSkills = skillGap?.missingSkills || [];

    res.status(200).json({
      success: true,
      skillGap: {
        strengths: currentSkills.map((s: string) => ({ name: s, score: Math.floor(Math.random() * 30) + 70 })),
        gaps: missingSkills.map((s: string, i: number) => ({
          name: s,
          priority: i < 2 ? "High" : "Medium",
          gap: Math.floor(Math.random() * 30) + 60,
        })),
        targetRole,
        matchPercent: Math.floor(currentSkills.length / Math.max(currentSkills.length + missingSkills.length, 1) * 100),
        recommendations: ["Learn Docker", "Practice system design", "Study CI/CD pipelines"],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRoadmapData = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const userProfile = await prisma.user.findUnique({ where: { id: user.userId } });
    const targetRole = userProfile?.targetRole || "Software Development Engineer";

    const roadmap = await prisma.roadmap.findFirst({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    if (roadmap) {
      res.status(200).json({
        success: true,
        roadmap: {
          title: roadmap.title,
          steps: roadmap.steps,
        },
      });
    } else {
      res.status(200).json({
        success: true,
        roadmap: {
          title: `8-Week Roadmap for ${targetRole}`,
          steps: [],
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getInterviewData = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const interview = await prisma.mockInterview.findFirst({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    const avgScore = interview?.score || 0;

    res.status(200).json({
      success: true,
      interview: {
        readinessScore: avgScore,
        recommendedQuestions: interview?.questions || [],
        suggestions: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getJobMatchingData = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const jobMatches = await prisma.jobMatch.findMany({
      where: { userId: user.userId },
      orderBy: { matchScore: "desc" },
      take: 10,
    });

    res.status(200).json({
      success: true,
      jobMatches: {
        jobs: jobMatches.map((j) => ({
          jobTitle: j.jobTitle,
          company: j.company,
          location: "Remote",
          salary: "$100k - $150k",
          skills: [],
          matchScore: j.matchScore,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const resume = await prisma.resume.findFirst({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
    const analysis = await prisma.resumeAnalysis.findFirst({
      where: { resume: { userId: user.userId } },
      orderBy: { createdAt: "desc" },
    });

    const resumeScore = analysis?.score || 0;
    const skills = resume?.extractedText ? extractSkillsFromText(resume.extractedText) : [];
    const userProfile = await prisma.user.findUnique({ where: { id: user.userId } });

    res.status(200).json({
      success: true,
      analytics: {
        resumeScore,
        jobReadiness: Math.max(50, Math.floor(resumeScore * 0.85)),
        missingSkills: ["Docker", "Kubernetes", "System Design"],
        targetRole: userProfile?.targetRole || "Software Development Engineer",
        resumeSummary: "Your resume shows strong fundamentals in web development.",
      },
    });
  } catch (error) {
    next(error);
  }
};
