#!/bin/bash

# ngrok 실행 스크립트
echo "🚀 ngrok을 시작합니다..."
echo "📝 아래에 나오는 'Forwarding' URL을 복사하세요!"
echo ""
echo "예시: https://abcd-1234-5678.ngrok-free.app"
echo ""
echo "그 URL을 사용해서 백엔드 서버를 실행하세요:"
echo "PUBLIC_BASE_URL=<복사한-URL> npm run dev"
echo ""
echo "---"
echo ""

ngrok http 4000





