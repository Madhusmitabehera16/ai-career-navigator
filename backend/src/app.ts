import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import authRouter from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);

app.get("/", (_req, res) => {
  res.json({
    name: "AI Career Navigator API",
    status: "ok",
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Centralized Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("API Error:", err);

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  // Check for duplicate key / database errors if needed (e.g. Prisma P2002)
  if (err.code === "P2002") {
    res.status(400).json({
      success: false,
      message: "An account with this email already exists.",
    });
    return;
  }

  // Handle service-thrown custom error messages with status code 400
  if (
    message.includes("already registered") ||
    message.includes("Invalid email or password")
  ) {
    res.status(400).json({
      success: false,
      message,
    });
    return;
  }

  res.status(status).json({
    success: false,
    message,
  });
});

export default app;

