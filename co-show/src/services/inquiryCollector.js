import { getApiBase } from "./apiBase";

export async function sendInquiry(message) {
  const payload = {
    message,
    deviceId: "temi-001",
  };

  const res = await fetch(`${getApiBase()}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to submit inquiry (${res.status}) ${text}`);
  }

  return await res.json();
}
