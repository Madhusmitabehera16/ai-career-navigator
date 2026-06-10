"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Briefcase, AlertTriangle, CheckCircle, TrendingUp, Users } from "lucide-react";
import { useAnalytics } from "@/src/hooks/useAnalytics";

export default function Overview() {
  const { data, isLoading } = useAnalytics();
 const resumeScore = data?.resumeScore || 0;
const jobReadiness = data?.jobReadiness || 0;
const missingSkills = data?.missingSkills || [];
const targetRole = data?.targetRole || "";
const resumeSummary = data?.resumeSummary || "";
if (isLoading) {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-500">Loading dashboard...</p>
    </div>
  );
}
if (!data) {
  return (
    <Card className="p-8">
      <h3 className="font-bold text-lg">
        No Analytics Available
      </h3>

      <p className="text-slate-500 mt-2">
        Analyze your resume to generate dashboard insights.
      </p>
    </Card>
  );
}

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back! Here is a summary of your resume analysis and career tracking.
        </p>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Resume Score */}
        <Card className="bg-white border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#F4B400]">
                <Award className="w-5.5 h-5.5 stroke-[2.5]" />
              </div>
             
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Resume Score
              </span>
              <span className="text-4xl font-extrabold text-slate-900 mt-2">
                {resumeScore}%
              </span>
              <div className="mt-4">
                <Progress value={resumeScore} className="h-1.5 bg-slate-100 [&>div]:bg-[#F4B400]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Job Readiness */}
        <Card className="bg-white border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <TrendingUp className="w-5.5 h-5.5 stroke-[2.5]" />
              </div>
             
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Job Readiness
              </span>
              <span className="text-4xl font-extrabold text-slate-900 mt-2">
                {jobReadiness}%
              </span>
              <div className="mt-4">
                <Progress value={jobReadiness} className="h-1.5 bg-slate-100 [&>div]:bg-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Missing Skills */}
        <Card className="bg-white border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5.5 h-5.5 stroke-[2.5]" />
              </div>
              
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Missing Skills
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {missingSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="bg-slate-50 border-slate-200 text-slate-600 text-[10px] font-bold py-0.5 px-2"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Target Role */}
        <Card className="bg-white border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Briefcase className="w-5.5 h-5.5 stroke-[2.5]" />
              </div>
             
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Target Role
              </span>
              <span className="text-lg font-bold text-slate-900 mt-2 truncate">
                {targetRole}
              </span>
              <span className="text-xs text-slate-400 mt-2.5">
                based on latest analysis
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Extra layout block - Recent Activity and Next Roadmap Step */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Next Milestones timeline summary */}
       <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm lg:col-span-2">
  <h2 className="text-base font-bold text-slate-900 font-serif mb-4">
    Resume Summary
  </h2>

  <p className="text-sm text-slate-600 leading-relaxed">
    {resumeSummary}
  </p>
</Card>

        {/* Quick action card */}
        <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm">
  <h3 className="text-lg font-bold text-slate-900 mb-2">
    Job Readiness
  </h3>

  <p className="text-sm text-slate-500">
    Your current readiness score is {jobReadiness}% based on your latest analysis.
  </p>
</Card>
      </div>

    </div>
  );
}
