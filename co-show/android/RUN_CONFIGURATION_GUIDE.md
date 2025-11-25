# Android Studio 실행 설정 가이드

Android Studio에서 앱을 실행하기 위한 Run Configuration이 설정되었습니다.

## ✅ 생성된 파일들

다음 파일들이 생성되었습니다:
- `.idea/runConfigurations/Android_App.xml` - 기본 실행 설정
- `.idea/runConfigurations/Android_App__Debug_.xml` - 디버그 모드 실행 설정
- `.idea/modules.xml` - 프로젝트 모듈 설정
- `.idea/gradle.xml` - Gradle 프로젝트 설정
- `.idea/misc.xml` - 프로젝트 기본 설정
- `.idea/compiler.xml` - 컴파일러 설정

## 🚀 사용 방법

### 1. Android Studio에서 프로젝트 열기

1. Android Studio 실행
2. **File → Open** 선택
3. `co-show/android` 폴더 선택
4. **Open as Project** 클릭

### 2. Gradle Sync

프로젝트를 열면 자동으로 Gradle Sync가 시작됩니다. 
만약 자동으로 시작되지 않으면:
- 상단 메뉴: **File → Sync Project with Gradle Files**
- 또는 우측 상단의 **Gradle Sync** 아이콘 클릭

### 3. 실행 설정 확인

1. 상단 툴바에서 실행 설정 확인
2. **"Android App"** 또는 **"Android App (Debug)"** 드롭다운이 보여야 합니다
3. 만약 보이지 않으면:
   - **Run → Edit Configurations...** 클릭
   - 왼쪽 상단의 **+** 버튼 클릭
   - **Android App** 선택
   - **Module:** `app` 선택
   - **OK** 클릭

### 4. 디바이스/에뮬레이터 선택

1. 상단 툴바에서 실행 버튼 옆의 디바이스 선택 드롭다운 클릭
2. 다음 중 하나 선택:
   - **실행 중인 Android 에뮬레이터**
   - **연결된 물리적 디바이스** (테미 로봇 포함)
   - **Create New Virtual Device** (에뮬레이터 생성)

### 5. 앱 실행

1. 상단 툴바의 **Run** 버튼 (▶️) 클릭
   - 또는 단축키: **Shift + F10** (Windows/Linux), **Ctrl + R** (Mac)
2. 첫 실행 시 빌드가 자동으로 수행됩니다
3. 빌드가 완료되면 선택한 디바이스에 앱이 설치되고 실행됩니다

## 🔧 설정 커스터마이징

### 디버그 모드로 실행

- 실행 설정 드롭다운에서 **"Android App (Debug)"** 선택
- 또는 **Run → Debug 'Android App'** 메뉴 사용

### 빌드 변형 변경

1. **Run → Edit Configurations...** 클릭
2. **Build Variant** 선택:
   - `debug` - 디버그 빌드 (기본값)
   - `release` - 릴리즈 빌드

### 에뮬레이터 자동 시작

1. **Run → Edit Configurations...** 클릭
2. **Emulator** 탭에서:
   - **Start emulator** 체크
   - 원하는 AVD 선택

## 📱 테미 로봇에 연결하여 실행

### 1. ADB 연결

터미널에서:
```bash
adb connect 192.168.0.20
```

### 2. 디바이스 확인

Android Studio에서:
1. **Tools → Device Manager** 열기
2. **Physical** 탭에서 테미 로봇이 나타나는지 확인
3. 나타나지 않으면 **Refresh** 클릭

### 3. 실행

1. 실행 설정 드롭다운에서 테미 로봇 선택
2. **Run** 버튼 클릭

## ❌ 문제 해결

### "Run configuration is invalid"

1. **Run → Edit Configurations...** 클릭
2. 실행 설정 삭제 후 다시 생성
3. **Module:** `app` 선택 확인

### "Gradle sync failed"

1. **File → Invalidate Caches / Restart...**
2. **Invalidate and Restart** 클릭
3. 프로젝트 다시 열기

### "No devices found"

1. 에뮬레이터 실행 또는 물리적 디바이스 연결 확인
2. **Tools → Device Manager**에서 디바이스 상태 확인
3. ADB 연결 확인: `adb devices`

### "Module not specified"

1. **File → Project Structure** 열기
2. **Modules** 탭에서 `app` 모듈 확인
3. 없으면 **+** 버튼으로 추가

## 💡 팁

- **빠른 실행**: `Ctrl + Shift + F10` (Windows/Linux) 또는 `Ctrl + R` (Mac)로 바로 실행
- **디버그 실행**: `Shift + F9` (Windows/Linux) 또는 `Ctrl + D` (Mac)
- **빌드만 실행**: 상단 메뉴 **Build → Make Project**
- **로그 확인**: 하단 **Logcat** 탭에서 앱 로그 확인

## 📚 추가 리소스

- [Android Studio 공식 문서](https://developer.android.com/studio/run)
- [Gradle 빌드 가이드](https://developer.android.com/studio/build)

