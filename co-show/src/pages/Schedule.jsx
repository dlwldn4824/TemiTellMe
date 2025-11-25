import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/schedule.css";

/* QR 이미지 import */
import contestQR from "../assets/qr/contest-qr.png";

/* -------------------------
   CSV 로드 유틸
------------------------- */
async function loadCSV(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CSV load failed: ${res.status}`);
  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0].split(",").map((h) => h.replace(/^\uFEFF/, "").trim());

  return lines
    .slice(1)
    .filter(Boolean)
    .map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      const row = {};
      header.forEach((k, i) => {
        row[k] = cols[i] ?? "";
      });
      return row;
    });
}

export default function Schedule() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [dayFilter, setDayFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await loadCSV("/data/Competition.csv");
        setRows(data);
      } catch (e) {
        setErr(e.message || "데이터 로드 실패");
      }
    })();
  }, []);

  const DAY_BUTTONS = [
    { label: "전체", value: "ALL" },
    { label: "11.26 (수)", value: "수" },
    { label: "11.27 (목)", value: "목" },
    { label: "11.28 (금)", value: "금" },
    { label: "11.29 (토)", value: "토" },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let base = rows;

    if (q) {
      base = base.filter((r) => {
        const cons = (r["컨소시엄명"] || "").toLowerCase();
        const name = (r["경진대회명"] || "").toLowerCase();
        return cons.includes(q) || name.includes(q);
      });
    }

    if (dayFilter !== "ALL") {
      base = base.filter((r) => {
        const schedule = r["일정 및 장소"] || "";
        return schedule.includes(`(${dayFilter})`);
      });
    }

    return base;
  }, [rows, search, dayFilter]);

  const handleClickRow = (row) => {
    navigate("/schedule/detail", { state: { row } });
  };

  return (
    <main className="sch-page">
      {err && <div className="contest-error">데이터 로드 오류: {err}</div>}

      <h1 className="sch-title">경진 대회 목록</h1>

      {/* 검색 + 요일 필터 */}
      <div className="contest-top-row">
        <div className="contest-search-wrap">
          <input
            className="contest-search-input"
            type="text"
            placeholder="컨소시엄명 또는 경진대회명을 입력하세요"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="contest-search-btn">🔍</button>
        </div>

        <div className="contest-day-filter">
          {DAY_BUTTONS.map((d) => (
            <button
              key={d.value}
              className={
                "contest-day-btn" +
                (dayFilter === d.value ? " contest-day-btn-active" : "")
              }
              onClick={() => setDayFilter(d.value)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* 스크롤 가능한 목록 */}
      <div className="contest-viewport">
        <div className="contest-wrap">

          {filtered.map((r, idx) => (
            <button
              key={idx}
              className="contest-btn"
              onClick={() => handleClickRow(r)}
            >
              <div className="contest-name">{r["경진대회명"]}</div>
              <div className="contest-consortium">{r["컨소시엄명"]}</div>
            </button>
          ))}

          {filtered.length === 0 && rows.length > 0 && (
            <div className="contest-empty">검색/필터 결과가 없습니다.</div>
          )}

          {rows.length === 0 && !err && (
            <div className="contest-empty">불러온 경진대회가 없습니다.</div>
          )}
        </div>
      </div>

      {/* 🔥 QR 이미지 (스크롤바 오른쪽, 스크롤 문구 위) */}
      <div className="contest-qr-fixed">
        <img src={contestQR} alt="경진대회 QR 코드" />
      </div>

      <div className="scroll-hint-char">스크롤을 내려줘!</div>
    </main>
  );
}
