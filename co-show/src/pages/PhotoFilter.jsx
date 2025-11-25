// src/pages/PhotoFilter.jsx
import React, { useRef, useEffect, useState } from "react";
import "../styles/PhotoFilter.css";
import temiSpinner from "../assets/스피너/테미_스피너.png";

import filter1 from "../assets/photo/filter_overlay1.png";
import filter2 from "../assets/photo/filter_overlay2.png";
import filter3 from "../assets/photo/filter_overlay3.png";
import filter4 from "../assets/photo/우주필터.png";
import filter5 from "../assets/photo/트로피필터.png";

import { useNavigate } from "react-router-dom";
import { getApiBase } from "../services/apiBase";
import { emitEvent, emitButtonClick } from "../api/temiApi";

export default function PhotoFilter() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [streaming, setStreaming] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(filter1);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [qrUrl, setQrUrl] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // 업로드/다운로드에 사용할 key (페이지 열릴 때 한 번 생성)
  const [uploadKey] = useState(() => Date.now().toString());

  // Android 네이티브 카메라 인터페이스 사용 가능 여부
  const isAndroidNativeAvailable = 
    typeof window !== "undefined" &&
    window.Android &&
    typeof window.Android.startInlinePreview === "function" &&
    typeof window.Android.capturePhoto === "function";

  /* -------------------------------------------------------
      카메라 초기화 (웹 카메라 API - Android 네이티브가 없을 때만)
  -------------------------------------------------------- */
  useEffect(() => {
    // Android 네이티브 카메라가 있으면 웹 카메라 초기화 안 함
    if (isAndroidNativeAvailable) {
      return;
    }

    async function initCamera() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          alert("이 기기에서는 카메라를 사용할 수 없습니다.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      } catch (err) {
        console.error("getUserMedia error:", err);
        alert(`카메라 접근 실패 (${err.name}): ${err.message}`);
      }
    }

    initCamera();

    // 언마운트 시 카메라 정리
    return () => {
      const video = videoRef.current;
      if (video?.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isAndroidNativeAvailable]);

  /* -------------------------------------------------------
      Android 네이티브 카메라에서 촬영된 사진 받기
  -------------------------------------------------------- */
  useEffect(() => {
    if (!isAndroidNativeAvailable) return;

    // Android에서 촬영된 사진을 받는 전역 함수
    window.onPhotoCaptured = async (base64Image) => {
      try {
        setIsCapturing(false);
        setLoading(true);

        // 이벤트 로깅: 촬영 시작
        emitButtonClick("photo_capture_button", { filter: selectedFilter });
        emitEvent("photo_capture_started", { filter: selectedFilter, key: uploadKey });

        // Base64를 Blob으로 변환
        const response = await fetch(base64Image);
        const blob = await response.blob();

        // 필터 적용을 위해 이미지 로드
        const img = new Image();
        const imageUrl = URL.createObjectURL(blob);
        img.src = imageUrl;

        await new Promise((resolve, reject) => {
          img.onload = () => {
            // 캔버스에 원본 이미지 그리기
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            // 필터 오버레이 적용
            const overlay = new Image();
            overlay.src = selectedFilter;
            overlay.onload = () => {
              ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
              canvas.toBlob(async (filteredBlob) => {
                if (!filteredBlob) {
                  reject(new Error("필터 적용 실패"));
                  return;
                }

                try {
                  emitEvent("photo_captured", { key: uploadKey, size: filteredBlob.size });

                  // 업로드 URL 요청
                  const uploadUrl = await getUploadUrl();

                  // PUT 업로드
                  await uploadToServer(uploadUrl, filteredBlob);
                  emitEvent("photo_uploaded", { key: uploadKey, url: uploadUrl });

                  // QR 이미지 요청
                  const qrBase64 = await fetchQrImage();

                  // localStorage에 저장
                  localStorage.setItem("qrUrl", qrBase64);
                  setQrUrl(qrBase64);

                  // QR 페이지로 이동
                  emitEvent("photo_qr_page_navigation", { key: uploadKey });
                  navigate("/photo/qr");
                } catch (err) {
                  emitEvent("photo_capture_error", { error: err.message, key: uploadKey });
                  alert("오류: " + err.message);
                  setLoading(false);
                }

                URL.revokeObjectURL(imageUrl);
                resolve();
              }, "image/png");
            };
            overlay.onerror = () => reject(new Error("필터 이미지 로드 실패"));
          };
          img.onerror = () => reject(new Error("이미지 로드 실패"));
        });
      } catch (err) {
        emitEvent("photo_capture_error", { error: err.message, key: uploadKey });
        alert("오류: " + err.message);
        setIsCapturing(false);
        setLoading(false);
      }
    };

    return () => {
      if (window.onPhotoCaptured) {
        delete window.onPhotoCaptured;
      }
    };
  }, [isAndroidNativeAvailable, selectedFilter, uploadKey, navigate]);

  /* -------------------------------------------------------
      사진 + 필터 캡처해서 Blob 생성
  -------------------------------------------------------- */
  const captureImageData = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) {
      throw new Error("카메라 또는 캔버스가 준비되지 않았습니다.");
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("캔버스 컨텍스트 생성 실패");
    }

    // 비디오 프레임 그리기
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 선택된 필터 덮어쓰기
    return new Promise((resolve, reject) => {
      const overlay = new Image();
      overlay.src = selectedFilter;

      overlay.onload = () => {
        ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("이미지 Blob 생성 실패"));
            return;
          }
          resolve(blob);
        }, "image/png");
      };

      overlay.onerror = () => {
        reject(new Error("필터 이미지를 불러올 수 없습니다."));
      };
    });
  };

  /* -------------------------------------------------------
      업로드 URL 요청
  -------------------------------------------------------- */
  const getUploadUrl = async () => {
    const apiBase = getApiBase();
    const res = await fetch(`${apiBase}/api/uploads/photo/upload?key=${uploadKey}`);
    if (!res.ok) {
      throw new Error("업로드 URL 요청 실패");
    }
    
    // 이벤트 로깅
    emitEvent("photo_upload_url_requested", { key: uploadKey });
    
    return res.text();
  };

  /* -------------------------------------------------------
      PUT 업로드
  -------------------------------------------------------- */
  const uploadToServer = async (url, blob) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "image/png" },
      body: blob,
    });

    if (!res.ok) {
      throw new Error("이미지 업로드 실패");
    }
  };

  /* -------------------------------------------------------
      업로드된 QR 이미지 요청하여 Base64 변환
  -------------------------------------------------------- */
  const fetchQrImage = async () => {
    const apiBase = getApiBase();
    const res = await fetch(`${apiBase}/api/uploads/photo/download?key=${uploadKey}`);
    if (!res.ok) {
      throw new Error("QR 요청 실패");
    }

    const blob = await res.blob();

    // 이벤트 로깅
    emitEvent("qr_code_generated", { key: uploadKey });

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        // QR 코드 생성 완료 이벤트
        emitEvent("qr_code_ready", { key: uploadKey, hasImage: !!result });
        resolve(result);
      };
      reader.onerror = () => reject(new Error("QR 이미지 변환 실패"));
      reader.readAsDataURL(blob);
    });
  };

  /* -------------------------------------------------------
      Android 네이티브 카메라 촬영 시작
  -------------------------------------------------------- */
  const startShooting = () => {
    if (isAndroidNativeAvailable) {
      // 상태 초기화
      setPhotos([]);
      setQrUrl("");
      setIsFinished(false);
      setIsCapturing(true);

      // 카메라 박스 띄우기
      window.Android.startInlinePreview();

      // 약간의 딜레이 후 첫 촬영
      setTimeout(() => {
        window.Android.capturePhoto();
      }, 1500);
    } else {
      alert(
        "촬영 기능을 사용할 수 없습니다.\n(Android.startInlinePreview / capturePhoto 인터페이스가 없습니다.)"
      );
    }
  };

  /* -------------------------------------------------------
      촬영 버튼 클릭 시 처리 (웹 카메라 API용)
  -------------------------------------------------------- */
  const handleCapture = async () => {
    // Android 네이티브 카메라가 있으면 그것을 사용
    if (isAndroidNativeAvailable) {
      startShooting();
      return;
    }

    // 웹 카메라 API 사용
    if (!streaming) {
      alert("카메라가 아직 준비되지 않았습니다.");
      return;
    }

    try {
      setLoading(true);
      
      // 이벤트 로깅: 촬영 시작
      emitButtonClick("photo_capture_button", { filter: selectedFilter });
      emitEvent("photo_capture_started", { filter: selectedFilter, key: uploadKey });

      // 1) 현재 화면 + 필터 캡처 → Blob
      const imageBlob = await captureImageData();
      emitEvent("photo_captured", { key: uploadKey, size: imageBlob.size });

      // 2) 업로드 URL 요청
      const uploadUrl = await getUploadUrl();

      // 3) PUT 업로드
      await uploadToServer(uploadUrl, imageBlob);
      emitEvent("photo_uploaded", { key: uploadKey, url: uploadUrl });

      // 4) 업로드 완료된 QR 이미지 요청 → base64
      const qrBase64 = await fetchQrImage();

      // 5) 다음 페이지에서 사용할 수 있도록 localStorage에 저장
      localStorage.setItem("qrUrl", qrBase64);

      // 6) QR 안내 페이지로 이동
      emitEvent("photo_qr_page_navigation", { key: uploadKey });
      navigate("/photo/qr");
    } catch (err) {
      emitEvent("photo_capture_error", { error: err.message, key: uploadKey });
      alert("오류: " + err.message);
      console.error(err);
      setLoading(false);
    }
  };

  const filters = [filter1, filter2, filter3, filter4, filter5];

  /* -------------------------------------------------------
      로딩 화면
  -------------------------------------------------------- */
  if (loading) {
    return (
      <main className="photo-filter-wrap photo-filter-loading">
        <div className="robot-spinner">
          <img src={temiSpinner} alt="loading robot" className="robot-img" />
          <div className="dot-ring">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="dot" style={{ "--i": i }} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* -------------------------------------------------------
      메인 화면
  -------------------------------------------------------- */
  return (
    <main className="photo-filter-wrap">
      <button className="photo-back-btn" onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>

      {/* 웹 카메라 API 사용 시에만 비디오 표시 */}
      {!isAndroidNativeAvailable && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-view"
          />

          {streaming && (
            <img src={selectedFilter} alt="filter" className="filter-overlay" />
          )}
        </>
      )}

      {/* Android 네이티브 카메라 사용 시 촬영 중 표시 */}
      {isAndroidNativeAvailable && isCapturing && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
            fontSize: "40px",
            zIndex: 1000,
          }}
        >
          카메라 준비 중...
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ display: "none" }}
      />

      <div className="filter-bar">
        {filters.map((f, i) => (
          <button
            key={i}
            className={`filter-option ${
              selectedFilter === f ? "active" : ""
            }`}
            onClick={() => {
              emitButtonClick("photo_filter_select", { filterIndex: i });
              emitEvent("photo_filter_changed", { filterIndex: i, filter: f });
              setSelectedFilter(f);
            }}
          >
            <img src={f} alt={`filter ${i + 1}`} />
          </button>
        ))}
      </div>

      <button
        className="capture-btn"
        onClick={handleCapture}
        style={{
          fontSize: "32px",
          padding: "0px 40px",
          width: "300px",
          height: "80px",
          borderRadius: "20px",
          fontWeight: "700",
        }}
      >
        촬영하기
      </button>
    </main>
  );
}
