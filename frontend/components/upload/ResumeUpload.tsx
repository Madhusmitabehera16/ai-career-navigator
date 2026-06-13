"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, Lock, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/src/context/AuthContext";
import { uploadResume, parseResume } from "@/src/services/resume.services";
import api from "@/src/lib/api";

export default function ResumeUpload() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === "application/pdf" ||
        droppedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        if (droppedFile.size <= 2 * 1024 * 1024) {
          setFile(droppedFile);
        } else {
          alert("File size exceeds 2MB limit.");
        }
      } else {
        alert("Only PDF or DOCX files are allowed.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size <= 2 * 1024 * 1024) {
        setFile(selectedFile);
      } else {
        alert("File size exceeds 2MB limit.");
      }
    }
  };

  const triggerUpload = async () => {
    if (!file) {
      alert("Please select a resume.");
      return;
    }

    if (!companyName.trim()) {
      alert("Please enter the target company name.");
      return;
    }

    if (!roleTitle.trim()) {
      alert("Please enter the target role title.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter the job description.");
      return;
    }

    if (!currentUser) {
      router.push("/login");
      return;
    }

    try {
      setIsUploading(true);

      console.log("Uploading resume...");

      const response = await uploadResume(
        file,
        companyName.trim(),
        roleTitle.trim(),
        jobDescription.trim()
      );

      console.log("Upload response:", response);

      if (!response?.success) {
        throw new Error("Resume processing failed");
      }

      console.log("Analysis complete. Redirecting...");

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Upload Error Details:", error);
      
      const backendMessage = error?.response?.data?.message;
      const errorMessage = error?.message;
      
      console.error("Backend response message:", backendMessage);
      
      alert(
        backendMessage ||
        errorMessage ||
        "Failed to process resume due to an unknown error."
      );
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 shadow-[0_24px_48px_rgba(0,0,0,0.04)] text-center relative overflow-hidden"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">
            Analyze Your Resume Instantly
          </h2>
          <p className="text-sm text-slate-500 max-w-md mb-8">
            Upload your resume to get AI skill gap feedback, build step-by-step career path roadmaps, and practice real-time interviews.
          </p>

          {/* Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`w-full max-w-2xl bg-gradient-to-br from-indigo-700 to-violet-800 text-white rounded-2xl p-8 md:p-12 relative border-2 border-dashed transition-all duration-300 ${
              isDragActive ? "border-[#F4B400] scale-[1.01]" : "border-white/30"
            }`}
          >
            {/* Top Right Privacy Badge */}
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 flex items-center gap-1.5 select-none">
              <Lock className="w-3.5 h-3.5 text-white" />
              <span className="text-[10px] font-bold text-white tracking-wider uppercase">
                100% Privacy
              </span>
            </div>

            <div className="flex flex-col items-center">
              {/* Animated icon indicator */}
              <div className="mb-6 relative">
                {file ? (
                  <div className="bg-[#F4B400] w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-8 h-8 text-slate-900 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="bg-white/15 w-16 h-16 rounded-full flex items-center justify-center shadow-inner">
                    <Upload className="w-7 h-7 text-white stroke-[2.5]" />
                  </div>
                )}
              </div>

              {file ? (
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-xl border border-white/10 max-w-md">
                    <FileText className="w-4 h-4 text-[#F4B400] shrink-0" />
                    <span className="text-xs font-bold truncate max-w-[240px]">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-white/60">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-xs text-white/60 hover:text-white underline cursor-pointer"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer group flex flex-col items-center">
                  <input
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={handleChange}
                  />
                  <h3 className="text-lg md:text-xl font-bold tracking-tight text-white mb-2">
                    Drop your resume here or{" "}
                    <span className="underline text-[#F4B400] group-hover:text-[#ffc738] transition-colors duration-200">
                      choose a file.
                    </span>
                  </h3>
                  <p className="text-xs text-white/60 max-w-sm">
                    English resumes in PDF or DOCX only. Max 2MB file size.
                  </p>
                </label>
              )}
            </div>
        </div>

        {/* Target Job Details Information Fields */}
        <div className="w-full max-w-2xl mt-8 text-left space-y-4 bg-slate-50/40 border border-slate-100 rounded-2xl p-6">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-[#F4B400] rounded-full" />
            Target Job Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider" htmlFor="companyName">
                Company Name <span className="text-rose-500 font-extrabold">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                placeholder="e.g. Google, Microsoft, Stripe"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#F4B400] transition-all duration-200 shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider" htmlFor="roleTitle">
                Role Title <span className="text-rose-500 font-extrabold">*</span>
              </label>
              <input
                id="roleTitle"
                type="text"
                placeholder="e.g. Software Development Engineer"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#F4B400] transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider" htmlFor="jobDescription">
              Job Description <span className="text-rose-500 font-extrabold">*</span>
            </label>
            <textarea
              id="jobDescription"
              rows={5}
              placeholder="Paste the job description details here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#F4B400] transition-all duration-200 shadow-sm resize-y"
            />
          </div>
        </div>

        {/* Action Trigger */}
        <div className="mt-8">
          <Button
            onClick={triggerUpload}
            disabled={isUploading || !file || !companyName.trim() || !roleTitle.trim() || !jobDescription.trim()}
            className={`bg-[#F4B400] hover:bg-[#E2A600] text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 font-extrabold text-base px-10 py-6.5 rounded-2xl shadow-[0_8px_24px_rgba(244,180,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${
              isUploading ? "animate-pulse" : ""
            }`}
          >
            {isUploading ? "Processing..." : "Upload & Analyze"}
          </Button>
        </div>
        </div>
      </motion.div>
    </div>
  );
};