export interface Resume {
  id: string;
  fileUrl: string;
  extractedText?: string;
  createdAt: string;
}

export interface ResumeAnalysisData {
  summary: string;
  skills: string[];
  experience: string[];
  educationSummary: string;
  suggestions: string[];
}

export interface SkillGapData {
  strengths: Array<{ name: string; score: number }>;
  gaps: Array<{ name: string; priority: string; gap: number }>;
  targetRole: string;
  matchPercent: number;
  recommendations: string[];
}

export interface RoadmapStep {
  week: string;
  title: string;
  desc: string;
  status: "completed" | "in-progress" | "pending";
}

export interface RoadmapData {
  title: string;
  steps: RoadmapStep[];
}

export interface InterviewData {
  readinessScore: number;
  recommendedQuestions: string[];
  suggestions: string[];
}

export interface JobMatchData {
  jobs: Array<{
    jobTitle: string;
    company: string;
    location?: string;
    salary?: string;
    skills?: string[];
    matchScore: number;
  }>;
}

export interface ImprovementsData {
  suggestions: Array<{
    before: string;
    after: string;
    impact: string;
    metric: string;
  }>;
}

export interface AnalyticsData {
  resumeScore: number;
  jobReadiness: number;
  matchPercentage: number;
  missingSkills: string[];
  companyName: string;
  targetRole: string;
  resumeSummary: string;
  improvementsCount: number;
  questionsCount: number;
  roadmapStepsCount: number;
}
