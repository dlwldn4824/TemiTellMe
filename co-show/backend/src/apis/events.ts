import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prismaClient";

const router = Router();

const eventSchema = z.object({
  type: z.string().min(1),
  data: z.record(z.any()).optional(),
  timestamp: z.number().optional(),
});

/**
 * 이벤트 로깅 API
 * POST /api/events
 */
router.post("/", async (req, res) => {
  try {
    const parsed = eventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { type, data, timestamp } = parsed.data;

    // 이벤트를 데이터베이스에 저장 (선택사항)
    try {
      await prisma.eventLog.create({
        data: {
          type,
          data: JSON.stringify(data || {}),
          timestamp: timestamp ? new Date(timestamp) : new Date(),
        },
      });
    } catch (dbError) {
      // 데이터베이스 저장 실패는 무시 (로깅만 하는 경우)
      console.warn("이벤트 로그 저장 실패:", dbError);
    }

    console.log(`📝 이벤트 로그: ${type}`, data);

    res.status(201).json({ success: true, type, timestamp: timestamp || Date.now() });
  } catch (error) {
    console.error("이벤트 로깅 오류:", error);
    res.status(500).json({ error: "이벤트 로깅 실패" });
  }
});

/**
 * 이벤트 로그 조회
 * GET /api/events
 */
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const type = req.query.type as string | undefined;

    const where = type ? { type } : {};

    const events = await prisma.eventLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    res.json(events);
  } catch (error) {
    console.error("이벤트 조회 오류:", error);
    res.status(500).json({ error: "이벤트 조회 실패" });
  }
});

export default router;

