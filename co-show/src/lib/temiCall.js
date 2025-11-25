// TemiCall Capacitor bridge. On web it falls back to a harmless mock.
import { Capacitor, registerPlugin } from "@capacitor/core";

const NativeTemiCall = Capacitor.isNativePlatform()
  ? registerPlugin("TemiCall")
  : {
      // Web mock: request mic permission only to mimic prompt.
      async startTelepresence({ displayName, peerId }) {
        try {
          if (navigator?.mediaDevices?.getUserMedia) {
            await navigator.mediaDevices.getUserMedia({ audio: true });
          }
        } catch {}
        console.warn("[TemiCall] Web mock: startTelepresence", { displayName, peerId });
        return { ok: true, mock: true };
      },
      async getContacts() {
        console.warn("[TemiCall] Web mock: getContacts -> []");
        return { contacts: [] };
      },
    };

export async function startTemiCall({ displayName, peerId }) {
  if (!displayName || !peerId) {
    throw new Error("displayName과 peerId가 필요합니다.");
  }

  await NativeTemiCall.startTelepresence({ displayName, peerId });
  return { ok: true };
}

export async function listTemiContacts() {
  if (!NativeTemiCall?.getContacts) return [];
  const res = await NativeTemiCall.getContacts();
  return res?.contacts ?? [];
}
