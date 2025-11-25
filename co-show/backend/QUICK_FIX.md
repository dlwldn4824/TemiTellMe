# 빠른 해결: 백엔드 서버 재시작

## 현재 상황

404 오류가 발생하는 이유는 백엔드 서버가 수정된 코드를 아직 반영하지 못했기 때문입니다.

## 즉시 해야 할 일

백엔드 서버를 실행 중인 터미널을 찾아서:

1. **Ctrl + C**로 서버 중지
2. 다음 명령 실행:

```bash
cd co-show/backend
npm run dev
```

## 확인

서버가 재시작되면 다음을 테스트하세요:

```bash
curl "http://localhost:4000/api/photo/upload?key=1"
```

이제 업로드 URL이 반환되어야 합니다 (HTML 에러 페이지가 아닌).

## 수정된 경로

- ✅ `GET /api/photo/upload?key=1` 
- ✅ `PUT /api/photo/:filename`
- ✅ `GET /api/photo/download?key=1`

코드는 이미 올바르게 수정되어 있으니, 서버만 재시작하면 됩니다!





