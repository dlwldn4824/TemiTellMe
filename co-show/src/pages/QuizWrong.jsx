// src/pages/QuizWrong.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/subquizs.css";

// 🔥 문제별 오답 영상 경로 매핑 (1, 2만)
const WRONG_VIDEO_MAP = {
  "1": "src/assets/퀴즈영상/테미_춤_오답.mp4",
  "2": "src/assets/퀴즈영상/테미_목소리_오답.mp4",
};

export default function QuizWrong() {
  const { qid } = useParams();
  const navigate = useNavigate();

  // 🔥 이 문제(qid)에 오답 영상이 있는지 여부
  const hasVideo = WRONG_VIDEO_MAP[qid] != null;

  // 🔥 영상 팝업 제어 상태 (영상이 있는 문제만 true로 시작)
  const [showVideo, setShowVideo] = useState(hasVideo);

  // qid가 바뀔 때마다 showVideo 초기화
  useEffect(() => {
    setShowVideo(hasVideo);
  }, [qid, hasVideo]);

  // 🔥 body에 문제별 클래스 추가
  useEffect(() => {
    document.body.classList.add("quiz-wrong-route", `qz-q${qid}`);
    return () => {
      document.body.classList.remove("quiz-wrong-route", `qz-q${qid}`);
    };
  }, [qid]);

  // 🔥 showVideo 에 따라 body에 video-open 클래스 토글 → 헤더 숨길 때 사용
  useEffect(() => {
    if (showVideo && hasVideo) {
      document.body.classList.add("video-open");
    } else {
      document.body.classList.remove("video-open");
    }
    return () => document.body.classList.remove("video-open");
  }, [showVideo, hasVideo]);

  // 🔥 10초 뒤 영상 자동 종료 (영상 있는 문제에만 적용)
  useEffect(() => {
    if (!hasVideo) return;     // Q3 등은 타이머 안 걸기
    if (!showVideo) return;

    const timer = setTimeout(() => setShowVideo(false), 10000); // 10초
    return () => clearTimeout(timer);
  }, [qid, hasVideo, showVideo]);

  const videoSrc = WRONG_VIDEO_MAP[qid];

  return (
    <main className="qz-page">
      {/* 🔥 영상 팝업 (Q1, Q2 오답일 때만) */}
      {hasVideo && showVideo && (
        <div className="video-overlay">
          {/* ✖ 닫기 버튼 */}
          <button
            className="video-close-btn"
            onClick={() => setShowVideo(false)}>
            ×
          </button>

          <video
            src={videoSrc}
            autoPlay
            muted={false}
            playsInline
            onEnded={() => setShowVideo(false)} // 영상 끝나면 닫힘
            style={{
              position: "absolute",
              inset: 0,            // top/right/bottom/left: 0 과 같음
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,           // 버튼보다 아래
              pointerEvents: "none" // 클릭은 비디오가 아니라 버튼/오버레이로
            }}
          />

        </div>
      )}

      {/* 🔥 영상이 없거나, 닫힌 후에만 본래 화면 표시 */}
      {(!hasVideo || !showVideo) && (
        <div className={`qz-wrong qz-q${qid}`}>
          <div className="qz-result-text qz-wrong-text" />

          {qid === "3" ? (
            <button
              className="qz-photo-btn"
              onClick={() => navigate("/photo")}
            />
          ) : (
            <button
              className="qz-retry-btn"
              onClick={() => navigate(`/quiz/${qid}`)}
            />
          )}

          <button
            className="qz-explain-btn"
            onClick={() => navigate(`/quiz/${qid}/result`)}
          />
        </div>
      )}
    </main>
  );
}
