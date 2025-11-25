# Android Studio Temi WebSocket 연동 가이드

## ✅ 완료된 작업

### 1. build.gradle 의존성 추가
- ✅ Socket.IO 클라이언트: `io.socket:socket.io-client:2.1.0`
- ✅ Gson (JSON 처리): `com.google.code.gson:gson:2.10.1`

### 2. AndroidManifest.xml 권한 추가
- ✅ `INTERNET` 권한
- ✅ `ACCESS_NETWORK_STATE` 권한

### 3. Java 코드 작성
- ✅ `TemiSocketManager.java` - WebSocket 통신 관리 클래스
- ✅ `MainActivity.java` - WebSocket 초기화 통합

---

## 📁 생성된 파일

```
android/app/src/main/java/com/example/coshowsample/
├── MainActivity.java          (수정됨 - WebSocket 초기화 추가)
└── TemiSocketManager.java    (새로 생성됨)
```

---

## 🚀 사용 방법

### 1. 서버 URL 설정

`TemiSocketManager.java` 파일에서 서버 URL을 설정하세요:

```java
// 에뮬레이터에서 테스트하는 경우
this.serverUrl = "http://10.0.2.2:4000";

// 실제 기기에서 테스트하는 경우 (서버 IP로 변경)
this.serverUrl = "http://192.168.0.100:4000";
```

또는 `MainActivity.java`에서 동적으로 설정:

```java
private void initWebSocket() {
    socketManager = TemiSocketManager.getInstance();
    
    // 실제 기기용 서버 IP 설정
    socketManager.setServerUrl("http://192.168.0.100:4000");
    
    socketManager.connect();
}
```

### 2. 서버 IP 확인 방법

**macOS/Linux:**
```bash
ifconfig | grep "inet "
```

**Windows:**
```bash
ipconfig
```

같은 Wi-Fi 네트워크에 연결되어 있어야 합니다.

### 3. AndroidManifest.xml에 HTTP 허용 추가 (필요한 경우)

Android 9.0 (API 28) 이상에서는 기본적으로 HTTP 연결이 차단됩니다.
개발 환경에서는 다음을 추가하세요:

```xml
<application
    android:usesCleartextTraffic="true"
    ...>
    ...
</application>
```

**주의:** 프로덕션 환경에서는 HTTPS를 사용하거나 네트워크 보안 설정을 사용하세요.

---

## 🧪 테스트 방법

### 1. Backend 서버 실행

```bash
cd co-show/backend
npm install
npm run dev
```

### 2. Android Studio에서 앱 실행

1. Android Studio에서 프로젝트 열기
2. `Sync Project with Gradle Files` 실행
3. 에뮬레이터 또는 실제 기기에서 앱 실행
4. Logcat에서 다음 메시지 확인:
   - `✅ 서버에 연결됨`
   - `✅ 서버에 등록 완료`

### 3. 웹에서 명령 보내기

브라우저 콘솔에서:
```javascript
import { getTemiSocket } from './lib/temiSocket';
const socket = getTemiSocket();
socket.connect();
socket.goTo("kitchen");
```

Android Logcat에서 `📍 이동 명령 수신: kitchen` 확인

---

## 📋 주요 기능

### TemiSocketManager 클래스 메서드

| 메서드 | 설명 |
|--------|------|
| `connect()` | 서버에 연결 |
| `disconnect()` | 연결 해제 |
| `isConnected()` | 연결 상태 확인 |
| `sendStatus()` | 로봇 상태 전송 |
| `notifyArrived(target)` | 도착 알림 전송 |
| `notifyPersonDetected(distance)` | 사람 감지 알림 전송 |
| `sendError(message, code)` | 에러 전송 |

### 수신하는 명령

- `temi_goTo` - 특정 위치로 이동
- `temi_speak` - 텍스트 말하기
- `temi_startFollow` - 팔로우 모드 시작
- `temi_stopFollow` - 팔로우 모드 중지
- `temi_stopMovement` - 이동 정지
- `temi_getStatus` - 상태 요청

### 전송하는 이벤트

- `temi_status` - 로봇 상태 업데이트
- `temi_arrived` - 목적지 도착
- `temi_personDetected` - 사람 감지
- `temi_error` - 에러 발생

---

## 🔧 문제 해결

### 연결이 안 될 때

1. **서버가 실행 중인지 확인**
   ```bash
   curl http://localhost:4000/health
   ```

2. **방화벽 확인**
   - 포트 4000이 열려있는지 확인

3. **네트워크 확인**
   - Android 기기와 서버가 같은 Wi-Fi에 연결되어 있는지 확인
   - 서버 IP 주소가 올바른지 확인

4. **Logcat 확인**
   - 연결 오류 메시지 확인
   - `❌ 연결 오류` 메시지가 있는지 확인

### Temi SDK 오류

- Temi SDK가 없어도 WebSocket 연결은 작동합니다
- 로봇 명령 실행 시에만 SDK가 필요합니다
- SDK가 없으면 경고 메시지만 출력되고 앱은 정상 작동합니다

---

## 📝 다음 단계

1. ✅ Socket.IO 클라이언트 추가 완료
2. ✅ Java 연동 코드 작성 완료
3. ⏳ 실제 Temi 로봇에서 테스트
4. ⏳ 추가 기능 구현 (배터리 상태, 위치 추적 등)

