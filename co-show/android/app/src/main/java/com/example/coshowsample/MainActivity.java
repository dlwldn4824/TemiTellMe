package com.example.coshowsample;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.content.Intent;
import android.graphics.Bitmap;
import android.provider.MediaStore;
import android.util.Base64;
import java.io.ByteArrayOutputStream;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

// Temi SDK imports - SDK가 있으면 직접 사용
// import com.robotemi.sdk.Robot;
// import com.robotemi.sdk.TtsRequest;

public class MainActivity extends AppCompatActivity {

    private static final int REQ_PERMISSIONS = 1001;

    private WebView webView;
    private Object robot; // Robot 타입 대신 Object 사용 (SDK가 없을 때 대비)
    private TemiSocketManager socketManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initTemi();
        initWebSocket();
        ensurePermissions();
        setupWebView();
    }

    /**
     * WebSocket 서버 연결 초기화
     */
    private void initWebSocket() {
        socketManager = TemiSocketManager.getInstance();
        
        // 서버 URL 설정 (필요 시 변경)
        // 에뮬레이터: "http://10.0.2.2:4000"
        // 실제 기기: "http://YOUR_SERVER_IP:4000"
        // socketManager.setServerUrl("http://192.168.0.100:4000");
        
        // 서버에 연결
        socketManager.connect();
    }

    private void initTemi() {
        try {
            // Temi SDK가 있으면 직접 사용
            Class<?> robotClass = Class.forName("com.robotemi.sdk.Robot");
            java.lang.reflect.Method getInstanceMethod = robotClass.getMethod("getInstance");
            robot = getInstanceMethod.invoke(null);
            
            // 말하기 기능 (선택적)
            try {
                Class<?> ttsRequestClass = Class.forName("com.robotemi.sdk.TtsRequest");
                java.lang.reflect.Method createMethod = ttsRequestClass.getMethod("create", String.class, boolean.class);
                Object ttsRequest = createMethod.invoke(null, "웹 페이지를 불러오는 중입니다.", false);
                
                java.lang.reflect.Method speakMethod = robotClass.getMethod("speak", ttsRequestClass);
                speakMethod.invoke(robot, ttsRequest);
            } catch (Exception e) {
                // 말하기 실패는 무시
            }
        } catch (ClassNotFoundException e) {
            // Temi SDK가 없으면 무시 (정상적인 상황)
        } catch (Exception ex) {
            // Temi SDK 가 없거나 로봇이 아니어도 앱이 크래시 되지 않도록 방어
        }
    }

    private void ensurePermissions() {
        String[] perms = new String[]{
                Manifest.permission.CAMERA,
                Manifest.permission.RECORD_AUDIO
        };

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            boolean need = false;
            for (String p : perms) {
                if (ContextCompat.checkSelfPermission(this, p)
                        != PackageManager.PERMISSION_GRANTED) {
                    need = true;
                    break;
                }
            }

            if (need) {
                ActivityCompat.requestPermissions(this, perms, REQ_PERMISSIONS);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        webView = findViewById(R.id.webview);

        WebSettings ws = webView.getSettings();
        ws.setJavaScriptEnabled(true);
        ws.setDomStorageEnabled(true);
        ws.setMediaPlaybackRequiresUserGesture(false);
        ws.setAllowFileAccess(true);
        ws.setAllowFileAccessFromFileURLs(true);
        ws.setAllowUniversalAccessFromFileURLs(true);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(() -> {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        request.grant(request.getResources());
                    }
                });
            }
        });

        // JavaScript 인터페이스 추가 (Android 카메라)
        webView.addJavascriptInterface(new AndroidInterface(), "Android");

        // 로컬 파일 로드 (TemiWebShell 방식)
        webView.loadUrl("file:///android_asset/www/index.html");
    }

    /**
     * JavaScript 인터페이스 클래스 (Android 카메라 기능)
     */
    private class AndroidInterface {
        private static final int REQUEST_CAMERA = 1002;
        private boolean isPreviewActive = false;

        @JavascriptInterface
        public void startInlinePreview() {
            runOnUiThread(() -> {
                isPreviewActive = true;
                // 카메라 인텐트 시작
                Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                if (intent.resolveActivity(getPackageManager()) != null) {
                    startActivityForResult(intent, REQUEST_CAMERA);
                }
            });
        }

        @JavascriptInterface
        public void capturePhoto() {
            runOnUiThread(() -> {
                if (isPreviewActive) {
                    // 카메라가 이미 열려있으면 촬영만 수행
                    // 실제로는 카메라 앱이 촬영 버튼을 처리
                } else {
                    // 카메라가 열려있지 않으면 다시 시작
                    startInlinePreview();
                }
            });
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        if (requestCode == 1002 && resultCode == RESULT_OK && data != null) {
            Bitmap photo = (Bitmap) data.getExtras().get("data");
            if (photo != null) {
                // Bitmap을 Base64로 변환하여 JavaScript로 전달
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                photo.compress(Bitmap.CompressFormat.PNG, 100, baos);
                byte[] imageBytes = baos.toByteArray();
                String base64Image = Base64.encodeToString(imageBytes, Base64.NO_WRAP);
                String dataUrl = "data:image/png;base64," + base64Image;
                
                // JavaScript 콜백 호출
                runOnUiThread(() -> {
                    webView.evaluateJavascript(
                        "if (typeof onPhotoCaptured === 'function') { onPhotoCaptured('" + dataUrl + "'); }",
                        null
                    );
                });
            }
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onStop() {
        super.onStop();
    }

    @Override
    protected void onDestroy() {
        // WebSocket 연결 해제
        if (socketManager != null) {
            socketManager.disconnect();
            socketManager = null;
        }
        
        if (robot != null) {
            robot = null;
        }
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
