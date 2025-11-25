# 404 오류 해결 방법

## 🔴 문제 원인

코드는 올바르게 수정되었지만, **백엔드 서버가 재시작되지 않아서** 이전 코드를 사용하고 있습니다.

## ✅ 해결 방법

### 방법 1: 개발 모드로 재시작 (권장)

백엔드 서버가 실행 중인 터미널에서:

1. **Ctrl + C**로 서버 중지
2. 다음 명령 실행:

```bash
cd co-show/backend
npm run dev
```

이렇게 하면 `ts-node-dev`가 TypeScript 소스 코드를 직접 실행하므로, 변경사항이 즉시 반영됩니다.

### 방법 2: 빌드 후 재시작

만약 `npm start`로 실행 중이라면:

```bash
cd co-show/backend
npm run build  # TypeScript 빌드
npm start      # 빌드된 파일 실행
```

## 🔍 확인 방법

서버가 재시작되면 다음 명령으로 테스트:

```bash
curl "http://localhost:4000/api/photo/upload?key=1"
```

**성공하면:** 업로드 URL이 반환됨 (예: `http://localhost:4000/api/photo/photo_1_1234567890.png`)

**실패하면:** 여전히 404 HTML 페이지가 반환됨

## 📝 현재 수정된 코드

- ✅ `GET /api/photo/upload?key=1` - 업로드 URL 생성
- ✅ `PUT /api/photo/:filename` - 이미지 업로드
- ✅ `GET /api/photo/download?key=1` - QR 코드 다운로드

**코드는 이미 올바르게 수정되어 있으니, 서버만 재시작하면 됩니다!**





