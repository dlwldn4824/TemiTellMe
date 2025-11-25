package com.example.coshowsample;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import io.socket.client.IO;
import io.socket.client.Socket;

import java.net.URISyntaxException;

// Temi SDK imports - SDK가 없을 때를 대비해 런타임에만 사용
// import com.robotemi.sdk.Robot;
// import com.robotemi.sdk.TtsRequest;
// import com.robotemi.sdk.listeners.OnGoToLocationStatusChangedListener;
// import com.robotemi.sdk.listeners.OnRobotReadyListener;

/**
 * Temi 로봇과 WebSocket 서버 간의 통신을 관리하는 클래스
 * React.js 웹에서 보낸 명령을 받아 Temi SDK로 전달하고,
 * Temi 로봇의 이벤트를 서버로 전송합니다.
 */
public class TemiSocketManager {
    private static final String TAG = "TemiSocketManager";
    private Socket socket;
    private Object robot; // Robot 타입 대신 Object 사용 (SDK가 없을 때 대비)
    private String serverUrl;
    private boolean isConnected = false;

    // 싱글톤 인스턴스
    private static TemiSocketManager instance;

    private TemiSocketManager() {
        // 기본 서버 URL (개발 환경)
        // 실제 사용 시 환경에 맞게 변경 필요
        this.serverUrl = "http://10.0.2.2:4000"; // 에뮬레이터용
        // this.serverUrl = "http://192.168.0.100:4000"; // 실제 기기용 (서버 IP로 변경)
    }

    public static TemiSocketManager getInstance() {
        if (instance == null) {
            instance = new TemiSocketManager();
        }
        return instance;
    }

    /**
     * 서버 URL 설정
     * @param url 서버 URL (예: "http://192.168.0.100:4000")
     */
    public void setServerUrl(String url) {
        this.serverUrl = url;
    }

    /**
     * WebSocket 서버에 연결
     */
    public void connect() {
        if (socket != null && socket.connected()) {
            Log.d(TAG, "이미 연결되어 있습니다.");
            return;
        }

        try {
            IO.Options opts = new IO.Options();
            opts.forceNew = true;
            opts.reconnection = true;
            opts.reconnectionDelay = 1000;
            opts.reconnectionAttempts = 5;
            opts.timeout = 10000;

            socket = IO.socket(serverUrl, opts);

            // 연결 이벤트
            socket.on(Socket.EVENT_CONNECT, args -> {
                Log.d(TAG, "✅ 서버에 연결됨: " + serverUrl);
                isConnected = true;

                // 클라이언트 타입 등록 (중요!)
                try {
                    JSONObject registerData = new JSONObject();
                    registerData.put("type", "temi");
                    socket.emit("register", registerData);
                } catch (JSONException e) {
                    Log.e(TAG, "등록 데이터 생성 실패", e);
                }
            });

            // 연결 해제 이벤트
            socket.on(Socket.EVENT_DISCONNECT, args -> {
                Log.d(TAG, "❌ 서버 연결 해제");
                isConnected = false;
            });

            // 연결 오류
            socket.on(Socket.EVENT_CONNECT_ERROR, args -> {
                Log.e(TAG, "❌ 연결 오류: " + (args.length > 0 ? args[0].toString() : "알 수 없는 오류"));
                isConnected = false;
            });

            // 등록 확인
            socket.on("registered", args -> {
                Log.d(TAG, "✅ 서버에 등록 완료: " + args[0].toString());
            });

            // 명령 핸들러 설정
            setupCommandHandlers();

            // Temi SDK 초기화
            initTemiRobot();

            // 연결 시작
            socket.connect();

        } catch (URISyntaxException e) {
            Log.e(TAG, "서버 URL 오류", e);
        }
    }

    /**
     * Temi SDK 초기화 및 리스너 설정
     * SDK가 없을 때를 대비해 리플렉션 사용
     */
    private void initTemiRobot() {
        try {
            // 리플렉션을 사용하여 Robot 클래스 로드 시도
            Class<?> robotClass = Class.forName("com.robotemi.sdk.Robot");
            java.lang.reflect.Method getInstanceMethod = robotClass.getMethod("getInstance");
            robot = getInstanceMethod.invoke(null);
            
            Log.d(TAG, "🤖 Temi SDK 초기화 성공");
            
            // 로봇 준비 리스너 (선택적)
            try {
                Class<?> listenerClass = Class.forName("com.robotemi.sdk.listeners.OnRobotReadyListener");
                Object listener = java.lang.reflect.Proxy.newProxyInstance(
                    listenerClass.getClassLoader(),
                    new Class[]{listenerClass},
                    (proxy, method, args) -> {
                        if (method.getName().equals("onRobotReady")) {
                            boolean isReady = (Boolean) args[0];
                            if (isReady) {
                                Log.d(TAG, "🤖 Temi 로봇 준비 완료");
                                sendStatus();
                            }
                        }
                        return null;
                    }
                );
                java.lang.reflect.Method addListenerMethod = robotClass.getMethod("addOnRobotReadyListener", listenerClass);
                addListenerMethod.invoke(robot, listener);
            } catch (Exception e) {
                Log.w(TAG, "로봇 준비 리스너 등록 실패 (무시 가능)", e);
            }

        } catch (ClassNotFoundException e) {
            Log.w(TAG, "Temi SDK를 찾을 수 없습니다. WebSocket은 정상 작동하지만 로봇 제어는 불가능합니다.");
        } catch (Exception e) {
            Log.w(TAG, "Temi SDK 초기화 실패 (로봇이 아닐 수 있음)", e);
        }
    }

    /**
     * 서버로부터 명령 수신 핸들러 설정
     */
    private void setupCommandHandlers() {
        // 이동 명령
        socket.on("temi_goTo", args -> {
            try {
                JSONObject data = (JSONObject) args[0];
                String target = data.getString("target");
                Log.d(TAG, "📍 이동 명령 수신: " + target);
                
                if (robot != null) {
                    // 리플렉션을 사용하여 goTo 메서드 호출
                    java.lang.reflect.Method goToMethod = robot.getClass().getMethod("goTo", String.class);
                    goToMethod.invoke(robot, target);
                } else {
                    Log.w(TAG, "Temi SDK가 초기화되지 않았습니다.");
                    sendError("Temi SDK가 초기화되지 않았습니다.", "SDK_NOT_INITIALIZED");
                }
            } catch (JSONException e) {
                Log.e(TAG, "이동 명령 파싱 오류", e);
            } catch (Exception e) {
                Log.e(TAG, "이동 명령 실행 오류", e);
                sendError("이동 명령 실행 실패: " + e.getMessage(), "GO_TO_ERROR");
            }
        });

        // 말하기 명령
        socket.on("temi_speak", args -> {
            try {
                JSONObject data = (JSONObject) args[0];
                String text = data.getString("text");
                Log.d(TAG, "💬 말하기 명령 수신: " + text);
                
                if (robot != null) {
                    try {
                        // 리플렉션을 사용하여 speak 메서드 호출
                        Class<?> ttsRequestClass = Class.forName("com.robotemi.sdk.TtsRequest");
                        java.lang.reflect.Method createMethod = ttsRequestClass.getMethod("create", String.class, boolean.class);
                        Object ttsRequest = createMethod.invoke(null, text, false);
                        
                        java.lang.reflect.Method speakMethod = robot.getClass().getMethod("speak", ttsRequestClass);
                        speakMethod.invoke(robot, ttsRequest);
                    } catch (ClassNotFoundException e) {
                        Log.w(TAG, "Temi SDK를 찾을 수 없습니다.", e);
                    } catch (Exception e) {
                        Log.e(TAG, "말하기 명령 실행 오류", e);
                    }
                } else {
                    Log.w(TAG, "Temi SDK가 초기화되지 않았습니다.");
                }
            } catch (JSONException e) {
                Log.e(TAG, "말하기 명령 파싱 오류", e);
            } catch (Exception e) {
                Log.e(TAG, "말하기 명령 실행 오류", e);
            }
        });

        // 팔로우 시작
        socket.on("temi_startFollow", args -> {
            Log.d(TAG, "👥 팔로우 모드 시작 명령 수신");
            try {
                if (robot != null) {
                    java.lang.reflect.Method startFollowMethod = robot.getClass().getMethod("startFollowMe");
                    startFollowMethod.invoke(robot);
                } else {
                    Log.w(TAG, "Temi SDK가 초기화되지 않았습니다.");
                }
            } catch (Exception e) {
                Log.e(TAG, "팔로우 시작 오류", e);
                sendError("팔로우 시작 실패: " + e.getMessage(), "FOLLOW_ERROR");
            }
        });

        // 팔로우 중지
        socket.on("temi_stopFollow", args -> {
            Log.d(TAG, "🛑 팔로우 모드 중지 명령 수신");
            try {
                if (robot != null) {
                    java.lang.reflect.Method stopFollowMethod = robot.getClass().getMethod("stopFollowMe");
                    stopFollowMethod.invoke(robot);
                } else {
                    Log.w(TAG, "Temi SDK가 초기화되지 않았습니다.");
                }
            } catch (Exception e) {
                Log.e(TAG, "팔로우 중지 오류", e);
            }
        });

        // 이동 정지
        socket.on("temi_stopMovement", args -> {
            Log.d(TAG, "⏹️ 이동 정지 명령 수신");
            try {
                if (robot != null) {
                    java.lang.reflect.Method stopMovementMethod = robot.getClass().getMethod("stopMovement");
                    stopMovementMethod.invoke(robot);
                } else {
                    Log.w(TAG, "Temi SDK가 초기화되지 않았습니다.");
                }
            } catch (Exception e) {
                Log.e(TAG, "이동 정지 오류", e);
            }
        });

        // 상태 요청
        socket.on("temi_getStatus", args -> {
            Log.d(TAG, "📊 상태 요청 수신");
            sendStatus();
        });

        // 춤추기 명령 (앞뒤 이동 + 고개 움직임)
        socket.on("temi_dance", args -> {
            try {
                JSONObject data = (JSONObject) args[0];
                int duration = data.optInt("duration", 5000);
                Log.d(TAG, "💃 춤추기 명령 수신: " + duration + "ms");
                
                if (robot != null) {
                    // 춤추기 시퀀스 실행 (앞뒤 이동 + 고개 움직임)
                    executeDanceSequence(duration);
                } else {
                    Log.w(TAG, "Temi SDK가 초기화되지 않았습니다.");
                }
            } catch (Exception e) {
                Log.e(TAG, "춤추기 명령 실행 오류", e);
            }
        });

        // 앞으로 이동
        socket.on("temi_moveForward", args -> {
            try {
                JSONObject data = (JSONObject) args[0];
                double distance = data.optDouble("distance", 0.5);
                Log.d(TAG, "⬆️ 앞으로 이동 명령 수신: " + distance + "m");
                
                if (robot != null) {
                    // 리플렉션을 사용하여 tiltBy 메서드 호출 (앞으로 이동)
                    try {
                        java.lang.reflect.Method tiltByMethod = robot.getClass().getMethod("tiltBy", float.class, float.class, float.class);
                        tiltByMethod.invoke(robot, 0.0f, (float)distance, 0.0f);
                    } catch (Exception e) {
                        Log.w(TAG, "tiltBy 메서드 호출 실패, 대체 방법 시도", e);
                        // 대체 방법: SDK의 다른 이동 메서드 사용
                    }
                } else {
                    Log.w(TAG, "Temi SDK가 초기화되지 않았습니다.");
                }
            } catch (Exception e) {
                Log.e(TAG, "앞으로 이동 명령 실행 오류", e);
            }
        });

        // 뒤로 이동
        socket.on("temi_moveBackward", args -> {
            try {
                JSONObject data = (JSONObject) args[0];
                double distance = data.optDouble("distance", 0.5);
                Log.d(TAG, "⬇️ 뒤로 이동 명령 수신: " + distance + "m");
                
                if (robot != null) {
                    // 리플렉션을 사용하여 tiltBy 메서드 호출 (뒤로 이동)
                    try {
                        java.lang.reflect.Method tiltByMethod = robot.getClass().getMethod("tiltBy", float.class, float.class, float.class);
                        tiltByMethod.invoke(robot, 0.0f, (float)(-distance), 0.0f);
                    } catch (Exception e) {
                        Log.w(TAG, "tiltBy 메서드 호출 실패, 대체 방법 시도", e);
                    }
                } else {
                    Log.w(TAG, "Temi SDK가 초기화되지 않았습니다.");
                }
            } catch (Exception e) {
                Log.e(TAG, "뒤로 이동 명령 실행 오류", e);
            }
        });

        // 고개 왼쪽으로
        socket.on("temi_headLeft", args -> {
            try {
                JSONObject data = (JSONObject) args[0];
                int angle = data.optInt("angle", 30);
                Log.d(TAG, "👈 고개 왼쪽 명령 수신: " + angle + "도");
                
                if (robot != null) {
                    // 리플렉션을 사용하여 고개 회전
                    try {
                        java.lang.reflect.Method turnByMethod = robot.getClass().getMethod("turnBy", float.class);
                        turnByMethod.invoke(robot, (float)angle);
                    } catch (Exception e) {
                        Log.w(TAG, "turnBy 메서드 호출 실패", e);
                    }
                } else {
                    Log.w(TAG, "Temi SDK가 초기화되지 않았습니다.");
                }
            } catch (Exception e) {
                Log.e(TAG, "고개 왼쪽 명령 실행 오류", e);
            }
        });

        // 고개 오른쪽으로
        socket.on("temi_headRight", args -> {
            try {
                JSONObject data = (JSONObject) args[0];
                int angle = data.optInt("angle", 30);
                Log.d(TAG, "👉 고개 오른쪽 명령 수신: " + angle + "도");
                
                if (robot != null) {
                    // 리플렉션을 사용하여 고개 회전
                    try {
                        java.lang.reflect.Method turnByMethod = robot.getClass().getMethod("turnBy", float.class);
                        turnByMethod.invoke(robot, (float)(-angle));
                    } catch (Exception e) {
                        Log.w(TAG, "turnBy 메서드 호출 실패", e);
                    }
                } else {
                    Log.w(TAG, "Temi SDK가 초기화되지 않았습니다.");
                }
            } catch (Exception e) {
                Log.e(TAG, "고개 오른쪽 명령 실행 오류", e);
            }
        });

        // 고개 중앙으로
        socket.on("temi_headCenter", args -> {
            Log.d(TAG, "⬆️ 고개 중앙 명령 수신");
            
            if (robot != null) {
                // 리플렉션을 사용하여 고개 중앙으로
                try {
                    java.lang.reflect.Method turnByMethod = robot.getClass().getMethod("turnBy", float.class);
                    turnByMethod.invoke(robot, 0.0f);
                } catch (Exception e) {
                    Log.w(TAG, "turnBy 메서드 호출 실패", e);
                }
            } else {
                Log.w(TAG, "Temi SDK가 초기화되지 않았습니다.");
            }
        });
    }

    /**
     * 춤추기 시퀀스 실행 (앞뒤 이동 + 고개 움직임)
     */
    private void executeDanceSequence(int duration) {
        if (robot == null) {
            return;
        }

        new Thread(() -> {
            try {
                int steps = duration / 1000; // 1초마다 동작
                for (int i = 0; i < steps; i++) {
                    // 앞으로 이동
                    try {
                        java.lang.reflect.Method tiltByMethod = robot.getClass().getMethod("tiltBy", float.class, float.class, float.class);
                        tiltByMethod.invoke(robot, 0.0f, 0.3f, 0.0f);
                    } catch (Exception e) {
                        Log.w(TAG, "앞으로 이동 실패", e);
                    }
                    Thread.sleep(500);

                    // 고개 왼쪽
                    try {
                        java.lang.reflect.Method turnByMethod = robot.getClass().getMethod("turnBy", float.class);
                        turnByMethod.invoke(robot, 30.0f);
                    } catch (Exception e) {
                        Log.w(TAG, "고개 왼쪽 실패", e);
                    }
                    Thread.sleep(500);

                    // 뒤로 이동
                    try {
                        java.lang.reflect.Method tiltByMethod = robot.getClass().getMethod("tiltBy", float.class, float.class, float.class);
                        tiltByMethod.invoke(robot, 0.0f, -0.3f, 0.0f);
                    } catch (Exception e) {
                        Log.w(TAG, "뒤로 이동 실패", e);
                    }
                    Thread.sleep(500);

                    // 고개 오른쪽
                    try {
                        java.lang.reflect.Method turnByMethod = robot.getClass().getMethod("turnBy", float.class);
                        turnByMethod.invoke(robot, -30.0f);
                    } catch (Exception e) {
                        Log.w(TAG, "고개 오른쪽 실패", e);
                    }
                    Thread.sleep(500);

                    // 고개 중앙
                    try {
                        java.lang.reflect.Method turnByMethod = robot.getClass().getMethod("turnBy", float.class);
                        turnByMethod.invoke(robot, 0.0f);
                    } catch (Exception e) {
                        Log.w(TAG, "고개 중앙 실패", e);
                    }
                }
            } catch (InterruptedException e) {
                Log.e(TAG, "춤추기 시퀀스 중단", e);
            }
        }).start();
    }

    /**
     * Temi 로봇 상태를 서버로 전송
     */
    public void sendStatus() {
        if (!isConnected || socket == null) {
            return;
        }

        try {
            JSONObject status = new JSONObject();
            
            if (robot != null) {
                try {
                    // 리플렉션을 사용하여 현재 위치 가져오기
                    java.lang.reflect.Method getLocationMethod = robot.getClass().getMethod("getCurrentLocation");
                    String currentLocation = (String) getLocationMethod.invoke(robot);
                    if (currentLocation != null) {
                        status.put("location", currentLocation);
                    }
                } catch (Exception e) {
                    Log.w(TAG, "상태 정보 가져오기 실패", e);
                }
            }
            
            socket.emit("temi_status", status);
            Log.d(TAG, "📊 상태 전송: " + status.toString());
            
        } catch (Exception e) {
            Log.e(TAG, "상태 데이터 생성 오류", e);
        }
    }

    /**
     * 목적지 도착 이벤트를 서버로 전송
     */
    public void notifyArrived(String target) {
        if (!isConnected || socket == null) {
            return;
        }

        try {
            JSONObject data = new JSONObject();
            data.put("target", target);
            socket.emit("temi_arrived", data);
            Log.d(TAG, "✅ 도착 알림 전송: " + target);
        } catch (JSONException e) {
            Log.e(TAG, "도착 알림 데이터 생성 오류", e);
        }
    }

    /**
     * 사람 감지 이벤트를 서버로 전송
     */
    public void notifyPersonDetected(double distance) {
        if (!isConnected || socket == null) {
            return;
        }

        try {
            JSONObject data = new JSONObject();
            data.put("distance", distance);
            socket.emit("temi_personDetected", data);
            Log.d(TAG, "👤 사람 감지 알림 전송: " + distance + "m");
        } catch (JSONException e) {
            Log.e(TAG, "사람 감지 알림 데이터 생성 오류", e);
        }
    }

    /**
     * 에러를 서버로 전송
     */
    public void sendError(String message, String code) {
        if (!isConnected || socket == null) {
            return;
        }

        try {
            JSONObject data = new JSONObject();
            data.put("message", message);
            if (code != null) {
                data.put("code", code);
            }
            socket.emit("temi_error", data);
            Log.e(TAG, "❌ 에러 전송: " + message);
        } catch (JSONException e) {
            Log.e(TAG, "에러 데이터 생성 오류", e);
        }
    }

    /**
     * 연결 해제
     */
    public void disconnect() {
        if (socket != null) {
            socket.disconnect();
            socket = null;
            isConnected = false;
            Log.d(TAG, "연결 해제됨");
        }
    }

    /**
     * 연결 상태 확인
     */
    public boolean isConnected() {
        return isConnected && socket != null && socket.connected();
    }

    /**
     * Robot 인스턴스 가져오기
     */
    public Object getRobot() {
        return robot;
    }
}

