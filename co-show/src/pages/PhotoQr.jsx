import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import finishBtn from "../assets/photo/finishbutton.svg";
import rephoto from "../assets/photo/retry.svg";
import { emitEvent, emitButtonClick, emitPageNavigation } from "../api/temiApi";

export default function PhotoQr() {
  const navigate = useNavigate();
  const [qrUrl, setQrUrl] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("qrUrl");

    if (!saved) {
      navigate("/");
      return;
    }

    setQrUrl(saved);
    
    // QR 코드 표시 이벤트
    emitEvent("qr_code_displayed", { hasImage: !!saved });
  }, [navigate]);

  const handleRetake = () => {
    emitButtonClick("photo_qr_retake_button");
    emitEvent("photo_qr_retake", {});
    localStorage.removeItem("qrUrl");
    emitPageNavigation("photo/qr", "photo/filter");
    navigate("/photo/filter"); // 필터 촬영 페이지로 돌아가기
  };

  const handleFinish = () => {
    emitButtonClick("photo_qr_finish_button");
    emitEvent("photo_qr_finished", {});
    emitPageNavigation("photo/qr", "home");
    navigate("/");
  };

  return (
    <main
      style={{
        width: "1920px",
        height: "1200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "250px",
        background: "white",
      }}
    >
      {qrUrl && (
        <img
          src={qrUrl}
          alt="QR Code"
          style={{
            width: 600,
            height: 600,
          }}
        />
      )}

      {/* 버튼 두 개를 감싸는 영역 */}
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          gap: "0px",
          alignItems: "center",
        }}
      >
        {/* 다시 찍기 버튼 */}
        <img
          src={rephoto}
          onClick={handleRetake}
          style={{
            height: "100px",
            cursor: "pointer",
            marginRight: "-70px"
          }}
        >
        </img>

        {/* 완료 버튼 (원래 이미지 버튼) */}
        <img
          src={finishBtn}
          alt="완료 버튼"
          onClick={handleFinish}
          style={{
            height: "100px",
            cursor: "pointer",
            marginRight: "-70px"
          }}
        />
      </div>
    </main>
  );
}
