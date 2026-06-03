"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Map, Video, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
  const metrics = [
    {
      title: "Total Users",
      val: "10,542",
      change: "+12.4%",
      icon: <Users className="w-5 h-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Resumes Uploaded",
      val: "18,120",
      change: "+18.2%",
      icon: <FileText className="w-5 h-5" />,
      color: "bg-amber-50 text-[#F4B400]",
    },
    {
      title: "Roadmaps Generated",
      val: "12,871",
      change: "+8.5%",
      icon: <Map className="w-5 h-5" />,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Mock Interviews",
      val: "8,530",
      change: "+15.1%",
      icon: <Video className="w-5 h-5" />,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
          Admin Analytics
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          System analytics dashboard indicating global engagement activities.
        </p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <Card key={idx} className="bg-white border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl ${m.color} flex items-center justify-center`}>
                  {m.icon}
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 font-bold border-none text-[10px] py-0.5 px-2">
                  {m.change}
                </Badge>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {m.title}
                </span>
                <span className="text-3xl font-extrabold text-slate-900 mt-2">
                  {m.val}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SVG Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Growth Line Chart */}
        <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Upload Activity Trend
            </h3>
            <span className="text-xs text-slate-400 font-medium">Last 6 Months</span>
          </div>

          {/* SVG line chart */}
          <div className="relative h-64 w-full">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#F1F5F9" strokeWidth="1" />

              {/* Chart Line Path */}
              <path
                d="M 10 160 Q 100 130, 200 90 T 400 40 T 490 30"
                fill="none"
                stroke="#F4B400"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Area Under Curve Gradient representation */}
              <path
                d="M 10 160 Q 100 130, 200 90 T 400 40 T 490 30 L 490 200 L 10 200 Z"
                fill="url(#gradient)"
                opacity="0.08"
              />

              {/* Gradient configuration */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F4B400" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
              </defs>

              {/* Data Node Dots */}
              <circle cx="200" cy="90" r="5" fill="#F4B400" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="490" cy="30" r="5" fill="#F4B400" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
            
            {/* Chart X axis text */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold px-1 mt-3">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </Card>

        {/* Feature Split Bar Chart */}
        <Card className="bg-white border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Popular Features
            </h3>
            <span className="text-xs text-slate-400 font-medium">Conversions</span>
          </div>

          <div className="space-y-5">
            {[
              { label: "Resume Analysis", pct: "85%", w: "w-[85%]", val: "6,240", color: "bg-[#F4B400]" },
              { label: "Roadmaps Build", pct: "70%", w: "w-[70%]", val: "5,120", color: "bg-blue-600" },
              { label: "Mock Interviews", pct: "55%", w: "w-[55%]", val: "4,030", color: "bg-purple-600" },
              { label: "Job Matching", pct: "40%", w: "w-[40%]", val: "2,980", color: "bg-rose-600" },
            ].map((bar, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{bar.label}</span>
                  <span className="font-bold text-slate-900">{bar.val}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full w-full">
                  <div className={`h-full ${bar.color} rounded-full`} style={{ width: bar.pct }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
}
