# Gradle 경고 메시지 설명

## flatDir 경고

### 경고 메시지
```
WARNING: Using flatDir should be avoided because it doesn't support any meta-data formats.
```

### 원인
이 경고는 `build.gradle` 파일에서 `flatDir` 리포지토리를 사용할 때 나타납니다.

### 왜 사용하는가?
다음과 같은 이유로 `flatDir`이 필요합니다:

1. **Temi SDK**: `libs/sdk-debug.aar` 파일을 로컬에서 직접 사용
2. **Capacitor 플러그인**: 일부 Capacitor 플러그인이 로컬 AAR 파일을 사용

### 해결 방법

이 경고는 **기능에 영향을 주지 않으며**, 다음 중 하나를 선택할 수 있습니다:

#### 옵션 1: 경고 무시 (권장)
경고는 단순히 권장사항이며, 실제 빌드나 실행에는 문제가 없습니다.
현재 프로젝트에서는 Temi SDK를 사용하기 위해 필수적이므로 경고를 무시해도 됩니다.

#### 옵션 2: 경고 억제
`gradle.properties` 파일에 다음을 추가할 수 있습니다:
```properties
org.gradle.warning.mode=none
```
하지만 이는 모든 경고를 억제하므로 권장하지 않습니다.

#### 옵션 3: Maven 로컬 리포지토리 사용 (고급)
Temi SDK를 Maven 로컬 리포지토리에 설치하면 flatDir을 제거할 수 있지만,
이는 추가 설정이 필요하고 프로젝트 구조가 복잡해집니다.

### 결론
**현재 상태로 사용해도 문제없습니다.** 경고는 무시하고 개발을 진행하세요.

