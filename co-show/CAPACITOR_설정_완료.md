# Capacitor 설정 완료 가이드

## ✅ 완료된 작업

1. **MainActivity를 BridgeActivity로 변경** ✅
   - `com.getcapacitor.BridgeActivity` 상속
   - Capacitor가 자동으로 WebView를 생성하고 `assets/www/index.html` 로드

2. **Capacitor 설정 확인** ✅
   - `capacitor.config.json`의 `webDir: "dist"` 설정 확인

---

## 🚀 React 빌드 → 안드로이드 싱크 작업

### 1단계: React 빌드

```bash
cd "/Users/LEEJIWOO/Desktop/대학교폴더/2학년 2학기/HCI-UX/co-show"
pnpm run build
```

이 명령어가 `dist/` 폴더를 생성합니다.

---

### 2단계: Capacitor로 dist를 안드로이드에 복사

```bash
npx cap copy android
```

이 명령어가:
- `dist/` 안의 파일들을
- `android/app/src/main/assets/www/`로 복사합니다
- Capacitor가 설정한 경로에 맞춰 자동 복사합니다

> **참고**: 수동으로 `cp -r dist/* android/app/src/main/assets/www/` 하는 것보다
> `npx cap copy android`가 Capacitor 설정에 맞춰 더 안정적으로 복사합니다.

---

### 3단계: APK 빌드

```bash
cd android

# Java 경로 설정
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"

# APK 빌드
./gradlew assembleDebug
```

---

### 4단계: 로봇에 설치

```bash
# 로봇 연결 (필요시)
adb connect <로봇_IP>:5555

# APK 설치
adb install -r app/build/outputs/apk/debug/app-debug.apk

# 앱 실행
adb shell am start -n com.example.coshowsample/.MainActivity
```

---

## 📋 전체 명령어 순서 (한 번에)

```bash
cd "/Users/LEEJIWOO/Desktop/대학교폴더/2학년 2학기/HCI-UX/co-show"

# 1. React 빌드
pnpm run build

# 2. Capacitor로 안드로이드에 복사
npx cap copy android

# 3. APK 빌드
cd android
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
./gradlew assembleDebug

# 4. 설치 (로봇 연결 후)
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.example.coshowsample/.MainActivity
```

---

## 🔍 확인 사항

### BridgeActivity 작동 확인

`MainActivity.java`가 `BridgeActivity`를 상속하면:
- ✅ Capacitor가 자동으로 WebView 생성
- ✅ `assets/www/index.html` 자동 로드
- ✅ JavaScript와 네이티브 간 Bridge 자동 설정

### assets/www 폴더 확인

`npx cap copy android` 실행 후:
```bash
ls -la android/app/src/main/assets/www/
```

다음 파일들이 있어야 합니다:
- `index.html`
- `assets/` 폴더 (JS, CSS 등)

---

## 🎯 예상 결과

앱을 실행하면:
1. **BridgeActivity가 자동으로 WebView 생성**
2. **`assets/www/index.html` 로드**
3. **React 앱 화면 표시** ✅

개발 서버 없이도 로컬에 빌드된 React 앱이 실행됩니다!

---

## ⚠️ 주의사항

### API 호출

React 앱에서 백엔드 API를 호출하는 경우:
- `src/services/apiBase.js`의 안드로이드 환경 IP 설정 확인
- 백엔드 서버가 실행 중이어야 함 (WebSocket, REST API 등)

### 이미지 경로

이미지를 import로 사용하면 Vite가 빌드 시 올바른 경로로 변환합니다.
절대 경로(`/assets/...`)는 Android WebView에서 문제가 될 수 있습니다.

---

## 🔧 문제 해결

### 문제: 화면이 안 뜨거나 빈 화면

**확인**:
1. `npx cap copy android`가 제대로 실행되었는지
2. `assets/www/index.html` 파일이 있는지
3. 로그 확인:
   ```bash
   adb logcat | grep -i "capacitor\|webview\|coshowsample"
   ```

### 문제: JavaScript 오류

**확인**:
1. React 빌드가 성공했는지 (`pnpm run build`)
2. `assets/` 폴더의 JS 파일들이 복사되었는지
3. 브라우저 콘솔에서 확인할 수 있는 오류를 로그에서 확인

---

## 📝 다음 단계

1. React 빌드 후 Capacitor 복사
2. APK 빌드 및 설치
3. 로봇에서 테스트
4. 필요시 Temi SDK 기능 추가



