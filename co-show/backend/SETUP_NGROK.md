# ngrok 인증 설정 가이드

## 1단계: ngrok 계정 가입

1. https://dashboard.ngrok.com/signup 방문
2. 무료 계정 가입 (이메일로 간단히 가입 가능)

## 2단계: Authtoken 가져오기

1. 가입 후 https://dashboard.ngrok.com/get-started/your-authtoken 방문
2. "Your Authtoken" 섹션에서 토큰 복사
   - 예: `2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz_5A6B7C8D9E0F1G2H3I4J5K`

## 3단계: Authtoken 설정

터미널에서:

```bash
ngrok config add-authtoken <복사한-토큰>
```

예시:
```bash
ngrok config add-authtoken 2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz_5A6B7C8D9E0F1G2H3I4J5K
```

## 4단계: 확인

```bash
ngrok http 4000
```

이제 정상적으로 실행되어야 합니다!





