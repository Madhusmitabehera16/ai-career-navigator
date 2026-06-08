"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/auth", auth_routes_1.default);
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
app.use((err, _req, res, _next) => {
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
    if (message.includes("already registered") ||
        message.includes("Invalid email or password")) {
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
exports.default = app;
//# sourceMappingURL=app.js.map