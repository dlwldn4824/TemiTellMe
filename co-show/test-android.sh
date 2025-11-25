#!/bin/bash

# Android 앱 테스트 스크립트
# 사용법: ./test-android.sh [build|install|run|all]

set -e

# 경로 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ANDROID_DIR="$SCRIPT_DIR/android"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# JDK 및 ADB 경로
JAVA_HOME="$PROJECT_ROOT/jdk-17.0.11+9/Contents/Home"
ADB_PATH="$PROJECT_ROOT/platform-tools"

# PATH 업데이트
export JAVA_HOME
export PATH="$ADB_PATH:$JAVA_HOME/bin:$PATH"

# 색상 출력
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. 웹 앱 빌드
build_web() {
    print_info "웹 앱 빌드 중..."
    cd "$SCRIPT_DIR"
    pnpm run build
    print_info "웹 앱 빌드 완료!"
}

# 2. 안드로이드 assets 복사
copy_assets() {
    print_info "안드로이드 assets 복사 중..."
    mkdir -p "$ANDROID_DIR/app/src/main/assets/www"
    cp -r "$SCRIPT_DIR/dist/"* "$ANDROID_DIR/app/src/main/assets/www/"
    print_info "Assets 복사 완료!"
}

# 3. 안드로이드 APK 빌드
build_android() {
    print_info "안드로이드 APK 빌드 중..."
    cd "$ANDROID_DIR"
    ./gradlew assembleDebug
    print_info "APK 빌드 완료!"
}

# 4. 디바이스 확인
check_device() {
    print_info "연결된 디바이스 확인 중..."
    DEVICES=$(adb devices | grep -v "List" | grep "device" | wc -l | tr -d ' ')
    
    if [ "$DEVICES" -eq 0 ]; then
        print_error "연결된 디바이스가 없습니다!"
        print_warn "다음 중 하나를 시도하세요:"
        echo "  1. Android Emulator 실행"
        echo "  2. 테미 로봇 연결: adb connect 192.168.0.20"
        exit 1
    else
        print_info "$DEVICES 개의 디바이스가 연결되어 있습니다."
        adb devices
    fi
}

# 5. APK 설치
install_apk() {
    print_info "APK 설치 중..."
    APK_PATH="$ANDROID_DIR/app/build/outputs/apk/debug/app-debug.apk"
    
    if [ ! -f "$APK_PATH" ]; then
        print_error "APK 파일을 찾을 수 없습니다: $APK_PATH"
        print_info "먼저 빌드를 실행하세요: ./test-android.sh build"
        exit 1
    fi
    
    adb install -r "$APK_PATH"
    print_info "APK 설치 완료!"
}

# 6. 앱 실행
run_app() {
    print_info "앱 실행 중..."
    adb shell am start -n com.example.coshowsample/.MainActivity
    print_info "앱 실행 완료!"
}

# 7. 전체 프로세스
all() {
    build_web
    copy_assets
    build_android
    check_device
    install_apk
    run_app
    print_info "전체 프로세스 완료! 🎉"
}

# 메인 로직
case "${1:-all}" in
    build)
        build_web
        copy_assets
        build_android
        ;;
    install)
        check_device
        install_apk
        ;;
    run)
        run_app
        ;;
    all)
        all
        ;;
    *)
        echo "사용법: $0 [build|install|run|all]"
        echo ""
        echo "  build  - 웹 앱 빌드 + Assets 복사 + APK 빌드"
        echo "  install - APK 설치 (디바이스 필요)"
        echo "  run    - 앱 실행"
        echo "  all    - 전체 프로세스 (기본값)"
        exit 1
        ;;
esac





