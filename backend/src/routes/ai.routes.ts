import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  analyzeResume,
  createSkillGap,
  generateRoadmap,
  improveResume,
  startInterview,
  evaluateInterview,
  matchJobs,
  getAnalytics,
  getResumeAnalysisData,
  getSkillGapData,
  getRoadmapData,
  getInterviewData,
  getJobMatchingData,
  getUserAnalytics,
} from "../controllers/ai.controller";

const router = Router();

// Legacy endpoints
router.post("/analyze/resume/:resumeId", authenticate as any, analyzeResume as any);
router.post("/skill-gap", authenticate as any, createSkillGap as any);
router.post("/roadmap/generate", authenticate as any, generateRoadmap as any);
router.post("/resume/improve", authenticate as any, improveResume as any);
router.post("/interview/start", authenticate as any, startInterview as any);
router.post("/interview/evaluate", authenticate as any, evaluateInterview as any);
router.post("/jobs/match", authenticate as any, matchJobs as any);
router.get("/admin/analytics", authenticate as any, getAnalytics as any);

// Dashboard endpoints for hooks
router.post("/analytics", authenticate as any, getUserAnalytics as any);
router.post("/resume-analysis", authenticate as any, getResumeAnalysisData as any);
router.post("/skill-gap", authenticate as any, getSkillGapData as any);
router.post("/roadmap", authenticate as any, getRoadmapData as any);
router.post("/interview", authenticate as any, getInterviewData as any);
router.post("/job-matching", authenticate as any, getJobMatchingData as any);

export default router;
