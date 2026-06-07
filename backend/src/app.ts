import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "AI Career Navigator API",
    status: "ok",
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
