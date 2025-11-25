import { createServer } from "http";
import app from "./app";
import { initializeWebSocket } from "./websocket";

const PORT = Number(process.env.PORT || 4000);

// HTTP 서버 생성
const httpServer = createServer(app);

// WebSocket 서버 초기화
initializeWebSocket(httpServer);

// 서버 시작
httpServer.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server ready on ws://localhost:${PORT}`);
});
