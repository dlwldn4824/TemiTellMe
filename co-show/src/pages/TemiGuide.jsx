// src/pages/TemiGuide.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { logNavigationStart, emitTemiDance } from "../api/temiApi";
import { getTemiSocket } from "../lib/temiSocket";
import { getApiBase } from "../services/apiBase";

const { TemiControl } = Capacitor.Plugins;

// 🔹 Temi가 실제로 이동할 POI 이름 (지능형로봇 존)
const ROBOT_POI_NAME = "intelligent robot"; // Temi POI에 저장해 둔 이름이랑 맞춰야 함

// QR 이미지 매핑
const QR_MAP = {
  "경주로봇 만들기": "src/assets/지능형로봇 QR코드/경주로봇 만들기.png",
  "로봇아 멍멍해봐": "src/assets/지능형로봇 QR코드/로봇아 멍멍해봐 4족보행로봇 활용 체험.png",
  "유선 스파이더로봇 만들기":
    "src/assets/지능형로봇 QR코드/유선 스파이더로봇 만들기.png",
  "자이로 외발주행로봇 만들기":
    "src/assets/지능형로봇 QR코드/자이로 외발주행로봇 만들기.png",
  "청소로봇 만들기": "src/assets/지능형로봇 QR코드/청소로봇 만들기.png",
  "휴머노이드 이론교육 및 미션수행":
    "src/assets/지능형로봇 QR코드/휴머노이드 이론교육 및 미션수행.png",
  "AI 드론 및 로봇 오목 로봇 체험":
    "src/assets/지능형로봇 QR코드/AI 드로잉 로봇 및 오목 로봇 체험.png",
  ROBO_SHOW: "src/assets/지능형로봇 QR코드/ROBO SHOW.png",
};

export default function TemiGuide() {
  const location = useLocation();
  const navigate = useNavigate();

  // 이전 페이지에서 넘겨준 "선택된 체험/존 이름" (화면·QR용)
  const targetLocation = location.state?.targetLocation;
  const qrImage = QR_MAP[targetLocation];

  const [statusText, setStatusText] = useState("안내를 준비하고 있습니다...");

  useEffect(() => {
    const startTemiMove = async () => {
      if (!targetLocation) {
        setStatusText("목적지 정보가 없습니다.");
        return;
      }

      try {
        // 화면에는 사용자가 선택한 이름을 그대로 보여줌
        setStatusText(`'${targetLocation}'(으)로 이동합니다!`);

        // 🔹 실제 로봇 이동은 항상 지능형로봇 존 POI로
        if (TemiControl && typeof TemiControl.goTo === "function") {
          await TemiControl.goTo({ location: ROBOT_POI_NAME });
        }

        // 🔹 백엔드 로그에는 "사용자가 선택한 것" + "실제 POI" 둘 다 남겨두기
        await logNavigationStart({
          id: targetLocation,
          name: targetLocation,      // 사람이 본 이름
          poi: ROBOT_POI_NAME,       // 실제 Temi가 간 POI
        });

        // 🔹 테미 춤추기 이벤트 (앞뒤 이동 + 고개 움직임)
        emitTemiDance(5000); // 5초간 춤추기
        
        // WebSocket을 통한 춤추기 명령도 전송
        const apiBase = getApiBase();
        const socket = getTemiSocket(apiBase);
        if (!socket.isConnected) {
          socket.connect();
        }
        socket.dance(5000);
      } catch (error) {
        console.error("테미 이동 에러:", error);
        setStatusText("로봇 연결 상태를 확인해주세요.");
      }
    };

    startTemiMove();
  }, [targetLocation]);

  return (
    <main
      style={{
        width: "1920px",
        height: "1200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url("src/assets/테미길안내/테미길안내중.png")`,
        backgroundSize: "cover",
        fontFamily: "nanumRound",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "1465px",
          top: "130px",
          left: "47px",
          padding: "40px 60px",
          borderRadius: "20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "50px" }}>{statusText}</h1>
        <p
          style={{
            marginTop: "12px",
            fontSize: "30px",
            opacity: 0.7,
          }}
        >
          가는 동안 큐알로 미리 줄 서는 건 어때요?
        </p>

        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "40px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontFamily: "nanumRound",
          }}
        >
          뒤로 가기
        </button>
      </div>

      {/* 🔽 QR 표시 영역: 선택한 체험에 맞는 QR은 그대로 */}
      {qrImage && (
        <img
          src={qrImage}
          alt="QR 코드"
          style={{
            position: "absolute",
            right: "180px",
            bottom: "430px",
            width: "400px",
            height: "400px",
          }}
        />
      )}
    </main>
  );
}
