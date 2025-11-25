# Temi 로봇 WebSocket 테스트 가이드

## 📋 목차
1. [서버 실행 방법](#서버-실행-방법)
2. [Android Studio에서 테스트하는 방법](#android-studio에서-테스트하는-방법)
3. [WebSocket 이벤트 목록](#websocket-이벤트-목록)
4. [테스트 시나리오](#테스트-시나리오)

---

## 서버 실행 방법

### 1. 의존성 설치
```bash
cd co-show/backend
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

서버가 실행되면:
- HTTP API: `http://localhost:4000`
- WebSocket: `ws://localhost:4000`

---

## Android Studio에서 테스트하는 방법

### 1. 프로젝트 설정

#### 1.1 build.gradle (Module: app)에 의존성 추가

```gradle
dependencies {
    // ... 기존 의존성들 ...
    
    // Socket.IO 클라이언트
    implementation 'io.socket:socket.io-client:2.1.0'
    
    // JSON 처리 (이미 있다면 생략)
    implementation 'com.google.code.gson:gson:2.10.1'
}
```

#### 1.2 AndroidManifest.xml에 인터넷 권한 추가

```xml
<manifest ...>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application
        android:usesCleartextTraffic="true"  <!-- 개발용, HTTP 허용 -->
        ...>
    </application>
</manifest>
```

### 2. Java/Kotlin 코드 작성

#### 2.1 Socket.IO 클라이언트 초기화

**Java 예제:**
```java
import io.socket.client.IO;
import io.socket.client.Socket;
import org.json.JSONObject;
import java.net.URISyntaxException;

public class TemiSocketManager {
    private Socket socket;
    private static final String SERVER_URL = "http://YOUR_SERVER_IP:4000";
    
    public void connect() {
        try {
            IO.Options opts = new IO.Options();
            opts.forceNew = true;
            opts.reconnection = true;
            
            socket = IO.socket(SERVER_URL, opts);
            
            // 연결 이벤트
            socket.on(Socket.EVENT_CONNECT, args -> {
                Log.d("TemiSocket", "서버에 연결됨");
                
                // 클라이언트 타입 등록 (중요!)
                socket.emit("register", new JSONObject().put("type", "temi"));
            });
            
            // 연결 해제 이벤트
            socket.on(Socket.EVENT_DISCONNECT, args -> {
                Log.d("TemiSocket", "서버 연결 해제");
            });
            
            // 등록 확인
            socket.on("registered", args -> {
                Log.d("TemiSocket", "등록 완료: " + args[0].toString());
            });
            
            // 서버로부터 명령 수신
            setupCommandHandlers();
            
            socket.connect();
            
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }
    
    private void setupCommandHandlers() {
        // 이동 명령
        socket.on("temi_goTo", args -> {
            try {
                JSONObject data = (JSONObject) args[0];
                String target = data.getString("target");
                Log.d("TemiSocket", "이동 명령 수신: " + target);
                
                // Temi SDK 호출
                // Robot.getInstance().goTo(target);
                
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        
        // 말하기 명령
        socket.on("temi_speak", args -> {
            try {
                JSONObject data = (JSONObject) args[0];
                String text = data.getString("text");
                Log.d("TemiSocket", "말하기 명령 수신: " + text);
                
                // Temi SDK 호출
                // Robot.getInstance().speak(text);
                
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        
        // 팔로우 시작
        socket.on("temi_startFollow", args -> {
            Log.d("TemiSocket", "팔로우 시작 명령 수신");
            // Robot.getInstance().startFollowMe();
        });
        
        // 팔로우 중지
        socket.on("temi_stopFollow", args -> {
            Log.d("TemiSocket", "팔로우 중지 명령 수신");
            // Robot.getInstance().stopFollowMe();
        });
        
        // 이동 정지
        socket.on("temi_stopMovement", args -> {
            Log.d("TemiSocket", "이동 정지 명령 수신");
            // Robot.getInstance().stopMovement();
        });
        
        // 상태 요청
        socket.on("temi_getStatus", args -> {
            Log.d("TemiSocket", "상태 요청 수신");
            // 상태 정보를 서버로 전송
            sendStatus();
        });
    }
    
    // Temi 상태를 서버로 전송
    public void sendStatus() {
        try {
            JSONObject status = new JSONObject();
            // status.put("battery", getBatteryLevel());
            // status.put("location", getCurrentLocation());
            // status.put("isMoving", isMoving());
            
            socket.emit("temi_status", status);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    // 도착 이벤트 전송
    public void notifyArrived(String target) {
        try {
            JSONObject data = new JSONObject();
            data.put("target", target);
            socket.emit("temi_arrived", data);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    // 사람 감지 이벤트 전송
    public void notifyPersonDetected(double distance) {
        try {
            JSONObject data = new JSONObject();
            data.put("distance", distance);
            socket.emit("temi_personDetected", data);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    // 에러 전송
    public void sendError(String message, String code) {
        try {
            JSONObject data = new JSONObject();
            data.put("message", message);
            data.put("code", code);
            socket.emit("temi_error", data);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public void disconnect() {
        if (socket != null) {
            socket.disconnect();
        }
    }
}
```

**Kotlin 예제:**
```kotlin
import io.socket.client.IO
import io.socket.client.Socket
import org.json.JSONObject

class TemiSocketManager {
    private var socket: Socket? = null
    private val serverUrl = "http://YOUR_SERVER_IP:4000"
    
    fun connect() {
        try {
            val opts = IO.Options().apply {
                forceNew = true
                reconnection = true
            }
            
            socket = IO.socket(serverUrl, opts)
            
            socket?.on(Socket.EVENT_CONNECT) {
                Log.d("TemiSocket", "서버에 연결됨")
                socket?.emit("register", JSONObject().put("type", "temi"))
            }
            
            socket?.on("registered") { args ->
                Log.d("TemiSocket", "등록 완료: ${args[0]}")
            }
            
            setupCommandHandlers()
            socket?.connect()
            
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
    
    private fun setupCommandHandlers() {
        socket?.on("temi_goTo") { args ->
            val data = args[0] as JSONObject
            val target = data.getString("target")
            Log.d("TemiSocket", "이동 명령: $target")
            // Robot.getInstance().goTo(target)
        }
        
        socket?.on("temi_speak") { args ->
            val data = args[0] as JSONObject
            val text = data.getString("text")
            Log.d("TemiSocket", "말하기 명령: $text")
            // Robot.getInstance().speak(text)
        }
        
        // ... 다른 핸들러들 ...
    }
    
    fun disconnect() {
        socket?.disconnect()
    }
}
```

### 3. Activity에서 사용

```java
public class MainActivity extends AppCompatActivity {
    private TemiSocketManager socketManager;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        socketManager = new TemiSocketManager();
        socketManager.connect();
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        socketManager.disconnect();
    }
}
```

### 4. 서버 IP 주소 설정

**로컬 테스트 (에뮬레이터):**
- `http://10.0.2.2:4000` (Android 에뮬레이터에서 localhost 접근)

**실제 기기 테스트:**
- 개발 서버의 실제 IP 주소 사용
- 예: `http://192.168.0.100:4000`
- 같은 Wi-Fi 네트워크에 연결되어 있어야 함

**IP 주소 확인 방법:**
```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

---

## WebSocket 이벤트 목록

### 웹 → 서버 → Temi (명령)

| 이벤트명 | 데이터 | 설명 |
|---------|--------|------|
| `goTo` | `{ target: string }` | 특정 위치로 이동 |
| `speak` | `{ text: string }` | 텍스트 말하기 |
| `startFollow` | - | 팔로우 모드 시작 |
| `stopFollow` | - | 팔로우 모드 중지 |
| `stopMovement` | - | 이동 정지 |
| `getStatus` | - | 로봇 상태 요청 |

### Temi → 서버 → 웹 (이벤트)

| 이벤트명 | 데이터 | 설명 |
|---------|--------|------|
| `temi_status` | `{ battery?: number, location?: string, isMoving?: boolean }` | 로봇 상태 업데이트 |
| `temi_arrived` | `{ target: string }` | 목적지 도착 |
| `temi_personDetected` | `{ distance?: number }` | 사람 감지 |
| `temi_error` | `{ message: string, code?: string }` | 에러 발생 |

---

## 테스트 시나리오

### 시나리오 1: 기본 연결 테스트

1. 서버 실행 (`npm run dev`)
2. Android 앱 실행
3. Logcat에서 다음 메시지 확인:
   - `서버에 연결됨`
   - `등록 완료: {"success":true,"type":"temi"}`

### 시나리오 2: 웹에서 명령 보내기

1. 웹 브라우저에서 React 앱 실행
2. 개발자 도구 콘솔에서:
   ```javascript
   socket.emit("goTo", { target: "kitchen" });
   ```
3. Android Logcat에서 `이동 명령 수신: kitchen` 확인

### 시나리오 3: Temi에서 이벤트 보내기

1. Android 앱에서:
   ```java
   socketManager.notifyArrived("kitchen");
   ```
2. 웹 콘솔에서 `arrived` 이벤트 수신 확인

---

## 문제 해결

### 연결이 안 될 때

1. **방화벽 확인**
   - 서버 포트(4000)가 열려있는지 확인

2. **네트워크 확인**
   - Android 기기와 서버가 같은 네트워크에 있는지 확인
   - IP 주소가 올바른지 확인

3. **서버 로그 확인**
   - 서버 콘솔에서 연결 시도 로그 확인

4. **AndroidManifest 확인**
   - `INTERNET` 권한이 있는지 확인
   - `usesCleartextTraffic="true"` 설정 확인 (HTTP 사용 시)

### 이벤트가 전달되지 않을 때

1. **클라이언트 타입 등록 확인**
   - `register` 이벤트를 보냈는지 확인
   - 서버 로그에서 클라이언트 타입 확인

2. **이벤트 이름 확인**
   - 대소문자 정확히 일치하는지 확인
   - 서버 코드의 이벤트 이름과 일치하는지 확인

---

## 다음 단계

1. Temi SDK 연동
2. 실제 로봇 동작 테스트
3. 에러 처리 강화
4. 인증/보안 추가 (프로덕션 환경)

