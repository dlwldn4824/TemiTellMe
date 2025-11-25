// src/pages/Line.jsx
import { useState } from "react";
import "../styles/line.css";
import { useNavigate } from "react-router-dom";


const BUTTONS = [
  {
    id: 1,
    label: "경주로봇 만들기",
    title: "경주로봇 만들기",
    description:
      "경주로봇 만들기 체험존 줄서기용 QR입니다. 가까운 안내 표지판의 QR을 스캔해 주세요.",
    qrImage: "src/assets/지능형로봇 QR코드/경주로봇 만들기.png",
  },
  {
    id: 2,
    label: "로봇아 멍멍해봐",
    title: "로봇아 멍멍해봐",
    description:
      "로봇아 멍멍해봐(4족보행 로봇 활용) 체험존 줄서기용 QR입니다.",
    qrImage:
      "src/assets/지능형로봇 QR코드/로봇아 멍멍해봐 4족보행로봇 활용 체험.png",
  },
  {
    id: 3,
    label: "유선 스파이더\n로봇 만들기",
    title: "유선 스파이더\n로봇 만들기",
    description:
      "유선 스파이더로봇 만들기 체험존 줄서기용 QR입니다.",
    qrImage: "src/assets/지능형로봇 QR코드/유선 스파이더로봇 만들기.png",
  },
  {
    id: 4,
    label: "자이로 외발주행 \n 로봇 만들기",
    title: "자이로 외발주행 \n 로봇 만들기",
    description:
      "자이로 외발주행로봇 만들기 체험존 줄서기용 QR입니다.",
    qrImage:
      "src/assets/지능형로봇 QR코드/자이로 외발주행로봇 만들기.png",
  },
  {
    id: 5,
    label:"청소로봇 만들기",
    title: "청소로봇 만들기",
    description:
      "청소로봇 만들기 체험존 줄서기용 QR입니다.",
    qrImage: "src/assets/지능형로봇 QR코드/청소로봇 만들기.png",
  },
  {
    id: 6,
    label: "휴머노이드 이론교육 및 미션수행",
    title: "휴머노이드 이론교육 및 미션수행",
    description:
      "휴머노이드 이론교육 및 미션수행 체험존 줄서기용 QR입니다.",
    qrImage:
      "src/assets/지능형로봇 QR코드/휴머노이드 이론교육 및 미션수행.png",
  },
  {
    id: 7,
    label: "AI 드론 및 로봇 오목 \n 로봇 체험",
    title: "AI 드론 및 로봇 오목 \n 로봇 체험",
    description:
      "AI 드론 및 로봇 오목 로봇 체험존 줄서기용 QR입니다.",
    qrImage:
      "src/assets/지능형로봇 QR코드/AI 드로잉 로봇 및 오목 로봇 체험.png",
  },
  {
    id: 8,
    label: "ROBO SHOW",
    title: "ROBO SHOW",
    description: "ROBO SHOW 체험존 줄서기용 QR입니다.",
    qrImage: "src/assets/지능형로봇 QR코드/ROBO SHOW.png",
  },
];

export default function Line() {
  const nav = useNavigate();
  const [activeId, setActiveId] = useState(BUTTONS[0].id);

  const activeData = BUTTONS.find((b) => b.id === activeId);

  return (
    <main className="line-page">
      <div className="line-overlay">
        <header className="line-header"></header>

        <section className="line-content">
          <div className="line-buttons-grid">
            {BUTTONS.map((btn) => (
              <button
                key={btn.id}
                type="button"
                className={
                  "line-button" +
                  (btn.id === activeId ? " line-button--active" : "")
                }
                onClick={() => setActiveId(btn.id)}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* 오른쪽: QR 정보 카드 */}
          <div className="line-info-card">
            <h2 className="line-info-title">{activeData.title}</h2>
            <p className="line-info-desc">{activeData.description}</p>

            <div className="line-qr-wrapper">
              {activeData.qrImage ? (
                <img
                  src={activeData.qrImage}
                  alt={`${activeData.title} QR 코드`}
                  className="line-qr-image"
                />
              ) : (
                <div className="line-qr-placeholder">QR 이미지 영역</div>
              )}
            </div>
            <button
              className="line-guide-btn"
              onClick={() =>
                nav("/quick/view/guide", {
                  state: { targetLocation: activeData.title },
                })
              }
            >
            </button>
          </div>
        </section>
      </div>
      
      <img
        src="src/assets/QR페이지/인어테미.png"
        alt="temi mascot"
        className="line-mascot"
        />
    </main>
  );
}
