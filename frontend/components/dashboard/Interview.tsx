"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Send, Bot, User, Award, HelpCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useInterview } from "@/src/hooks/useInterview";

export default function Interview() {
  const { data, isLoading } = useInterview();
  const questions = data?.recommendedQuestions ?? [];
  const readinessScore = data?.readinessScore ?? 82;

  const [activeQuestion, setActiveQuestion] = useState<string>(questions && questions.length > 0 ? questions[0] : "Tell me about yourself");
  const [messages, setMessages] = useState<Array<{ sender: "bot" | "user"; text: string }>>([
    {
      sender: "bot",
      text: "Hello! Welcome to your AI Mock Interview. Let's begin. Please introduce yourself and talk about your primary development focus.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = inputValue;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInputValue("");

    // Simulate bot response after a brief pause
    setTimeout(() => {
      let replyText = "That's a solid answer! Let's build on that. Tell me how you would design a scalable backend cache for this flow.";
      if (activeQuestion.includes("JWT")) {
        replyText = "Great explanation of JSON Web Tokens. Can you explain the difference between local storage security and HTTP-only cookie storage?";
      } else if (activeQuestion.includes("React rendering")) {
        replyText = "Excellent summary of Virtual DOM reconciliation. How does React 18's Concurrent Mode help improve user experience?";
      }
      setMessages((prev) => [...prev, { sender: "bot", text: replyText }]);
    }, 1000);
  };

  const selectQuestion = (q: string) => {
    setActiveQuestion(q);
    setMessages([
      {
        sender: "bot",
        text: `Great. Let's focus on this question: "${q}". How would you explain this concept to an interviewer?`,
      },
    ]);
  };

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
                onClick={() => selectQuestion(q)}
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
              <span>Voice Interview Mode</span>
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
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    msg.sender === "user"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat input block */}
          <div className="border-t border-slate-100 p-4 bg-white flex gap-3 items-center shrink-0">
            <input
              type="text"
              placeholder="Type your response here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shrink-0 transition-colors duration-200 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </Card>

      </div>

    </div>
  );
}
