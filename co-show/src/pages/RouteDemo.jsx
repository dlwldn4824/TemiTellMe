import { useState } from "react";
import { ZONES, coords } from "../logic/mapGraph";
import { findPath } from "../logic/findPath";

export default function RouteDemo() {
  const [start, setStart] = useState("실감미디어");
  const [goal, setGoal] = useState("미래자동차");

  const path = findPath(start, goal);

  return (
    <main
      style={{
        width: 1920,
        minHeight: 1200,
        margin: "0 auto",
        padding: "40px 0",
        background: "#eef6ff",
      }}
    >
      {/* 출발/도착 선택 UI */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        <div>
          <div>출발</div>
          <select value={start} onChange={(e) => setStart(e.target.value)}>
            {ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div>도착</div>
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            {ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 지도 + 경로 */}
      <div
        style={{
          position: "relative",
          width: 800,
          height: 600,
          margin: "40px auto",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src={mapImg}
          alt="전시장 지도"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        <svg
          width="800"
          height="600"
          style={{ position: "absolute", inset: 0 }}
        >
          {path.length >= 2 && (
            <polyline
              points={path
                .map((name) => {
                  const { x, y } = coords[name];
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="#007aff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* 노드 위치에 점 + 라벨도 찍어주기 (디버깅/확인용) */}
          {ZONES.map((name) => {
            const { x, y } = coords[name];
            return (
              <g key={name}>
                <circle cx={x} cy={y} r={6} fill="#ff4d4f" />
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#000"
                >
                  {name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 디버깅용 경로 텍스트 */}
      <div style={{ textAlign: "center" }}>
        {path.length > 0
          ? `경로: ${path.join(" → ")}`
          : "경로를 찾을 수 없습니다."}
      </div>
    </main>
  );
}
