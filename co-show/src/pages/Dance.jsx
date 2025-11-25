import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from '@capacitor/core';

// 1. 우리가 만든 플러그인 불러오기
const { TemiControl } = Capacitor.Plugins;

export default function Dance() {
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState("버튼을 누르면 테미가 춤을 춥니다! 💃");

  // 춤추기 버튼 클릭 시 실행될 함수
  const handleDance = async () => {
    try {
      setStatusText("빙글빙글 도는 중... 🌪️");
      
      // 2. 안드로이드(Java)에 만들어둔 dance 함수 실행!
      if (TemiControl) {
        await TemiControl.dance(); 
      } else {
        console.warn("TemiControl 플러그인을 찾을 수 없습니다.");
      }
      
      // 5초 뒤에 멘트 변경
      setTimeout(() => {
        setStatusText("춤추기 완료! ✨");
      }, 5000);

    } catch (error) {
      console.error(error);
      alert("춤추기 실패: 로봇 연결을 확인하세요.");
    }
  };

  return (
    <main
      style={{
        width: "100vw", height: "100vh",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        background: "#fff0f5", fontFamily: "nanumRound"
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>Let's Dance! 💃</h1>
      <p style={{ fontSize: "24px", color: "#555", marginBottom: "50px" }}>
        {statusText}
      </p>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* 춤추기 버튼 */}
        <button
          onClick={handleDance}
          style={{
            padding: "20px 50px", fontSize: "28px", fontWeight: "bold",
            color: "white", backgroundColor: "#FF4081",
            border: "none", borderRadius: "50px", cursor: "pointer",
            boxShadow: "0 5px 15px rgba(255, 64, 129, 0.4)"
          }}
        >
          Start Dance ▶
        </button>

        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "20px 40px", fontSize: "24px",
            color: "#333", backgroundColor: "#ddd",
            border: "none", borderRadius: "50px", cursor: "pointer"
          }}
        >
          뒤로가기
        </button>
      </div>
    </main>
  );
}