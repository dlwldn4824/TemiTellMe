# WebSocket 서버 설정 가이드

## 📋 빠른 시작

### 1. Backend 서버 실행

```bash
cd co-show/backend
npm install
npm run dev
```

서버가 실행되면:
- HTTP API: `http://localhost:4000`
- WebSocket: `ws://localhost:4000`

### 2. React.js 클라이언트 설정

```bash
cd co-show
npm install socket.io-client
```

### 3. React 컴포넌트에서 사용

```jsx
import { useTemiSocket } from "./lib/temiSocket";

function MyComponent() {
  const socket = useTemiSocket("http://localhost:4000");
  
  // 명령 보내기
  socket.goTo("kitchen");
  socket.speak("안녕하세요");
  
  // 이벤트 수신
  socket.on("arrived", (data) => {
    console.log("도착:", data);
  });
  
  return <div>...</div>;
}
```

## 📁 프로젝트 구조

```
co-show/
├── backend/                 # Node.js 서버
│   ├── src/
│   │   ├── websocket.ts    # WebSocket 서버 로직
│   │   ├── server.ts       # HTTP + WebSocket 서버
│   │   └── app.ts          # Express 앱
│   └── package.json
│
└── src/
    ├── lib/
    │   └── temiSocket.js   # React WebSocket 클라이언트
    └── components/
        └── TemiController.jsx  # 제어 UI 예제
```

## 🔌 WebSocket 이벤트

### 웹 → 서버 → Temi (명령)

| 이벤트 | 데이터 | 설명 |
|--------|--------|------|
| `goTo` | `{ target: string }` | 특정 위치로 이동 |
| `speak` | `{ text: string }` | 텍스트 말하기 |
| `startFollow` | - | 팔로우 모드 시작 |
| `stopFollow` | - | 팔로우 모드 중지 |
| `stopMovement` | - | 이동 정지 |
| `getStatus` | - | 로봇 상태 요청 |

### Temi → 서버 → 웹 (이벤트)

| 이벤트 | 데이터 | 설명 |
|--------|--------|------|
| `status` | `{ battery?, location?, isMoving? }` | 로봇 상태 업데이트 |
| `arrived` | `{ target: string }` | 목적지 도착 |
| `personDetected` | `{ distance? }` | 사람 감지 |
| `error` | `{ message: string, code? }` | 에러 발생 |

## 🧪 테스트 방법

### 1. 서버 테스트

```bash
# 서버 실행
cd co-show/backend
npm run dev
```

### 2. 웹 클라이언트 테스트

브라우저 콘솔에서:
```javascript
import { getTemiSocket } from './lib/temiSocket';
const socket = getTemiSocket();
socket.connect();
socket.goTo("kitchen");
```

### 3. Android 앱 테스트

자세한 내용은 `backend/TEMI_TEST_GUIDE.md` 참고

## 📝 다음 단계

1. ✅ Backend 서버 구축 완료
2. ✅ WebSocket 서버 구현 완료
3. ✅ React 클라이언트 라이브러리 완료
4. ⏳ Android 앱 연동 (Temi SDK 필요)
5. ⏳ 실제 로봇 테스트

