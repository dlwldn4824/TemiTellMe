import { useLocation, useNavigate } from "react-router-dom";
import "../styles/quickDetail.css";

const QR_MAP = {
  "경주로봇 만들기": "src/assets/지능형로봇 QR코드/경주로봇 만들기.png",
  "로봇아 멍멍해봐": "src/assets/지능형로봇 QR코드/로봇아 멍멍해봐 4족보행로봇 활용 체험.png",
  "유선 스파이더로봇 만들기": "src/assets/지능형로봇 QR코드/유선 스파이더로봇 만들기.png",
  "자이로 외발주행로봇 만들기": "src/assets/지능형로봇 QR코드/자이로 외발주행로봇 만들기.png",
  "청소로봇 만들기": "src/assets/지능형로봇 QR코드/청소로봇 만들기.png",
  "휴머노이드 이론교육 및 미션수행": "src/assets/지능형로봇 QR코드/휴머노이드 이론교육 및 미션수행.png",
  "AI 드론 및 로봇 오목 로봇 체험": "src/assets/지능형로봇 QR코드/AI 드로잉 로봇 및 오목 로봇 체험.png",
  "ROBO SHOW": "src/assets/지능형로봇 QR코드/ROBO SHOW.png",
};

export default function QuickSearchDetail() {
  const nav = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <main className="qs-detail-page qs-detail-fallback">
        <p>잘못된 접근입니다. 다시 빠른 검색에서 선택해 주세요.</p>
        <button onClick={() => nav("/quick")}>빠른 검색으로 돌아가기</button>
      </main>
    );
  }

  const { title, description } = state;
  const qrImage = QR_MAP[title];

  return (
    <main className="qs-detail-page">
      <div className="qs-detail-bg">
        <img
          src={"src/assets/빠른길찾기/A존 보기 클릭 시.png"}
          alt={title}
          className="qs-detail-bg-img"
        />
      </div>

      <div className="qs-detail-content">
        <div className="qs-detail-badge">선택한 체험</div>
        <h1 className="qs-detail-title">{title}</h1>
        <p className="qs-detail-desc">{description}</p>
        <h1 className="qs-detail-comment">큐알 찍고 원격 현장 줄서자!</h1>

        {qrImage && (
          <div className="qs-detail-qr">
            <img src={qrImage} alt={`${title} QR`} />
          </div>
        )}
      </div>

      <div className="qs-detail-actions">
        <button
          className="qs-detail-go-btn"
          onClick={() =>
            nav("/quick/view/guide", {
              state: { targetLocation: title },  
            })
          }
        />

        <button className="qs-detail-back-btn" onClick={() => nav(-1)} />
      </div>
    </main>
  );
}
