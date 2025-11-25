// src/pages/QuizCorrect.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import "../styles/subquizs.css";

import temiSpinner from "../assets/스피너/테미_스피너.png";

const { TemiControl } = Capacitor.Plugins;

// 🔥 정답 영상(mp4) 매핑
const CORRECT_VIDEO_MAP = {
  "1": "src/assets/퀴즈영상/테미_춤_정답.mp4",
  "2": "src/assets/퀴즈영상/테미_목소리_정답.mp4",
};

export default function QuizCorrect() {
  const { qid } = useParams();
  const navigate = useNavigate();

  const videoSrc = CORRECT_VIDEO_MAP[qid];
  const hasVideo = !!videoSrc;

  const [showVideo, setShowVideo] = useState(hasVideo);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [statusText, setStatusText] = useState("");

  // qid 바뀌면 초기화
  useEffect(() => {
    setShowVideo(hasVideo);
    setVideoLoaded(false);
  }, [qid, hasVideo]);

  // body class
  useEffect(() => {
    document.body.classList.add("quiz-correct-route", `qz-q${qid}`);
    return () =>
      document.body.classList.remove("quiz-correct-route", `qz-q${qid}`);
  }, [qid]);

  // showVideo 시 헤더 숨김
  useEffect(() => {
    if (showVideo && hasVideo) document.body.classList.add("video-open");
    else document.body.classList.remove("video-open");
  }, [showVideo, hasVideo]);

  // 🔥 영상 로딩 완료 후 10초 뒤 자동 종료
  useEffect(() => {
    if (!hasVideo) return;
    if (!showVideo) return;
    if (!videoLoaded) return;

    const timer = setTimeout(() => setShowVideo(false), 10000);
    return () => clearTimeout(timer);
  }, [qid, showVideo, videoLoaded, hasVideo]);

  // 🔥 테미 춤 제어
  useEffect(() => {
    if (qid !== "1") return;

    if (showVideo && videoLoaded) {
      setStatusText("테미가 춤추는 중입니다! 💃");
      TemiControl?.dance?.().catch(() => {});
    } else {
      setStatusText("");
      TemiControl?.stopDance?.().catch(() => {});
    }

    return () => {
      TemiControl?.stopDance?.().catch(() => {});
    };
  }, [qid, showVideo, videoLoaded]);

  const handleNext = () => {
    const n = Number(qid);
    if (n < 3) navigate(`/quiz/${n + 1}`);
    else navigate("/events/complete");
  };

  return (
    <main className="qz-page">
      {/* 1번 문제: 상태 텍스트 출력 */}
      {qid === "1" && statusText && (
        <div
          style={{
            position: "absolute",
            top: "100px",
            left: "300px",
            color: "#fff",
            fontSize: "50px",
            fontWeight: "900",
            zIndex: 10,
          }}
        >
          {statusText}
        </div>
      )}

      {/* 🔥 mp4 영상 재생 */}
      {hasVideo && showVideo && (
        <div className="video-overlay">
          <button
            className="video-close-btn"
            onClick={() => setShowVideo(false)}
          >
            ×
          </button>

          {/* 로딩 스피너 */}
          {!videoLoaded && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgb(255, 255, 255)",
                zIndex: 5,
              }}
            >
              <img
                src={temiSpinner}
                alt="loading"
                style={{ width: "200px", height: "200px", opacity: 0.9 }}
              />
            </div>
          )}

          {/* mp4 비디오 */}
          <video
            src={videoSrc}
            autoPlay
            playsInline
            muted={false}
            onCanPlay={() => setVideoLoaded(true)} // 로딩 완료 이벤트
            onEnded={() => setShowVideo(false)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: videoLoaded ? 1 : 0,
              transition: "opacity 0.4s",
            }}
          />
        </div>
      )}

      {/* 영상 종료 후 정답 UI */}
      {(!hasVideo || !showVideo) && (
        <div className={`qz-result qz-q${qid}`}>
          <div className="qz-result-text qz-correct-text" />
          <button className="qz-next-btn" onClick={handleNext} />
        </div>
      )}
    </main>
  );
}
