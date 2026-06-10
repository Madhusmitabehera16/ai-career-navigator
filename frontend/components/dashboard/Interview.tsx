"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Send, Bot, User, Award, HelpCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useInterview } from "@/src/hooks/useInterview";

export default function Interview() {
  const { data, isLoading } = useInterview();
  const questions = data?.recommendedQuestions || [];
const readinessScore = data?.readinessScore || 0;
const suggestions = data?.suggestions || [];
const [activeQuestion, setActiveQuestion] = useState(
  questions[0] || ""
);
if (isLoading) {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-500">Loading interview questions...</p>
    </div>
  );
}

if (!data) {
  return (
    <Card className="p-8">
      <h3 className="font-bold text-lg">
        No Interview Session Found
      </h3>

      <p className="text-slate-500 mt-2">
        Generate interview questions first.
      </p>
    </Card>
  );
}

  

 

  

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header with score card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Mock Interview Practice
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Simulate real-world SDE screening interviews and get immediate score evaluations.
          </p>
        </div>

        {/* Score card widget */}
        <Card className="bg-white border-slate-100 rounded-2xl p-4 shadow-sm w-full md:w-64">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Interview Readiness
            </span>
            <span className="text-base font-extrabold text-slate-900">{readinessScore}%</span>
          </div>
          <Progress value={readinessScore} className="h-1.5 bg-slate-100 [&>div]:bg-purple-600" />
          <div className="text-[10px] text-slate-400 mt-2 font-medium">
            Acquired based on recent reviews
          </div>
        </Card>
      </div>

      {/* ChatGPT style window panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[520px]">
        
        {/* Left Side: Question List Selector */}
        <Card className="bg-white border-slate-100 rounded-3xl p-5 shadow-sm lg:col-span-4 flex flex-col h-full overflow-hidden">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 shrink-0">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            Core Questions List
          </h3>

          <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
            {questions.map((q) => (
              <button
                key={q}
                onClick={() => setActiveQuestion(q)}
                className={`w-full text-left p-3.5 rounded-2xl border text-xs leading-normal font-semibold transition-all duration-200 cursor-pointer ${
                  activeQuestion === q
                    ? "bg-purple-50 border-purple-100 text-purple-700"
                    : "bg-slate-50/60 border-slate-100 hover:bg-slate-50 text-slate-700"
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 shrink-0">
            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5">
              <Mic className="w-3.5 h-3.5" />
              
            </button>
          </div>
        </Card>

        {/* Right Side: Conversation Chat interface */}
        <Card className="bg-white border-slate-100 rounded-3xl shadow-sm lg:col-span-8 flex flex-col h-full overflow-hidden relative">
          
          {/* Chat header */}
          <div className="bg-slate-50/80 border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 leading-none">
                  AI Practice Panel
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">
                  Active focus: {activeQuestion}
                </span>
              </div>
            </div>
          </div>

          {/* Messages list area */}
          
         <div className="flex-1 p-8">
  <h3 className="text-lg font-bold text-slate-900 mb-4">
    Selected Question
  </h3>

  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
    <p className="text-sm text-slate-700">
      {activeQuestion || "Select a question"}
    </p>
  </div>

  {suggestions.length > 0 && (
    <div className="mt-6">
      <h4 className="text-sm font-bold mb-3">
        Interview Suggestions
      </h4>

      <div className="space-y-3">
        {suggestions.map((s, idx) => (
          <div
            key={idx}
            className="bg-purple-50 rounded-xl p-3 text-xs text-purple-700"
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  )}
</div>

        </Card>

      </div>

    </div>
  );
}
