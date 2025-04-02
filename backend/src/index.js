import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import authAdminRouter from "./modules/authAdmin/authAdmin.route.js";
import authComownRouter from "./modules/authComown/authComown.route.js";
import contractorsRouter from "./modules/contractor/authContractor.route.js";
import projectRouter from "./modules/project/project.route.js";
import paymentRouter from "./modules/payment/payment.route.js";
import workersRouter from "./modules/workers/workers.route.js";
import attendanceRouter from "./modules/attendance/attendance.route.js";
import officerRouter from "./modules/officerSft/officerSft.route.js";
import reportRouter from "./modules/reports/report.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();
dotenv.config();

connectDb();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.get('/', (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
  })
})
// Routes
app.use("/api/authAdmin", authAdminRouter);
app.use("/api/authComown", authComownRouter);
app.use("/api/contractors", contractorsRouter);
app.use("/api/projects", projectRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/workers", workersRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/officer", officerRouter);
app.use("/api/reports", reportRouter);
// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
const PORT = process.env.PORT || 3005;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
