// src/services/phoneCollector.js
import { getApiBase } from "./apiBase";

// 백엔드에 전화번호 저장 후, 서버가 준 레코드(JSON) 반환
export async function sendPhone(phone) {
  // phone: "01012345678" 같은 숫자 문자열
  const payload = {
    phone: phone,
    deviceId: "temi-001", // 나중에 실제 기기 ID 넣고 싶으면 여기 수정
    consent: true,
  };

  const res = await fetch(`${getApiBase()}/api/phone-registrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to submit phone (${res.status}) ${text}`);
  }

  const data = await res.json();

  // ✅ (선택) 성공한 전화번호를 로컬에도 캐시해두기
  try {
    const key = "collectedPhones";
    const entry = {
      phone: phone,
      timestamp: new Date().toISOString(),
      serverId: data.id,
    };

    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    prev.push(entry);
    localStorage.setItem(key, JSON.stringify(prev));
  } catch (e) {
    console.warn("localStorage write failed (non-blocking)", e);
  }

  return data; // { id, phone, createdAt, ... }
}
