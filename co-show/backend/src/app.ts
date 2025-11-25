import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import phoneRouter from "./apis/phone";
import inquiryRouter from "./apis/inquiry";
import uploadRouter from "./apis/upload";
import eventsRouter from "./apis/events";

const app = express();

// 기본 미들웨어
app.use(express.json());
app.use(cors({ origin: true, credentials: true })); // 개발 편의용,  origin: ["http://localhost:5173", "http://222.232.30.11:4000"]
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

// 정적 제공 (업로드 파일 접근)
const uploadsPath = path.resolve(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

// 라우터
app.use("/api/phone-registrations", phoneRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/events", eventsRouter);

// 헬스체크
app.get("/", (_req, res) => res.send("Backend OK"));
app.get("/health", (_req, res) => res.json({ ok: true }));

export default app;
