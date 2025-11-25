# 백엔드 서버 재시작 필요 ⚠️

## 문제

코드가 올바르게 수정되었지만, 백엔드 서버가 이전 코드를 사용하고 있어 404 오류가 발생하고 있습니다.

## 해결 방법

### 1. 백엔드 서버 재시작

백엔드 서버가 실행 중인 터미널에서:

1. **Ctrl + C**를 눌러 서버 중지
2. 다음 명령으로 다시 시작:

```bash
cd co-show/backend
npm run dev
```

또는 새 터미널에서:

```bash
cd co-show/backend
npm run dev
```

### 2. 서버가 재시작되었는지 확인

브라우저나 터미널에서:

```bash
curl http://localhost:4000/health
```

`{"ok":true}` 응답이 나와야 합니다.

그 다음:

```bash
curl "http://localhost:4000/api/photo/upload?key=1"
```

이제 업로드 URL이 반환되어야 합니다 (404가 아닌).

## 수정된 라우터 경로

- ✅ `GET /api/photo/upload?key=1` - 업로드 URL 생성
- ✅ `PUT /api/photo/:filename` - 이미지 업로드  
- ✅ `GET /api/photo/download?key=1` - QR 코드 다운로드

## 확인 체크리스트

- [ ] 백엔드 서버 재시작 완료
- [ ] `http://localhost:4000/health` 응답 확인
- [ ] `http://localhost:4000/api/photo/upload?key=1` 테스트 (404 아님)
- [ ] 브라우저에서 사진 촬영 재시도





