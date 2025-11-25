export function getApiBase() {
  // 1) .env에 명시된 경우 (Temi 실기기나 배포 시)
  const envBase = import.meta?.env?.VITE_API_BASE_URL;
  if (envBase && String(envBase).trim() !== "") {
    return envBase;
  }

  // 2) 안드로이드 환경이면 에뮬레이터용 주소 사용
  if (typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent)) {
    // Android Emulator -> PC localhost:4000
    return "http://10.0.2.2:4000";
  }

  // 3) 그 외(브라우저 개발) -> 로컬 PC에서 백엔드
  return "http://localhost:4000";
}