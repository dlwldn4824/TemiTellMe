import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prismaClient";

const router = Router();

const bodySchema = z.object({
  phone: z.string().min(7).max(20),
  deviceId: z.string().optional(),
  consent: z.boolean().optional(),
});

router.post("/", async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { phone, deviceId, consent } = parsed.data;

  // 메타데이터(마스킹은 콘솔 출력 시에만)
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    undefined;
  const userAgent = req.headers["user-agent"];

  const saved = await prisma.phoneRegistration.create({
    data: { phone, deviceId, consent: consent ?? false, ip, userAgent },
  });

  res.status(201).json(saved);
});

// 최근 등록 목록 확인 (디버깅/관리용)
router.get("/", async (req, res) => {
  const take = Math.min(Number(req.query.take ?? 20), 100);
  const list = await prisma.phoneRegistration.findMany({
    orderBy: { createdAt: "desc" },
    take,
  });
  res.json(list);
});

export default router;
