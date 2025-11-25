import { useLocation, useNavigate } from "react-router-dom";
import "../styles/scheduleDetail.css"; // 필요하면 새로 만들거나 기존 CSS 써도 됨

export default function ScheduleDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const row = location.state?.row;   // Schedule에서 넘겨준 row

  // 새로고침 등으로 state가 없을 때
  if (!row) {
    return (
      <main className="sch-detail-page">
        <div className="sch-detail-inner">
          <p>잘못된 접근이거나, 페이지를 새로고침해서 정보가 사라졌어요.</p>
          <button onClick={() => navigate(-1)}>← 목록으로 돌아가기</button>
        </div>
      </main>
    );
  }

  return (
    <main className="sch-detail-page">
      <div className="sch-detail-inner">
        {/* 상단 제목 영역 */}
        <h1 className="sch-detail-title">{row["경진대회명"]}</h1>
        <p className="sch-detail-consortium">{row["컨소시엄명"]}</p>

        {/* 기타 CSV 컬럼들 전부 보여주고 싶으면 */}
        <div className="sch-detail-fields">
          {Object.entries(row).map(([key, value]) => (
            <div className="sch-detail-row" key={key}>
              <span className="sch-detail-label">{key}</span>
              <span className="sch-detail-value">{value || "-"}</span>
            </div>
          ))}
        </div>

        <button
          className="sch-detail-back-btn"
          type="button"
          onClick={() => navigate(-1)}
        >
          ← 목록으로 돌아가기
        </button>
      </div>
    </main>
  );
}
