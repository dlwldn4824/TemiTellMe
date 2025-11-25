# 빠른 시작 가이드

## 방법 1: ngrok 사용 (권장)

### 1단계: ngrok 계정 가입 및 인증

1. **계정 가입**: https://dashboard.ngrok.com/signup
   - 이메일로 간단히 가입 (무료)

2. **Authtoken 가져오기**: https://dashboard.ngrok.com/get-started/your-authtoken
   - 페이지에서 토큰 복사

3. **토큰 설정**:
   ```bash
   ngrok config add-authtoken <복사한-토큰>
   ```

### 2단계: ngrok 실행

새 터미널:
```bash
ngrok http 4000
```

### 3단계: URL 복사

출력에서 `https://xxxx-xxxx.ngrok-free.app` 형식의 URL 복사

### 4단계: 백엔드 서버 실행

다른 터미널:
```bash
cd co-show/backend
PUBLIC_BASE_URL=https://xxxx-xxxx.ngrok-free.app npm run dev
```

---

## 방법 2: localtunnel 사용 (인증 불필요)

### 1단계: localtunnel 설치

```bash
npm install -g localtunnel
```

### 2단계: 터널 실행

```bash
lt --port 4000
```

출력 예시:
```
your url is: https://random-name-1234.loca.lt
```

### 3단계: 백엔드 서버 실행

다른 터미널:
```bash
cd co-show/backend
PUBLIC_BASE_URL=https://random-name-1234.loca.lt npm run dev
```

**주의**: localtunnel은 무료 버전에서 브라우저에서 한 번 "Continue" 버튼을 눌러야 할 수 있습니다.

---

## 방법 3: Serveo 사용 (SSH 기반, 인증 불필요)

```bash
ssh -R 80:localhost:4000 serveo.net
```

출력에서 나온 URL을 사용하세요.

---

## 추천

- **발표/데모용**: ngrok (안정적, 빠름)
- **빠른 테스트**: localtunnel (설치만 하면 바로 사용)





