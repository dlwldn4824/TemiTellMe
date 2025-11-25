import { useEffect, useState } from "react";
import { useTemiSocket } from "../lib/temiSocket";

/**
 * Temi 로봇 제어 컴포넌트 예제
 * 
 * 사용법:
 * <TemiController />
 */
export default function TemiController() {
  const socket = useTemiSocket("http://localhost:4000");
  const [status, setStatus] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    // 연결 상태 업데이트
    const checkConnection = setInterval(() => {
      setIsConnected(socket.isConnected);
    }, 1000);

    // 상태 업데이트 리스너
    socket.on("status", (data) => {
      setStatus(data);
      setLastEvent({ type: "status", data, time: new Date() });
    });

    // 도착 이벤트 리스너
    socket.on("arrived", (data) => {
      setLastEvent({ type: "arrived", data, time: new Date() });
      alert(`✅ ${data.target}에 도착했습니다!`);
    });

    // 사람 감지 이벤트 리스너
    socket.on("personDetected", (data) => {
      setLastEvent({ type: "personDetected", data, time: new Date() });
      console.log("👤 사람 감지:", data);
    });

    // 에러 이벤트 리스너
    socket.on("error", (data) => {
      setLastEvent({ type: "error", data, time: new Date() });
      alert(`❌ 에러: ${data.message}`);
    });

    return () => {
      clearInterval(checkConnection);
      socket.off("status");
      socket.off("arrived");
      socket.off("personDetected");
      socket.off("error");
    };
  }, [socket]);

  const handleGoTo = (target) => {
    socket.goTo(target);
  };

  const handleSpeak = () => {
    const text = prompt("말할 텍스트를 입력하세요:");
    if (text) {
      socket.speak(text);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Temi 로봇 제어</h2>
      
      {/* 연결 상태 */}
      <div style={{ marginBottom: "20px" }}>
        <p>
          연결 상태:{" "}
          <span style={{ color: isConnected ? "green" : "red" }}>
            {isConnected ? "✅ 연결됨" : "❌ 연결 안 됨"}
          </span>
        </p>
      </div>

      {/* 로봇 상태 */}
      {status && (
        <div style={{ marginBottom: "20px", padding: "10px", background: "#f0f0f0", borderRadius: "5px" }}>
          <h3>로봇 상태</h3>
          <p>배터리: {status.battery ?? "N/A"}%</p>
          <p>위치: {status.location ?? "N/A"}</p>
          <p>이동 중: {status.isMoving ? "예" : "아니오"}</p>
        </div>
      )}

      {/* 마지막 이벤트 */}
      {lastEvent && (
        <div style={{ marginBottom: "20px", padding: "10px", background: "#e8f4f8", borderRadius: "5px" }}>
          <h3>마지막 이벤트</h3>
          <p>타입: {lastEvent.type}</p>
          <p>시간: {lastEvent.time.toLocaleTimeString()}</p>
          <pre>{JSON.stringify(lastEvent.data, null, 2)}</pre>
        </div>
      )}

      {/* 제어 버튼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3>이동 명령</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => handleGoTo("kitchen")} disabled={!isConnected}>
            부엌으로 이동
          </button>
          <button onClick={() => handleGoTo("living_room")} disabled={!isConnected}>
            거실로 이동
          </button>
          <button onClick={() => handleGoTo("bedroom")} disabled={!isConnected}>
            침실로 이동
          </button>
        </div>

        <h3>기타 명령</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={handleSpeak} disabled={!isConnected}>
            말하기
          </button>
          <button onClick={() => socket.startFollow()} disabled={!isConnected}>
            팔로우 시작
          </button>
          <button onClick={() => socket.stopFollow()} disabled={!isConnected}>
            팔로우 중지
          </button>
          <button onClick={() => socket.stopMovement()} disabled={!isConnected}>
            이동 정지
          </button>
          <button onClick={() => socket.getStatus()} disabled={!isConnected}>
            상태 요청
          </button>
        </div>
      </div>

      <style jsx>{`
        button {
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        button:hover:not(:disabled) {
          background-color: #0056b3;
        }
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

