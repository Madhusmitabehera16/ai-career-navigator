"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Briefcase, AlertTriangle, CheckCircle, TrendingUp, Users } from "lucide-react";
import { useAnalytics } from "@/src/hooks/useAnalytics";

export default function Overview() {
  const { data, isLoading } = useAnalytics();
  const resumeScore = data?.resumeScore ?? 89;
  const jobReadiness = data?.jobReadiness ?? 76;
  const missingSkills = data?.missingSkills ?? ["Docker", "Kubernetes", "System Design"];
  const targetRole = data?.targetRole ?? "Software Development Engineer";

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
              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 font-bold border-none">
                +4% vs last scan
              </Badge>
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
              <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 font-bold border-none">
                Good Match
              </Badge>
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
              <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50 font-bold border-none">
                High Priority
              </Badge>
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
              <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-50 font-bold border-none">
                Active Target
              </Badge>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Target Role
              </span>
              <span className="text-lg font-bold text-slate-900 mt-2 truncate">
                {targetRole}
              </span>
              <span className="text-xs text-slate-400 mt-2.5">
                Tracking 4 open positions
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Extra layout block - Recent Activity and Next Roadmap Step */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Next Milestones timeline summary */}
        <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-base font-bold text-slate-900 font-serif mb-6">
            Active Learning Roadmap
          </h2>
          <div className="space-y-6">
            {[
              {
                week: "Week 1",
                topic: "Linux & Terminal Fundamentals",
                status: "completed",
                desc: "File navigation, pipeline commands, permissions, and basic scripting.",
              },
              {
                week: "Week 2",
                topic: "Docker Containers & Networking",
                status: "in-progress",
                desc: "Dockerfile construction, multi-stage compilation, port configurations.",
              },
              {
                week: "Week 3",
                topic: "AWS Hosting & EC2 Instances",
                status: "pending",
                desc: "Virtual private clouds, security groups, public server allocation.",
              },
            ].map((milestone, idx) => (
              <div key={idx} className="flex gap-4 items-start relative">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      milestone.status === "completed"
                        ? "bg-emerald-50 text-emerald-600"
                        : milestone.status === "in-progress"
                        ? "bg-amber-50 text-[#F4B400]"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {milestone.status === "completed" ? (
                      <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  {idx < 2 && (
                    <div className="w-0.5 h-12 bg-slate-100 mt-2" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-[#F4B400]">
                      {milestone.week}
                    </span>
                    {milestone.status === "in-progress" && (
                      <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-800 font-bold border-none text-[10px] py-0 px-2 animate-pulse">
                        Active Step
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">
                    {milestone.topic}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {milestone.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick action card */}
        <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="bg-[#F4B400]/10 w-12 h-12 rounded-2xl flex items-center justify-center text-[#F4B400] mb-6">
              <Users className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Next AI Mock Interview
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your overall mock interview preparedness is at **82%**. Start a session to test your system design knowledge.
            </p>
          </div>
          <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 rounded-xl transition-colors duration-200 mt-8">
            Launch Mock Interview
          </button>
        </Card>
      </div>

    </div>
  );
}
