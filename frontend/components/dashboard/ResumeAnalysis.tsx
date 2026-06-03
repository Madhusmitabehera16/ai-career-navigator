"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, AlertCircle, Sparkles } from "lucide-react";

export default function ResumeAnalysis() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          Resume Overview
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          ATS parsing summary, identified competencies, and formatting evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: parsed ATS structure view */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 font-serif mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#F4B400]" />
              Parsed ATS Sections
            </h2>

            {/* Profile Overview */}
            <div className="border-b border-slate-100 pb-6 mb-6">
              <span className="text-xs font-extrabold text-[#F4B400] uppercase tracking-wider">
                Profile Overview
              </span>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Full-stack developer with 2+ years of experience constructing web applications. Experienced with modern frontend tooling, cloud deployments, and backend databases. Seeking Software Development Engineer (SDE) roles.
              </p>
            </div>

            {/* Skills detected */}
            <div className="border-b border-slate-100 pb-6 mb-6">
              <span className="text-xs font-extrabold text-[#F4B400] uppercase tracking-wider">
                Skills Detected
              </span>
              <div className="flex flex-wrap gap-2.5 mt-3">
                {["React", "Next.js", "Node.js", "MongoDB", "AWS"].map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 font-bold border py-1.5 px-3.5 rounded-xl text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="border-b border-slate-100 pb-6 mb-6">
              <span className="text-xs font-extrabold text-[#F4B400] uppercase tracking-wider">
                Projects Evaluated
              </span>
              <div className="space-y-4 mt-4">
                {[
                  {
                    title: "Hotel Booking Platform",
                    desc: "A full-stack booking system featuring user secure checkout, calendar reservation widgets, and dashboard tracking.",
                  },
                  {
                    title: "AI Career Navigator",
                    desc: "Interactive recruitment tool delivering parsed resume feedback, custom timelines, and mock voice dialogues.",
                  },
                ].map((project, idx) => (
                  <div key={idx} className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4">
                    <h4 className="text-sm font-bold text-slate-800">
                      {project.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {project.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <span className="text-xs font-extrabold text-[#F4B400] uppercase tracking-wider">
                Education Detected
              </span>
              <div className="flex justify-between items-start mt-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    B.Tech Computer Science
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Graduated with Honours
                  </p>
                </div>
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none font-bold">
                  Verified Degree
                </Badge>
              </div>
            </div>

          </Card>
        </div>

        {/* Right Side: Score overview & ATS Checkers */}
        <div className="space-y-6">
          
          {/* ATS Score card */}
          <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 font-serif mb-4">
              Formatting Evaluation
            </h3>
            
            <div className="flex flex-col gap-5">
              {[
                { title: "ATS Layout Compatibility", status: "pass", desc: "No tables/graphics blocking indexers." },
                { title: "Contact Information Check", status: "pass", desc: "Found phone, email, and location details." },
                { title: "Action Verb Frequency", status: "fail", desc: "Requires stronger leading statements." },
                { title: "Section Headers Structure", status: "pass", desc: "Uses standard parseable names." },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  {item.status === "pass" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick AI Optimizer advice */}
          <Card className="bg-slate-900 text-white border-none rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex gap-1.5 items-center text-[#F4B400] mb-4">
              <Sparkles className="w-4 h-4 fill-current" />
              <span className="text-xs font-extrabold tracking-wider uppercase">
                AI Career Tip
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2 leading-snug">
              Boost your score from 89% to 95%
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Stronger resume bullet structures improve recruiter readability. Replace weak action verbs in your experience section to boost evaluation scores.
            </p>
            <button className="bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs py-3 px-5 rounded-xl transition-colors duration-200">
              Optimize Resume Now
            </button>
          </Card>

        </div>

      </div>

    </div>
  );
}
