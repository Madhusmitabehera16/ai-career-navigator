import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "dummy_key";
const modelName = process.env.GEMINI_MODEL || "gemini-1.0";

if (!apiKey || apiKey === "dummy_key") {
  console.warn("⚠️  GEMINI_API_KEY not set; AI features will be unavailable.");
}

const generator = new GoogleGenerativeAI(apiKey);
const model = generator.getGenerativeModel({ model: modelName });

const flattenContent = (content: any): string => {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content.parts)) {
    return content.parts
      .map((part: any) => (typeof part === "string" ? part : JSON.stringify(part)))
      .join("");
  }
  return JSON.stringify(content);
};

export const generateGeminiResponse = async (prompt: string): Promise<string> => {
  const request = {
    contents: [
      {
        role: "user",
        parts: [prompt],
      },
    ],
  };

  const result = await model.generateContent(request as any);
  const candidate = result?.response?.candidates?.[0];
  if (!candidate || !candidate.content) {
    throw new Error("Gemini did not return a valid response.");
  }

  return flattenContent(candidate.content).trim();
};
