import { Router, Request } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import express from "express";
import qrcode from "qrcode";
import os from "os";
import { prisma } from "../prismaClient";

const router = Router();

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const QR_DIR = path.resolve(process.cwd(), "uploads", "qr");
if (!fs.existsSync(QR_DIR)) fs.mkdirSync(QR_DIR, { recursive: true });

// 메모리 저장소 (key -> image buffer, key_url -> image URL)
const photoStore = new Map<string, Buffer>();

// 공개 URL 가져오기 (localhost를 실제 네트워크 IP로 변환)
function getPublicBaseUrl(req: Request): string {
  // 1순위: PUBLIC_BASE_URL 환경 변수 (ngrok, 배포 서버용)
  if (process.env.PUBLIC_BASE_URL) {
    return process.env.PUBLIC_BASE_URL.trim();
  }

  // 2순위: SERVER_HOST 환경 변수
  if (process.env.SERVER_HOST || process.env.PUBLIC_HOST) {
    const host = (process.env.SERVER_HOST || process.env.PUBLIC_HOST || "").trim();
    if (host && !host.includes(":")) {
      return `${host}:${process.env.PORT || 4000}`;
    }
    return host;
  }

  // 3순위: 요청 헤더에서 호스트 확인
  const host = req.get("host") || "";
  
  // localhost나 127.0.0.1인 경우 실제 네트워크 IP로 변환
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      const nets = interfaces[name];
      if (nets) {
        for (const net of nets) {
          if (net.family === "IPv4" && !net.internal) {
            const addr = net.address;
            // 사설 IP 대역: 192.168.x.x, 10.x.x.x, 172.16.x.x ~ 172.31.x.x
            if (
              addr.startsWith("192.168.") ||
              addr.startsWith("10.") ||
              (addr.startsWith("172.") &&
                parseInt(addr.split(".")[1] || "0") >= 16 &&
                parseInt(addr.split(".")[1] || "0") <= 31)
            ) {
              const port = process.env.PORT || 4000;
              console.log(`📱 QR 코드에 사용될 주소: http://${addr}:${port}`);
              return `${addr}:${port}`;
            }
          }
        }
      }
    }
  }

  // 기본값: 요청 헤더의 호스트 사용 (이미 실제 IP인 경우)
  return host;
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ===== 1) 업로드 URL 발급 =====
// GET /api/uploads/photo/upload?key=1
router.get("/photo/upload", (req, res) => {
  const key = String(req.query.key || "1");
  const publicBaseUrl = getPublicBaseUrl(req);
  const uploadUrl = publicBaseUrl.startsWith("http")
    ? `${publicBaseUrl}/api/uploads/photo/file/${key}`
    : `${req.protocol}://${publicBaseUrl}/api/uploads/photo/file/${key}`;
  
  res.status(200).type("text/plain").send(uploadUrl);
});

// ===== 2) 실제 이미지 업로드 (PUT) =====
// PUT /api/uploads/photo/file/:key
const rawImage = express.raw({ type: "image/png", limit: "5mb" });
router.put("/photo/file/:key", rawImage, async (req, res) => {
  const key = req.params.key;
  const body = req.body;
  
  if (!body || !body.length) {
    return res.status(400).send("빈 이미지입니다.");
  }

  // 파일로도 저장 (QR 코드에서 접근 가능하도록)
  const filename = `photo_${key}_${Date.now()}.png`;
  const filePath = path.join(UPLOAD_DIR, filename);
  fs.writeFileSync(filePath, body);

  // 메모리에도 저장 (빠른 접근용)
  photoStore.set(key, body);

  // 이미지 URL 저장 (QR 코드 생성용) - 공개 URL 사용
  const publicBaseUrl = getPublicBaseUrl(req);
  const imageUrl = publicBaseUrl.startsWith("http")
    ? `${publicBaseUrl}/uploads/${filename}`
    : `${req.protocol}://${publicBaseUrl}/uploads/${filename}`;
  
  photoStore.set(`${key}_url`, Buffer.from(imageUrl, "utf-8"));
  console.log(`✅ 사진 저장 완료: key=${key}, size=${body.length}, url=${imageUrl}`);

  res.status(200).end();
});

// ===== 3) QR 코드 생성 및 반환 =====
// GET /api/uploads/photo/download?key=1
router.get("/photo/download", async (req, res) => {
  const key = String(req.query.key || "1");
  
  try {
    const publicBaseUrl = getPublicBaseUrl(req);
    
    // 업로드된 이미지의 파일명 찾기
    const urlBuffer = photoStore.get(`${key}_url`);
    let filename: string;
    
    if (urlBuffer) {
      const savedUrl = urlBuffer.toString("utf-8");
      const urlMatch = savedUrl.match(/\/([^\/]+\.png)$/);
      filename = urlMatch ? urlMatch[1] : `photo_${key}.png`;
    } else {
      filename = `photo_${key}.png`;
    }

    // 항상 최신 공개 URL로 재구성
    const imageUrl = publicBaseUrl.startsWith("http")
      ? `${publicBaseUrl}/uploads/${filename}`
      : `${req.protocol}://${publicBaseUrl}/uploads/${filename}`;
    
    console.log(`📱 QR 코드 생성 중: ${imageUrl}`);
    
    // QR 코드 생성 (PNG 형식, 600x600 크기)
    const qrCodeBuffer = await qrcode.toBuffer(imageUrl, {
      type: "png",
      width: 600,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    
    console.log(`✅ QR 코드 생성 완료: ${qrCodeBuffer.length} bytes`);
    res.type("image/png").send(qrCodeBuffer);
  } catch (error) {
    console.error("QR 코드 생성 오류:", error);
    // 에러 발생 시 빈 PNG 반환
    const emptyPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    res.type("image/png").send(emptyPng);
  }
});

// 사진 1장 업로드 (FormData 키: "photo") - 기존 엔드포인트 유지
router.post("/photo", upload.single("photo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "파일 누락" });

  const { originalname, mimetype, size, filename } = req.file;
  const deviceId = req.body?.deviceId as string | undefined;
  const url = `/uploads/${filename}`;

  const saved = await prisma.photoUpload.create({
    data: { fileName: originalname, mimeType: mimetype, size, url, deviceId },
  });

  res.status(201).json(saved); // { id, url, ... }
});

export default router;
