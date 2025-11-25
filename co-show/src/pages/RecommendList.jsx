// RecommendList.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/RecommendList.css";
import noImage from "../assets/전시회장 사진/이미지없음.svg";

/* ---------- CSV 유틸 ---------- */
async function loadCSV(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CSV load failed: ${res.status}`);
  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  const header = splitCSVLine(lines[0]).map(h => h.replace(/^\uFEFF/, "").trim());
  return lines.slice(1).filter(Boolean).map(line => {
    const cols = splitCSVLine(line);
    const row = {};
    header.forEach((k, i) => (row[k] = (cols[i] ?? "").trim()));
    return row;
  });
}
function splitCSVLine(line) {
  const out = []; let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQ = !inQ; continue; }
    if (ch === "," && !inQ) { out.push(cur); cur = ""; } else cur += ch;
  }
  out.push(cur);
  return out;
}
const EMPTY = new Set(["", "—", "-", "?", "없음", "N/A", "n/a"]);
const clean = v => {
  if (v == null) return "";
  const s = String(v).trim();
  return EMPTY.has(s) ? "" : s;
};

/* ---------- Stage utils (임계치 필터용) ---------- */
const STAGES = ["유아", "초등", "중등", "고등", "성인"];
const STAGE_IDX = Object.fromEntries(STAGES.map((s, i) => [s, i]));

// CSV의 stage 문자열에서 "최소 요구 단계" 인덱스 계산
function minStageIdxFrom(raw) {
  const s = (raw || "").replace(/\s+/g, "").toLowerCase();
  if (!s || s.includes("누구나")) return STAGE_IDX["유아"]; // 제한 없음
  const has = kw => s.includes(kw);
  if (has("유아")) return STAGE_IDX["유아"];
  if (has("초등")) return STAGE_IDX["초등"];               // "초등학생고학년이상" 포함
  if (has("중등") || has("중학생")) return STAGE_IDX["중등"];
  if (has("고등") || has("고등학생")) return STAGE_IDX["고등"];
  if (has("성인")) return STAGE_IDX["성인"];
  return STAGE_IDX["유아"];
}

// “8/11/14/17세 이상” 라벨을 임계 인덱스로
function ageLabelToThresholdIdx(label) {
  const s = (label || "").replace(/\s+/g, "");
  if (!s || s === "누구나") return STAGE_IDX["유아"];
  if (s.startsWith("8세"))  return STAGE_IDX["초등"]; // 초등 이상
  if (s.startsWith("11세")) return STAGE_IDX["중등"]; // 중·고·성인
  if (s.startsWith("14세")) return STAGE_IDX["중등"]; // 필요시 고등으로 조정 가능
  if (s.startsWith("17세")) return STAGE_IDX["고등"]; // 고등·성인
  return null; // 드롭다운(유아/초등/중등/고등/성인) 호환
}

/* ---------- Normalizers ---------- */
function normalizeStageSet(raw) {
  const s = (raw || "").replace(/\s+/g, "");
  if (!s || s.includes("누구나")) {
    return new Set(["유아", "초등", "중등", "고등", "성인"]);
  }
  const set = new Set();
  const has = (kw) => s.includes(kw);

  if (has("유아")) set.add("유아");
  if (has("초등")) set.add("초등");
  if (has("중등") || has("중학생")) set.add("중등");
  if (has("고등") || has("고등학생")) set.add("고등");
  if (has("성인")) set.add("성인");

  if (s.includes("이상")) {
    if (set.has("유아")) { set.add("초등"); set.add("중등"); set.add("고등"); set.add("성인"); }
    if (set.has("초등")) { set.add("중등"); set.add("고등"); set.add("성인"); }
    if (set.has("중등")) { set.add("고등"); set.add("성인"); }
    if (set.has("고등")) { set.add("성인"); }
  }
  return set.size ? set : new Set(["유아", "초등", "중등", "고등", "성인"]);
}

// time_max → 분(최대치)
function parseTimeToMinutes(s) {
  if (!s) return null;
  const t = String(s).trim();
  if (t === "상시") return 9999;
  const norm = t.replace(/\s+/g, "");
  if (/^\d+$/.test(norm)) return parseInt(norm, 10);
  const range = norm.match(/^(\d+)~(\d+)(분)?$/);
  if (range) return parseInt(range[2], 10);
  const inae = norm.match(/^(\d+)분?이내$/);
  if (inae) return parseInt(inae[1], 10);
  const hr = norm.match(/(\d+)시간/);
  const mn = norm.match(/(\d+)분/);
  if (hr) {
    const H = parseInt(hr[1], 10);
    const M = mn ? parseInt(mn[1], 10) : 0;
    return H * 60 + M;
  }
  if (mn) return parseInt(mn[1], 10);
  return null;
}

// 접수방식 분리
function splitMethods(raw) {
  return (raw || "")
    .split(/[\/|,·]/g)
    .map(s => s.trim())
    .filter(Boolean);
}

// 이미지 경로 정리
function resolveImagePath(s) {
  const v = clean(s);
  if (!v) return "";
  if (v.startsWith("src/")) return `/${v}`; // dev
  if (v.startsWith("/")) return v;
  return `/images/${v}`;
}

/* ---------- 쿼리→내부필터 매핑 ---------- */
function mapAgeToStage(ageLabel) {
  // 드롭다운용(유아/초등/중등/고등/성인)도 지원하기 위해 그대로 유지
  const s = (ageLabel || "").replace(/\s+/g, "");
  if (!s || s === "누구나") return "전체";
  if (s.includes("유아")) return "유아";
  if (s.includes("초등")) return "초등";
  if (s.includes("중등") || s.includes("중학생")) return "중등";
  if (s.includes("고등") || s.includes("고등학생")) return "고등";
  if (s.includes("성인")) return "성인";
  if (/^(8세|11세)/.test(s)) return s;  // 버튼 라벨은 그대로 넘김 (필터에서 처리)
  if (/^(14세|17세)/.test(s)) return s;
  return "전체";
}
function mapTimeLabelToKey(timeLabel) {
  if (!timeLabel) return "전체";
  const t = timeLabel.replace(/\s+/g, "");
  if (t.startsWith("5분")) return "5";
  if (t.startsWith("10분")) return "10";
  if (t.startsWith("15분")) return "15";
  if (t.startsWith("20분")) return "20";
  if (t.startsWith("30분")) return "30";
  if (t.startsWith("40분")) return "40";
  if (t.startsWith("60분") || t.startsWith("1시간")) return "60";
  if (t.startsWith("90분") || t.startsWith("1시간30분")) return "90";
  return "전체";
}
function normalizeMethodLabel(m) {
  return m === "현장접수" || m === "사전접수" ? m : "전체";
}

/* ---------- 이미지 폴백 ---------- */
const FALLBACK_HERO = noImage;
const FALLBACK_THUMB = noImage;

/* ---------- Component ---------- */
export default function RecommendList() {
  const location = useLocation();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const stripRef = useRef(null);

  // 필터 상태
  const [stageSel, setStageSel] = useState("전체");
  const [methodSel, setMethodSel] = useState("전체");
  const [timeSel, setTimeSel] = useState("전체");

  // URL 쿼리 & location.state → 초기 필터 반영
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const qsAge = sp.get("age") ?? location.state?.age ?? null;
    const qsTime = sp.get("time") ?? location.state?.time ?? null;
    const qsMethod = sp.get("method") ?? location.state?.method ?? null;

    setStageSel(qsAge ? mapAgeToStage(qsAge) : "전체");   // 버튼 라벨/드롭다운 라벨 모두 허용
    setTimeSel(qsTime ? mapTimeLabelToKey(qsTime) : "전체");
    setMethodSel(qsMethod ? normalizeMethodLabel(qsMethod) : "전체");
  }, [location.search, location.state]);

  // CSV 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const raw = await loadCSV("/data/programs.csv"); // public/data/programs.csv
        const mapped = raw.map((r, i) => {
          const stage = clean(r["stage"]);
          const title = clean(r["title"]);
          const intro = clean(r["introdustion"]);
          const timeRaw = clean(r["time_max"]);
          const method = clean(r["method"]);
          const image = resolveImagePath(clean(r["image"]));

          const timeInfoRaw = clean(r["time_info"] || r["time"] || r["시간"]);
          const timeSlots = timeInfoRaw
            ? timeInfoRaw.split("/").map(s => s.trim()).filter(Boolean)
            : [];

          return {
            id: i + 1,
            title,
            stageRaw: stage,
            stageSet: normalizeStageSet(stage),   // 드롭다운 호환
            minStageIdx: minStageIdxFrom(stage),  // ✅ 임계치 비교용
            methods: splitMethods(method),
            methodRaw: method,
            timeRaw,
            timeMin: parseTimeToMinutes(timeRaw),
            tags: clean(r["tags"]),
            introdustion: intro,
            image,
            timeInfoRaw,
            timeSlots,
          };
        });
        if (!alive) return;
        setRows(mapped);
        setSelected(mapped[0] || null);
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "데이터 로드 실패");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // 드롭다운 옵션
  const stageOptions = ["전체", "유아", "초등", "중등", "고등", "성인"];
  const methodOptions = useMemo(() => {
    const set = new Set(["전체"]);
    rows.forEach(r => r.methods.forEach(m => set.add(m)));
    return Array.from(set);
  }, [rows]);
  const timeOptions = ["전체", "5", "10", "15", "20", "30", "40", "60", "90"];

  // 필터링
  const filtered = useMemo(() => {
    return rows.filter(p => {
      if (stageSel !== "전체") {
        const thr = ageLabelToThresholdIdx(stageSel);
        if (thr != null) {
          // 버튼(8/11/14/17세 이상): 최소 요구 단계가 임계 이상인 것만 통과
          if (p.minStageIdx < thr) return false;
        } else {
          // 드롭다운(유아/초등/중등/고등/성인)
          if (!p.stageSet.has(stageSel)) return false;
        }
      }
      if (methodSel !== "전체" && (p.methods.length === 0 || !p.methods.includes(methodSel))) return false;
      if (timeSel !== "전체") {
        const limit = parseInt(timeSel, 10);
        if (!Number.isFinite(p.timeMin) || p.timeMin > limit) return false;
      }
      return true;
    });
  }, [rows, stageSel, methodSel, timeSel]);

  // 선택 보정
  useEffect(() => {
    if (!filtered.length) { setSelected(null); return; }
    if (!selected || !filtered.find(x => x.id === selected.id)) {
      setSelected(filtered[0]);
    }
  }, [filtered, selected]);

  const formatTitle = (title) => {
    if (!title) return "";
    let formatted = title;

    if (formatted === "우리의 친절한 로봇의 반란") {
      formatted = "우리의 친절한 로봇의\n반란";
    }

    if (formatted === "탈출하라, 사이버 보안 위기속 탈출기") {
      return "탈출하라,\n사이버 보안 위기속 탈출기";
    }

    formatted = formatted.replace(/:(?=\s*[^\d\s])/g, ":\n");
    formatted = formatted.replace(/：(?=\s*[^\d\s])/g, "：\n");

    return formatted;
  };

  const renderMultiline = (text = "") =>
    text.split("\n").map((line, idx, arr) => (
      <React.Fragment key={`${line}-${idx}`}>
        {line}
        {idx < arr.length - 1 && <br />}
      </React.Fragment>
    ));

  // 스트립 스크롤
  const scrollStrip = (dir = 1) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.6), behavior: "smooth" });
  };

  if (loading) return <main className="rec-page">불러오는 중…</main>;
  if (err) return <main className="rec-page">에러: {err}</main>;

  return (
    <main className="rec-page">
      {/* 필터 바 */}
      <div className="rec-filterbar" style={{ display: "flex", gap: 12 }}>
        <select value={stageSel} onChange={e => setStageSel(e.target.value)}>
          {stageOptions.map(o => <option key={o} value={o}>{o}</option>)}
          {/* 버튼 라벨(8/11/14/17세 이상)도 이 페이지에서 직접 제공한다면 옵션에 추가해도 됩니다 */}
        </select>

        <select value={methodSel} onChange={e => setMethodSel(e.target.value)}>
          {methodOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        <select value={timeSel} onChange={e => setTimeSel(e.target.value)}>
          {timeOptions.map(o => (
            <option key={o} value={o}>
              {o === "전체" ? "시간 전체" : `최대 ${o}분`}
            </option>
          ))}
        </select>

        <div style={{ marginLeft: "auto", opacity: 0.7 }}>
          결과: {filtered.length}개
        </div>
      </div>

      {/* 상단 상세 */}
      <section className="rec-hero">
        <div className="rec-hero-image">
          {selected?.image ? (
            <img
              src={selected.image}
              alt={selected.title}
              loading="lazy"
              onError={(e) => { e.currentTarget.src = FALLBACK_HERO; }}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <img
              src={FALLBACK_HERO}
              alt="기본 이미지"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          )}
        </div>

        <div className="rec-hero-desc">
          <div className="desc-card">
            <h2 className="desc-title">
              {renderMultiline(formatTitle(selected?.title || "프로그램명"))}
            </h2>
            <p className="desc-text">
              {selected?.introdustion || "이 프로그램에 대한 설명이 없습니다."}
            </p>
            <div className="desc-meta">
              {selected?.stageRaw && <span>{selected.stageRaw}</span>}
              {selected?.timeRaw && <span>{selected.timeRaw}</span>}
              {selected?.methodRaw && <span>{selected.methodRaw}</span>}
            </div>

            {(selected?.timeSlots?.length > 0 || selected?.timeInfoRaw) && (
              <div className="desc-times">
                {selected.timeSlots?.length > 0 ? (
                  selected.timeSlots.map((slot, idx) => (
                    <span key={idx} className="time-chip">{slot}</span>
                  ))
                ) : (
                  <span className="time-chip">{selected.timeInfoRaw}</span>
                )}
              </div>
            )}
            {/* <button
              className="primary-go"
              type="button"
              onClick={() => selected && alert(`${selected.title} 상세 페이지로 이동`)}
            /> */}
          </div>
        </div>
      </section>

      {/* 하단 스트립 */}
      <section className="rec-strip">
        <button type="button" className="strip-nav prev" onClick={() => scrollStrip(-1)} aria-label="이전">‹</button>

        <div className="strip-scroll" ref={stripRef}>
          {filtered.length === 0 ? (
            <div className="rec-empty">조건에 맞는 프로그램이 없어요.</div>
          ) : (
            filtered.map(p => {
              const active = selected?.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`strip-item ${active ? "active" : ""}`}
                  onClick={() => setSelected(p)}
                  aria-pressed={active}
                >
                  {/* <div className="thumb">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = FALLBACK_THUMB; }}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <img
                        src={FALLBACK_THUMB}
                        alt="기본 썸네일"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    )}
                  </div> */}
                  <div className="strip-title">
                    {renderMultiline(formatTitle(p.title))}
                  </div>
                  {p.timeInfoRaw && (
                    <div className="strip-sub">
                      {renderMultiline(formatTitle(p.timeInfoRaw))}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        <button type="button" className="strip-nav next" onClick={() => scrollStrip(1)} aria-label="다음">›</button>
      </section>
    </main>
  );
}
