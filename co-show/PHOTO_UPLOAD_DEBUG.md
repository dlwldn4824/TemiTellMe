# 사진 업로드 및 QR 코드 "Load failed" 오류 해결 가이드

## 🔍 문제 진단

"Load failed" 오류가 발생하는 경우, 다음을 확인하세요:

### 1. 백엔드 서버 실행 확인

```bash
cd co-show/backend
npm run dev
```

서버가 `http://localhost:4000`에서 실행 중인지 확인하세요.

### 2. 브라우저 개발자 도구 확인

1. **F12** 또는 **Cmd+Option+I** (Mac)로 개발자 도구 열기
2. **Console** 탭에서 에러 메시지 확인
3. **Network** 탭에서 API 요청 상태 확인

### 3. 단계별 확인

콘솔에 다음 로그들이 순서대로 나타나야 합니다:

```
📸 1. 이미지 캡처 중...
✅ 이미지 캡처 완료, 크기: ...
📤 2. 업로드 URL 요청 중...
✅ 업로드 URL 받음: http://localhost:4000/api/photo/...
⬆️ 3. 서버에 업로드 중...
✅ 업로드 완료
📥 4. QR 코드 다운로드 중...
✅ QR 코드 받음
✅ localStorage에 저장 완료
```

## 🛠️ 문제 해결

### 문제 1: "업로드 URL 요청 실패"

**원인:** 백엔드 서버가 실행되지 않았거나 연결할 수 없음

**해결:**
1. 백엔드 서버 실행 확인
2. `getApiBase()`가 올바른 주소 반환하는지 확인
   - 브라우저: `http://localhost:4000`
   - Android 에뮬레이터: `http://10.0.2.2:4000`

### 문제 2: "이미지 업로드 실패"

**원인:** 파일 크기가 너무 크거나 서버 오류

**해결:**
- Network 탭에서 PUT 요청 상태 코드 확인
- 서버 로그 확인

### 문제 3: "QR 요청 실패"

**원인:** QR 코드 생성 실패 또는 키 매칭 실패

**해결:**
- 현재는 임시 빈 PNG를 반환하므로, 실제 QR 코드 생성 로직 추가 필요
- `backend/src/apis/upload.ts`의 `/photo/download` 엔드포인트 확인

### 문제 4: 이미지 로드 실패 (PhotoQr 페이지)

**원인:** localStorage에 잘못된 데이터가 저장되었거나 base64 형식 오류

**해결:**
1. 브라우저 콘솔에서 `localStorage.getItem("qrUrl")` 확인
2. 값이 `data:image/png;base64,...` 형식인지 확인
3. 잘못된 데이터면 localStorage 삭제 후 재촬영

## 🔧 추가 디버깅

### localStorage 확인

브라우저 콘솔에서:

```javascript
// QR URL 확인
const qrUrl = localStorage.getItem("qrUrl");
console.log("QR URL:", qrUrl);

// 길이 확인
console.log("QR URL 길이:", qrUrl?.length);

// 처음 100자 확인
console.log("QR URL (처음 100자):", qrUrl?.substring(0, 100));
```

### Network 요청 확인

1. 개발자 도구 → Network 탭
2. 사진 촬영 클릭
3. 다음 요청들이 성공하는지 확인:
   - `GET /api/photo/upload?key=1` → 200
   - `PUT /api/photo/photo_1_...` → 200
   - `GET /api/photo/download?key=1` → 200

### 서버 로그 확인

백엔드 터미널에서 다음 로그가 나타나는지 확인:

```
GET /api/photo/upload?key=1 200
PUT /api/photo/photo_1_... 200
GET /api/photo/download?key=1 200
```

## 📝 체크리스트

- [ ] 백엔드 서버 실행 중 (`npm run dev`)
- [ ] 브라우저에서 `http://localhost:4000/health` 접속 시 `{"ok":true}` 응답
- [ ] 브라우저 콘솔에 에러 없음
- [ ] Network 탭에서 모든 API 요청이 200 응답
- [ ] localStorage에 `qrUrl`이 올바르게 저장됨
- [ ] QR 이미지가 base64 data URL 형식 (`data:image/png;base64,...`)

## 💡 다음 단계

현재 QR 코드는 임시 빈 이미지를 반환합니다. 실제 QR 코드를 생성하려면:

```bash
cd co-show/backend
npm install qrcode @types/qrcode
```

그리고 `backend/src/apis/upload.ts`의 QR 생성 로직을 구현하세요.





