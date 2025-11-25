import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Inquiry_employee.css";
import { listTemiContacts, startTemiCall } from "../lib/temiCall";

const DEFAULT_DISPLAY_NAME = "CO-Show Temi";
const TEMI_TELEPRESENCE_CONFIG = (() => {
  const displayName =
    (import.meta.env?.VITE_TEMI_CALL_DISPLAY_NAME || DEFAULT_DISPLAY_NAME).trim();
  const peerId = import.meta.env?.VITE_TEMI_CALL_PEER_ID?.trim() || "";

  return { displayName, peerId };
})();

export default function InquiryEmployee() {
  const nav = useNavigate();
  const [calling, setCalling] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [selectedPeerId, setSelectedPeerId] = useState("");

  // 환경 변수 또는 선택된 Peer ID 사용
  const getPeerId = () => {
    return selectedPeerId || TEMI_TELEPRESENCE_CONFIG.peerId;
  };

  const handleYes = async () => {
    if (calling) return;

    const { displayName } = TEMI_TELEPRESENCE_CONFIG;
    const peerId = getPeerId();

    if (!peerId) {
      const shouldLoadContacts = confirm(
        "Temi Telepresence 대상이 설정되지 않았습니다.\n\n" +
        "연락처를 불러와서 Peer ID를 선택하시겠습니까?\n\n" +
        "(또는 .env 파일에 VITE_TEMI_CALL_PEER_ID를 설정하세요)"
      );
      
      if (shouldLoadContacts) {
        await handleListContacts();
      }
      return;
    }

    setCalling(true);

    try {
      await startTemiCall({ displayName, peerId });
      nav("/inquiry/call");
    } catch (e) {
      console.error("[TemiCall] failed:", e);
      alert(
        "직원 호출 연결에 실패했습니다. 네트워크, 권한 또는 Telepresence 설정을 확인해주세요."
      );
      setCalling(false);
    }
  };

  const handleListContacts = async () => {
    if (loadingContacts) return;
    setLoadingContacts(true);
    try {
      const contacts = await listTemiContacts();
      if (!contacts || contacts.length === 0) {
        alert("가져온 연락처가 없습니다. (Temi 기기에서 실행 중인지, 계정이 활성화됐는지 확인)");
        setLoadingContacts(false);
        return;
      }
      
      // 연락처 목록을 보여주고 선택할 수 있도록
      const contactList = contacts
        .map(
          (c, idx) =>
            `${idx + 1}. ${c.displayName || "(이름없음)"} - Peer ID: ${c.userId || "N/A"}`
        )
        .join("\n");
      
      const selectedIndex = prompt(
        `Temi 연락처 목록\n(Peer ID = userId)\n\n${contactList}\n\n` +
        `연락처 번호를 입력하세요 (1-${contacts.length}):`
      );
      
      if (selectedIndex) {
        const index = parseInt(selectedIndex) - 1;
        if (index >= 0 && index < contacts.length) {
          const selectedContact = contacts[index];
          setSelectedPeerId(selectedContact.userId || "");
          alert(
            `선택됨: ${selectedContact.displayName || "(이름없음)"}\n` +
            `Peer ID: ${selectedContact.userId}\n\n` +
            `이제 "직원 호출" 버튼을 눌러주세요.`
          );
        } else {
          alert("잘못된 번호입니다.");
        }
      }
    } catch (e) {
      console.error("[TemiCall] getContacts failed:", e);
      alert("연락처를 불러오지 못했습니다. Temi SDK/권한/계정 상태를 확인해주세요.");
    } finally {
      setLoadingContacts(false);
    }
  };

  return (
    <main className="employee-wrap">
      <div className="inqury-call">
        <button
          className="call-btn-yes"
          onClick={handleYes}
          disabled={calling}
          aria-busy={calling}
        />
        <button
          className="call-btn-no"
          onClick={() => nav("/")}
          disabled={calling}
        />
        <button
          type="button"
          className="call-btn-debug"
          onClick={handleListContacts}
          disabled={calling || loadingContacts}
          aria-busy={loadingContacts}
          style={{ marginTop: "12px", padding: "10px 16px" }}
        >
          {selectedPeerId ? `선택됨: ${selectedPeerId.substring(0, 10)}...` : "연락처 불러오기 (Peer ID 선택)"}
        </button>
        {!getPeerId() && (
          <p style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
            💡 .env 파일에 VITE_TEMI_CALL_PEER_ID를 설정하거나<br />
            연락처를 불러와서 선택하세요.
          </p>
        )}
      </div>
    </main>
  );
}
