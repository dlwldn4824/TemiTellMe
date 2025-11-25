# "Module not specified" 오류 해결 가이드

Run Configuration에서 "Module not specified" 오류가 발생하는 경우 해결 방법입니다.

## ✅ 수정 완료

모듈 이름을 `android.app`에서 `app`으로 수정했습니다.

## 🔧 추가 해결 방법

### 방법 1: Android Studio에서 모듈 자동 인식

1. **Android Studio에서 프로젝트 열기**
   - File → Open → `co-show/android` 폴더 선택

2. **Gradle Sync 완료 대기**
   - 하단에 진행 상태가 표시됩니다
   - "Gradle sync finished" 메시지가 나올 때까지 기다리세요

3. **프로젝트 구조 확인**
   - 왼쪽 프로젝트 패널에서 `app` 모듈이 보이는지 확인
   - 없으면: File → Sync Project with Gradle Files

### 방법 2: Run Configuration 수동 수정

1. **Run → Edit Configurations...** 클릭

2. 실행 설정 선택 (예: "Android App")

3. 오른쪽 패널에서:
   - **Module:** 드롭다운을 클릭
   - `app` 모듈 선택
   - 없으면 "No module" 상태입니다

4. **OK** 클릭

### 방법 3: Run Configuration 재생성

1. **Run → Edit Configurations...** 클릭

2. 실행 설정 삭제:
   - 왼쪽에서 실행 설정 선택
   - 상단의 **-** (마이너스) 버튼 클릭

3. 새로운 실행 설정 생성:
   - 상단의 **+** 버튼 클릭
   - **Android App** 선택

4. 설정:
   - **Name:** "Android App"
   - **Module:** `app` 선택 (드롭다운에서)
   - **Launch:** "Default Activity" 선택
   - **Before launch:** Gradle-aware Make 체크

5. **OK** 클릭

### 방법 4: 프로젝트 구조 확인 및 수정

1. **File → Project Structure** (또는 `Cmd + ;` Mac, `Ctrl + Alt + Shift + S` Windows)

2. **Modules** 탭 확인:
   - `app` 모듈이 있는지 확인
   - 없으면:
     - **+** 버튼 클릭
     - **Import Gradle Project** 선택
     - `app` 폴더 선택

3. **OK** 클릭

### 방법 5: Gradle 프로젝트 재임포트

1. **File → Close Project**

2. **File → Open**
   - `co-show/android` 폴더 다시 선택

3. **Import Gradle Project** 선택 (표시되는 경우)

4. Gradle Sync 완료 대기

### 방법 6: .idea 폴더 정리 (최후의 수단)

만약 위 방법들이 모두 실패하면:

1. Android Studio 종료

2. 터미널에서:
   ```bash
   cd co-show/android
   rm -rf .idea
   ```

3. Android Studio 다시 열기
   - File → Open → `co-show/android` 폴더 선택
   - "Import Gradle Project" 선택

4. Gradle Sync 완료 대기

## 📝 체크리스트

다음 항목들을 확인하세요:

- [ ] Android Studio에서 프로젝트가 제대로 열렸는가?
- [ ] Gradle Sync가 완료되었는가? (하단 상태바 확인)
- [ ] 왼쪽 프로젝트 패널에 `app` 모듈이 보이는가?
- [ ] Run → Edit Configurations에서 Module 드롭다운에 `app`이 있는가?
- [ ] `app/build.gradle` 파일이 존재하는가?

## 💡 일반적인 원인

1. **Gradle Sync 미완료**
   - 해결: File → Sync Project with Gradle Files

2. **잘못된 프로젝트 폴더 열기**
   - 해결: `co-show/android` 폴더를 열어야 함 (루트가 아님)

3. **모듈 파일(.iml) 미생성**
   - 해결: Gradle Sync 완료 후 자동 생성됨

4. **프로젝트 캐시 문제**
   - 해결: File → Invalidate Caches / Restart

## 🚀 빠른 확인 명령어

터미널에서 프로젝트 구조 확인:

```bash
cd co-show/android
ls -la app/
ls -la app/build.gradle  # 파일이 있어야 함
```

## ❓ 여전히 문제가 있다면

1. **Log 확인**
   - View → Tool Windows → Gradle
   - 빌드 오류 메시지 확인

2. **프로젝트 정보 확인**
   - File → Project Structure
   - SDK, JDK 설정 확인

3. **Android Studio 로그 확인**
   - Help → Show Log in Finder (Mac)
   - 또는 Help → Show Log in Explorer (Windows)





