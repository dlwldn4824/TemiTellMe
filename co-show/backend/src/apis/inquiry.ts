import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prismaClient";
const router = Router();

const inquirySchema = z.object({
  phone: z.string().optional(),
  category: z.string().optional(),
  message: z.string().min(1),
  imageUrl: z.string().url().optional(), // /uploads/... 또는 S3 URL
  deviceId: z.string().optional(),
});

router.post("/", async (req, res) => {
  const parsed = inquirySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const saved = await prisma.inquiry.create({ data: parsed.data });
  res.status(201).json(saved);
});

router.get("/", async (_req, res) => {
  const list = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json(list);
});

export default router;