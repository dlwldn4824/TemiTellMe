# QR 코드 전 세계 접근 설정 가이드

## 문제 상황

현재 QR 코드에 들어가는 URL이 `localhost`나 로컬 IP(`192.168.x.x`)이기 때문에:
- ✅ 같은 와이파이에서는 접근 가능
- ❌ 다른 와이파이/5G에서는 접근 불가

**전 세계 어디서나 접근하려면 공개 서버 주소가 필요합니다.**

---

## 해결 방법

### 방법 1: ngrok 사용 (임시/발표용) ⚡

**장점**: 빠르게 설정 가능, 발표/체험용으로 적합  
**단점**: ngrok 실행 중에만 유효, URL이 변경될 수 있음

#### 1단계: ngrok 설치

```bash
# Homebrew로 설치 (macOS)
brew install ngrok

# 또는 공식 사이트에서 다운로드
# https://ngrok.com/download
```

#### 2단계: ngrok 실행

새 터미널 창에서:

```bash
ngrok http 4000
```

출력 예시:
```
Forwarding  https://abcd-1234-5678.ngrok-free.app -> http://localhost:4000
```

#### 3단계: 백엔드 서버 실행 (PUBLIC_BASE_URL 설정)

기존 백엔드 서버 터미널에서:

```bash
cd co-show/backend
PUBLIC_BASE_URL=https://abcd-1234-5678.ngrok-free.app npm run dev
```

**중요**: ngrok에서 나온 URL을 그대로 복사해서 사용하세요.

#### 4단계: 확인

1. 웹 앱에서 사진 촬영
2. QR 코드 생성
3. QR 코드를 스캔하면 `https://abcd-1234-5678.ngrok-free.app/uploads/...` 주소로 접근
4. **어느 와이파이에서든 접근 가능!** ✅

---

### 방법 2: 클라우드 배포 (제대로 된 방법) 🚀

**장점**: 항상 켜져 있음, 안정적, 도메인 사용 가능  
**단점**: 설정이 조금 더 복잡

#### 추천 서비스

1. **Render** (가장 쉬움)
   - 무료 플랜 제공
   - GitHub 연동으로 자동 배포
   - URL: `https://your-app.onrender.com`

2. **Railway**
   - 무료 크레딧 제공
   - 간단한 배포

3. **Fly.io**
   - 빠른 성능
   - 글로벌 CDN

#### Render 배포 예시

1. **GitHub에 코드 푸시**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push
   ```

2. **Render에서 새 Web Service 생성**
   - GitHub 저장소 연결
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Environment Variables:
     - `PORT=4000`
     - `PUBLIC_BASE_URL=https://your-app.onrender.com` (배포 후 자동 생성된 URL)

3. **배포 완료 후**
   ```bash
   # 로컬에서 테스트
   PUBLIC_BASE_URL=https://your-app.onrender.com npm run dev
   ```

---

## 환경 변수 설정 방법

### 방법 A: 명령어에 직접 지정

```bash
PUBLIC_BASE_URL=https://abcd-1234.ngrok-free.app npm run dev
```

### 방법 B: .env 파일 사용

`co-show/backend/.env` 파일 생성:

```env
PUBLIC_BASE_URL=https://abcd-1234.ngrok-free.app
PORT=4000
```

그리고 `package.json`에 `dotenv` 추가:

```bash
npm install dotenv
```

`server.ts` 상단에:
```typescript
import "dotenv/config";
```

### 방법 C: 시스템 환경 변수 (영구 설정)

```bash
# macOS/Linux
export PUBLIC_BASE_URL=https://abcd-1234.ngrok-free.app

# Windows (PowerShell)
$env:PUBLIC_BASE_URL="https://abcd-1234.ngrok-free.app"
```

---

## 동작 원리

1. **로컬 테스트 모드** (PUBLIC_BASE_URL 없음)
   - QR 코드: `http://192.168.x.x:4000/uploads/...`
   - 같은 와이파이에서만 접근 가능

2. **공개 URL 모드** (PUBLIC_BASE_URL 설정됨)
   - QR 코드: `https://abcd-1234.ngrok-free.app/uploads/...`
   - 전 세계 어디서나 접근 가능

---

## 확인 체크리스트

- [ ] ngrok 설치 완료 (방법 1 선택 시)
- [ ] ngrok 실행 중 (`ngrok http 4000`)
- [ ] `PUBLIC_BASE_URL` 환경 변수 설정
- [ ] 백엔드 서버 재시작
- [ ] 서버 콘솔에 "🌐 공개 URL (PUBLIC_BASE_URL): ..." 메시지 확인
- [ ] QR 코드 스캔 테스트 (다른 와이파이에서)

---

## 문제 해결

### "ngrok: command not found"
→ ngrok 설치 필요: `brew install ngrok`

### "QR 코드가 여전히 localhost를 가리킴"
→ 백엔드 서버를 재시작했는지 확인
→ 환경 변수가 제대로 설정되었는지 확인: `echo $PUBLIC_BASE_URL`

### "ngrok URL이 계속 바뀜"
→ ngrok 유료 플랜 사용 시 고정 URL 제공
→ 또는 클라우드 배포(방법 2) 사용 권장

---

## 요약

**빠른 테스트/발표용**: ngrok 사용  
**제대로 된 서비스**: 클라우드 배포

둘 다 `PUBLIC_BASE_URL` 환경 변수만 설정하면 됩니다! 🎉





